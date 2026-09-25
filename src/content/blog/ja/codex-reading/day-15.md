---
lang: "ja"
title: "Day 15｜MCP — 外部の道具を、同じ作業の輪につなぐ"
summary: "外部ツールを発見し、呼び出せる形に対応付け、結果を Agent Loop へ返す。"
date: "2026-09-08"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-15.svg"
codexReadingDay: 15
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>外部<rt>がいぶ</rt></ruby>ツールを<ruby>発見<rt>はっけん</rt></ruby>し、<ruby>呼び出<rt>よびだ</rt></ruby>せる<ruby>形<rt>かたち</rt></ruby>に<ruby>対応付<rt>たいおうづ</rt></ruby>け、<ruby>結果<rt>けっか</rt></ruby>を Agent Loop へ<ruby>返<rt>かえ</rt></ruby>す。</p></div>

<ruby>外部<rt>がいぶ</rt></ruby>サービスのツールも、モデルから<ruby>見<rt>み</rt></ruby>れば<ruby>名前<rt>なまえ</rt></ruby>と<ruby>入力<rt>にゅうりょく</rt></ruby>の<ruby>仕様<rt>しよう</rt></ruby>を<ruby>持<rt>も</rt></ruby>つ<ruby>道具<rt>どうぐ</rt></ruby>です。ただし<ruby>実行<rt>じっこう</rt></ruby><ruby>先<rt>さき</rt></ruby>は<ruby>別<rt>べつ</rt></ruby>のサーバーにあります。ツール<ruby>一覧<rt>いちらん</rt></ruby>の<ruby>取得<rt>しゅとく</rt></ruby>と、<ruby>実際<rt>じっさい</rt></ruby>の<ruby>一回<rt>いっかい</rt></ruby>の<ruby>呼び出<rt>よびだ</rt></ruby>しを<ruby>分<rt>わ</rt></ruby>けて<ruby>追<rt>お</rt></ruby>います。

## 01｜図でつかむ

![図15｜MCP](/assets/codex-reading/day-15.svg)

<ruby>発見<rt>はっけん</rt></ruby>に<ruby>成功<rt>せいこう</rt></ruby>しても、<ruby>呼び出<rt>よびだ</rt></ruby>し・<ruby>認証<rt>にんしょう</rt></ruby>・<ruby>結果<rt>けっか</rt></ruby><ruby>処理<rt>しょり</rt></ruby>の<ruby>確認<rt>かくにん</rt></ruby>は<ruby>別<rt>べつ</rt></ruby>に<ruby>必要<rt>ひつよう</rt></ruby>。

## 02｜3つのポイントで理解する

### 1. ツールの存在を知る

<ruby>接続先<rt>せつぞくさき</rt></ruby>から<ruby>利用<rt>りよう</rt></ruby>できるツールの<ruby>情報<rt>じょうほう</rt></ruby>を<ruby>受け取<rt>うけと</rt></ruby>ります。McpRuntime <ruby>周辺<rt>しゅうへん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>み、<ruby>接続<rt>せつぞく</rt></ruby>とツール<ruby>一覧<rt>いちらん</rt></ruby>の<ruby>取得<rt>しゅとく</rt></ruby>がどの<ruby>状態<rt>じょうたい</rt></ruby>で<ruby>管理<rt>かんり</rt></ruby>されるかを<ruby>見<rt>み</rt></ruby>ます。

### 2. 内部の呼び出しへ橋を架ける

McpBinding や Handler は、<ruby>内部<rt>ないぶ</rt></ruby>のツール<ruby>呼び出<rt>よびだ</rt></ruby>しと<ruby>外部<rt>がいぶ</rt></ruby>サーバーの<ruby>操作<rt>そうさ</rt></ruby>を<ruby>結<rt>むす</rt></ruby>びます。<ruby>同<rt>おな</rt></ruby>じような<ruby>名前<rt>なまえ</rt></ruby>のツールがある<ruby>場合<rt>ばあい</rt></ruby>、どの<ruby>接続先<rt>せつぞくさき</rt></ruby>を<ruby>使<rt>つか</rt></ruby>うかが<ruby>重要<rt>じゅうよう</rt></ruby>になります。

### 3. 成功と失敗を結果として戻す

<ruby>外部<rt>がいぶ</rt></ruby><ruby>呼び出<rt>よびだ</rt></ruby>しには<ruby>通信<rt>つうしん</rt></ruby>、<ruby>認証<rt>にんしょう</rt></ruby>、ツール<ruby>自身<rt>じしん</rt></ruby>の<ruby>失敗<rt>しっぱい</rt></ruby>があります。どこで<ruby>失敗<rt>しっぱい</rt></ruby>したかを<ruby>保持<rt>ほじ</rt></ruby>して<ruby>返<rt>かえ</rt></ruby>せば、Agent Loop は<ruby>結果<rt>けっか</rt></ruby>に<ruby>応<rt>おう</rt></ruby>じて<ruby>次<rt>つぎ</rt></ruby>の<ruby>判断<rt>はんだん</rt></ruby>を<ruby>行<rt>おこな</rt></ruby>えます。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>tools/list が<ruby>返<rt>かえ</rt></ruby>ったことだけでは、tools/call で<ruby>必要<rt>ひつよう</rt></ruby>な<ruby>操作<rt>そうさ</rt></ruby>が<ruby>成功<rt>せいこう</rt></ruby>するとは<ruby>言<rt>い</rt></ruby>えません。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "McpRuntime|McpBinding" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/codex-mcp/src/runtime.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/codex-mcp/src/runtime.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>読み取<rt>よみと</rt></ruby>り<ruby>専用<rt>せんよう</rt></ruby>のツールを<ruby>一<rt>ひと</rt></ruby>つ<ruby>選<rt>えら</rt></ruby>び、<ruby>一覧<rt>いちらん</rt></ruby>の<ruby>名前<rt>なまえ</rt></ruby>、<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>先<rt>さき</rt></ruby>、<ruby>返<rt>かえ</rt></ruby>った<ruby>結果<rt>けっか</rt></ruby>の<ruby>三点<rt>さんてん</rt></ruby>を<ruby>対応付<rt>たいおうづ</rt></ruby>けます。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>発見<rt>はっけん</rt></ruby>と<ruby>実行<rt>じっこう</rt></ruby>を<ruby>分<rt>わ</rt></ruby>ける。**
- **Binding が<ruby>内部<rt>ないぶ</rt></ruby>と<ruby>外部<rt>がいぶ</rt></ruby>の<ruby>対応<rt>たいおう</rt></ruby>を<ruby>持<rt>も</rt></ruby>つ。**
- **<ruby>通信<rt>つうしん</rt></ruby>・<ruby>認証<rt>にんしょう</rt></ruby>・<ruby>操作<rt>そうさ</rt></ruby>の<ruby>失敗<rt>しっぱい</rt></ruby>を<ruby>区別<rt>くべつ</rt></ruby>する。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
