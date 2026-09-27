// "Back to list" links on detail pages (articles, photo albums) return to the
// list the reader actually came from — おすすめ, a tag, a category, a filtered
// /blog view — instead of always jumping to the section root.
//
// The origin list is remembered per section in sessionStorage, so it survives
// hopping through previous/next links between detail pages.

import { TAG_GROUPS } from '../data/post-tags';

interface ListRule { pattern: RegExp; label: (match: RegExpMatchArray, url: URL) => string }

const categoryLabels: Record<string, string> = { journals: '日記', japanese: '日本語学習', codex: '技術' };
const areaLabels: Record<string, string> = Object.fromEntries(TAG_GROUPS.map(g => [g.key, g.label]));
const decode = (value: string) => { try { return decodeURIComponent(value); } catch { return value; } };

const LISTS: Record<string, ListRule[]> = {
  blog: [
    { pattern: /^\/blog\/featured\/?$/, label: () => 'おすすめに戻る' },
    { pattern: /^\/blog\/tags\/?$/, label: () => 'タグ地図に戻る' },
    { pattern: /^\/blog\/tags\/area\/([^/]+)\/?$/, label: m => `${areaLabels[m[1]] || m[1]}に戻る` },
    { pattern: /^\/blog\/tags\/([^/]+)\/?$/, label: m => `#${decode(m[1])} に戻る` },
    { pattern: /^\/blog\/codex-reading\/?$/, label: () => 'シリーズ一覧に戻る' },
    { pattern: /^\/category\/([^/]+)(?:\/\d+)?\/?$/, label: m => `${categoryLabels[m[1]] || decode(m[1])}に戻る` },
    { pattern: /^\/blog(?:\/\d+)?\/?$/, label: (_, url) => url.searchParams.get('tag') ? `#${url.searchParams.get('tag')} に戻る` : '一覧に戻る' },
    { pattern: /^\/archive\/?$/, label: () => 'アーカイブに戻る' },
    { pattern: /^\/$/, label: () => 'ホームに戻る' },
  ],
  photos: [
    { pattern: /^\/photos\/tags\/([^/]+)(?:\/\d+)?\/?$/, label: m => `${decode(m[1])} に戻る` },
    { pattern: /^\/photos(?:\/\d+)?\/?$/, label: () => '写真一覧' },
    { pattern: /^\/$/, label: () => 'ホーム' },
  ],
};

interface Origin { href: string; label: string }

function matchList(section: string, url: URL): Origin | null {
  for (const rule of LISTS[section] || []) {
    const match = url.pathname.match(rule.pattern);
    if (match) return { href: url.pathname + url.search + url.hash, label: rule.label(match, url) };
  }
  return null;
}

function read(key: string): Origin | null {
  try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; }
}
function write(key: string, value: Origin) {
  try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable: fall back to the static link */ }
}

document.querySelectorAll<HTMLAnchorElement>('a[data-smart-back]').forEach(link => {
  const section = link.dataset.smartBack!;
  const key = `smart-back:${section}`;
  let referrer: URL | null = null;
  try { referrer = document.referrer ? new URL(document.referrer) : null; } catch { referrer = null; }
  const sameOrigin = referrer && referrer.origin === location.origin;
  const fromList = sameOrigin ? matchList(section, referrer!) : null;
  // Arriving from a list records it; arriving from another detail page keeps the
  // remembered list; arriving from elsewhere (search, direct link) forgets it.
  const origin = fromList || (sameOrigin ? read(key) : null);
  if (fromList) write(key, fromList);
  else if (!sameOrigin) { try { sessionStorage.removeItem(key); } catch { /* ignore */ } }
  if (!origin) return;

  link.href = origin.href;
  const label = link.querySelector('[data-smart-back-label]');
  if (label) label.textContent = origin.label;
  // When the list is the page right behind us, use history so its scroll
  // position and client-side filters come back exactly as they were.
  link.addEventListener('click', event => {
    if (fromList && history.length > 1) { event.preventDefault(); history.back(); }
  });
});
