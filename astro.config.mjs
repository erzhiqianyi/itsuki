import {defineConfig} from 'astro/config';

// [https://astro.build/config](https://astro.build/config)
export default defineConfig({
    // 1. 站点部署后的基础 URL
    // site: '[https://example.com](https://example.com)',

    // 2. 项目部署的子路径（如果是根目录则留空）
    // base: '/blog',

    // 3. 输出模式：'static' 表示生成纯静态 HTML
    output: 'static',

    // 4. 服务器配置
    server: {
        port: 3000,
        host: true, // 允许通过局域网 IP 访问
    },

    // 5. 预留：未来添加插件（如 Tailwind, React, Sitemap）的地方
    integrations: [],
});