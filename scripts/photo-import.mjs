#!/usr/bin/env node
// Command-line album import. For the graphical version run `npm run photos:studio`.
import { createInterface } from 'node:readline/promises';
import { mkdtemp, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  ROOT, SOURCES, slugify, processImage, objectKey, publicUrl, uploadObject, frontMatter, writeAlbum, preflight,
} from './photo-lib.mjs';

const fail = message => { console.error(`\n✗ ${message}`); process.exit(1); };

function parseArgs(argv) {
  const options = { inputs: [] };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) { options.inputs.push(token); continue; }
    const [flag, inline] = token.slice(2).split(/=(.*)/s);
    if (flag === 'dry-run' || flag === 'featured' || flag === 'keep-local') options[flag] = true;
    else options[flag] = inline ?? argv[++i];
  }
  return options;
}

async function collect(inputs) {
  const files = [];
  for (const input of inputs) {
    const target = path.resolve(input);
    const info = await stat(target).catch(() => fail(`見つかりません: ${input}`));
    if (info.isDirectory()) {
      const entries = await readdir(target);
      files.push(...entries.filter(name => SOURCES.has(path.extname(name).toLowerCase()) && !name.startsWith('.'))
        .map(name => path.join(target, name)));
    } else if (SOURCES.has(path.extname(target).toLowerCase())) files.push(target);
  }
  return [...new Set(files)].sort((a, b) => path.basename(a).localeCompare(path.basename(b), 'en', { numeric: true }));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.inputs.length) fail('使い方: npm run photos:add -- <画像フォルダ|画像...> [--dry-run]');

  const files = await collect(options.inputs);
  if (!files.length) fail('対象の画像が見つかりません。');
  console.log(`\n${files.length} 枚の画像を検出しました。`);

  const staging = await mkdtemp(path.join(tmpdir(), 'photo-import-'));
  const photos = [];

  try {
    for (const [index, file] of files.entries()) {
      const local = path.join(staging, `${path.basename(file, path.extname(file))}.jpg`);
      const { width, height, exif } = await processImage(file, local);
      photos.push({ local, name: path.basename(local), width, height, exif });
      process.stdout.write(`\r  処理 ${index + 1}/${files.length}  ${path.basename(file)}          `);
    }
    console.log('\n');

    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const ask = async (flag, text, fallback) => {
      if (options[flag] !== undefined) return options[flag];
      const answer = (await rl.question(`${text}${fallback ? ` [${fallback}]` : ''}: `)).trim();
      return answer || fallback || '';
    };

    const album = {
      titleJa: await ask('title-ja', 'アルバム名（日本語）'),
      titleEn: await ask('title-en', 'アルバム名（英語）'),
      locationJa: await ask('location-ja', '場所（日本語）'),
      locationEn: await ask('location-en', '場所（英語）'),
      // EXIF already knows when these were taken; offer the earliest as the default.
      date: await ask('date', '撮影日 YYYY-MM-DD',
        photos.map(p => p.exif.taken).filter(Boolean).sort()[0] || new Date().toISOString().slice(0, 10)),
    };
    album.locationTag = slugify(await ask('location-tag', '場所タグ', slugify(album.locationEn)));
    album.collectionTag = slugify(await ask('collection-tag', 'コレクションタグ', album.locationTag));
    album.featured = options.featured ?? /^y/i.test(await ask('featured-answer', 'トップに出す？ y/N', 'n'));
    album.slug = slugify(await ask('slug', 'スラッグ', slugify(album.titleEn) || album.locationTag));
    rl.close();

    if (!album.titleJa || !/^\d{4}-\d{2}-\d{2}$/.test(album.date) || !album.slug) fail('アルバム名・日付・スラッグは必須です。');
    for (const photo of photos) {
      photo.key = objectKey(album.date, photo.name);
      photo.url = publicUrl(photo.key);
    }
    photos[0].cover = true;

    if (options['dry-run']) {
      console.log('\n' + frontMatter(album, photos));
      console.log('（--dry-run のためアップロードも書き込みもしていません）');
      return;
    }

    const ready = await preflight();
    if (!ready.ok) fail(ready.message);

    for (const [index, photo] of photos.entries()) {
      await uploadObject(photo.key, photo.local);
      process.stdout.write(`\r  アップロード ${index + 1}/${photos.length}  ${photo.key}          `);
    }
    console.log('\n');

    const target = await writeAlbum(album, photos)
      .catch(error => fail(error.code === 'EEXIST' ? `既に存在します: ${album.date} / ${album.slug}` : error.message));

    console.log(`✓ ${photos.length} 枚を R2 にアップロードしました。`);
    console.log(`✓ ${path.relative(ROOT, target)} を作成しました。`);
  } finally {
    if (options['keep-local']) console.log(`\n変換後の画像: ${staging}`);
    else await rm(staging, { recursive: true, force: true });
  }
}

main().catch(error => fail(error.message));
