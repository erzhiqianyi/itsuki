# YouTube 视频同步

频道公开 Videos 页的视频同步到 `src/content/videos/YYYY/MM/<videoId>.md`，封面存 `public/assets/videos/youtube/<videoId>.jpg`。按频道分类而非时长阈值，因此包括 16 秒宣传片和 9 秒俳句；排除 Shorts 和直播页。不保存视频文件，不展示易过期的播放量。核对清单见 `youtube-sync.json`。

标题、公开状态、精确发布时间和简介来自公开视频页面 `https://www.youtube.com/watch?v=<id>`；时长使用频道页显示值。日期转换为日本时间，保留时间用于同一天的视频排序。

置顶：`src/pages/videos.astro` 取按日期倒序后第一个 `featured: true` 的长视频作为头图。当前置顶为 `cZN8PLBN2Tc`（レシートが、日本語の教材に。｜ニャ識），需要一直保持。**同步新视频时一律写 `featured: false`**，除非用户明确要求换置顶。

原有 3 篇视频正文保留。原 Rust 直播条目和误用同一链接的 EP3 稿件移至 `video-drafts/`，正文完整保留，不在普通视频列表发布。

## 自动同步

定时任务 `youtube-daily-sync`（每天 10:00，任务定义在 `~/.claude/scheduled-tasks/youtube-daily-sync/SKILL.md`）会核对频道页、补齐缺失视频、构建并推送。

抓取方式（普通 curl 即可，不需要浏览器和 API key）：
- 频道页 `https://www.youtube.com/@Itsuki-no-Nihonggo/videos`，用 `"videoId":"..."` 去重取全量 ID；时长在同一份 HTML 的 `thumbnailBadgeViewModel.text` 里。
- 视频页 `https://www.youtube.com/watch?v=<id>`：`lengthSeconds`、`<meta itemprop="datePublished">`、`"isUnlisted"`、JSON 字段 `shortDescription`。
- 封面 `https://i.ytimg.com/vi/<id>/maxresdefault.jpg`，取不到时依次退到 `hq720.jpg`、`hqdefault.jpg`。
- RSS `https://www.youtube.com/feeds/videos.xml?channel_id=UCpPNVWQ_YOm-IaIMEQtc8_g` 只作参考，它含 Shorts，不是收录依据。

`desc` 取简介开头一到两行、用空格连接；正文可留空，也可保留人工撰写的内容——重跑时不要覆盖已有正文和已改过的标题。`category` 沿用现有取值（VLOG / APP / PODCAST / 俳句），`type` 一律 `long`，`tags` 留空。
