---
lang: "ja"
title: "Day 13｜Approval — 方針と、一回の判断を分ける"
summary: "承認方針、今回の要求に必要な確認、実際の決定を別々に読む。"
date: "2026-09-06"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-13.svg"
codexReadingDay: 13
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>承認<rt>しょうにん</rt></ruby><ruby>方針<rt>ほうしん</rt></ruby>、<ruby>今回<rt>こんかい</rt></ruby>の<ruby>要求<rt>ようきゅう</rt></ruby>に<ruby>必要<rt>ひつよう</rt></ruby>な<ruby>確認<rt>かくにん</rt></ruby>、<ruby>実際<rt>じっさい</rt></ruby>の<ruby>決定<rt>けってい</rt></ruby>を<ruby>別々<rt>べつべつ</rt></ruby>に<ruby>読<rt>よ</rt></ruby>む。</p></div>

<ruby>毎回<rt>まいかい</rt></ruby><ruby>確認<rt>かくにん</rt></ruby>するのか、<ruby>条件<rt>じょうけん</rt></ruby>に<ruby>応<rt>おう</rt></ruby>じて<ruby>確認<rt>かくにん</rt></ruby>するのか。その<ruby>方針<rt>ほうしん</rt></ruby>と、<ruby>今<rt>いま</rt></ruby>この<ruby>操作<rt>そうさ</rt></ruby>を<ruby>実行<rt>じっこう</rt></ruby>してよいかの<ruby>決定<rt>けってい</rt></ruby>は<ruby>別<rt>べつ</rt></ruby>です。<ruby>承認<rt>しょうにん</rt></ruby><ruby>処理<rt>しょり</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つの if <ruby>文<rt>ぶん</rt></ruby>として<ruby>考<rt>かんが</rt></ruby>えず、<ruby>段階<rt>だんかい</rt></ruby>に<ruby>分<rt>わ</rt></ruby>けて<ruby>追<rt>お</rt></ruby>います。

## 01｜図でつかむ

![図13｜Approval](/assets/codex-reading/day-13.svg)

<ruby>判断<rt>はんだん</rt></ruby>を<ruby>受<rt>う</rt></ruby>けたあとも、<ruby>実行<rt>じっこう</rt></ruby>は<ruby>選<rt>えら</rt></ruby>ばれた<ruby>権限<rt>けんげん</rt></ruby>と<ruby>環境<rt>かんきょう</rt></ruby>の<ruby>制約<rt>せいやく</rt></ruby>に<ruby>従<rt>したが</rt></ruby>う。

## 02｜3つのポイントで理解する

### 1. Policy は基本ルール

AskForApproval などの<ruby>設定<rt>せってい</rt></ruby>は、<ruby>承認<rt>しょうにん</rt></ruby>をどのように<ruby>扱<rt>あつか</rt></ruby>うかを<ruby>決<rt>き</rt></ruby>めます。<ruby>設定<rt>せってい</rt></ruby><ruby>名<rt>めい</rt></ruby>の<ruby>印象<rt>いんしょう</rt></ruby>だけで<ruby>判断<rt>はんだん</rt></ruby>せず、どの<ruby>条件分岐<rt>じょうけんぶんき</rt></ruby>で<ruby>参照<rt>さんしょう</rt></ruby>されるかを<ruby>読<rt>よ</rt></ruby>みます。

### 2. Requirement は今回の操作についての判定

<ruby>実行<rt>じっこう</rt></ruby>するコマンドやパスなどから、<ruby>必要<rt>ひつよう</rt></ruby>な<ruby>確認<rt>かくにん</rt></ruby>が<ruby>組み立<rt>くみた</rt></ruby>てられます。<ruby>設定<rt>せってい</rt></ruby>が<ruby>同<rt>おな</rt></ruby>じでも<ruby>操作<rt>そうさ</rt></ruby>の<ruby>内容<rt>ないよう</rt></ruby>が<ruby>違<rt>ちが</rt></ruby>えば、<ruby>通<rt>とお</rt></ruby>る<ruby>経路<rt>けいろ</rt></ruby>が<ruby>変<rt>か</rt></ruby>わる<ruby>可能性<rt>かのうせい</rt></ruby>があります。

### 3. Decision は判定結果

<ruby>確認<rt>かくにん</rt></ruby>を<ruby>担当<rt>たんとう</rt></ruby>する<ruby>側<rt>がわ</rt></ruby>から<ruby>返<rt>かえ</rt></ruby>った<ruby>決定<rt>けってい</rt></ruby>が、<ruby>実行<rt>じっこう</rt></ruby>・<ruby>拒否<rt>きょひ</rt></ruby>・<ruby>中断<rt>ちゅうだん</rt></ruby>などへどう<ruby>接続<rt>せつぞく</rt></ruby>されるかを<ruby>見<rt>み</rt></ruby>ます。ユーザーへの<ruby>質問<rt>しつもん</rt></ruby><ruby>表示<rt>ひょうじ</rt></ruby>だけでなく、<ruby>返答<rt>へんとう</rt></ruby><ruby>後<rt>のち</rt></ruby>の<ruby>処理<rt>しょり</rt></ruby>まで<ruby>追<rt>お</rt></ruby>って<ruby>初<rt>はじ</rt></ruby>めて<ruby>一周<rt>いっしゅう</rt></ruby>できます。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p><ruby>承認<rt>しょうにん</rt></ruby>されたという<ruby>事実<rt>じじつ</rt></ruby>から、ファイルシステムやネットワークの<ruby>制約<rt>せいやく</rt></ruby>がすべて<ruby>解除<rt>かいじょ</rt></ruby>されたとは<ruby>考<rt>かんが</rt></ruby>えません。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "AskForApproval|ReviewDecision" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/protocol/src/protocol.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/protocol/src/protocol.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

Approval の<ruby>要求<rt>ようきゅう</rt></ruby>を<ruby>作<rt>つく</rt></ruby>る<ruby>場所<rt>ばしょ</rt></ruby>と<ruby>決定<rt>けってい</rt></ruby>を<ruby>受け取<rt>うけと</rt></ruby>る<ruby>場所<rt>ばしょ</rt></ruby>を<ruby>探<rt>さが</rt></ruby>し、その<ruby>間<rt>あいだ</rt></ruby>に<ruby>運<rt>はこ</rt></ruby>ばれる<ruby>情報<rt>じょうほう</rt></ruby>を<ruby>書き出<rt>かきだ</rt></ruby>します。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>方針<rt>ほうしん</rt></ruby>と<ruby>個別<rt>こべつ</rt></ruby><ruby>判断<rt>はんだん</rt></ruby>を<ruby>分<rt>わ</rt></ruby>ける。**
- **<ruby>操作<rt>そうさ</rt></ruby><ruby>内容<rt>ないよう</rt></ruby>から<ruby>確認<rt>かくにん</rt></ruby><ruby>要件<rt>ようけん</rt></ruby>が<ruby>決<rt>き</rt></ruby>まる。**
- **<ruby>決定後<rt>けっていご</rt></ruby>の<ruby>実行<rt>じっこう</rt></ruby>・<ruby>拒否<rt>きょひ</rt></ruby><ruby>経路<rt>けいろ</rt></ruby>まで<ruby>追<rt>お</rt></ruby>う。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
