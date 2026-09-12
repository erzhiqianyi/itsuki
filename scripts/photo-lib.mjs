// Shared pipeline for the photo tools: read EXIF, strip metadata, upload to R2,
// and render the album front matter. Used by photo-import.mjs and photo-studio.mjs.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, writeFile, readFile, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);

export const ROOT = path.resolve(import.meta.dirname, '..');

// Settings live in .env at the project root; real environment variables still win.
export const ENV_FILE = path.join(ROOT, '.env');
if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE);

export const BUCKET = process.env.R2_BUCKET || 'blog-image';
export const HOST = process.env.PHOTO_CDN_HOST || 'blog.image.erzhiqian.cc';
export const PREFIX = process.env.R2_PREFIX || 'photos';
export const SOURCES = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.heic', '.heif']);

export const slugify = value => String(value || '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const mode = values => {
  const tally = new Map();
  for (const value of values.filter(Boolean)) tally.set(value, (tally.get(value) || 0) + 1);
  return [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
};

// --- EXIF ------------------------------------------------------------------
const TAGS = { make: 0x010f, model: 0x0110, exifIfd: 0x8769, exposure: 0x829a, fnumber: 0x829d, iso: 0x8827, taken: 0x9003 };
const SIZES = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

// `buffer` is sharp's raw EXIF chunk: either the bare TIFF block or one still
// carrying the "Exif\0\0" prefix. Offsets inside EXIF are relative to `app1`.
export function readExif(buffer) {
  if (!buffer || buffer.length < 8) return {};
  const app1 = buffer.toString('latin1', 0, 4) === 'Exif' ? 6 : 0;
  const order = buffer.toString('latin1', app1, app1 + 2);
  if (order !== 'II' && order !== 'MM') return {};
  const little = order === 'II';
  const u16 = at => little ? buffer.readUInt16LE(at) : buffer.readUInt16BE(at);
  const u32 = at => little ? buffer.readUInt32LE(at) : buffer.readUInt32BE(at);
  const found = {};

  const readIfd = offset => {
    if (offset <= 0 || app1 + offset + 2 > buffer.length) return;
    const count = u16(app1 + offset);
    for (let n = 0; n < count; n++) {
      const entry = app1 + offset + 2 + n * 12;
      if (entry + 12 > buffer.length) return;
      const tag = u16(entry), type = u16(entry + 2), length = u32(entry + 4);
      const bytes = (SIZES[type] || 0) * length;
      if (!bytes) continue;
      const at = bytes <= 4 ? entry + 8 : app1 + u32(entry + 8);
      if (at + bytes > buffer.length) continue;
      if (type === 2) found[tag] = buffer.toString('latin1', at, at + length).replace(/\0.*$/s, '').trim();
      else if (type === 3) found[tag] = u16(at);
      else if (type === 4) found[tag] = u32(at);
      else if (type === 5) found[tag] = u32(at + 4) ? u32(at) / u32(at + 4) : 0;
    }
  };

  readIfd(u32(app1 + 4));
  if (found[TAGS.exifIfd]) readIfd(found[TAGS.exifIfd]);

  const make = found[TAGS.make], model = found[TAGS.model];
  const camera = model && make && !model.toLowerCase().startsWith(make.toLowerCase().split(' ')[0])
    ? `${make} ${model}` : model || make;
  const shutter = found[TAGS.exposure];
  const taken = /^\d{4}:\d{2}:\d{2}/.test(found[TAGS.taken] || '') ? found[TAGS.taken].slice(0, 10).replaceAll(':', '-') : undefined;
  return {
    camera: camera || undefined,
    aperture: found[TAGS.fnumber] ? `f/${Number(found[TAGS.fnumber].toFixed(1))}` : undefined,
    shutter: shutter ? (shutter < 1 ? `1/${Math.round(1 / shutter)}s` : `${Number(shutter.toFixed(1))}s`) : undefined,
    iso: found[TAGS.iso] ? String(found[TAGS.iso]) : undefined,
    taken,
  };
}

// --- image processing ------------------------------------------------------
// rotate() bakes in the EXIF orientation; re-encoding without withMetadata()
// drops every tag, GPS included, before anything leaves this machine.
export async function processImage(input, destination) {
  const source = sharp(input, { failOn: 'none' });
  const meta = await source.metadata();
  const exif = readExif(meta.exif);
  const { width, height } = await source.rotate().jpeg({ quality: 92, mozjpeg: true }).toFile(destination);
  return { width, height, exif };
}

export const thumbnail = (input, width = 480) =>
  sharp(input, { failOn: 'none' }).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toBuffer();

// --- R2 --------------------------------------------------------------------
export const objectKey = (date, name) => `${PREFIX}/${date.slice(0, 4)}/${date.slice(5, 7)}/${date.slice(8, 10)}/${name}`;
export const publicUrl = key => `https://${HOST}/${key}`;

const wrangler = args => run('npx', ['--yes', 'wrangler', ...args], { cwd: ROOT });

export const uploadObject = (key, file) =>
  wrangler(['r2', 'object', 'put', `${BUCKET}/${key}`, '--file', file, '--content-type', 'image/jpeg', '--remote']);

// Is wrangler authenticated and does the bucket exist? Reported before any upload starts.
export async function preflight() {
  try {
    await wrangler(['r2', 'bucket', 'info', BUCKET]);
    return { ok: true, message: `バケット ${BUCKET} に接続できました。` };
  } catch (error) {
    const output = `${error.stderr || ''}${error.stdout || ''}${error.message || ''}`;
    if (/not logged in|authentication|credential|API token|Unauthorized|10000/i.test(output))
      return { ok: false, message: 'Cloudflare にログインしていません。`npx wrangler login` を実行してください。' };
    if (/does not exist|not found|10006|10009/i.test(output))
      return { ok: false, message: `バケット ${BUCKET} が見つかりません。\`npx wrangler r2 bucket create ${BUCKET}\` で作成してください。` };
    return { ok: false, message: output.trim().split('\n').filter(Boolean).slice(-2).join(' ') || '接続を確認できませんでした。' };
  }
}

// --- library ---------------------------------------------------------------
// Every upload is recorded here with the width/height/EXIF that the bucket no longer
// carries (metadata is stripped before upload), so albums can be assembled later.
export const LIBRARY_FILE = path.join(ROOT, 'src/data/photo-library.json');

export async function loadLibrary() {
  try { return JSON.parse(await readFile(LIBRARY_FILE, 'utf8')).photos || []; }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
}

async function saveLibrary(photos) {
  photos.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  const temp = `${LIBRARY_FILE}.tmp`;
  await mkdir(path.dirname(LIBRARY_FILE), { recursive: true });
  await writeFile(temp, JSON.stringify({ photos }, null, 2) + '\n');
  await rename(temp, LIBRARY_FILE);
}

export async function recordUpload(photo) {
  const photos = await loadLibrary();
  const entry = {
    key: photo.key, url: photo.url, name: photo.name,
    width: photo.width, height: photo.height,
    exif: Object.fromEntries(Object.entries(photo.exif || {}).filter(([, v]) => v)),
    uploadedAt: new Date().toISOString(),
    album: null,
  };
  const index = photos.findIndex(item => item.key === photo.key);
  if (index >= 0) entry.album = photos[index].album, photos[index] = entry; else photos.push(entry);
  await saveLibrary(photos);
  return entry;
}

export async function assignAlbum(keys, album) {
  const photos = await loadLibrary();
  const wanted = new Set(keys);
  for (const photo of photos) if (wanted.has(photo.key)) photo.album = album;
  await saveLibrary(photos);
}

// --- front matter ----------------------------------------------------------
const quote = value => `"${String(value ?? '').replace(/(["\\])/g, '\\$1')}"`;

export function frontMatter(album, photos) {
  const cover = photos.find(photo => photo.cover) || photos[0];
  const lines = [
    '---',
    'lang: ja',
    'title:', `  ja: ${quote(album.titleJa)}`, `  en: ${quote(album.titleEn)}`,
    'location:', `  ja: ${quote(album.locationJa)}`, `  en: ${quote(album.locationEn)}`,
    `cover: ${quote(cover.url)}`,
    'images:',
  ];
  for (const photo of photos) {
    lines.push(`  - url: ${quote(photo.url)}`, `    width: ${photo.width}`, `    height: ${photo.height}`);
    if (photo.title) lines.push(`    title: ${quote(photo.title)}`);
  }
  lines.push(
    `date: ${quote(album.date)}`,
    `location_tag: ${quote(album.locationTag)}`,
    `year_tag: ${quote(album.date.slice(0, 4))}`,
    `collection_tag: ${quote(album.collectionTag)}`,
    `featured: ${Boolean(album.featured)}`,
  );
  const exif = {
    camera: mode(photos.map(p => p.exif?.camera)),
    aperture: mode(photos.map(p => p.exif?.aperture)),
    shutter: mode(photos.map(p => p.exif?.shutter)),
    iso: mode(photos.map(p => p.exif?.iso)),
  };
  if (exif.camera) lines.push(`gear: ${quote(exif.camera.split(' ')[0])}`);
  if (Object.values(exif).some(Boolean)) {
    lines.push('exif:');
    for (const [key, value] of Object.entries(exif)) if (value) lines.push(`  ${key}: ${quote(value)}`);
  }
  lines.push('---', '');
  return lines.join('\n');
}

export const albumPath = (date, slug) =>
  path.join(ROOT, 'src/content/photos', date.slice(0, 4), date.slice(5, 7), `${date.slice(8, 10)}_${slug}.md`);

export const albumSlug = (date, slug) => `${date.slice(0, 4)}/${date.slice(5, 7)}/${date.slice(8, 10)}_${slug}`;

export async function writeAlbum(album, photos) {
  const target = albumPath(album.date, album.slug);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, frontMatter(album, photos), { flag: 'wx' });
  await assignAlbum(photos.map(photo => photo.key), albumSlug(album.date, album.slug));
  return target;
}
