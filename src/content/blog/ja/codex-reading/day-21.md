---
lang: "ja"
title: "Day 21｜git の履歴 — 一行の変更から、設計の理由をたどる"
summary: "blame で手掛かりを得て、差分と周辺の変更から理由を読む。"
date: "2026-09-14"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-21.svg"
codexReadingDay: 21
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p>blame で<ruby>手掛<rt>てが</rt></ruby>かりを<ruby>得<rt>え</rt></ruby>て、<ruby>差分<rt>さぶん</rt></ruby>と<ruby>周辺<rt>しゅうへん</rt></ruby>の<ruby>変更<rt>へんこう</rt></ruby>から<ruby>理由<rt>りゆう</rt></ruby>を<ruby>読<rt>よ</rt></ruby>む。</p></div>

<ruby>現在<rt>げんざい</rt></ruby>のコードだけでは、なぜその<ruby>条件<rt>じょうけん</rt></ruby>が<ruby>必要<rt>ひつよう</rt></ruby>なのか<ruby>分<rt>わ</rt></ruby>からないことがあります。<ruby>履歴<rt>りれき</rt></ruby>を<ruby>使<rt>つか</rt></ruby>うと、<ruby>以前<rt>いぜん</rt></ruby>の<ruby>不具合<rt>ふぐあい</rt></ruby>への<ruby>対処<rt>たいしょ</rt></ruby>や、<ruby>周辺<rt>しゅうへん</rt></ruby>の<ruby>設計変更<rt>せっけいへんこう</rt></ruby>が<ruby>見<rt>み</rt></ruby>えてきます。<ruby>最後<rt>さいご</rt></ruby>に<ruby>触<rt>ふ</rt></ruby>れた commit と、<ruby>不具合<rt>ふぐあい</rt></ruby>を<ruby>導入<rt>どうにゅう</rt></ruby>した commit は<ruby>分<rt>わ</rt></ruby>けて<ruby>考<rt>かんが</rt></ruby>えます。

## 01｜図でつかむ

![図21｜git の履歴](/assets/codex-reading/day-21.svg)

<ruby>履歴<rt>りれき</rt></ruby>は<ruby>理由<rt>りゆう</rt></ruby>を<ruby>探<rt>さが</rt></ruby>す<ruby>手掛<rt>てが</rt></ruby>かり。<ruby>最後<rt>さいご</rt></ruby>の<ruby>編集者<rt>へんしゅうしゃ</rt></ruby>や commit が、そのまま<ruby>原因<rt>げんいん</rt></ruby>とは<ruby>限<rt>かぎ</rt></ruby>らない。

## 02｜3つのポイントで理解する

### 1. blame で現在の行の来歴を見る

<ruby>関数<rt>かんすう</rt></ruby>や<ruby>行範囲<rt>ぎょうはんい</rt></ruby>を<ruby>絞<rt>しぼ</rt></ruby>り、<ruby>関連<rt>かんれん</rt></ruby>する commit を<ruby>確認<rt>かくにん</rt></ruby>します。<ruby>整形<rt>せいけい</rt></ruby>や<ruby>移動<rt>いどう</rt></ruby>が<ruby>直近<rt>ちょっきん</rt></ruby>にある<ruby>場合<rt>ばあい</rt></ruby>、その<ruby>差分<rt>さぶん</rt></ruby>だけで<ruby>原因<rt>げんいん</rt></ruby>と<ruby>決<rt>き</rt></ruby>めず、さらに<ruby>前<rt>まえ</rt></ruby>へ<ruby>進<rt>すす</rt></ruby>みます。

### 2. show で一行の周囲も読む

