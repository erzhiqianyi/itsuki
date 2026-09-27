// Controlled vocabulary for blog tags. Every tag used in front matter should
// appear in exactly one group; anything else is shown under "その他" on the
// tag map so stray tags are easy to spot and fold back in.
export interface TagGroup {
  key: string;
  en: string;
  label: string;
  icon: string;
  description: string;
  tags: string[];
}

export const TAG_GROUPS: TagGroup[] = [
  { key: 'life', en: 'LIFE', label: '暮らし', icon: 'house', description: '東京での毎日、食べること、体のこと。', tags: ['東京生活', '留学・移住', '散歩', '季節と行事', '食と自炊', '健康', '習慣', 'ミニマリズム', 'お金'] },
  { key: 'learn', en: 'LEARN', label: '学び', icon: 'book-open', description: '日本語と、本から学んだこと。', tags: ['日本語学習', 'やさしい日本語', '読書'] },
  { key: 'make', en: 'MAKE', label: 'つくる', icon: 'hammer', description: 'コードを書き、AIと作り、発信する。', tags: ['開発', 'AI', 'Codex', '発信'] },
  { key: 'work', en: 'WORK', label: '仕事', icon: 'briefcase', description: '会社員時代から、退職、日本での就職活動まで。', tags: ['仕事', '退職', '就職活動'] },
  { key: 'travel', en: 'TRAVEL', label: '旅', icon: 'plane', description: '旅先の記録と、ふるさと中国のこと。', tags: ['旅行', '中国'] },
  { key: 'culture', en: 'CULTURE', label: '表現と趣味', icon: 'feather', description: '俳句、エッセイ、考えごと、好きな作品。', tags: ['俳句', 'エッセイ', '考えごと', 'エンタメ'] },
  { key: 'format', en: 'FORMAT', label: '記録の形', icon: 'notebook-pen', description: 'どこで、どう書いたか。', tags: ['日記', 'X'] },
];

export const FORMAT_TAGS = new Set(TAG_GROUPS.find(g => g.key === 'format')!.tags);

export const tagHref = (tag: string) => `/blog/tags/${encodeURIComponent(tag)}`;
export const areaHref = (key: string) => `/blog/tags/area/${key}`;

export const groupOfTag = (tag: string) => TAG_GROUPS.find(g => g.tags.includes(tag));

interface TaggedPost { data: { tags: string[] } }

/** Groups with per-tag counts and how many posts each group reaches, plus an
 *  "その他" group for tags missing from the vocabulary. Empty groups are dropped. */
export function tagAreas<T extends TaggedPost>(posts: T[]) {
  const counts = new Map<string, number>();
  for (const post of posts) for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) || 0) + 1);
  const known = new Set(TAG_GROUPS.flatMap(g => g.tags));
  const stray = [...counts.keys()].filter(tag => !known.has(tag));
  const groups: TagGroup[] = [...TAG_GROUPS, ...(stray.length ? [{ key: 'other', en: 'OTHER', label: 'その他', icon: 'tags', description: 'まだ地図に載っていないタグ。', tags: stray }] : [])];
  return groups
    .map(group => ({
      ...group,
      tags: group.tags.filter(tag => counts.get(tag)).map(tag => ({ tag, count: counts.get(tag)! })).sort((a, b) => b.count - a.count),
      posts: posts.filter(post => post.data.tags.some(tag => group.tags.includes(tag))),
    }))
    .filter(group => group.tags.length);
}
