import {defineConfig} from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap'; // 确保已安装此插件
import react from '@astrojs/react'; // [!code ++]
import icon from 'astro-icon'; // 导入插件


// [https://astro.build/config](https://astro.build/config)
export default defineConfig({
    // 1. 站点部署后的基础 URL
    site: 'https://itsuki.erzhiqian.cc',

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
    integrations: [tailwind(), sitemap(), react(),icon()],
});