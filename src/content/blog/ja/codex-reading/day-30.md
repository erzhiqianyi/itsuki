---
lang: "ja"
title: "Day 30｜全体地図 — 入力・判断・実行・状態をつなぐ"
summary: "一つの操作を、画面からモデル・ツール・履歴まで説明できれば地図がつながる。"
date: "2026-09-23"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-30.svg"
codexReadingDay: 30
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>一<rt>ひと</rt></ruby>つの<ruby>操作<rt>そうさ</rt></ruby>を、<ruby>画面<rt>がめん</rt></ruby>からモデル・ツール・<ruby>履歴<rt>りれき</rt></ruby>まで<ruby>説明<rt>せつめい</rt></ruby>できれば<ruby>地図<rt>ちず</rt></ruby>がつながる。</p></div>

30<ruby>日間<rt>にちかん</rt></ruby>で<ruby>増<rt>ふ</rt></ruby>やしてきた<ruby>部品<rt>ぶひん</rt></ruby>を、<ruby>一<rt>ひと</rt></ruby>つの<ruby>作業<rt>さぎょう</rt></ruby>へ<ruby>戻<rt>もど</rt></ruby>して<ruby>見<rt>み</rt></ruby>ます。<ruby>大切<rt>たいせつ</rt></ruby>なのは<ruby>全<rt>ぜん</rt></ruby>ファイルの<ruby>暗記<rt>あんき</rt></ruby>ではなく、<ruby>問題<rt>もんだい</rt></ruby>が<ruby>起<rt>お</rt></ruby>きたときに、どの<ruby>境界<rt>きょうかい</rt></ruby>と<ruby>状態<rt>じょうたい</rt></ruby>から<ruby>調<rt>しら</rt></ruby>べればよいかを<ruby>判断<rt>はんだん</rt></ruby>できることです。

## 01｜図でつかむ

![図30｜全体地図](/assets/codex-reading/day-30.svg)

<ruby>全体<rt>ぜんたい</rt></ruby>の<ruby>循環<rt>じゅんかん</rt></ruby>に、Approval・Sandbox・<ruby>保存<rt>ほぞん</rt></ruby>・テストの<ruby>確認<rt>かくにん</rt></ruby><ruby>点<rt>てん</rt></ruby>を<ruby>重<rt>かさ</rt></ruby>ねる。

## 02｜3つのポイントで理解する

### 1. 入力と実行をつなぐ

ユーザーの<ruby>操作<rt>そうさ</rt></ruby>が<ruby>要求<rt>ようきゅう</rt></ruby>になり、Session / Turn の<ruby>処理<rt>しょり</rt></ruby>に<ruby>渡<rt>わた</rt></ruby>り、モデルとツールの<ruby>往復<rt>おうふく</rt></ruby>へ<ruby>進<rt>すす</rt></ruby>みます。UI、Core、<ruby>外部<rt>がいぶ</rt></ruby>サービスをまたぐ<ruby>場所<rt>ばしょ</rt></ruby>が、<ruby>調査<rt>ちょうさ</rt></ruby>の<ruby>重要<rt>じゅうよう</rt></ruby>な<ruby>境界<rt>きょうかい</rt></ruby>です。

### 2. 状態が次の判断を支える

ツール<ruby>結果<rt>けっか</rt></ruby>や<ruby>会話<rt>かいわ</rt></ruby>は<ruby>履歴<rt>りれき</rt></ruby>へ<ruby>入<rt>い</rt></ruby>り、<ruby>送信用<rt>そうしんよう</rt></ruby>の Context として<ruby>整<rt>ととの</rt></ruby>えられます。<ruby>長<rt>なが</rt></ruby>い<ruby>作業<rt>さぎょう</rt></ruby>では Compaction も<ruby>関<rt>かか</rt></ruby>わります。どこに<ruby>何<rt>なに</rt></ruby>が<ruby>保存<rt>ほぞん</rt></ruby>され、<ruby>今回<rt>こんかい</rt></ruby><ruby>何<rt>なに</rt></ruby>を<ruby>送<rt>おく</rt></ruby>るかを<ruby>分<rt>わ</rt></ruby>けて<ruby>説明<rt>せつめい</rt></ruby>します。

