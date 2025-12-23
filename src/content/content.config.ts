import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 博客文章集合
const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "src/content/blog" }),
    schema: z.object({
        lang: z.enum(['ja', 'en']).default('ja'),
        title: z.string(),
        summary: z.string().optional(),
        date: z.string(),
        category: z.string(),
        tags: z.array(z.string()),
        coverImage: z.string(),
        featured: z.boolean().default(false),
    }),
});

// 摄影作品集合
const photos = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "src/content/photos" }),
    schema: z.object({
        lang: z.enum(['ja', 'en']).default('ja'),
        title: z.record(z.string()),
        location: z.record(z.string()),
        image: z.string(),
        date: z.string(),
        location_tag: z.string(),
        year_tag: z.string(),
        collection_tag: z.string(),
        featured: z.boolean().default(false),
        gear: z.string().optional(),
        exif: z.object({
            camera: z.string().optional(),
            aperture: z.string().optional(),
            shutter: z.string().optional(),
            iso: z.string().optional(),
        }).optional(),
    }),
});

// 视频作品集合
const videos = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx,json,yaml}', base: "src/content/videos" }),
    schema: z.object({
        lang: z.enum(['ja', 'en']).default('ja'),
        title: z.string(),
        desc: z.string().optional(),
        image: z.string(),
        tags: z.array(z.string()).default([]),
        duration: z.string().optional(),
        category: z.string().optional(),
        views: z.string().optional(),
        date: z.string(),
        featured: z.boolean().default(false),
        type: z.enum(['long', 'short']).default('long'),
        url: z.string().optional(),
    }),
});

// Now 页面 - 核心状态集合
const now = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,yaml}', base: "src/content/now" }),
    schema: z.object({
        type: z.enum(['mission', 'status']), // 区分使命宣言和当前状态卡片
        lang: z.enum(['ja', 'en']).default('ja'),
        title: z.string(),
        description: z.string().optional(),
        // 针对 mission 的指标
        metrics: z.array(z.object({
            label: z.record(z.string()),
            value: z.string(),
            color: z.string()
        })).optional(),
        // 针对 status (阅读/游戏) 的字段
        category: z.string().optional(),
        author: z.string().optional(),
        platform: z.string().optional(),
        cover: z.string().optional(),
        progress: z.number().min(0).max(100).optional(),
        status_text: z.record(z.string()).optional(),
        link: z.string().optional(),
    }),
});

// Now 页面 - 归档集合 (书影音记录)
const archive = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,yaml}', base: "src/content/archive" }),
    schema: z.object({
        type: z.enum(['books', 'games', 'movies']),
        title: z.string(),
        meta: z.string(), // 作者、导演等
        date: z.string(), // 完成日期
        status: z.string(), // 已读、二周目等
        imgId: z.string().optional(), // Unsplash ID
        hasReview: z.boolean().default(false),
        reviewLink: z.string().optional(),
    }),
});

export const collections = { blog, photos, videos, now, archive };