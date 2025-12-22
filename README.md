# itskui

## tsconfig.json 配置深度解析 (Astro 新手版)

如果你是第一次接触 Astro，可以将 tsconfig.json 理解为项目的“大脑”，它告诉开发工具（如 VS Code）如何理解你的代码。

### 1. tsconfig.json 完整代码


### 2. 配置项深度解析

继承官方预设 (extends)

"extends": "astro/tsconfigs/strict"


这是 Astro 的精髓。Astro 官方提供了一套最佳实践配置。使用 strict（严格模式）可以帮你捕捉到大部分初学者容易犯的低级错误（例如使用了未定义的变量或类型不匹配）。

为什么需要 isolatedModules 和 noEmit？

这是因为 Astro 的工作方式比较特殊：

isolatedModules: Astro 使用 Vite 进行构建，文件是并行处理的。这个设置确保每个文件都能被独立转译。

noEmit: 在 Astro 项目中，TypeScript 只负责“检查错误”，而不负责“生成 JavaScript 文件”。真正的文件生成（从 .astro 到 .html/.js）是由 Astro 自己的编译器完成的。

路径别名 (paths) —— 告别 ../../

这是对开发者最友好的配置。假设你在深层目录下想引用一个组件：

没有配置时：import Nav from "../../../components/Nav.astro"

配置别名后：import Nav from "@components/Nav.astro"

这不仅让代码更整洁，而且当你移动文件位置时，不需要痛苦地重写引用路径。

Astro 专用插件

"plugins": [{ "name": "@astrojs/ts-plugin" }]


由于 .astro 文件不是纯粹的 .ts 文件（它是 HTML + JS 的混合体），这个插件让你的编辑器（如 VS Code）能够识别 .astro 文件里的语法补全和错误提示。

排除项 (exclude)

"exclude": ["node_modules", "dist"]


我们告诉 TypeScript 不要去检查第三方库（node_modules）和构建出来的成品目录（dist），这能极大地提升编辑器的响应速度。

### 给新手的建议

刚开始开发时，你不需要修改这个文件。只需确保它存在于项目根目录即可。如果你发现编辑器对 .astro 文件报错，通常重启一下 VS Code 的 TypeScript 服务器（或重启 VS Code）就能解决。

## package.json 配置深度解析 (Astro 新手版)

package.json 就像是项目的“说明书”和“购物清单”。它告诉 Node.js 这个项目叫什么、需要下载哪些工具，以及如何启动它。

### 1. package.json 完整代码


### 2. 关键配置项解析

模块类型 (type)

"type": "module"


Astro 及其插件都是现代的 JavaScript 模块（ESM）。这一行告诉 Node.js 将项目中的所有 .js 文件视为现代模块，这样我们就可以直接使用 import 和 export 语法。

运行脚本 (scripts)

这是你平时在终端输入命令的地方：

npm run dev: 启动开发服务器。你修改代码后，浏览器会实时刷新。

npm run build: 最重要的一步。它会将你的 Astro 组件和 Markdown 转换成纯粹的 HTML/CSS/JS 存放在 dist 目录。这也是 Cloudflare Pages 最终执行的命令。

npm run preview: 在本地预览打包后的效果（即预览 dist 目录）。

核心依赖 (dependencies)

这些是网站运行必不可少的工具：

astro: 框架核心。

zod: 这是 Astro 处理 Markdown 元数据（Frontmatter）的秘密武器。它确保你的文章标题、日期等格式是正确的，如果不正确，构建时会报错提醒你。

开发依赖 (devDependencies)

这些工具仅在开发时使用，不会包含在最终生成的网页中：

typescript: 为你的项目提供强类型支持。

@astrojs/check: 一个专门检查 .astro 文件中是否存在类型错误的工具。

### 3. 给新手的建议

如何安装？：在终端进入项目目录后，输入 npm install。Node.js 会根据这个清单自动下载所有东西到 node_modules 文件夹中。

版本号前面的 ^：这表示“自动升级兼容的小版本”。例如 ^4.16.0 意味着下次安装时，如果是 4.16.1，它会自动更新，但不会跨越到 5.0.0。

不要手动修改 node_modules：那个文件夹是自动生成的，如果你想添加新功能，应该使用命令（如 npx astro add tailwind），而不是手动修改 package.json。

## astro.config.mjs 配置深度解析 (Astro 新手版)

astro.config.mjs 是 Astro 项目的核心配置文件。它采用 JavaScript 编写，允许你灵活地控制项目的构建行为。

### 1. astro.config.mjs 完整代码

你可以直接将以下内容复制到项目根目录下的 astro.config.mjs 文件中：

import { defineConfig } from 'astro/config';

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


