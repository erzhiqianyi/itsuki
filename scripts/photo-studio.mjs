#!/usr/bin/env node
// Local graphical album importer: drop photos in a browser window, fill the form,
// and it strips metadata, uploads to R2 and writes src/content/photos/…
import { createServer } from 'node:http';
import { readFile, mkdtemp, rm, access } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  ROOT, BUCKET, HOST, PREFIX, SOURCES, slugify, processImage, thumbnail,
  objectKey, publicUrl, uploadObject, albumPath, writeAlbum, albumSlug, preflight,
  loadLibrary, recordUpload,
} from './photo-lib.mjs';

const PORT = Number(process.env.PORT) || 4477;
const PAGE = path.join(import.meta.dirname, 'photo-studio.html');
const staging = await mkdtemp(path.join(tmpdir(), 'photo-studio-'));
const staged = new Map();

const body = request => new Promise((resolve, reject) => {
  const chunks = [];
  request.on('data', chunk => chunks.push(chunk));
  request.on('end', () => resolve(Buffer.concat(chunks)));
  request.on('error', reject);
});

const json = (response, status, payload) => {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
};

const routes = {
  'GET /api/config': async (_request, response) => json(response, 200, { host: HOST, bucket: BUCKET, prefix: PREFIX }),

  'GET /api/preflight': async (_request, response) => json(response, 200, await preflight()),

  // Decode, strip metadata and measure one photo; the cleaned JPEG waits in the staging dir.
  'POST /api/stage': async (request, response, url) => {
    const name = path.basename(url.searchParams.get('name') || 'photo.jpg');
    if (!SOURCES.has(path.extname(name).toLowerCase())) return json(response, 415, { error: `対応していない形式です: ${name}` });
    const bytes = await body(request);
    if (!bytes.length) return json(response, 400, { error: `空のファイルです: ${name}` });
    const id = randomUUID();
    const local = path.join(staging, `${id}.jpg`);
    try {
      const { width, height, exif } = await processImage(bytes, local);
      const photo = { id, name: `${path.basename(name, path.extname(name))}.jpg`, local, width, height, exif, thumb: await thumbnail(local) };
      staged.set(id, photo);
      json(response, 200, { id, name: photo.name, width, height, exif, source: name });
    } catch (error) {
      json(response, 422, { error: `${name}: ${error.message}` });
    }
  },

  // Large preview for a staged photo; library photos are previewed straight from the CDN.
  'GET /api/preview': async (_request, response, url) => {
    const photo = staged.get(url.searchParams.get('id'));
    if (!photo) return json(response, 404, { error: 'not staged' });
    photo.preview ??= await thumbnail(photo.local, 1800);
    response.writeHead(200, { 'content-type': 'image/webp', 'cache-control': 'no-store' });
    response.end(photo.preview);
  },

  'GET /api/thumb': async (_request, response, url) => {
    const photo = staged.get(url.searchParams.get('id'));
    if (!photo) return json(response, 404, { error: 'not staged' });
    response.writeHead(200, { 'content-type': 'image/webp', 'cache-control': 'no-store' });
    response.end(photo.thumb);
  },

  // Does this album file already exist? Checked before uploading anything.
  'POST /api/check': async (request, response) => {
    const { date, slug } = JSON.parse(await body(request));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !slug) return json(response, 200, { exists: false });
    const target = albumPath(date, slug);
    const exists = await access(target).then(() => true, () => false);
    json(response, 200, { exists, path: path.relative(ROOT, target) });
  },

  // Upload one staged photo. Without an album date the key uses the EXIF date, so
  // photos can go up first and be sorted into albums later from the library.
  'POST /api/upload': async (request, response) => {
    const { id, date } = JSON.parse(await body(request));
    const photo = staged.get(id);
    if (!photo) return json(response, 404, { error: 'not staged' });
    const day = /^\d{4}-\d{2}-\d{2}$/.test(date || '') ? date : photo.exif.taken || new Date().toISOString().slice(0, 10);
    const key = objectKey(day, photo.name);
    try {
      await uploadObject(key, photo.local);
      Object.assign(photo, { key, url: publicUrl(key) });
      const entry = await recordUpload(photo);
      json(response, 200, entry);
    } catch (error) {
      json(response, 502, { error: (error.stderr || error.message || '').trim().split('\n').slice(-3).join(' ') });
    }
  },

  'GET /api/library': async (_request, response) => json(response, 200, { photos: await loadLibrary() }),

  // `order` mixes staged ids and library keys; both resolve to an uploaded photo.
  'POST /api/publish': async (request, response) => {
    const { album, order, cover } = JSON.parse(await body(request));
    const library = new Map((await loadLibrary()).map(photo => [photo.key, photo]));
    const photos = order.map(id => staged.get(id) || library.get(id)).filter(Boolean);
    if (!photos.length) return json(response, 400, { error: '写真がありません。' });
    if (photos.some(photo => !photo.url)) return json(response, 409, { error: 'アップロードが完了していない写真があります。' });
    photos.forEach(photo => { photo.cover = (photo.id || photo.key) === cover || photo.key === cover; });
    try {
      const target = await writeAlbum(album, photos);
      json(response, 200, { path: path.relative(ROOT, target), slug: albumSlug(album.date, album.slug) });
    } catch (error) {
      json(response, error.code === 'EEXIST' ? 409 : 500, { error: error.code === 'EEXIST' ? '同じ日付とスラッグのアルバムが既にあります。' : error.message });
    }
  },
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://localhost:${PORT}`);
  try {
    if (request.method === 'GET' && url.pathname === '/') {
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      return response.end(await readFile(PAGE));
    }
    const route = routes[`${request.method} ${url.pathname}`];
    if (!route) return json(response, 404, { error: 'not found' });
    await route(request, response, url);
  } catch (error) {
    if (!response.headersSent) json(response, 500, { error: error.message });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  const address = `http://localhost:${PORT}`;
  console.log(`\n写真スタジオ  ${address}`);
  console.log(`  バケット  ${BUCKET}`);
  console.log(`  配信先    https://${HOST}/${PREFIX}/…`);
  console.log('\n終了するには Ctrl+C\n');
  if (process.argv.includes('--no-open')) return;
  const opener = { darwin: 'open', win32: 'start' }[process.platform] || 'xdg-open';
  execFile(opener, [address], () => {});
});

const shutdown = async () => {
  await rm(staging, { recursive: true, force: true });
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
