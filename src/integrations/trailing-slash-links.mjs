// Cloudflare serves every page at its directory URL ("/blog/") and 308-redirects
// "/blog" there. Internal links written without the slash — in templates and in
// Markdown posts alike — cost crawlers an extra redirect each, so after the build
// every root-relative href that points at a generated page gets its slash added.
// Links to files, redirects (_redirects) or missing pages are left untouched.

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await htmlFiles(path));
    else if (entry.name.endsWith('.html')) out.push(path);
  }
  return out;
}

export default function trailingSlashLinks() {
  return {
    name: 'trailing-slash-links',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const pageCache = new Map();
        const isPage = async (pathname) => {
          if (!pageCache.has(pathname)) {
            let decoded;
            try { decoded = decodeURIComponent(pathname); } catch { decoded = pathname; }
            pageCache.set(pathname, stat(join(root, decoded, 'index.html')).then(() => true, () => false));
          }
          return pageCache.get(pathname);
        };

        // href="/path" with no trailing slash and no file extension in the last segment.
        const pattern = /href="(\/(?:[^"#?/]+\/)*[^"#?/.]+)([?#][^"]*)?"/g;
        let changed = 0;
        for (const file of await htmlFiles(root)) {
          const html = await readFile(file, 'utf8');
          const targets = new Set([...html.matchAll(pattern)].map(m => m[1]));
          const pages = new Set();
          for (const target of targets) if (await isPage(target)) pages.add(target);
          if (!pages.size) continue;
          const next = html.replace(pattern, (all, path, rest = '') => {
            if (!pages.has(path)) return all;
            changed++;
            return `href="${path}/${rest}"`;
          });
          await writeFile(file, next);
        }
        logger.info(`added trailing slash to ${changed} internal links`);
      },
    },
  };
}
