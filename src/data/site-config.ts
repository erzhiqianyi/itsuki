import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

/**
 * Itsuki Digital Garden - 站点配置中心
 * 功能：从 src/data/site-config.yaml 读取并解析配置
 */

interface SiteConfig {
    brand: {
        logo: string;
        favicon: string;
        watermark: string;
        email: string;
        footer: string;
        googleAnalyticsId: string;
        siteUrl: string;
        description: { ja: string; en: string };
        webring: {
            label: string;
            home: string;
            prev: string;
            next: string;
        }
    };
    // 博客全局配置
    blog: {
        pageSize: number;
    };
    navigation: Array<{
        id: string;
        href: string;
        label: { ja: string; en: string };
        color: string;
    }>;
    socials: Array<{
        id: string;
        label: string;
        handle: string;
        href: string;
        icon: string;
        color: string;
        activeColor?: string;
    }>;
    theme: {
        colors: {
            bg: string;
            card: string;
            text: string;
            subtext: string;
            accent: string;
            pink: string;
            green: string;
            peach: string;
            red: string;
        }
    };
    ui: {
        headings: Record<string, { ja: string; en: string }>;
        labels: Record<string, { ja: string; en: string }>;
    };
    stats: Array<{
        id: string;
        label: { ja: string; en: string };
    }>;
    profile: {
        avatar: string;
        intro: { ja: string; en: string };
        roles: Array<{ id: string; label: { ja: string; en: string }; color: string; }>;
        philosophy: { ja: string; en: string };
    }
}

// 构建配置文件路径
const configPath = path.resolve(process.cwd(), 'src/data/site-config.yaml');

let config: SiteConfig;

try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    config = yaml.load(fileContents) as SiteConfig;
} catch (e) {
    console.error('无法加载 site-config.yaml，请检查文件路径和格式:', e);
    // 完备的回退配置
    config = {
        brand: {
            logo: "Itsuki",
            footer: "© 2025",
            description: { ja: "", en: "" }
        } as any,
        blog: { pageSize: 6 },
        ui: { headings: {}, labels: {} },
        navigation: [],
        socials: []
    } as any;
}

export const SITE_CONFIG = config;

/**
 * 翻译辅助函数
 * @param key UI 字典中的键
 * @param lang 语言代码 ('ja' | 'en')
 */
export function t(key: string, lang: 'ja' | 'en' = 'ja') {
    if (!SITE_CONFIG.ui) return key;

    // 优先从 labels 查找，再从 headings 查找
    const entry = SITE_CONFIG.ui.labels?.[key] || SITE_CONFIG.ui.headings?.[key];

    // @ts-ignore
    return entry ? entry[lang] : key;
}