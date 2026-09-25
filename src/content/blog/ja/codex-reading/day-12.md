---
lang: "ja"
title: "Day 12｜apply_patch — 変更の意図を、ファイルへの差分にする"
summary: "パッチを解析し、適用できるかを確認してから実際の変更へ進む。"
date: "2026-09-05"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-12.svg"
codexReadingDay: 12
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p>パッチを<ruby>解析<rt>かいせき</rt></ruby>し、<ruby>適用<rt>てきよう</rt></ruby>できるかを<ruby>確認<rt>かくにん</rt></ruby>してから<ruby>実際<rt>じっさい</rt></ruby>の<ruby>変更<rt>へんこう</rt></ruby>へ<ruby>進<rt>すす</rt></ruby>む。</p></div>

ファイルを<ruby>丸<rt>まる</rt></ruby>ごと<ruby>書き直<rt>かきなお</rt></ruby>す<ruby>代<rt>か</rt></ruby>わりに、どこをどう<ruby>変<rt>か</rt></ruby>えるかを<ruby>差分<rt>さぶん</rt></ruby>で<ruby>伝<rt>つた</rt></ruby>えます。apply_patch の<ruby>読<rt>よ</rt></ruby>みどころは、<ruby>文字列<rt>もじれつ</rt></ruby>のパッチが<ruby>構造化<rt>こうぞうか</rt></ruby>された<ruby>変更<rt>へんこう</rt></ruby>になり、ファイル<ruby>操作<rt>そうさ</rt></ruby>へ<ruby>変換<rt>へんかん</rt></ruby>される<ruby>境目<rt>さかいめ</rt></ruby>です。

## 01｜図でつかむ

![図12｜apply_patch](/assets/codex-reading/day-12.svg)

<ruby>解析<rt>かいせき</rt></ruby>できること、<ruby>適用<rt>てきよう</rt></ruby>できること、<ruby>変更内容<rt>へんこうないよう</rt></ruby>が<ruby>正<rt>ただ</rt></ruby>しいことは、それぞれ<ruby>別<rt>べつ</rt></ruby>の<ruby>確認<rt>かくにん</rt></ruby>。

## 02｜3つのポイントで理解する

### 1. 文字列から Hunk へ

parse_patch や Hunk の<ruby>定義<rt>ていぎ</rt></ruby>から、<ruby>追加<rt>ついか</rt></ruby>・<ruby>削除<rt>さくじょ</rt></ruby>・<ruby>更新<rt>こうしん</rt></ruby>をどう<ruby>表現<rt>ひょうげん</rt></ruby>するかを<ruby>見<rt>み</rt></ruby>ます。<ruby>構文<rt>こうぶん</rt></ruby>が<ruby>壊<rt>こわ</rt></ruby>れていれば、この<ruby>段階<rt>だんかい</rt></ruby>でファイル<ruby>操作<rt>そうさ</rt></ruby>へ<ruby>進<rt>すす</rt></ruby>めないようにする<ruby>必要<rt>ひつよう</rt></ruby>があります。

### 2. 既存ファイルとの対応を確認する

<ruby>更新<rt>こうしん</rt></ruby>する<ruby>文脈<rt>ぶんみゃく</rt></ruby>やパスを<ruby>調<rt>しら</rt></ruby>べ、パッチの<ruby>意図<rt>いと</rt></ruby>を<ruby>実際<rt>じっさい</rt></ruby>の<ruby>操作<rt>そうさ</rt></ruby>へ<ruby>変<rt>か</rt></ruby>えます。<ruby>構文<rt>こうぶん</rt></ruby>として<ruby>正<rt>ただ</rt></ruby>しくても、<ruby>対象<rt>たいしょう</rt></ruby>の<ruby>内容<rt>ないよう</rt></ruby>が<ruby>変<rt>か</rt></ruby>わっていれば<ruby>適用<rt>てきよう</rt></ruby>できないことがあります。

### 3. 権限と結果を最後まで読む

ApplyPatchHandler から<ruby>実行<rt>じっこう</rt></ruby><ruby>側<rt>がわ</rt></ruby>へ<ruby>進<rt>すす</rt></ruby>み、<ruby>許可<rt>きょか</rt></ruby>の<ruby>確認<rt>かくにん</rt></ruby>と<ruby>実際<rt>じっさい</rt></ruby>の<ruby>変更<rt>へんこう</rt></ruby>を<ruby>区別<rt>くべつ</rt></ruby>します。<ruby>適用<rt>てきよう</rt></ruby><ruby>後<rt>あと</rt></ruby>は diff を<ruby>見<rt>み</rt></ruby>て<ruby>意図<rt>いと</rt></ruby>しない<ruby>変更<rt>へんこう</rt></ruby>がないか<ruby>確認<rt>かくにん</rt></ruby>し、<ruby>必要<rt>ひつよう</rt></ruby>な<ruby>動作<rt>どうさ</rt></ruby><ruby>検証<rt>けんしょう</rt></ruby>につなげます。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>apply_patch が<ruby>成功<rt>せいこう</rt></ruby>しても、プログラムの<ruby>意味<rt>いみ</rt></ruby>や<ruby>仕様<rt>しよう</rt></ruby>が<ruby>正<rt>ただ</rt></ruby>しいとは<ruby>限<rt>かぎ</rt></ruby>りません。<ruby>適用<rt>てきよう</rt></ruby>の<ruby>成否<rt>せいひ</rt></ruby>と<ruby>変更後<rt>へんこうご</rt></ruby>の<ruby>品質<rt>ひんしつ</rt></ruby>は<ruby>別<rt>べつ</rt></ruby>です。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "parse_patch|enum Hunk" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/apply-patch/src/parser.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/apply-patch/src/parser.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>学習用<rt>がくしゅうよう</rt></ruby>の<ruby>小<rt>ちい</rt></ruby>さなファイルで<ruby>一箇所<rt>いっかしょ</rt></ruby>の<ruby>変更<rt>へんこう</rt></ruby>を<ruby>読<rt>よ</rt></ruby>み、パッチの<ruby>指定<rt>してい</rt></ruby><ruby>箇所<rt>かしょ</rt></ruby>と<ruby>生成<rt>せいせい</rt></ruby>された diff を<ruby>照合<rt>しょうごう</rt></ruby>します。

## 04｜30秒で復習

<div class="codex-recap">

- **パッチを<ruby>構造化<rt>こうぞうか</rt></ruby>された<ruby>変更<rt>へんこう</rt></ruby>へ<ruby>変<rt>か</rt></ruby>える。**
- **<ruby>構文<rt>こうぶん</rt></ruby>・<ruby>適用条件<rt>てきようじょうけん</rt></ruby>・<ruby>権限<rt>けんげん</rt></ruby>を<ruby>分<rt>わ</rt></ruby>ける。**
- **<ruby>適用<rt>てきよう</rt></ruby><ruby>後<rt>あと</rt></ruby>は<ruby>差分<rt>さぶん</rt></ruby>と<ruby>動作<rt>どうさ</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>する。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