<ruby>変更<rt>へんこう</rt></ruby>の<ruby>前後<rt>ぜんご</rt></ruby>、<ruby>同時<rt>どうじ</rt></ruby>に<ruby>追加<rt>ついか</rt></ruby>されたテスト、メッセージを<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>確認<rt>かくにん</rt></ruby>します。<ruby>隣<rt>となり</rt></ruby>の<ruby>状態<rt>じょうたい</rt></ruby><ruby>管理<rt>かんり</rt></ruby>が<ruby>変<rt>か</rt></ruby>わった<ruby>結果<rt>けっか</rt></ruby>として、その<ruby>一行<rt>いちぎょう</rt></ruby>が<ruby>必要<rt>ひつよう</rt></ruby>になった<ruby>可能性<rt>かのうせい</rt></ruby>があります。

### 3. -S と -G を使い分ける

git log -S は<ruby>指定<rt>してい</rt></ruby><ruby>文字列<rt>もじれつ</rt></ruby>の<ruby>出現<rt>しゅつげん</rt></ruby><ruby>数<rt>かず</rt></ruby>が<ruby>変<rt>か</rt></ruby>わる<ruby>変更<rt>へんこう</rt></ruby>を<ruby>探<rt>さが</rt></ruby>します。-G は<ruby>差分<rt>さぶん</rt></ruby>の<ruby>行<rt>ぎょう</rt></ruby>が<ruby>正規表現<rt>せいきひょうげん</rt></ruby>に<ruby>一致<rt>いっち</rt></ruby>する<ruby>変更<rt>へんこう</rt></ruby>を<ruby>探<rt>さが</rt></ruby>します。<ruby>関数<rt>かんすう</rt></ruby>の<ruby>導入<rt>どうにゅう</rt></ruby>を<ruby>探<rt>さが</rt></ruby>すのか、<ruby>条件式<rt>じょうけんしき</rt></ruby>の<ruby>変化<rt>へんか</rt></ruby>を<ruby>探<rt>さが</rt></ruby>すのかで<ruby>選<rt>えら</rt></ruby>びます。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>commit メッセージは<ruby>意図<rt>いと</rt></ruby>の<ruby>説明<rt>せつめい</rt></ruby>であり、<ruby>挙動<rt>きょどう</rt></ruby>の<ruby>正<rt>ただ</rt></ruby>しさの<ruby>証明<rt>しょうめい</rt></ruby>ではありません。<ruby>差分<rt>さぶん</rt></ruby>とテストを<ruby>合<rt>あ</rt></ruby>わせて<ruby>読<rt>よ</rt></ruby>みます。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git blame -L '/restore_backtrack_prompt_after_branch_error/',+12 -- codex-rs/tui/src/app_backtrack.rs
git log -S'maybe_send_next_queued_input' -- codex-rs/tui/src
# 対象 commit を決めたら git show <commit> で差分を読む
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/tui/src/app_backtrack.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/tui/src/app_backtrack.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>気<rt>き</rt></ruby>になる<ruby>関数<rt>かんすう</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つ<ruby>選<rt>えら</rt></ruby>び、<ruby>現在<rt>げんざい</rt></ruby>の<ruby>実装<rt>じっそう</rt></ruby>、<ruby>直近<rt>ちょっきん</rt></ruby>の<ruby>変更<rt>へんこう</rt></ruby>、<ruby>導入時<rt>どうにゅうじ</rt></ruby>の<ruby>差分<rt>さぶん</rt></ruby>を<ruby>順<rt>じゅん</rt></ruby>に<ruby>見<rt>み</rt></ruby>ます。

## 04｜30秒で復習

<div class="codex-recap">

- **blame は<ruby>調査<rt>ちょうさ</rt></ruby>の<ruby>開始点<rt>かいしてん</rt></ruby>。**
- **<ruby>差分<rt>さぶん</rt></ruby>は<ruby>周辺<rt>しゅうへん</rt></ruby>の<ruby>状態<rt>じょうたい</rt></ruby><ruby>変更<rt>へんこう</rt></ruby>と<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>読<rt>よ</rt></ruby>む。**
- **<ruby>文字列<rt>もじれつ</rt></ruby>の<ruby>増減<rt>ぞうげん</rt></ruby>と<ruby>差分<rt>さぶん</rt></ruby>パターンを<ruby>使い分<rt>つかいわ</rt></ruby>ける。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
