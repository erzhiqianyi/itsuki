---
lang: "ja"
title: "Day 04｜Op と EventMsg — お願いと報告を分ける"
summary: "UI からの操作要求と、Core からの出来事の通知は別の方向に流れる。"
date: "2026-08-28"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-04.svg"
codexReadingDay: 4
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p>UI からの<ruby>操作<rt>そうさ</rt></ruby><ruby>要求<rt>ようきゅう</rt></ruby>と、Core からの<ruby>出来事<rt>できごと</rt></ruby>の<ruby>通知<rt>つうち</rt></ruby>は<ruby>別<rt>べつ</rt></ruby>の<ruby>方向<rt>ほうこう</rt></ruby>に<ruby>流<rt>なが</rt></ruby>れる。</p></div>

レストランで<ruby>注文<rt>ちゅうもん</rt></ruby>を<ruby>伝<rt>つた</rt></ruby>えることと、<ruby>料理<rt>りょうり</rt></ruby>ができたと<ruby>知<rt>し</rt></ruby>らされることは<ruby>別<rt>べつ</rt></ruby>です。Codex の<ruby>内部<rt>ないぶ</rt></ruby>メッセージも、してほしいことと<ruby>起<rt>お</rt></ruby>きたことを<ruby>分<rt>わ</rt></ruby>けて<ruby>読<rt>よ</rt></ruby>むと、<ruby>非同期<rt>ひどうき</rt></ruby>の<ruby>動<rt>うご</rt></ruby>きが<ruby>分<rt>わ</rt></ruby>かりやすくなります。

## 01｜図でつかむ

![図04｜Op と EventMsg](/assets/codex-reading/day-04.svg)

<ruby>要求<rt>ようきゅう</rt></ruby>は Core へ、<ruby>出来事<rt>できごと</rt></ruby>は UI へ。これは<ruby>内部<rt>ないぶ</rt></ruby> Protocol の<ruby>概念図<rt>がいねんず</rt></ruby>。

## 02｜3つのポイントで理解する

### 1. Op は要求の種類を表す

ユーザー<ruby>入力<rt>にゅうりょく</rt></ruby>や<ruby>処理<rt>しょり</rt></ruby>への<ruby>操作<rt>そうさ</rt></ruby>は、<ruby>内部<rt>ないぶ</rt></ruby>の Op として<ruby>表現<rt>ひょうげん</rt></ruby>されます。enum の<ruby>定義<rt>ていぎ</rt></ruby>だけでなく、その variant を<ruby>受け取<rt>うけと</rt></ruby>る match を<ruby>探<rt>さが</rt></ruby>すと、どこが<ruby>実行<rt>じっこう</rt></ruby>を<ruby>担当<rt>たんとう</rt></ruby>するかが<ruby>分<rt>わ</rt></ruby>かります。

### 2. EventMsg は進行を知らせる

<ruby>処理中<rt>しょりちゅう</rt></ruby>には<ruby>複数<rt>ふくすう</rt></ruby>の<ruby>出来事<rt>できごと</rt></ruby>が<ruby>発生<rt>はっせい</rt></ruby>します。UI は<ruby>通知<rt>つうち</rt></ruby>を<ruby>受<rt>う</rt></ruby>けて<ruby>表示<rt>ひょうじ</rt></ruby>を<ruby>更新<rt>こうしん</rt></ruby>します。<ruby>一<rt>ひと</rt></ruby>つの<ruby>要求<rt>ようきゅう</rt></ruby>が<ruby>一<rt>ひと</rt></ruby>つの<ruby>通知<rt>つうち</rt></ruby>だけで<ruby>完結<rt>かんけつ</rt></ruby>するとは<ruby>限<rt>かぎ</rt></ruby>らず、<ruby>開始<rt>かいし</rt></ruby>・<ruby>途中<rt>とちゅう</rt></ruby>・<ruby>完了<rt>かんりょう</rt></ruby>を<ruby>区別<rt>くべつ</rt></ruby>して<ruby>読<rt>よ</rt></ruby>みます。

### 3. 識別子で対応を確認する

Submission や Event の<ruby>包み方<rt>つつみかた</rt></ruby>、ThreadId や<ruby>処理<rt>しょり</rt></ruby>の ID を<ruby>見<rt>み</rt></ruby>ると、どの<ruby>会話<rt>かいわ</rt></ruby>・<ruby>操作<rt>そうさ</rt></ruby>に<ruby>属<rt>ぞく</rt></ruby>する<ruby>情報<rt>じょうほう</rt></ruby>かを<ruby>追<rt>お</rt></ruby>えます。App Server の<ruby>公開<rt>こうかい</rt></ruby> API と<ruby>内部<rt>ないぶ</rt></ruby> Op の<ruby>型<rt>かた</rt></ruby>を<ruby>同<rt>おな</rt></ruby>じものとして<ruby>扱<rt>あつか</rt></ruby>わないことも<ruby>大切<rt>たいせつ</rt></ruby>です。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>イベントを<ruby>受信<rt>じゅしん</rt></ruby>したことと、すべての<ruby>後処理<rt>あとしょり</rt></ruby>が<ruby>済<rt>す</rt></ruby>んだことは<ruby>同義<rt>どうぎ</rt></ruby>ではありません。どのイベントが<ruby>何<rt>なに</rt></ruby>を<ruby>保証<rt>ほしょう</rt></ruby>するかを<ruby>確認<rt>かくにん</rt></ruby>します。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "enum Op|enum EventMsg" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/protocol/src/protocol.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/protocol/src/protocol.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

Op と EventMsg から<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>選<rt>えら</rt></ruby>び、<ruby>作<rt>つく</rt></ruby>る<ruby>場所<rt>ばしょ</rt></ruby>・<ruby>受け取<rt>うけと</rt></ruby>る<ruby>場所<rt>ばしょ</rt></ruby>・<ruby>更新<rt>こうしん</rt></ruby>する<ruby>状態<rt>じょうたい</rt></ruby>を<ruby>線<rt>せん</rt></ruby>で<ruby>結<rt>むす</rt></ruby>びます。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>要求<rt>ようきゅう</rt></ruby>と<ruby>通知<rt>つうち</rt></ruby>は<ruby>方向<rt>ほうこう</rt></ruby>が<ruby>違<rt>ちが</rt></ruby>う。**
- **<ruby>一<rt>ひと</rt></ruby>つの<ruby>要求<rt>ようきゅう</rt></ruby>から<ruby>複数<rt>ふくすう</rt></ruby>の<ruby>通知<rt>つうち</rt></ruby>が<ruby>出<rt>で</rt></ruby>る。**
- **ID と<ruby>受信側<rt>じゅしんがわ</rt></ruby>の<ruby>処理<rt>しょり</rt></ruby>まで<ruby>追<rt>お</rt></ruby>う。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
