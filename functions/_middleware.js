// Keep withdrawn Codex drafts inaccessible even while old Pages assets remain cached.
export function onRequest({ request, next }) {
  const path = new URL(request.url).pathname;
  if (
    path === '/blog/codex-reading' || path.startsWith('/blog/codex-reading/') ||
    path === '/blog/ja/codex-reading' || path.startsWith('/blog/ja/codex-reading/') ||
    path === '/category/codex' || path.startsWith('/category/codex/') ||
    path === '/assets/codex-reading' || path.startsWith('/assets/codex-reading/')
  ) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }
  return next();
}
