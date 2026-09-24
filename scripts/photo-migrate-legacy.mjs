// One-off migration for the handful of pre-R2 albums whose images still sit
// in public/assets/photos/ and are committed straight into the (public) git
// repo. Uploads each local file to R2 as-is (no re-encoding — they're already
// optimized), rewrites the album's front matter to the R2 CDN URL with
// measured width/height, and reports which local files are now safe to
// remove from the repo.
//
// Usage:
//   node scripts/photo-migrate-legacy.mjs --dry-run   # preview only, no upload/writes
//   node scripts/photo-migrate-legacy.mjs             # upload + rewrite front matter
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import yaml from 'js-yaml';
import { ROOT, objectKey, publicUrl, uploadObject, preflight } from './photo-lib.mjs';

const ALBUMS = [
  'src/content/photos/2024/10/01_nihon_travel.md',
  'src/content/photos/2025/04/01_tai_travel.md',
  'src/content/photos/2025/10/01_nihon_travel.md',
  'src/content/photos/2026/01/11_zhongshan.md',
];

const CONTENT_TYPES = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' };
const dryRun = process.argv.includes('--dry-run');

async function migrateUrl(url, date, localFiles) {
  if (!url?.startsWith('/assets/photos/')) return { url, migrated: false };
  const localPath = path.join(ROOT, 'public', url);
  if (!existsSync(localPath)) throw new Error(`missing local file for ${url}`);
  const name = path.basename(url);
  const key = objectKey(date, name);
  const { width, height } = await sharp(localPath).metadata();
  if (!dryRun) await uploadObject(key, localPath, CONTENT_TYPES[path.extname(name).toLowerCase()] || 'image/jpeg');
  localFiles.add(localPath);
  return { url: publicUrl(key), width, height, migrated: true };
}

async function migrateAlbum(file) {
  const full = path.join(ROOT, file);
  const raw = await readFile(full, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file}: front matter not found`);
  const [, frontMatterText, body] = match;
  const data = yaml.load(frontMatterText);
  const localFiles = new Set();
  let count = 0;

  if (data.cover) {
    const result = await migrateUrl(data.cover, data.date, localFiles);
    if (result.migrated) { data.cover = result.url; count++; }
  }
  for (const photo of data.images || []) {
    const result = await migrateUrl(photo.url, data.date, localFiles);
    if (result.migrated) {
      photo.url = result.url;
      photo.width = result.width;
      photo.height = result.height;
      count++;
    }
  }

  if (!dryRun) {
    const nextFrontMatter = yaml.dump(data, { sortKeys: false, lineWidth: -1 });
    await writeFile(full, `---\n${nextFrontMatter}---\n${body}`);
  }
  return { file, count, localFiles: [...localFiles] };
}

async function main() {
  if (!dryRun) {
    const status = await preflight();
    if (!status.ok) throw new Error(status.message);
    console.log(status.message);
  }
  const allLocalFiles = [];
  for (const album of ALBUMS) {
    const result = await migrateAlbum(album);
    console.log(`${dryRun ? '[dry-run] would migrate' : 'migrated'} ${result.count} image(s) in ${result.file}`);
    allLocalFiles.push(...result.localFiles);
  }
  console.log(`\n${dryRun ? 'Would free up' : 'Now safe to remove from git'} (still on disk — nothing deleted automatically):`);
  for (const f of allLocalFiles) console.log(`  ${path.relative(ROOT, f)}`);
  if (!dryRun) console.log('\nRun `git rm <paths>` (or delete + `git add -u`) once you\'ve checked the site still looks right, then commit.');
}

main().catch(error => { console.error(error.message || error); process.exitCode = 1; });
