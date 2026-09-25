---
lang: "ja"
title: "Day 09｜Compaction — 長い会話を、続けられる形にする"
summary: "コンテキストの制約に合わせて履歴を組み替え、次の処理に必要な情報を引き継ぐ。"
date: "2026-09-02"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-09.svg"
codexReadingDay: 9
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p>コンテキストの<ruby>制約<rt>せいやく</rt></ruby>に<ruby>合<rt>あ</rt></ruby>わせて<ruby>履歴<rt>りれき</rt></ruby>を<ruby>組み替<rt>くみか</rt></ruby>え、<ruby>次<rt>つぎ</rt></ruby>の<ruby>処理<rt>しょり</rt></ruby>に<ruby>必要<rt>ひつよう</rt></ruby>な<ruby>情報<rt>じょうほう</rt></ruby>を<ruby>引き継<rt>ひきつ</rt></ruby>ぐ。</p></div>

<ruby>作業<rt>さぎょう</rt></ruby>が<ruby>長<rt>なが</rt></ruby>くなると、モデルへ<ruby>渡<rt>わた</rt></ruby>す<ruby>情報<rt>じょうほう</rt></ruby>も<ruby>増<rt>ふ</rt></ruby>えていきます。Compaction を<ruby>理解<rt>りかい</rt></ruby>するには、<ruby>短<rt>みじか</rt></ruby>くする<ruby>処理<rt>しょり</rt></ruby>だけでなく、いつ<ruby>起動<rt>きどう</rt></ruby>し、<ruby>置き換<rt>おきか</rt></ruby>えた<ruby>履歴<rt>りれき</rt></ruby>をどこから<ruby>使<rt>つか</rt></ruby>い<ruby>始<rt>はじ</rt></ruby>めるかを<ruby>見<rt>み</rt></ruby>る<ruby>必要<rt>ひつよう</rt></ruby>があります。

## 01｜図でつかむ

![図09｜Compaction](/assets/codex-reading/day-09.svg)

<ruby>処理<rt>しょり</rt></ruby>の<ruby>目的<rt>もくてき</rt></ruby>は、<ruby>必要<rt>ひつよう</rt></ruby>な<ruby>情報<rt>じょうほう</rt></ruby>を<ruby>引き継<rt>ひきつ</rt></ruby>いで<ruby>会話<rt>かいわ</rt></ruby>を<ruby>続<rt>つづ</rt></ruby>けること。

## 02｜3つのポイントで理解する

### 1. 起動の条件を探す

ContextWindowTokenStatus や token_limit_reached を<ruby>検索<rt>けんさく</rt></ruby>し、どの<ruby>使用量<rt>しようりょう</rt></ruby>・<ruby>閾値<rt>いきち</rt></ruby>が<ruby>判定<rt>はんてい</rt></ruby>に<ruby>使<rt>つか</rt></ruby>われるかを<ruby>見<rt>み</rt></ruby>ます。<ruby>設定値<rt>せっていち</rt></ruby>だけでなく、それを<ruby>比較<rt>ひかく</rt></ruby>する<ruby>場所<rt>ばしょ</rt></ruby>まで<ruby>追<rt>お</rt></ruby>います。

### 2. 圧縮を独立した処理として読む

run_auto_compact や CompactTask <ruby>周辺<rt>しゅうへん</rt></ruby>には、<ruby>通常<rt>つうじょう</rt></ruby>のモデル<ruby>要求<rt>ようきゅう</rt></ruby>とは<ruby>異<rt>こと</rt></ruby>なる<ruby>準備<rt>じゅんび</rt></ruby>や<ruby>結果<rt>けっか</rt></ruby>の<ruby>扱<rt>あつか</rt></ruby>いがあります。<ruby>成功<rt>せいこう</rt></ruby><ruby>時<rt>とき</rt></ruby>だけでなく<ruby>失敗時<rt>しっぱいじ</rt></ruby>に<ruby>元<rt>もと</rt></ruby>の<ruby>履歴<rt>りれき</rt></ruby>がどう<ruby>扱<rt>あつか</rt></ruby>われるかも<ruby>確認<rt>かくにん</rt></ruby>します。

### 3. 置き換えの後が重要

replacement history を<ruby>採用<rt>さいよう</rt></ruby>した<ruby>後<rt>あと</rt></ruby>、Agent Loop がどの<ruby>情報<rt>じょうほう</rt></ruby>から<ruby>続行<rt>ぞっこう</rt></ruby>するかを<ruby>見<rt>み</rt></ruby>ます。<ruby>要約<rt>ようやく</rt></ruby>で<ruby>細部<rt>さいぶ</rt></ruby>が<ruby>省<rt>はぶ</rt></ruby>かれる<ruby>可能性<rt>かのうせい</rt></ruby>を<ruby>考<rt>かんが</rt></ruby>え、<ruby>重要<rt>じゅうよう</rt></ruby>な<ruby>制約<rt>せいやく</rt></ruby>や<ruby>未完了<rt>みかんりょう</rt></ruby>の<ruby>作業<rt>さぎょう</rt></ruby>が<ruby>残<rt>のこ</rt></ruby>るかを<ruby>検証<rt>けんしょう</rt></ruby>します。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>Compaction は<ruby>全文<rt>ぜんぶん</rt></ruby>を<ruby>完全<rt>かんぜん</rt></ruby>に<ruby>同<rt>おな</rt></ruby>じ<ruby>意味<rt>いみ</rt></ruby>のまま<ruby>小<rt>ちい</rt></ruby>さくできるという<ruby>保証<rt>ほしょう</rt></ruby>ではありません。<ruby>原文<rt>げんぶん</rt></ruby>と<ruby>引き継<rt>ひきつ</rt></ruby>ぎ<ruby>内容<rt>ないよう</rt></ruby>の<ruby>差<rt>さ</rt></ruby>を<ruby>意識<rt>いしき</rt></ruby>します。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "run_auto_compact|replace_compacted_history" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/core/src/session/turn.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/core/src/session/turn.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>長<rt>なが</rt></ruby>さ<ruby>判定<rt>はんてい</rt></ruby>、<ruby>圧縮<rt>あっしゅく</rt></ruby>の<ruby>実行<rt>じっこう</rt></ruby>、<ruby>履歴置換<rt>りれきちかん</rt></ruby>の<ruby>三<rt>さん</rt></ruby><ruby>箇所<rt>かしょ</rt></ruby>を<ruby>見<rt>み</rt></ruby>つけ、<ruby>一<rt>ひと</rt></ruby>つの<ruby>流<rt>なが</rt></ruby>れに<ruby>並<rt>なら</rt></ruby>べます。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>起動条件<rt>きどうじょうけん</rt></ruby>は<ruby>使用量<rt>しようりょう</rt></ruby>と<ruby>制約<rt>せいやく</rt></ruby>から<ruby>読<rt>よ</rt></ruby>む。**
- **<ruby>圧縮<rt>あっしゅく</rt></ruby>の<ruby>失敗<rt>しっぱい</rt></ruby><ruby>経路<rt>けいろ</rt></ruby>も<ruby>確認<rt>かくにん</rt></ruby>する。**
- **<ruby>置き換<rt>おきか</rt></ruby>え<ruby>後<rt>のち</rt></ruby>に<ruby>何<rt>なに</rt></ruby>を<ruby>引き継<rt>ひきつ</rt></ruby>ぐかが<ruby>核心<rt>かくしん</rt></ruby>。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
