---
lang: "ja"
title: "Day 19｜コントリビューション — 差分を、伝わる問題分析へ"
summary: "再現条件と根拠がそろうと、小さな発見も他の人が検証できる。"
date: "2026-09-12"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-19.svg"
codexReadingDay: 19
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>再現<rt>さいげん</rt></ruby><ruby>条件<rt>じょうけん</rt></ruby>と<ruby>根拠<rt>こんきょ</rt></ruby>がそろうと、<ruby>小<rt>ちい</rt></ruby>さな<ruby>発見<rt>はっけん</rt></ruby>も<ruby>他<rt>ほか</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>が<ruby>検証<rt>けんしょう</rt></ruby>できる。</p></div>

<ruby>手元<rt>てもと</rt></ruby>で<ruby>動<rt>うご</rt></ruby>く<ruby>修正<rt>しゅうせい</rt></ruby>ができても、そのまま<ruby>採用<rt>さいよう</rt></ruby>されるとは<ruby>限<rt>かぎ</rt></ruby>りません。<ruby>何<rt>なに</rt></ruby>が<ruby>困<rt>こま</rt></ruby>るのか、どう<ruby>再現<rt>さいげん</rt></ruby>するのか、<ruby>既存<rt>きぞん</rt></ruby>の<ruby>報告<rt>ほうこく</rt></ruby>とどう<ruby>違<rt>ちが</rt></ruby>うのかを<ruby>説明<rt>せつめい</rt></ruby>できると、<ruby>調査結果<rt>ちょうさけっか</rt></ruby>を<ruby>共有<rt>きょうゆう</rt></ruby>する<ruby>価値<rt>かち</rt></ruby>が<ruby>生<rt>う</rt></ruby>まれます。

## 01｜図でつかむ

![図19｜コントリビューション](/assets/codex-reading/day-19.svg)

<ruby>実装<rt>じっそう</rt></ruby><ruby>差分<rt>さぶん</rt></ruby>だけでなく、<ruby>第三者<rt>だいさんしゃ</rt></ruby>が<ruby>確<rt>たし</rt></ruby>かめられる<ruby>再現手順<rt>さいげんてじゅん</rt></ruby>を<ruby>用意<rt>ようい</rt></ruby>する。

## 02｜3つのポイントで理解する

### 1. その時点の参加方法を読む

contributing <ruby>文書<rt>ぶんしょ</rt></ruby>やテンプレートを<ruby>確認<rt>かくにん</rt></ruby>します。<ruby>過去<rt>かこ</rt></ruby>の<ruby>受け入れ方<rt>うけいれかた</rt></ruby>を<ruby>現在<rt>げんざい</rt></ruby>にも<ruby>当<rt>あ</rt></ruby>てはめず、Issue と PR のどちらで<ruby>何<rt>なに</rt></ruby>を<ruby>求<rt>もと</rt></ruby>めているかを<ruby>調<rt>しら</rt></ruby>べます。

### 2. 似た報告と照合する

<ruby>症状<rt>しょうじょう</rt></ruby>、バージョン、<ruby>操作<rt>そうさ</rt></ruby><ruby>手順<rt>てじゅん</rt></ruby>を<ruby>比<rt>くら</rt></ruby>べます。<ruby>同<rt>おな</rt></ruby>じ<ruby>言葉<rt>ことば</rt></ruby>が<ruby>含<rt>ふく</rt></ruby>まれていても、<ruby>発生<rt>はっせい</rt></ruby><ruby>条件<rt>じょうけん</rt></ruby>や<ruby>原因<rt>げんいん</rt></ruby>が<ruby>違<rt>ちが</rt></ruby>う<ruby>場合<rt>ばあい</rt></ruby>があります。<ruby>逆<rt>ぎゃく</rt></ruby>に、<ruby>別<rt>べつ</rt></ruby>の<ruby>表現<rt>ひょうげん</rt></ruby>でも<ruby>同<rt>おな</rt></ruby>じ<ruby>不具合<rt>ふぐあい</rt></ruby>かもしれません。

### 3. 観察と仮説を分けて書く

<ruby>再現<rt>さいげん</rt></ruby>した<ruby>症状<rt>しょうじょう</rt></ruby>と、ソースコードから<ruby>推測<rt>すいそく</rt></ruby>した<ruby>原因<rt>げんいん</rt></ruby>を<ruby>分<rt>わ</rt></ruby>けます。<ruby>期待<rt>きたい</rt></ruby>する<ruby>動<rt>うご</rt></ruby>き、<ruby>実際<rt>じっさい</rt></ruby>の<ruby>動<rt>うご</rt></ruby>き、<ruby>最小<rt>さいしょう</rt></ruby><ruby>手順<rt>てじゅん</rt></ruby>、<ruby>対象<rt>たいしょう</rt></ruby> commit があれば、<ruby>読<rt>よ</rt></ruby>む<ruby>人<rt>ひと</rt></ruby>が<ruby>同<rt>おな</rt></ruby>じ<ruby>地点<rt>ちてん</rt></ruby>から<ruby>調査<rt>ちょうさ</rt></ruby>を<ruby>始<rt>はじ</rt></ruby>められます。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>ローカルでテストが<ruby>通<rt>とお</rt></ruby>ったことは、<ruby>修正<rt>しゅうせい</rt></ruby>が upstream に<ruby>採用<rt>さいよう</rt></ruby>されたことを<ruby>意味<rt>いみ</rt></ruby>しません。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
cat docs/contributing.md
gh issue list --repo openai/codex --state all --search "slash command alias"
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `docs/contributing.md` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/docs/contributing.md)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>既存<rt>きぞん</rt></ruby>の Issue を<ruby>一<rt>ひと</rt></ruby>つ<ruby>読<rt>よ</rt></ruby>み、<ruby>観察<rt>かんさつ</rt></ruby>された<ruby>事実<rt>じじつ</rt></ruby>・<ruby>原因<rt>げんいん</rt></ruby><ruby>仮説<rt>かせつ</rt></ruby>・<ruby>追加<rt>ついか</rt></ruby>で<ruby>必要<rt>ひつよう</rt></ruby>な<ruby>検証<rt>けんしょう</rt></ruby>を<ruby>三<rt>さん</rt></ruby><ruby>列<rt>れつ</rt></ruby>に<ruby>整理<rt>せいり</rt></ruby>します。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>最新<rt>さいしん</rt></ruby>の<ruby>参加方法<rt>さんかほうほう</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>する。**
- **<ruby>重複<rt>ちょうふく</rt></ruby><ruby>調査<rt>ちょうさ</rt></ruby>では<ruby>条件<rt>じょうけん</rt></ruby>まで<ruby>比<rt>くら</rt></ruby>べる。**
- **<ruby>事実<rt>じじつ</rt></ruby>と<ruby>仮説<rt>かせつ</rt></ruby>を<ruby>区別<rt>くべつ</rt></ruby>して<ruby>伝<rt>つた</rt></ruby>える。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
