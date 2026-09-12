import {defineCollection, z} from 'astro:content';
import {glob} from 'astro/loaders';

// 1. 博客文章集合
const blog = defineCollection({
    loader: glob({pattern: '**/[^_]*.{md,mdx}', base: "src/content/blog"}),
    schema: z.object({
        lang: z.enum(['ja', 'en']).default('ja'),
        title: z.string(),
        summary: z.string().optional(),
        date: z.string(),
        category: z.string(),
        tags: z.array(z.string()),
        coverImage: z.string(),
        featured: z.boolean().default(false),
        transcriptReview: z.boolean().default(false),
    }),
});

// 2. 摄影作品集合
const photos = defineCollection({
    loader: glob({pattern: '**/[^_]*.{md,mdx}', base: "src/content/photos"}),
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
        // 新增 images 数组验证
        images: z.array(z.object({
            url: z.string(),
            width: z.number().optional(),  // 可选，但在代码中最好有回退值
            height: z.number().optional(), // 可选
            title: z.string().optional(),
            location: z.string().optional(),          // 写真ごとの場所（例: 男木島）
            tags: z.array(z.string()).default([])     // 写真ごとの被写体タグ（例: 猫, 花火, 富士山）
        })).optional()
    }),
});

// 3. 视频作品集合
const videos = defineCollection({
    loader: glob({pattern: '**/[^_]*.{md,mdx,json,yaml}', base: "src/content/videos"}),
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

const projects = defineCollection({
    type: 'content',
    schema: z.object({
        id: z.string(), order: z.number(), name: z.string(), description: z.string(),
        kind: z.string(), href: z.string().url(), icon: z.string(), action: z.string(),
    }),
});

// 4. Now 页面 - 核心状态集合
const now = defineCollection({
    loader: glob({pattern: '**/[^_]*.{md,yaml}', base: "src/content/now"}),
    schema: z.object({
        type: z.enum(['mission', 'status']),
        updated: z.string().optional(),
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

// 5. Now 页面 - 归档集合 (书影音记录)
const archive = defineCollection({
    loader: glob({pattern: '**/[^_]*.{md,yaml}', base: "src/content/archive"}),
    schema: z.object({
        type: z.enum(['books', 'games', 'movies']),
        title: z.string(),
        meta: z.string(),
        date: z.string(),
        status: z.string(),
        imgId: z.string().optional(),
        hasReview: z.boolean().default(false),
        reviewLink: z.string().optional(),
    }),
});

// 6. About 页面 - 个人资料与履历集合
const about = defineCollection({
    loader: glob({pattern: '**/[^_]*.{md,mdx}', base: "src/content/about"}),
    schema: z.object({
        lang: z.enum(['ja', 'en']).default('ja'),
        // Profile 模块
        name: z.string().optional(),
        avatar: z.string().optional(),
        tags: z.array(z.string()).optional(),
        attributes: z.array(z.object({
            icon: z.string(),
            label: z.string(),
            value: z.string().optional(),
            color: z.string(),
            isLanguageList: z.boolean().optional(),
            items: z.array(z.object({
                lang: z.string(),
                level: z.string(),
                color: z.string(),
                bg: z.string(),
                border: z.string()
            })).optional()
        })).optional(),
        // Bio 模块
        title: z.string().optional(),
        quote: z.string().optional(),
        // Experience / Journey 模块列表数据
        items: z.array(z.object({
            role: z.string().optional(),
            company: z.string().optional(),
            period: z.string().optional(),
            description: z.string().optional(),
            tech: z.array(z.string()).optional(),
            date: z.string().optional(),
            location: z.string().optional(),
            desc: z.string().optional(),
            color: z.string().optional(),
            cover: z.string().optional(),
        })).optional()
    })
});

const changelog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.string(), // 格式如 2025-12-27
        version: z.string(),
        lang: z.enum(['ja', 'en']), // 显式区分语言
        type: z.enum(['feat', 'fix', 'refactor', 'style', 'perf']), // 日志类型
    }),
});

export const collections = {projects, blog, photos, videos, now, archive, about, changelog};
