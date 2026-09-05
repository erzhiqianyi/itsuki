# X 日记备份

来源：https://x.com/itsuki_maer

2026-09-05 通过已登录 Chrome 的 Posts、Replies、Videos、Photos 和 Reposts 栏读取并交叉检查：

- 379 条本人帖子（含回复），按日本时间合并为 62 篇日记。
- 日期范围：2026-07-04 至 2026-09-05。
- 1 条他人转发单独保留来源，见 `x-backup-report.json`；未将原帖日期误作转发日期。
- 379 + 1 与采集时主页显示的 380 对齐，但不是 X 官方全量存档，不保证已删除或隐藏内容。
- 保存 524 张浏览器可取得的图片及缩略图，约 34 MB。图片为已观察到的显示版本，不保证是原图。
- 视频播放器提供的是 blob 流，浏览器资源导出未暴露视频文件。视频正文已备份，视频文件未备份，保留原帖入口。

网站内容：`src/content/blog/ja/journals/YYYY/MM/YYYY-MM-DD-x.md`。
图片：`public/assets/x/`。已有日记不覆盖，同日 X 记录使用独立的 `-x` 文件。

原始采集记录按跨项目资源约定保存在：
`/Users/itsuki/AI/knowledge-base/personal-knowledge/sources/x/itsuki_maer/2026-09-05-browser-capture.json`

原始记录保留逐帖 ID、UTC 时间、正文、引用文本、链接及图片来源；不是私信或账户数据导出。

重新生成：

```sh
python3 scripts/import-x-capture.py /absolute/path/to/browser-capture.json
npm run build
```

脚本按帖子 URL 去重、以日本时间分日，只覆盖带生成标记的 `-x.md`，复用已经下载的图片，并输出备份数量及失败项。完整视频和原始媒体可在取得 X 官方数据存档后再补充；无需将私信等账户数据放入网站。