### 2. 关键配置项解析

defineConfig 函数

import { defineConfig } from 'astro/config';


使用 defineConfig 是为了获得更好的自动补全支持。当你在这个函数内部编写代码时，编辑器会提示你哪些选项是可用的，大大降低了拼写错误的风险。

输出模式 (output)

output: 'static'


这是你这个项目的核心。static 表示 SSG（静态站点生成）。

逻辑：当你运行 npm run build 时，Astro 会一次性把所有页面算好，变成 HTML 文件。

优点：部署在 Cloudflare 上速度极快，且不需要运行任何后台程序。

站点地址 (site)

// site: '[https://example.com](https://example.com)'


虽然现在可以先注释掉，但在你正式部署到 Cloudflare 后，建议填上你的域名。Astro 会利用这个地址自动生成 sitemap.xml（帮助搜索引擎收录）以及处理页面中的绝对路径。

基础路径 (base)

// base: '/blog'


如果你希望你的网站通过 yourdomain.com/blog 访问，而不是直接通过 yourdomain.com 访问，就需要配置这个选项。

插件系统 (integrations)

integrations: []


这是 Astro 最强大的地方。如果你以后想用 Tailwind CSS 来写样式，或者想用 React 来做复杂的交互，你只需要在这里添加相应的插件即可（通常通过命令 npx astro add tailwind 自动完成添加）。

### 3. 给新手的建议

文件名后缀 .mjs：这代表它是一个 ES 模块文件。在 Astro 中，我们统一使用 import 这种现代语法。

热更新：当你修改这个文件并保存时，Astro 的开发服务器通常会自动重启以应用新设置。

按需配置：刚开始你只需要保持默认值即可。随着项目变复杂（比如需要添加搜索功能、图片压缩），我们才会回来修改这个文件。


## BaseLayout.astro 配置深度解析 (Astro 新手版)

布局组件是 Astro 开发中最常用的概念。它像一个“信封”，而具体的页面内容就是“信纸”。

### 1. 什么是 Frontmatter (代码栅栏)？

在 .astro 文件的顶部，有两个 --- 符号包裹的区域：

---
interface Props {
  title: string;
}
const { title } = Astro.props;
---


这是你编写 JavaScript 或 TypeScript 的地方。它只在**构建时（Build time）**运行一次。在这里，我们定义了 title 参数，这样不同的页面调用同一个布局时，可以显示不同的标题。

### 2. 核心标签：<slot />

这是布局组件中最重要的部分。

<main>
  <slot />
</main>


<slot /> 是一个占位符。当你其他页面（如 index.astro）引用这个布局时，该页面里的所有内容都会被自动“填”到这个 <slot /> 的位置。

### 3. 样式处理 (is:global)

<style is:global>


在 Astro 中，组件内的样式默认是“局部的”（只对当前组件生效）。
但由于这是 BaseLayout，我们需要定义一些影响全站的样式（如字体、Body 背景颜色、导航栏高度变量等），所以我们加上了 is:global 属性。

### 4. 关键设计点解析

Flex 布局与 min-height: 100vh：我们给 body 设置了 flex-direction: column 和 min-height，并给 main 设置了 flex: 1。这确保了即使页面内容很少，页脚也会乖乖待在屏幕最下方，而不会浮到半中间。

Sticky 导航栏：导航栏使用了 position: sticky; top: 0; 和 backdrop-filter: blur(10px)。这模仿了现代网站常见的毛玻璃效果，当用户向下滚动时，导航栏会半透明地悬浮在顶部。

响应式设计：在底部添加了 @media 查询，确保在手机端浏览时，导航链接和页脚布局依然整齐。

### 5. 如何在页面中使用它？

你只需要在 src/pages/index.astro 中这样写：

---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="首页">
  <h1>这是首页的内容</h1>
  <p>它会被放入布局的 slot 中。</p>
</BaseLayout>


给新手的建议

你可以先保持这个 Layout 不变。以后如果你想给网站换个字体，或者想把导航栏改成黑色背景，直接回来修改这个文件，全站的页面都会同步更新。


Astro 本地开发与预览指南

按照以下步骤，你可以在几分钟内看到你的网站在本地运行。

1. 准备工作

确保你的电脑上安装了 Node.js（建议版本 v18.14.1 或更高）。

你可以通过在终端输入 node -v 来检查版本。

2. 安装项目依赖

在你保存了所有项目文件（package.json, astro.config.mjs 等）的根目录下打开终端，运行：

npm install


这会根据 package.json 中的清单，下载 Astro 核心库以及 Zod 等必要工具到 node_modules 文件夹中。

3. 启动开发服务器

安装完成后，运行以下命令启动预览：

npm run dev


你会看到什么？

