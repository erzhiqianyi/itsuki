import { filterPosts, postCategoryLabel, type PostFilter, type PostIndexItem } from '../lib/post-filter';

const root = document.querySelector<HTMLElement>('[data-post-index]');
if (root) {
  const find = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const category = root.dataset.category || '';
  const base = root.dataset.base || '/blog';
  const pageSize = Number(root.dataset.pageSize) || 9;
  const tools = find<HTMLElement>('[data-post-tools]');
  const entries = find<HTMLElement>('[data-post-entries]');
  const pagination = find<HTMLElement>('[data-post-pages]');
  const years = find<HTMLElement>('[data-year-options]');
  const tags = find<HTMLElement>('[data-tag-options]');
  const month = find<HTMLSelectElement>('#post-month');
  const more = find<HTMLButtonElement>('.post-tags-more');
  const panel = find<HTMLElement>('#post-filters-panel');
  const toggle = find<HTMLButtonElement>('.post-filters-toggle');
  const template = find<HTMLTemplateElement>('[data-post-template]');
  let posts: PostIndexItem[] = [];
  let filter: PostFilter = { year: '', month: '', tag: '', sort: 'desc' };
  let currentPage = Number(root.dataset.page) || 1;
  let loaded = false;

  const unique = (values: string[]) => [...new Set(values)].filter(Boolean);
  const currentPageFromPath = () => {
    const suffix = location.pathname.replace(/\/$/, '').slice(base.length);
    return /^\/\d+$/.test(suffix) ? Math.max(1, Number(suffix.slice(1))) : 1;
  };
  function readURL() {
    const query = new URLSearchParams(location.search);
    filter = { year: query.get('year') || '', month: query.get('month') || '', tag: query.get('tag') || '', sort: query.get('sort') === 'asc' ? 'asc' : 'desc' };
    currentPage = currentPageFromPath();
  }
  function urlFor(page: number) {
    const query = new URLSearchParams(location.search);
    for (const key of ['year', 'month', 'tag', 'sort'] as const) {
      const value = filter[key];
      if (value && !(key === 'sort' && value === 'desc')) query.set(key, value);
      else query.delete(key);
    }
    const search = query.toString();
    return `${base}${page > 1 ? `/${page}` : ''}${search ? `?${search}` : ''}${location.hash}`;
  }
  function optionButton(value: string, label: string, key: 'year' | 'tag', selected: string) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.filter = key;
    button.dataset.value = value;
    button.textContent = label;
    button.setAttribute('aria-pressed', String(value === selected));
    return button;
  }
  function syncClamp() {
    if (!tags.getClientRects().length) return;
    const expanded = tags.classList.contains('expanded');
    more.hidden = !expanded && tags.scrollHeight <= tags.clientHeight + 1;
    const bottom = tags.getBoundingClientRect().bottom;
    tags.querySelectorAll<HTMLButtonElement>('button').forEach(button => {
      const clipped = !expanded && button.getBoundingClientRect().bottom > bottom + 1;
      button.inert = clipped;
      button.style.visibility = clipped ? 'hidden' : '';
      if (clipped) button.setAttribute('aria-hidden', 'true');
      else button.removeAttribute('aria-hidden');
    });
  }
  function render(historyMode: 'push' | 'replace' = 'replace') {
    const active = document.activeElement as HTMLElement | null;
    const focusKey = active?.dataset.filter;
    const focusValue = active?.dataset.value;
    const availableYears = unique(posts.map(post => post.date.slice(0, 4))).sort().reverse();
    if (!availableYears.includes(filter.year)) filter.year = '';
    const yearPosts = posts.filter(post => !filter.year || post.date.slice(0, 4) === filter.year);
    const availableMonths = unique(yearPosts.map(post => post.date.slice(5, 7))).sort();
    if (!availableMonths.includes(filter.month)) filter.month = '';
    const datedPosts = yearPosts.filter(post => !filter.month || post.date.slice(5, 7) === filter.month);
    const availableTags = unique(datedPosts.flatMap(post => post.tags)).sort((a, b) => a.localeCompare(b, 'ja'));
    if (!availableTags.includes(filter.tag)) filter.tag = '';
    years.replaceChildren(optionButton('', 'すべて', 'year', filter.year), ...availableYears.map(year => optionButton(year, year, 'year', filter.year)));
    month.replaceChildren(new Option('すべての月', ''), ...availableMonths.map(value => new Option(`${Number(value)}月`, value)));
    month.value = filter.month;
    // Keep the selected tag visible even when the rest of the tag list is folded.
    const orderedTags = filter.tag ? [filter.tag, ...availableTags.filter(tag => tag !== filter.tag)] : availableTags;
    tags.replaceChildren(optionButton('', 'すべて', 'tag', filter.tag), ...orderedTags.map(tag => optionButton(tag, tag, 'tag', filter.tag)));
    root!.querySelectorAll<HTMLButtonElement>('[data-post-sort]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.postSort === filter.sort)));
    const matching = filterPosts(posts, filter, category);
    const pageCount = Math.max(1, Math.ceil(matching.length / pageSize));
    currentPage = Math.min(Math.max(1, currentPage), pageCount);
    const start = (currentPage - 1) * pageSize;
    const fragment = document.createDocumentFragment();
    for (const post of matching.slice(start, start + pageSize)) {
      const item = template.content.cloneNode(true) as DocumentFragment;
      const href = `/blog/${post.id}`;
      item.querySelector<HTMLElement>('[data-entry-pin]')!.hidden = !(category && post.category === category && post.pinnedInCategory);
      const time = item.querySelector('time')!;
      time.dateTime = post.date;
      time.textContent = post.date.replaceAll('-', '.');
      const title = item.querySelector<HTMLAnchorElement>('[data-entry-title]')!;
      title.href = href;
      title.textContent = post.title;
      const excerpt = item.querySelector<HTMLElement>('[data-entry-excerpt]')!;
      excerpt.textContent = post.excerpt;
      excerpt.hidden = !post.excerpt;
      const cat = item.querySelector<HTMLAnchorElement>('[data-entry-category]')!;
      cat.href = `/category/${post.category}`;
      cat.textContent = postCategoryLabel(post.category);
      const arrow = item.querySelector<HTMLAnchorElement>('[data-entry-arrow]')!;
      arrow.href = href;
      arrow.setAttribute('aria-label', `${post.title}を読む`);
      fragment.append(item);
    }
    entries.replaceChildren(fragment);
    find('[data-post-total]').textContent = `${matching.length} 記事`;
    const conditions = [filter.year && `${filter.year}年`, filter.month && `${Number(filter.month)}月`, filter.tag && `#${filter.tag}`].filter(Boolean);
    find('[data-post-status]').textContent = `${conditions.length ? conditions.join(' · ') + ' — ' : ''}${matching.length} 記事 · ${filter.sort === 'asc' ? '古い順' : '新しい順'}${matching.length ? ` · ${start + 1}–${Math.min(start + pageSize, matching.length)}件を表示` : ''}`;
    find('[data-post-reset]').hidden = !conditions.length;
    find('[data-post-empty]').hidden = matching.length > 0;
    pagination.replaceChildren();
    function pageLink(page: number, text: string, label?: string) {
      const link = document.createElement('a');
      link.href = urlFor(page);
      link.dataset.resultPage = String(page);
      link.textContent = text;
      if (label) link.setAttribute('aria-label', label);
      if (page === currentPage && !label) link.setAttribute('aria-current', 'page');
      pagination.append(link);
    }
    if (pageCount > 1) {
      if (currentPage > 1) pageLink(currentPage - 1, '←', '前のページ');
      let last = 0;
      for (let page = 1; page <= pageCount; page++) {
        if (page !== 1 && page !== pageCount && Math.abs(page - currentPage) > 1) continue;
        if (last && page - last > 1) {
          const dots = document.createElement('span');
          dots.textContent = '…';
          pagination.append(dots);
        }
        pageLink(page, String(page));
        last = page;
      }
      if (currentPage < pageCount) pageLink(currentPage + 1, '→', '次のページ');
    }
    pagination.hidden = pageCount <= 1;
    // Category changes reset dependent filters and keep the chosen ordering.
    root!.querySelectorAll<HTMLAnchorElement>('[data-post-categories] a').forEach(link => {
      const url = new URL(link.href);
      if (url.pathname === '/blog/featured') return;
      url.search = filter.sort === 'asc' ? '?sort=asc' : '';
      link.href = url.pathname + url.search;
    });
    const url = urlFor(currentPage);
    if (url !== location.pathname + location.search + location.hash) {
      if (historyMode === 'push') history.pushState(null, '', url);
      else history.replaceState(null, '', url);
    }
    requestAnimationFrame(syncClamp);
    if (focusKey) {
      [...root!.querySelectorAll<HTMLButtonElement>('[data-filter]')].find(button => button.dataset.filter === focusKey && button.dataset.value === focusValue)?.focus({ preventScroll: true });
    }
  }
  async function load() {
    find('[data-post-error]').hidden = true;
    try {
      const response = await fetch('/post-index.json');
      if (!response.ok) throw new Error('Index unavailable');
      const all: PostIndexItem[] = await response.json();
      posts = all.filter(post => !category || post.category === category);
      loaded = true;
      readURL();
      tools.hidden = false;
      render();
    } catch {
      find('[data-post-error]').hidden = false;
    }
  }
  root.addEventListener('click', event => {
    const target = event.target as Element;
    const button = target.closest<HTMLButtonElement>('button');
    if (button?.hasAttribute('data-post-retry')) { void load(); return; }
    if (!loaded) return;
    if (button?.dataset.filter) {
      filter[button.dataset.filter as 'year' | 'tag'] = button.dataset.value || '';
      currentPage = 1;
      render('push');
    } else if (button?.dataset.postSort) {
      filter.sort = button.dataset.postSort as 'asc' | 'desc';
      currentPage = 1;
      render('push');
    } else if (button?.hasAttribute('data-post-reset')) {
      filter.year = filter.month = filter.tag = '';
      currentPage = 1;
      render('push');
    }
    const link = target.closest<HTMLAnchorElement>('[data-result-page]');
    if (link && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) {
      event.preventDefault();
      currentPage = Number(link.dataset.resultPage);
      render('push');
      find('[data-post-status]').scrollIntoView({ block: 'start' });
      pagination.querySelector<HTMLAnchorElement>('[aria-current="page"]')?.focus({ preventScroll: true });
    }
  });
  month.addEventListener('change', () => { filter.month = month.value; currentPage = 1; render('push'); });
  toggle.addEventListener('click', () => {
    const expanded = panel.classList.toggle('expanded');
    toggle.setAttribute('aria-expanded', String(expanded));
    requestAnimationFrame(syncClamp);
  });
  more.addEventListener('click', () => {
    const expanded = tags.classList.toggle('expanded');
    more.setAttribute('aria-expanded', String(expanded));
    more.textContent = expanded ? '閉じる' : 'もっと見る';
    syncClamp();
  });
  window.addEventListener('popstate', () => { if (loaded) { readURL(); render(); } });
  window.addEventListener('resize', syncClamp);
  document.fonts?.ready.then(syncClamp);
  void load();
}
