// Password-protect an existing album: pulls its `images`/`cover` out of the
// public front matter and replaces them with an AES-GCM ciphertext that only
// decrypts in the visitor's browser with the right password. Nothing about
// the plaintext password is ever written to disk or committed.
//
// Usage: node scripts/photo-lock.mjs src/content/photos/2026/08/09_2026-summer-holiday.md
import { readFile, writeFile } from 'node:fs/promises';
import { webcrypto as crypto } from 'node:crypto';
import readline from 'node:readline/promises';
import yaml from 'js-yaml';

const ITERATIONS = 250_000;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = prompt => rl.question(prompt);

async function encrypt(password, payload) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  );
  const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(payload)));
  return {
    salt: Buffer.from(salt).toString('base64'),
    iv: Buffer.from(iv).toString('base64'),
    data: Buffer.from(data).toString('base64'),
  };
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node scripts/photo-lock.mjs <path-to-album.md>');
    process.exit(1);
  }

  const raw = await readFile(file, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file}: front matter not found`);
  const [, frontMatterText, body] = match;
  const data = yaml.load(frontMatterText);

  if (data.locked) throw new Error(`${file}: already locked`);
  if (!data.images?.length) throw new Error(`${file}: no images[] to lock`);

  const password = await question('Album password: ');
  const confirm = await question('Confirm password: ');
  if (!password) throw new Error('password must not be empty');
  if (password !== confirm) throw new Error('passwords did not match');

  const cipher = await encrypt(password, { images: data.images, cover: data.cover });

  const { images, cover, ...rest } = data;
  const next = { ...rest, locked: true, imageCount: images.length, cipher };
  const nextFrontMatter = yaml.dump(next, { sortKeys: false, lineWidth: -1 });

  await writeFile(file, `---\n${nextFrontMatter}---\n${body}`);
  console.log(`Locked ${file} (${images.length} photos). Share the password with people you've authorized — it is not stored anywhere.`);
}

main()
  .catch(error => { console.error(error.message || error); process.exitCode = 1; })
  .finally(() => rl.close());
