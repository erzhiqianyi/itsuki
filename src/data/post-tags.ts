// Controlled vocabulary for blog tags. Every tag used in front matter should
// appear in exactly one group; anything else is shown under "その他" on the
// tag map so stray tags are easy to spot and fold back in.
export interface TagGroup {
  key: string;
  en: string;
  label: string;
  description: string;
  tags: string[];
}

export const TAG_GROUPS: TagGroup[] = [
  { key: 'life', en: 'LIFE', label: '暮らし', description: '東京での毎日、食べること、体のこと。', tags: ['東京生活', '留学・移住', '散歩', '季節と行事', '食と自炊', '健康', '習慣', 'ミニマリズム', 'お金'] },
  { key: 'learn', en: 'LEARN', label: '学び', description: '日本語と、本から学んだこと。', tags: ['日本語学習', 'やさしい日本語', '読書'] },
  { key: 'make', en: 'MAKE', label: 'つくる', description: 'コードを書き、AIと作り、発信する。', tags: ['開発', 'AI', 'Codex', '発信'] },
  { key: 'work', en: 'WORK', label: '仕事', description: '会社員時代から、退職、日本での就職活動まで。', tags: ['仕事', '退職', '就職活動'] },
  { key: 'travel', en: 'TRAVEL', label: '旅', description: '旅先の記録と、ふるさと中国のこと。', tags: ['旅行', '中国'] },
  { key: 'culture', en: 'CULTURE', label: '表現と趣味', description: '俳句、エッセイ、考えごと、好きな作品。', tags: ['俳句', 'エッセイ', '考えごと', 'エンタメ'] },
  { key: 'format', en: 'FORMAT', label: '記録の形', description: 'どこで、どう書いたか。', tags: ['日記', 'X'] },
];

export const FORMAT_TAGS = new Set(TAG_GROUPS.find(g => g.key === 'format')!.tags);

export const tagHref = (tag: string) => `/blog/tags/${encodeURIComponent(tag)}`;

export const groupOfTag = (tag: string) => TAG_GROUPS.find(g => g.tags.includes(tag));
