export interface PostIndexItem {
  id: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  pinnedInCategory?: boolean;
}
export interface PostFilter {
  year: string;
  month: string;
  tag: string;
  sort: 'asc' | 'desc';
}
export function filterPosts(posts: PostIndexItem[], filter: PostFilter, category?: string) {
  return posts.filter(post =>
    (!filter.year || post.date.slice(0, 4) === filter.year) &&
    (!filter.month || post.date.slice(5, 7) === filter.month) &&
    (!filter.tag || post.tags.includes(filter.tag))
  ).sort((a, b) => {
    const pinOrder = Number(!!(category && b.category === category && b.pinnedInCategory)) - Number(!!(category && a.category === category && a.pinnedInCategory));
    if (pinOrder) return pinOrder;
    const dateOrder = a.date.localeCompare(b.date);
    return (filter.sort === 'asc' ? dateOrder : -dateOrder) || a.id.localeCompare(b.id);
  });
}
export const postCategoryLabel = (key: string) => (({ japanese: '日本語学習', journals: '日記', codex: '技術' } as Record<string, string>)[key] || key);
