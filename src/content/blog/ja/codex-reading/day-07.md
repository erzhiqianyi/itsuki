---
lang: "ja"
title: "Day 07｜Model Client — 応答を少しずつ受け取る仕組み"
summary: "Prompt を通信の要求に変え、届いたストリームを内部のイベントとして読む。"
date: "2026-08-31"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-07.svg"
codexReadingDay: 7
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p>Prompt を<ruby>通信<rt>つうしん</rt></ruby>の<ruby>要求<rt>ようきゅう</rt></ruby>に<ruby>変<rt>か</rt></ruby>え、<ruby>届<rt>とど</rt></ruby>いたストリームを<ruby>内部<rt>ないぶ</rt></ruby>のイベントとして<ruby>読<rt>よ</rt></ruby>む。</p></div>

<ruby>画面<rt>がめん</rt></ruby>に<ruby>文字<rt>もじ</rt></ruby>が<ruby>少<rt>すこ</rt></ruby>しずつ<ruby>現<rt>あらわ</rt></ruby>れる<ruby>裏側<rt>うらがわ</rt></ruby>では、<ruby>完成<rt>かんせい</rt></ruby>した<ruby>一<rt>ひと</rt></ruby>つの<ruby>文章<rt>ぶんしょう</rt></ruby>を<ruby>待<rt>ま</rt></ruby>つだけではない<ruby>処理<rt>しょり</rt></ruby>が<ruby>動<rt>うご</rt></ruby>いています。Model Client は、<ruby>内部<rt>ないぶ</rt></ruby>の<ruby>入力<rt>にゅうりょく</rt></ruby>と<ruby>外部<rt>がいぶ</rt></ruby> API の<ruby>応答<rt>おうとう</rt></ruby>をつなぐ<ruby>境界<rt>きょうかい</rt></ruby>です。

## 01｜図でつかむ

![図07｜Model Client](/assets/codex-reading/day-07.svg)

ストリーム<ruby>中<rt>なか</rt></ruby>のデータと、<ruby>応答<rt>おうとう</rt></ruby><ruby>全体<rt>ぜんたい</rt></ruby>の<ruby>完了<rt>かんりょう</rt></ruby>を<ruby>区別<rt>くべつ</rt></ruby>する。

## 02｜3つのポイントで理解する

### 1. 送信内容を先に見る

Prompt にはユーザーの<ruby>一文<rt>いちぶん</rt></ruby>だけでなく、<ruby>履歴<rt>りれき</rt></ruby>やツール<ruby>定義<rt>ていぎ</rt></ruby>などが<ruby>関<rt>かか</rt></ruby>わります。まず<ruby>何<rt>なに</rt></ruby>が<ruby>入力<rt>にゅうりょく</rt></ruby>として<ruby>渡<rt>わた</rt></ruby>されるかを<ruby>確認<rt>かくにん</rt></ruby>し、それから<ruby>通信処理<rt>つうしんしょり</rt></ruby>を<ruby>読<rt>よ</rt></ruby>みます。

### 2. Client と Session の役割を追う

ModelClient と ModelClientSession の<ruby>生成<rt>せいせい</rt></ruby><ruby>場所<rt>ばしょ</rt></ruby>、<ruby>保持<rt>ほじ</rt></ruby>する<ruby>情報<rt>じょうほう</rt></ruby>、stream の<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>見<rt>み</rt></ruby>ます。<ruby>名前<rt>なまえ</rt></ruby>から<ruby>寿命<rt>じゅみょう</rt></ruby>を<ruby>推測<rt>すいそく</rt></ruby>したら、<ruby>実際<rt>じっさい</rt></ruby>にどこで<ruby>再利用<rt>さいりよう</rt></ruby>されるかで<ruby>確<rt>たし</rt></ruby>かめます。

### 3. 途中のデータを完了と混同しない

ResponseStream を<ruby>読<rt>よ</rt></ruby>む<ruby>側<rt>がわ</rt></ruby>は、<ruby>文章<rt>ぶんしょう</rt></ruby>やツール<ruby>呼び出<rt>よびだ</rt></ruby>しに<ruby>関<rt>かん</rt></ruby>するイベントを<ruby>処理<rt>しょり</rt></ruby>します。<ruby>通信<rt>つうしん</rt></ruby>が<ruby>切<rt>き</rt></ruby>れた<ruby>場合<rt>ばあい</rt></ruby>、<ruby>途中<rt>とちゅう</rt></ruby>までの<ruby>出力<rt>しゅつりょく</rt></ruby>がある<ruby>場合<rt>ばあい</rt></ruby>、<ruby>完了<rt>かんりょう</rt></ruby>した<ruby>場合<rt>ばあい</rt></ruby>を<ruby>分<rt>わ</rt></ruby>けて<ruby>追<rt>お</rt></ruby>うと、<ruby>再試行<rt>さいしこう</rt></ruby>の<ruby>扱<rt>あつか</rt></ruby>いも<ruby>理解<rt>りかい</rt></ruby>しやすくなります。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p><ruby>画面<rt>がめん</rt></ruby>に<ruby>文字<rt>もじ</rt></ruby>が<ruby>出始<rt>ではじ</rt></ruby>めても、モデル<ruby>応答<rt>おうとう</rt></ruby><ruby>全体<rt>ぜんたい</rt></ruby>やツール<ruby>引数<rt>ひきすう</rt></ruby>が<ruby>確定<rt>かくてい</rt></ruby>したとは<ruby>限<rt>かぎ</rt></ruby>りません。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "ModelClientSession|ResponseStream" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/core/src/client.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/core/src/client.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

ModelClientSession の<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>側<rt>がわ</rt></ruby>から stream の<ruby>戻り値<rt>もどりち</rt></ruby>へ<ruby>進<rt>すす</rt></ruby>み、<ruby>完了<rt>かんりょう</rt></ruby>とエラーを<ruby>処理<rt>しょり</rt></ruby>する<ruby>分岐<rt>ぶんき</rt></ruby>を<ruby>探<rt>さが</rt></ruby>します。

## 04｜30秒で復習

<div class="codex-recap">

- **Prompt と<ruby>通信<rt>つうしん</rt></ruby><ruby>要求<rt>ようきゅう</rt></ruby>の<ruby>境界<rt>きょうかい</rt></ruby>を<ruby>見<rt>み</rt></ruby>る。**
- **ストリームは<ruby>複数<rt>ふくすう</rt></ruby>のイベントとして<ruby>届<rt>とど</rt></ruby>く。**
- **<ruby>途中<rt>とちゅう</rt></ruby><ruby>出力<rt>しゅつりょく</rt></ruby>・<ruby>完了<rt>かんりょう</rt></ruby>・<ruby>通信<rt>つうしん</rt></ruby><ruby>失敗<rt>しっぱい</rt></ruby>を<ruby>分<rt>わ</rt></ruby>ける。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
