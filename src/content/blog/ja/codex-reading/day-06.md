---
lang: "ja"
title: "Day 06｜Agent Loop — 結果を受け取り、もう一度判断する"
summary: "ツールの結果や保留入力を確認し、続きが必要なら次のモデル呼び出しへ進む。"
date: "2026-08-30"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-06.svg"
codexReadingDay: 6
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p>ツールの<ruby>結果<rt>けっか</rt></ruby>や<ruby>保留<rt>ほりゅう</rt></ruby><ruby>入力<rt>にゅうりょく</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>し、<ruby>続<rt>つづ</rt></ruby>きが<ruby>必要<rt>ひつよう</rt></ruby>なら<ruby>次<rt>つぎ</rt></ruby>のモデル<ruby>呼び出<rt>よびだ</rt></ruby>しへ<ruby>進<rt>すす</rt></ruby>む。</p></div>

エージェントは<ruby>一回<rt>いっかい</rt></ruby>の<ruby>回答<rt>かいとう</rt></ruby>で<ruby>仕事<rt>しごと</rt></ruby>を<ruby>終<rt>お</rt></ruby>えるとは<ruby>限<rt>かぎ</rt></ruby>りません。ファイルを<ruby>読<rt>よ</rt></ruby>み、<ruby>結果<rt>けっか</rt></ruby>を<ruby>見<rt>み</rt></ruby>て<ruby>次<rt>つぎ</rt></ruby>の<ruby>操作<rt>そうさ</rt></ruby>を<ruby>選<rt>えら</rt></ruby>びます。この<ruby>繰り返<rt>くりかえ</rt></ruby>しを<ruby>支<rt>ささ</rt></ruby>えるのが Agent Loop です。ループの<ruby>本体<rt>ほんたい</rt></ruby>と<ruby>同<rt>おな</rt></ruby>じくらい、<ruby>継続<rt>けいぞく</rt></ruby>・<ruby>停止<rt>ていし</rt></ruby>の<ruby>条件<rt>じょうけん</rt></ruby>が<ruby>重要<rt>じゅうよう</rt></ruby>になります。

## 01｜図でつかむ

![図06｜Agent Loop](/assets/codex-reading/day-06.svg)

<ruby>続<rt>つづ</rt></ruby>きが<ruby>必要<rt>ひつよう</rt></ruby>なら Model へ<ruby>戻<rt>もど</rt></ruby>る。<ruby>不要<rt>ふよう</rt></ruby>なら Turn を<ruby>完了<rt>かんりょう</rt></ruby>する。

## 02｜3つのポイントで理解する

### 1. 一回の sampling を切り出す

run_turn の<ruby>中<rt>なか</rt></ruby>でモデルへの<ruby>一回<rt>いっかい</rt></ruby>の<ruby>要求<rt>ようきゅう</rt></ruby>を<ruby>見<rt>み</rt></ruby>つけます。モデルの<ruby>応答<rt>おうとう</rt></ruby>にツール<ruby>要求<rt>ようきゅう</rt></ruby>が<ruby>含<rt>ふく</rt></ruby>まれると、その<ruby>実行結果<rt>じっこうけっか</rt></ruby>が<ruby>後続<rt>こうぞく</rt></ruby>の<ruby>判断材料<rt>はんだんざいりょう</rt></ruby>になります。

### 2. 継続の理由を分ける

<ruby>確認<rt>かくにん</rt></ruby>したソースコードでは、モデル<ruby>側<rt>がわ</rt></ruby>の needs_follow_up と<ruby>保留<rt>ほりゅう</rt></ruby><ruby>入力<rt>にゅうりょく</rt></ruby>の<ruby>有無<rt>うむ</rt></ruby>を<ruby>合<rt>あ</rt></ruby>わせて<ruby>継続<rt>けいぞく</rt></ruby>を<ruby>判断<rt>はんだん</rt></ruby>しています。「ツールがあったから」だけで<ruby>説明<rt>せつめい</rt></ruby>せず、<ruby>追加<rt>ついか</rt></ruby>の<ruby>入力<rt>にゅうりょく</rt></ruby>や<ruby>状態<rt>じょうたい</rt></ruby>も<ruby>見<rt>み</rt></ruby>ます。

### 3. 出口も同じ重さで読む

<ruby>完了<rt>かんりょう</rt></ruby>、エラー、<ruby>中断<rt>ちゅうだん</rt></ruby>の<ruby>経路<rt>けいろ</rt></ruby>を<ruby>分<rt>わ</rt></ruby>けて<ruby>追<rt>お</rt></ruby>います。ツール<ruby>結果<rt>けっか</rt></ruby>の<ruby>記録<rt>きろく</rt></ruby>と<ruby>次<rt>つぎ</rt></ruby>の<ruby>要求<rt>ようきゅう</rt></ruby>の<ruby>間<rt>かん</rt></ruby>で<ruby>何<rt>なに</rt></ruby>が<ruby>起<rt>お</rt></ruby>きるかを<ruby>押<rt>お</rt></ruby>さえると、<ruby>無限<rt>むげん</rt></ruby>に<ruby>続<rt>つづ</rt></ruby>く・<ruby>早<rt>はや</rt></ruby>く<ruby>終<rt>お</rt></ruby>わりすぎるといった<ruby>問題<rt>もんだい</rt></ruby>を<ruby>調<rt>しら</rt></ruby>べやすくなります。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>ループはモデル<ruby>内部<rt>ないぶ</rt></ruby>の<ruby>独り言<rt>ひとりごと</rt></ruby>ではなく、クライアント<ruby>側<rt>がわ</rt></ruby>が<ruby>状態<rt>じょうたい</rt></ruby>と<ruby>結果<rt>けっか</rt></ruby>を<ruby>管理<rt>かんり</rt></ruby>して<ruby>進<rt>すす</rt></ruby>める<ruby>制御<rt>せいぎょ</rt></ruby>です。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "needs_follow_up|has_pending_input" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/core/src/session/turn.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/core/src/session/turn.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

run_turn <ruby>内<rt>ない</rt></ruby>で needs_follow_up を<ruby>検索<rt>けんさく</rt></ruby>し、<ruby>値<rt>あたい</rt></ruby>を<ruby>作<rt>つく</rt></ruby>る<ruby>箇所<rt>かしょ</rt></ruby>と<ruby>終了判定<rt>しゅうりょうはんてい</rt></ruby>に<ruby>使<rt>つか</rt></ruby>う<ruby>箇所<rt>かしょ</rt></ruby>を<ruby>結<rt>むす</rt></ruby>びます。

## 04｜30秒で復習

<div class="codex-recap">

- **モデル<ruby>呼び出<rt>よびだ</rt></ruby>しを<ruby>繰り返<rt>くりかえ</rt></ruby>す<ruby>制御<rt>せいぎょ</rt></ruby>がある。**
- **<ruby>継続<rt>けいぞく</rt></ruby><ruby>理由<rt>りゆう</rt></ruby>にはツール<ruby>結果<rt>けっか</rt></ruby>や<ruby>保留<rt>ほりゅう</rt></ruby><ruby>入力<rt>にゅうりょく</rt></ruby>がある。**
- **<ruby>終了条件<rt>しゅうりょうじょうけん</rt></ruby>とキャンセル<ruby>経路<rt>けいろ</rt></ruby>も<ruby>読<rt>よ</rt></ruby>む。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
