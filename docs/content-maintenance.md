# 内容维护

- `src/content/projects/*.md`：项目资料、排序、访问入口、介绍正文及截图。首页和项目页共用这些文件。
- `src/content/page-copy/projects.md`：项目页标题、简介与搜索摘要。
- `src/content/now/*.md`：近况、阅读与娱乐；`mission.md` 的 `updated` 是更新日期。
- `src/content/about/*.md`：个人介绍。
- `src/content/archive/*.md`：已读书籍等历史记录。
- `src/content/videos/**/*.md`：视频资料。
- `src/content/blog/ja/journals/**/*-x.md`：X 日记，由导入脚本生成。
- `src/content/changelog/*.md`：更新历史。

Astro 负责布局、交互和通用界面标签。图片放在 `public/assets/`，由 Markdown 引用。新增项目只需增加 Markdown 文件。

ニャ識截图来自已有宣传素材 `docs/promo/assets/captures/02-receipt-result.png` 和 `07-sudachi-ja.png`；本项目副本位于 `public/assets/projects/nyashiki/`。它们是已保存的演示界面，并非实时截图。
