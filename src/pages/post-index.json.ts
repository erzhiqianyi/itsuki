import { getCollection, render } from 'astro:content';
import type { APIRoute } from 'astro';
import type { PostIndexItem } from '../lib/post-filter';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', ({ data }) => data.lang === 'ja');
  const entries: PostIndexItem[] = await Promise.all(posts.map(async post => ({
    id: post.id.replace(/\.(md|mdx)$/, ''),
    title: post.data.title || post.data.date,
    date: post.data.date,
    category: post.data.category.toLowerCase(),
    tags: post.data.tags,
    pinnedInCategory: post.data.pinnedInCategory,
    excerpt: post.data.summary || (await render(post)).headings.filter(h => h.depth <= 3).slice(0, 5).map(h => h.text).join(' / '),
  })));
  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