### 3. 安全性と検証を地図に加える

Approval は<ruby>実行<rt>じっこう</rt></ruby><ruby>判断<rt>はんだん</rt></ruby>、Sandbox は<ruby>実行<rt>じっこう</rt></ruby><ruby>範囲<rt>はんい</rt></ruby>に<ruby>関<rt>かか</rt></ruby>わります。<ruby>成功<rt>せいこう</rt></ruby>だけでなく<ruby>失敗時<rt>しっぱいじ</rt></ruby>の<ruby>回復<rt>かいふく</rt></ruby>、<ruby>実際<rt>じっさい</rt></ruby>に<ruby>到達<rt>とうたつ</rt></ruby>できる<ruby>状態<rt>じょうたい</rt></ruby>、API の<ruby>契約<rt>けいやく</rt></ruby>まで<ruby>含<rt>ふく</rt></ruby>めると、<ruby>実用的<rt>じつようてき</rt></ruby>なエージェントの<ruby>設計<rt>せっけい</rt></ruby>が<ruby>見<rt>み</rt></ruby>えてきます。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>この<ruby>地図<rt>ちず</rt></ruby>は<ruby>責務<rt>せきむ</rt></ruby>のつながりを<ruby>簡略化<rt>かんりゃくか</rt></ruby>したものです。<ruby>一<rt>ひと</rt></ruby>つの<ruby>矢印<rt>やじるし</rt></ruby>が<ruby>常<rt>つね</rt></ruby>に<ruby>一<rt>ひと</rt></ruby>つの<ruby>関数呼<rt>かんすうよ</rt></ruby>び<ruby>出<rt>だ</rt></ruby>しや<ruby>一<rt>ひと</rt></ruby>つのプロセスを<ruby>表<rt>あらわ</rt></ruby>すわけではありません。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "ThreadManager|CodexThread|run_turn|ToolRouter" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/core/src/session/turn.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/core/src/session/turn.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

「git status を<ruby>確認<rt>かくにん</rt></ruby>して」という<ruby>依頼<rt>いらい</rt></ruby>を<ruby>題材<rt>だいざい</rt></ruby>に、<ruby>入力<rt>にゅうりょく</rt></ruby>、モデル<ruby>要求<rt>ようきゅう</rt></ruby>、ツール<ruby>実行<rt>じっこう</rt></ruby>、<ruby>結果<rt>けっか</rt></ruby>、<ruby>履歴<rt>りれき</rt></ruby>、<ruby>回答<rt>かいとう</rt></ruby>を<ruby>自分<rt>じぶん</rt></ruby>で<ruby>描<rt>えが</rt></ruby>きます。<ruby>次<rt>つぎ</rt></ruby>にツールが<ruby>失敗<rt>しっぱい</rt></ruby>した<ruby>場合<rt>ばあい</rt></ruby>の<ruby>戻<rt>もど</rt></ruby>り<ruby>道<rt>みち</rt></ruby>を<ruby>書き加<rt>かきくわ</rt></ruby>えます。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>境界<rt>きょうかい</rt></ruby>を<ruby>追<rt>お</rt></ruby>えば、<ruby>巨大<rt>きょだい</rt></ruby>な<ruby>実装<rt>じっそう</rt></ruby>も<ruby>分<rt>わ</rt></ruby>けて<ruby>読<rt>よ</rt></ruby>める。**
- **<ruby>状態<rt>じょうたい</rt></ruby>の<ruby>寿命<rt>じゅみょう</rt></ruby>と<ruby>更新<rt>こうしん</rt></ruby><ruby>点<rt>てん</rt></ruby>が<ruby>挙動<rt>きょどう</rt></ruby>を<ruby>決<rt>き</rt></ruby>める。**
- **<ruby>観察<rt>かんさつ</rt></ruby> → <ruby>検索<rt>けんさく</rt></ruby> → <ruby>比較<rt>ひかく</rt></ruby> → <ruby>検証<rt>けんしょう</rt></ruby>で<ruby>地図<rt>ちず</rt></ruby>を<ruby>更新<rt>こうしん</rt></ruby>する。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