终端会输出类似以下内容：

┃  λ  astro  v4.16.0 local service path
┃
┃  Local:     http://localhost:3000/
┃  Network:   use --host to expose


此时，打开浏览器并访问 http://localhost:3000/，你就能看到刚才编写的首页了！

4. 开发中的黑科技：热更新 (HMR)

Astro 支持实时预览。这意味着：

你不需要关闭终端或刷新浏览器。

当你修改 src/pages/index.astro 里的文字或样式并保存时，浏览器会自动显示最新的改动。

5. 常用指令速查

命令

用途

npm run dev

启动开发环境（带热更新）

npm run build

模拟 Cloudflare 的行为，打包生成最终的静态文件 (dist 目录)

npm run preview

在本地预览打包后的 dist 目录效果

常见问题排查

端口冲突：如果 3000 端口被占用，Astro 会自动尝试 3001 或其他端口，请留意终端输出。

依赖报错：如果安装失败，请尝试删除 package-lock.json 后重新运行 npm install。


Itsuki Digital Garden: Astro 原生架构设计

为了实现“通过修改 Markdown 维护网站”的目标，我们将废弃 Demo 阶段的单一 data.json，转而采用 Astro 的 Content Collections 架构。

1. 目录结构设计 (Project Structure)

src/
├── components/          # 可复用的 UI 组件 (BentoCard, Button, etc.)
├── content/             # 核心内容区 (重点)
│   ├── blog/            # 博客文章 (.md)
│   ├── photos/          # 摄影作品元数据 (.md 或 .yaml)
│   ├── now/             # 状态更新 (.md)
│   ├── journey/         # 个人历程 (.md)
│   └── config.ts        # 内容集合 Schema 定义 (Zod 验证)
├── data/                # 非 Markdown 的结构化数据
│   └── site-config.ts   # 导航、UI 样式、社交链接配置
├── layouts/             # 页面模板
└── pages/               # 路由页面


2. 静态配置 (src/data/site-config.ts)

这里存放“核心页面配置”，不经常变动，不建议使用 Markdown，直接用 TypeScript 对象，享受代码补全。

export const SITE_CONFIG = {
  brand: {
    logo: "樹のデジタルガーデン",
    footer: "© 2025 itsuki.garden."
  },
  navigation: [
    { id: "blog", label: { ja: "ブログ", en: "Blog" }, href: "/blog" },
    { id: "photos", label: { ja: "写真", en: "Photos" }, href: "/photos" },
    // ... 其他导航
  ],
  theme: {
    colors: {
      accent: "#89b4fa",
      pink: "#f5c2e7",
      // ... Catppuccin 变量
    }
  }
};


3. 内容集合设计 (src/content/config.ts)

使用 zod 强制约束 Markdown 的 Frontmatter，确保你在增加 .md 文件时，如果漏写了日期或分类，构建会报错。

博客 (Blog)

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.string(),
    tags: z.array(z.string()),
    cover: z.string(),
    summary: z.string(),
    language: z.enum(['en', 'ja']),
  }),
});


摄影 (Photos)

摄影作品不再写在 JSON，而是每个作品一个 .md（或者一个包含所有信息的 .yaml）。

const photos = defineCollection({
  schema: z.object({
    title: z.string(),
    location: z.string(),
    gear: z.string(),
    exif: z.string(),
    image: z.string(), // 指向本地资源路径
    year: z.number(),
    collection: z.string(),
  }),
});


4. 如何维护网站内容？

增加一篇博客

只需在 src/content/blog/ 下新建 my-post.md：

---
title: "我的第一篇 Astro 博客"
date: 2025-12-23
category: "Tech"
tags: ["Astro", "Web"]
cover: "/image/blog-post.jpg"
summary: "这是通过 Markdown 维护的内容..."
language: "ja"
---
这里是正文内容...


增加一个人生阶段 (Journey)

在 src/content/journey/ 下增加 .md，Astro 会自动读取并在 About 页面生成时间轴。

5. 架构优势

自动路由: 利用 Astro 的 getStaticPaths，增加一个 MD 文件就自动生成一个页面。

本地图片优化: Astro 的 <Image /> 组件可以直接处理 Markdown 里的相对路径图片，自动压缩并转为 WebP。

i18n 友好: 可以通过文件夹结构（如 content/blog/ja/ 和 content/blog/en/）轻松实现多语言。

无需 Loading: 所有 Markdown 在构建时直接转为 HTML，极致的 SEO 表现。

下一步建议

定义 Schema: 我们先在 src/content/config.ts 中把这些模型定义出来。

拆分组件: 将设计稿中的 Bento 卡片提取为独立组件，这些组件通过 props 接收来自 Markdown 的数据。