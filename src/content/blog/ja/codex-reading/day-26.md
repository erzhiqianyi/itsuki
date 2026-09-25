---
lang: "ja"
title: "Day 26｜State Reachability — その状態は、本当に起きる？"
summary: "テストで作れる状態と、実際のイベントから到達できる状態を区別する。"
date: "2026-09-19"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-26.svg"
codexReadingDay: 26
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p>テストで<ruby>作<rt>つく</rt></ruby>れる<ruby>状態<rt>じょうたい</rt></ruby>と、<ruby>実際<rt>じっさい</rt></ruby>のイベントから<ruby>到達<rt>とうたつ</rt></ruby>できる<ruby>状態<rt>じょうたい</rt></ruby>を<ruby>区別<rt>くべつ</rt></ruby>する。</p></div>

<ruby>内部<rt>ないぶ</rt></ruby>のフラグを<ruby>直接<rt>ちょくせつ</rt></ruby><ruby>書き換<rt>かきか</rt></ruby>えれば、さまざまな<ruby>状態<rt>じょうたい</rt></ruby>を<ruby>作<rt>つく</rt></ruby>れます。でも<ruby>実際<rt>じっさい</rt></ruby>の<ruby>利用<rt>りよう</rt></ruby>では、イベントの<ruby>順序<rt>じゅんじょ</rt></ruby>やガード<ruby>条件<rt>じょうけん</rt></ruby>によって<ruby>到達<rt>とうたつ</rt></ruby>できない<ruby>組み合<rt>くみあ</rt></ruby>わせもあります。<ruby>状態<rt>じょうたい</rt></ruby>の<ruby>値<rt>あたい</rt></ruby>だけでなく、その<ruby>来歴<rt>らいれき</rt></ruby>を<ruby>調<rt>しら</rt></ruby>べます。

## 01｜図でつかむ

![図26｜State Reachability](/assets/codex-reading/day-26.svg)

<ruby>止<rt>と</rt></ruby>める<ruby>人<rt>ひと</rt></ruby>、<ruby>解除<rt>かいじょ</rt></ruby>する<ruby>人<rt>ひと</rt></ruby>、<ruby>再開<rt>さいかい</rt></ruby>させるきっかけ。この<ruby>三<rt>みっ</rt></ruby>つを<ruby>対応付<rt>たいおうづ</rt></ruby>ける。

## 02｜3つのポイントで理解する

### 1. フラグを立てる側から追う

suppress_queue_autosend のような gate を<ruby>見<rt>み</rt></ruby>つけたら、<ruby>参照<rt>さんしょう</rt></ruby>する<ruby>場所<rt>ばしょ</rt></ruby>だけでなく、<ruby>値<rt>あたい</rt></ruby>を<ruby>書き込<rt>かきこ</rt></ruby>む<ruby>場所<rt>ばしょ</rt></ruby>を<ruby>探<rt>さが</rt></ruby>します。その<ruby>直前<rt>ちょくぜん</rt></ruby>のイベントが<ruby>状態<rt>じょうたい</rt></ruby>の<ruby>入口<rt>いりぐち</rt></ruby>です。

### 2. 解除と再送信は別の操作

フラグを<ruby>解除<rt>かいじょ</rt></ruby>しても、それだけで<ruby>待機<rt>たいき</rt></ruby><ruby>入力<rt>にゅうりょく</rt></ruby>を<ruby>送り出<rt>おくりだ</rt></ruby>すとは<ruby>限<rt>かぎ</rt></ruby>りません。<ruby>解除<rt>かいじょ</rt></ruby><ruby>後<rt>のち</rt></ruby>にスケジューラやイベント<ruby>処理<rt>しょり</rt></ruby>を<ruby>動<rt>うご</rt></ruby>かす<ruby>箇所<rt>かしょ</rt></ruby>まで<ruby>追<rt>お</rt></ruby>います。

### 3. イベント列として再現する

<ruby>本番<rt>ほんばん</rt></ruby>に<ruby>近<rt>ちか</rt></ruby>いテストでは、<ruby>可能<rt>かのう</rt></ruby>な<ruby>限<rt>かぎ</rt></ruby>り<ruby>実際<rt>じっさい</rt></ruby>の<ruby>操作<rt>そうさ</rt></ruby><ruby>経路<rt>けいろ</rt></ruby>で<ruby>状態<rt>じょうたい</rt></ruby>を<ruby>作<rt>つく</rt></ruby>ります。<ruby>直接<rt>ちょくせつ</rt></ruby>フィールドを<ruby>設定<rt>せってい</rt></ruby>する<ruby>場合<rt>ばあい</rt></ruby>も、<ruby>同<rt>おな</rt></ruby>じ<ruby>状態<rt>じょうたい</rt></ruby>に<ruby>到達<rt>とうたつ</rt></ruby>するイベント<ruby>列<rt>れつ</rt></ruby>を<ruby>説明<rt>せつめい</rt></ruby>できるようにします。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p><ruby>原稿<rt>げんこう</rt></ruby>の rate_limit_recovery_pending は<ruby>確認<rt>かくにん</rt></ruby>したローカル<ruby>版<rt>はん</rt></ruby>では<ruby>見<rt>み</rt></ruby>つかりません。<ruby>名前<rt>なまえ</rt></ruby>を<ruby>置換<rt>ちかん</rt></ruby>するだけでなく、<ruby>現在<rt>げんざい</rt></ruby>の<ruby>送信<rt>そうしん</rt></ruby><ruby>停止条件<rt>ていしじょうけん</rt></ruby>と<ruby>解除<rt>かいじょ</rt></ruby><ruby>条件<rt>じょうけん</rt></ruby>を<ruby>調<rt>しら</rt></ruby>べます。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "suppress_queue_autosend|maybe_send_next_queued_input" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/tui/src/chatwidget/input_queue.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/tui/src/chatwidget/input_queue.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>一<rt>ひと</rt></ruby>つの gate を<ruby>選<rt>えら</rt></ruby>び、<ruby>立<rt>た</rt></ruby>てる<ruby>場所<rt>ばしょ</rt></ruby>、<ruby>解除<rt>かいじょ</rt></ruby>する<ruby>場所<rt>ばしょ</rt></ruby>、<ruby>再送信<rt>さいそうしん</rt></ruby>を<ruby>試<rt>ため</rt></ruby>す<ruby>場所<rt>ばしょ</rt></ruby>を<ruby>三点<rt>さんてん</rt></ruby>で<ruby>結<rt>むす</rt></ruby>びます。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>状態<rt>じょうたい</rt></ruby>には<ruby>到達<rt>とうたつ</rt></ruby><ruby>経路<rt>けいろ</rt></ruby>が<ruby>必要<rt>ひつよう</rt></ruby>。**
- **<ruby>解除<rt>かいじょ</rt></ruby>と<ruby>再開<rt>さいかい</rt></ruby>のきっかけを<ruby>区別<rt>くべつ</rt></ruby>する。**
- **テストの<ruby>準備<rt>じゅんび</rt></ruby>を<ruby>実際<rt>じっさい</rt></ruby>のイベント<ruby>列<rt>れつ</rt></ruby>に<ruby>対応付<rt>たいおうづ</rt></ruby>ける。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
