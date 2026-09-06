# Itsuki's Digital Garden

樹のデジタルガーデン：一个持续更新的个人网站，记录软件开发、日语学习、摄影、视频与日常思考。

[访问网站](https://erzhiqian.cc) · [报告问题](https://github.com/erzhiqianyi/itsuki/issues) · [内容维护指南](docs/content-maintenance.md)

这是个人网站的源码仓库，可作为搭建数字花园的参考。仓库包含作者的真实内容和站点配置；复用时需要替换个人资料、媒体及外部链接。

## 功能

- **文章**：Markdown 内容、分类、标签、精选文章和分页浏览。
- **摄影**：相册、照片预览和标签浏览。
- **项目与视频**：项目介绍、截图、视频资料及外部访问入口。
- **个人记录**：近况、个人介绍、日语学习、书影音归档和更新历史。
- **静态发布**：构建时生成 HTML 和 sitemap，无需部署应用后端或数据库。

网站以日语内容为主，部分内容和配置提供英语字段，并非所有页面都有完整的双语版本。

## 技术栈

Astro 5、TypeScript、React 19、Tailwind CSS 3、Astro Icon / Lucide。内容主要通过 Markdown、YAML 和 Astro Content Collections 管理。

依赖及命令以 [package.json](package.json) 为准。

## 本地运行

### 环境

- Node.js 22 或更高版本（需满足所安装 Astro 版本的 `engines` 要求）。
- npm 9.6.5 或更高版本。
- Git。

基本开发与构建无需 API 密钥或 `.env` 文件。X 日记导入脚本另需 Python 3，普通网站开发不需要运行它。

### 启动

```sh
git clone https://github.com/erzhiqianyi/itsuki.git
cd itsuki
npm install
npm run dev
```

默认打开 [localhost:3000](http://localhost:3000)，实际地址以终端输出为准。当前配置允许局域网访问。需要指定端口或仅本机访问时：

```sh
npm run dev -- --host 127.0.0.1 --port 4322
```

### 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm start` | 与 `npm run dev` 相同 |
| `npm run build` | 构建静态网站，输出至 `dist/` |
| `npm run preview` | 在本地预览已构建的网站；先运行构建 |
| `npm run astro -- check` | 运行 Astro / TypeScript 诊断 |

目前没有独立的 `test` 或 `lint` 脚本。构建与类型检查是不同的检查步骤。

## 目录结构

```text
src/
├── pages/                    # 页面与动态路由
├── layouts/                  # 页面布局
├── components/               # Astro / React 组件
├── styles/                   # 全局与页面样式
├── data/
│   ├── site-config.yaml      # 品牌、社交链接和通用文案
│   └── site-config.ts        # 配置读取与类型定义
└── content/
    ├── content.config.ts     # 内容集合与字段定义
    ├── blog/                 # 文章与日记
    ├── photos/               # 摄影与相册
    ├── projects/             # 项目资料
    ├── videos/               # 视频资料
    ├── page-copy/            # 页面文案
    ├── now/                  # 近况
    ├── about/                # 个人介绍
    ├── japanese/             # 日语学习
    ├── archive/              # 书影音归档
    └── changelog/            # 更新历史
public/                       # 原样复制到构建产物的静态文件
scripts/                      # 内容导入工具
docs/                         # 内容维护与同步说明
astro.config.mjs              # 站点 URL、集成和构建配置
```

## 内容维护

内容字段以 [集合定义](src/content/content.config.ts) 和同目录的现有文件为准。新增内容时，优先复制同类文件并修改 frontmatter；图片通常放入 `public/assets/`，在正文中以 `/assets/...` 引用。

例如，在 `src/content/blog/ja/` 下新增一篇 `.md` 文章：

```markdown
---
lang: ja
title: "はじめての記事"
summary: "記事の短い紹介。"
date: "2026-09-06"
category: "日常"
tags: ["日記"]
coverImage: "/assets/blog/my-first-post.jpg"
featured: false
---

ここから本文を書きます。
```

请同时将示例封面替换为真实图片，并确认路径存在。保存后检查文章列表和详情页，再运行构建。

更多维护说明：

- [内容维护](docs/content-maintenance.md)：各类内容的位置及修改方式。
- [X 日记备份](docs/x-backup.md)：采集范围、外部原始数据位置、导入命令及备份限制。
- [YouTube 视频同步](docs/youtube-sync.md)：同步范围与后续更新步骤；目前不是自动定时同步。

X 原始采集数据保存在仓库外，克隆本项目不会包含这些数据。网站已有内容可以直接构建，重新导入时需自行提供源文件。

## 复用与站点配置

搭建自己的站点时，检查以下位置：

1. 在 [astro.config.mjs](astro.config.mjs) 中修改 `site` 为目标域名，用于生成站点地图等信息。
2. 在 [site-config.yaml](src/data/site-config.yaml) 中修改 `brand.siteUrl`、品牌信息、社交链接和个人文案，使其与目标域名一致。
3. 将 `brand.googleAnalyticsId` 替换为自己的 ID，或设为空字符串以关闭当前布局中的 Google Analytics。
4. 替换 `src/content/` 中的个人内容、`public/` 中的图片和图标，并检查布局、页面中直接写入的导航及外部链接。

当前页面使用 Google Fonts，并可按配置加载 Google Analytics；部分内容也引用外部媒体。需要完全自托管时，应一并调整这些资源。

## 构建与部署

```sh
npm run build
npm run preview
```

检查预览页面后，将 `dist/` 发布到支持静态网站的托管平台。常用构建设置：

| 设置 | 值 |
| --- | --- |
| 项目根目录 | 仓库根目录 |
| 依赖安装 | `npm install` |
| 构建命令 | `npm run build` |
| 输出目录 | `dist` |
| Node.js | 与本地使用的兼容版本一致 |

仓库未提供自动部署工作流；域名绑定、发布分支和托管平台配置需要在平台侧设置。`npm run preview` 仅用于本地检查，不会发布网站。

## 参与贡献

欢迎通过 [Issue](https://github.com/erzhiqianyi/itsuki/issues) 报告问题或讨论改进，也欢迎提交 Pull Request。较大的功能或设计调整请先通过 Issue 讨论。

1. Fork 仓库并创建独立分支。
2. 保持修改范围集中，必要时同步更新文档。
3. 运行 `npm run astro -- check` 和 `npm run build`，在 PR 中说明结果及遇到的问题。
4. 涉及界面时，检查桌面和移动端，并附上截图；涉及内容时，检查列表、详情和图片链接。

问题报告请附复现步骤、预期与实际行为，以及相关浏览器或 Node.js 版本。请勿提交密钥、账户凭据或私人采集数据。

## 许可证

本仓库提供 [Apache License 2.0](LICENSE)。第三方依赖及素材请同时参阅各自的许可与来源说明。
