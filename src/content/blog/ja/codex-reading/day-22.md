---
lang: "ja"
title: "Day 22｜git bisect — 変化した地点を、半分ずつ絞る"
summary: "同じ判定で good と bad を区別し、最初に変わった commit を探す。"
date: "2026-09-15"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-22.svg"
codexReadingDay: 22
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>同<rt>おな</rt></ruby>じ<ruby>判定<rt>はんてい</rt></ruby>で good と bad を<ruby>区別<rt>くべつ</rt></ruby>し、<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>変<rt>か</rt></ruby>わった commit を<ruby>探<rt>さが</rt></ruby>す。</p></div>

<ruby>数百<rt>すうひゃく</rt></ruby>の commit を<ruby>順番<rt>じゅんばん</rt></ruby>に<ruby>試<rt>ため</rt></ruby>す<ruby>代<rt>か</rt></ruby>わりに、<ruby>良<rt>よ</rt></ruby>かった<ruby>地点<rt>ちてん</rt></ruby>と<ruby>悪<rt>わる</rt></ruby>い<ruby>地点<rt>ちてん</rt></ruby>の<ruby>間<rt>かん</rt></ruby>を<ruby>半分<rt>はんぶん</rt></ruby>ずつ<ruby>絞<rt>しぼ</rt></ruby>ります。ただし<ruby>探索<rt>たんさく</rt></ruby>の<ruby>信頼性<rt>しんらいせい</rt></ruby>は、「この commit は<ruby>良<rt>よ</rt></ruby>いか」を<ruby>毎回<rt>まいかい</rt></ruby><ruby>同<rt>おな</rt></ruby>じ<ruby>意味<rt>いみ</rt></ruby>で<ruby>判定<rt>はんてい</rt></ruby>できるかにかかっています。

## 01｜図でつかむ

![図22｜git bisect](/assets/codex-reading/day-22.svg)

<ruby>判定<rt>はんてい</rt></ruby>できない commit は skip。ビルドできないことと、<ruby>調査中<rt>ちょうさちゅう</rt></ruby>のバグがあることを<ruby>混同<rt>こんどう</rt></ruby>しない。

## 02｜3つのポイントで理解する

### 1. まず両端で同じ症状を確認する

good と bad では、<ruby>同<rt>おな</rt></ruby>じ<ruby>再現手順<rt>さいげんてじゅん</rt></ruby>と<ruby>期待値<rt>きたいち</rt></ruby>を<ruby>使<rt>つか</rt></ruby>います。テストが<ruby>途中<rt>とちゅう</rt></ruby>の<ruby>版<rt>はん</rt></ruby>で<ruby>使<rt>つか</rt></ruby>えなくなる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>判定方法<rt>はんていほうほう</rt></ruby>の<ruby>互換性<rt>ごかんせい</rt></ruby>も<ruby>考<rt>かんが</rt></ruby>える<ruby>必要<rt>ひつよう</rt></ruby>があります。

### 2. 判定スクリプトの終了コードを決める

git bisect run では 0 が good、1〜127 のうち125<ruby>以外<rt>いがい</rt></ruby>が bad、125 が skip です。ツール<ruby>不足<rt>ふそく</rt></ruby>などでテスト<ruby>不能<rt>ふのう</rt></ruby>な<ruby>状態<rt>じょうたい</rt></ruby>を、<ruby>症状<rt>しょうじょう</rt></ruby>の<ruby>再現<rt>さいげん</rt></ruby>として bad にしないよう<ruby>区別<rt>くべつ</rt></ruby>します。

### 3. 候補を独立に確かめる

<ruby>探索<rt>たんさく</rt></ruby><ruby>結果<rt>けっか</rt></ruby>が<ruby>出<rt>で</rt></ruby>たら、<ruby>候補<rt>こうほ</rt></ruby>とその<ruby>前<rt>まえ</rt></ruby>の commit を<ruby>同<rt>おな</rt></ruby>じ<ruby>条件<rt>じょうけん</rt></ruby>で<ruby>比較<rt>ひかく</rt></ruby>します。skip が<ruby>多<rt>おお</rt></ruby>いと<ruby>候補<rt>こうほ</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つに<ruby>絞<rt>しぼ</rt></ruby>れないこともあります。<ruby>終<rt>お</rt></ruby>わったら git bisect reset で<ruby>探索<rt>たんさく</rt></ruby><ruby>状態<rt>じょうたい</rt></ruby>を<ruby>終了<rt>しゅうりょう</rt></ruby>します。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>ソースに<ruby>特定<rt>とくてい</rt></ruby>の<ruby>文字列<rt>もじれつ</rt></ruby>があるかだけの<ruby>判定<rt>はんてい</rt></ruby>では、<ruby>挙動<rt>きょどう</rt></ruby>の<ruby>退行<rt>たいこう</rt></ruby>ではなく<ruby>文字列<rt>もじれつ</rt></ruby>の<ruby>導入<rt>どうにゅう</rt></ruby><ruby>地点<rt>ちてん</rt></ruby>を<ruby>見<rt>み</rt></ruby>つけるだけになる<ruby>場合<rt>ばあい</rt></ruby>があります。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>は<ruby>専用<rt>せんよう</rt></ruby>の<ruby>作業<rt>さぎょう</rt></ruby>コピーで<ruby>使<rt>つか</rt></ruby>う<ruby>手順<rt>てじゅん</rt></ruby>のひな<ruby>型<rt>かた</rt></ruby>です。<ruby>山<rt>やま</rt></ruby><ruby>括弧<rt>かっこ</rt></ruby>の commit とスクリプトのパスは、<ruby>確認済<rt>かくにんずみ</rt></ruby>みの<ruby>値<rt>あたい</rt></ruby>に<ruby>置き換<rt>おきか</rt></ruby>えます。

```bash
git bisect start
# 確認済みの commit を指定する
git bisect bad <bad-commit>
git bisect good <good-commit>
git bisect run python3 /absolute/path/to/oracle.py
git bisect reset
```

### 小さく試す

<ruby>専用<rt>せんよう</rt></ruby>の<ruby>作業<rt>さぎょう</rt></ruby>コピーで<ruby>行<rt>おこな</rt></ruby>う<ruby>前提<rt>ぜんてい</rt></ruby>で、good・bad・<ruby>判定<rt>はんてい</rt></ruby><ruby>不能<rt>ふのう</rt></ruby>の<ruby>条件<rt>じょうけん</rt></ruby>を<ruby>文章<rt>ぶんしょう</rt></ruby>にします。<ruby>原稿<rt>げんこう</rt></ruby>の /tmp のスクリプトは<ruby>付属<rt>ふぞく</rt></ruby>していないため、<ruby>自分<rt>じぶん</rt></ruby>の<ruby>判定<rt>はんてい</rt></ruby>を<ruby>用意<rt>ようい</rt></ruby>します。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>両端<rt>りょうたん</rt></ruby>を<ruby>同<rt>おな</rt></ruby>じ<ruby>条件<rt>じょうけん</rt></ruby>で<ruby>判定<rt>はんてい</rt></ruby>する。**
- **0・bad・125 の<ruby>意味<rt>いみ</rt></ruby>を<ruby>区別<rt>くべつ</rt></ruby>する。**
- **<ruby>結果<rt>けっか</rt></ruby>の commit と<ruby>直前<rt>ちょくぜん</rt></ruby>の<ruby>挙動<rt>きょどう</rt></ruby>を<ruby>再確認<rt>さいかくにん</rt></ruby>する。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
