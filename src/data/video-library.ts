import { getCollection, type CollectionEntry } from 'astro:content';

const youtubeHosts = ['youtube.com', 'www.youtube.com', 'm.youtube.com'];

function youtubeId(url: string | undefined) {
    if (!url) return;
    const parsed = URL.canParse(url) ? new URL(url) : undefined;
    if (!parsed || !['https:', 'http:'].includes(parsed.protocol)) return;
    const id = parsed.hostname === 'youtu.be'
        ? parsed.pathname.split('/')[1]
        : youtubeHosts.includes(parsed.hostname)
            ? parsed.searchParams.get('v') || parsed.pathname.match(/^\/(?:shorts|embed)\/([^/]+)\/?$/)?.[1]
            : undefined;
    return id && /^[\w-]{11}$/.test(id) ? id : undefined;
}

const fileSlug = (id: string) => id.split('/').at(-1)?.replace(/\.(mdx?|json|ya?ml)$/, '');
const watchHref = (id: string | undefined) => `/videos/${id}/`;
export const videoHref = (entry: CollectionEntry<'videos'>) => watchHref(youtubeId(entry.data.url) || fileSlug(entry.id));
export const isVideoReview = ({ data }: CollectionEntry<'blog'>) =>
    data.transcriptReview || (!!data.youtube && data.tags.includes('やさしい日本語'));

interface ArticleVideoLink {
    id?: string;
    href: string;
    title: string;
    url?: string;
}

export function articleVideoLinks({ data, id }: CollectionEntry<'blog'>): ArticleVideoLink[] {
    const related = data.relatedYoutube ?? [];
    const videos: { id: string; title: string }[] = data.youtube ? [data.youtube, ...related] : related;
    if (videos.length) {
        return videos.map(video => ({
            ...video,
            href: watchHref(video.id),
            url: `https://www.youtube.com/watch?v=${video.id}`,
        }));
    }
    if (data.transcriptReview || data.videoFile) {
        return [{ href: watchHref(fileSlug(id)), title: data.title }];
    }
    return [];
}

interface LibraryVideo {
    href: string;
    title: string;
    description?: string;
    image: string;
    date: string;
    duration?: string;
    type: 'long' | 'short';
    lang: 'ja' | 'en';
    youtubeId?: string;
    url?: string;
    video?: CollectionEntry<'videos'>;
    article?: CollectionEntry<'blog'>;
    review: boolean;
}

export async function getVideoLibrary() {
    const [videos, articles] = await Promise.all([getCollection('videos'), getCollection('blog')]);
    const library = new Map<string, LibraryVideo>();

    for (const video of videos) {
        const href = videoHref(video);
        const { title, desc, image, date, duration, lang, url, type } = video.data;
        library.set(href, {
            href, title, description: desc, image, date, duration, type, lang, url,
            youtubeId: youtubeId(url), video, review: false,
        });
    }

    for (const article of articles) {
        const { title, summary, coverImage, date, lang, videoFile } = article.data;
        const review = isVideoReview(article);
        for (const link of articleVideoLinks(article)) {
            const video = library.get(link.href);
            if (video) {
                video.article = article;
                video.review = review;
                if (review) {
                    video.title = title;
                    video.description = summary || video.description;
                }
            } else {
                library.set(link.href, {
                    href: link.href, title: review ? title : link.title, description: summary,
                    image: coverImage || (link.id ? youtubeThumbnail(link.id) : ''), date, lang,
                    type: 'long', duration: videoFile?.duration, article, review, youtubeId: link.id, url: link.url,
                });
            }
        }
    }

    return [...library.values()].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export const youtubeThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export function videoImage(src: string) {
    if (!src || src.startsWith('/') || src.startsWith('http')) return src;
    return `https://images.unsplash.com/photo-${src}?q=80&w=1200&fit=crop`;
}
