---
lang: "ja"
title: "Day 28｜Contract Test — 境界の約束を、両側から確かめる"
summary: "要求・永続状態の変更・返答・通知が、同じ意味でつながることを検証する。"
date: "2026-09-21"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-28.svg"
codexReadingDay: 28
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>要求<rt>ようきゅう</rt></ruby>・<ruby>永続<rt>えいぞく</rt></ruby><ruby>状態<rt>じょうたい</rt></ruby>の<ruby>変更<rt>へんこう</rt></ruby>・<ruby>返答<rt>へんとう</rt></ruby>・<ruby>通知<rt>つうち</rt></ruby>が、<ruby>同<rt>おな</rt></ruby>じ<ruby>意味<rt>いみ</rt></ruby>でつながることを<ruby>検証<rt>けんしょう</rt></ruby>する。</p></div>

TUI のテストとサーバーのテストがそれぞれ<ruby>通<rt>とお</rt></ruby>っていても、<ruby>間<rt>あいだ</rt></ruby>の<ruby>約束<rt>やくそく</rt></ruby>がずれていると<ruby>利用者<rt>りようしゃ</rt></ruby>の<ruby>操作<rt>そうさ</rt></ruby>は<ruby>壊<rt>こわ</rt></ruby>れます。thread/revert を<ruby>題材<rt>だいざい</rt></ruby>に、<ruby>何<rt>なに</rt></ruby>を<ruby>変更<rt>へんこう</rt></ruby>し、<ruby>何<rt>なに</rt></ruby>を<ruby>返<rt>かえ</rt></ruby>す API なのかを<ruby>具体化<rt>ぐたいか</rt></ruby>します。

## 01｜図でつかむ

![図28｜Contract Test](/assets/codex-reading/day-28.svg)

<ruby>返答<rt>へんとう</rt></ruby>と<ruby>通知<rt>つうち</rt></ruby>の<ruby>順序<rt>じゅんじょ</rt></ruby>や<ruby>内容<rt>ないよう</rt></ruby>はテスト<ruby>対象<rt>たいしょう</rt></ruby>。<ruby>図<rt>ず</rt></ruby>は<ruby>固定<rt>こてい</rt></ruby>の<ruby>配信<rt>はいしん</rt></ruby><ruby>順<rt>じゅん</rt></ruby>を<ruby>保証<rt>ほしょう</rt></ruby>するものではない。

## 02｜3つのポイントで理解する

### 1. 何を戻す操作かを明確にする

<ruby>確認<rt>かくにん</rt></ruby>した ThreadRevertParams は、<ruby>指定<rt>してい</rt></ruby> turn より<ruby>前<rt>まえ</rt></ruby>の<ruby>保存<rt>ほぞん</rt></ruby><ruby>済<rt>す</rt></ruby>み<ruby>会話<rt>かいわ</rt></ruby><ruby>履歴<rt>りれき</rt></ruby>へ<ruby>置き換<rt>おきか</rt></ruby>える<ruby>操作<rt>そうさ</rt></ruby>です。ファイルの<ruby>変更<rt>へんこう</rt></ruby>を<ruby>元<rt>もと</rt></ruby>に<ruby>戻<rt>もど</rt></ruby>す<ruby>操作<rt>そうさ</rt></ruby>ではありません。この<ruby>区別<rt>くべつ</rt></ruby>が<ruby>契約<rt>けいやく</rt></ruby>の<ruby>中心<rt>ちゅうしん</rt></ruby>です。

### 2. 応答だけで履歴がそろうかを見る

<ruby>確認<rt>かくにん</rt></ruby>した<ruby>型<rt>かた</rt></ruby>の<ruby>説明<rt>せつめい</rt></ruby>では、<ruby>返<rt>かえ</rt></ruby>す thread の turns は<ruby>空<rt>から</rt></ruby>で、<ruby>保持<rt>ほじ</rt></ruby>された<ruby>履歴<rt>りれき</rt></ruby>は<ruby>一覧<rt>いちらん</rt></ruby> API から<ruby>取得<rt>しゅとく</rt></ruby>します。<ruby>応答<rt>おうとう</rt></ruby>にすべての turn が<ruby>入<rt>はい</rt></ruby>ると<ruby>思い込<rt>おもいこ</rt></ruby>むと、UI の<ruby>復元<rt>ふくげん</rt></ruby>が<ruby>不完全<rt>ふかんぜん</rt></ruby>になります。

### 3. 失敗時の状態も契約に含める

<ruby>不正<rt>ふせい</rt></ruby>な<ruby>対象<rt>たいしょう</rt></ruby>を<ruby>指定<rt>してい</rt></ruby>したとき、エラーだけでなく<ruby>保存状態<rt>ほぞんじょうたい</rt></ruby>がどう<ruby>残<rt>のこ</rt></ruby>るかを<ruby>確<rt>たし</rt></ruby>かめます。<ruby>成功<rt>せいこう</rt></ruby><ruby>時<rt>とき</rt></ruby>は<ruby>通知<rt>つうち</rt></ruby>と<ruby>再<rt>さい</rt></ruby><ruby>取得<rt>しゅとく</rt></ruby>が<ruby>同<rt>おな</rt></ruby>じ<ruby>履歴<rt>りれき</rt></ruby>を<ruby>示<rt>しめ</rt></ruby>すかを<ruby>見<rt>み</rt></ruby>ます。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>thread/revert の<ruby>成功<rt>せいこう</rt></ruby>を、<ruby>作業<rt>さぎょう</rt></ruby>ディレクトリのファイルまで<ruby>復元<rt>ふくげん</rt></ruby>されたという<ruby>意味<rt>いみ</rt></ruby>にしません。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "ThreadRevertParams|ThreadRevertResponse" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/app-server-protocol/src/protocol/v2/thread.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/app-server-protocol/src/protocol/v2/thread.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

ThreadRevertParams と Response のコメントを<ruby>読<rt>よ</rt></ruby>み、<ruby>入力<rt>にゅうりょく</rt></ruby>、<ruby>変更対象<rt>へんこうたいしょう</rt></ruby>、<ruby>返答<rt>へんとう</rt></ruby>、<ruby>再<rt>さい</rt></ruby><ruby>取得<rt>しゅとく</rt></ruby>の<ruby>必要性<rt>ひつようせい</rt></ruby>を<ruby>四行<rt>よんぎょう</rt></ruby>で<ruby>整理<rt>せいり</rt></ruby>します。

## 04｜30秒で復習

<div class="codex-recap">

- **API が<ruby>何<rt>なに</rt></ruby>を<ruby>変更<rt>へんこう</rt></ruby>するかを<ruby>明確<rt>めいかく</rt></ruby>にする。**
- **<ruby>応答<rt>おうとう</rt></ruby>にない<ruby>情報<rt>じょうほう</rt></ruby>は<ruby>別途<rt>べっと</rt></ruby><ruby>取得<rt>しゅとく</rt></ruby>する。**
- **<ruby>成功<rt>せいこう</rt></ruby>と<ruby>失敗<rt>しっぱい</rt></ruby>の<ruby>両方<rt>りょうほう</rt></ruby>で<ruby>保存状態<rt>ほぞんじょうたい</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>する。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
