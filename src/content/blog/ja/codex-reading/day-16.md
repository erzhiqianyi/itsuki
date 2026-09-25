---
lang: "ja"
title: "Day 16｜TUI と App Server — 画面と処理の間にある橋"
summary: "画面の操作は要求として渡り、返答や通知を受けて表示が変わる。"
date: "2026-09-09"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-16.svg"
codexReadingDay: 16
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>画面<rt>がめん</rt></ruby>の<ruby>操作<rt>そうさ</rt></ruby>は<ruby>要求<rt>ようきゅう</rt></ruby>として<ruby>渡<rt>わた</rt></ruby>り、<ruby>返答<rt>へんとう</rt></ruby>や<ruby>通知<rt>つうち</rt></ruby>を<ruby>受<rt>う</rt></ruby>けて<ruby>表示<rt>ひょうじ</rt></ruby>が<ruby>変<rt>か</rt></ruby>わる。</p></div>

<ruby>画面<rt>がめん</rt></ruby>が<ruby>動<rt>うご</rt></ruby>く<ruby>仕組<rt>しく</rt></ruby>みと、エージェントが<ruby>仕事<rt>しごと</rt></ruby>を<ruby>進<rt>すす</rt></ruby>める<ruby>仕組<rt>しく</rt></ruby>みを<ruby>分<rt>わ</rt></ruby>けると、<ruby>別<rt>べつ</rt></ruby>の UI から<ruby>同<rt>おな</rt></ruby>じ<ruby>処理<rt>しょり</rt></ruby>を<ruby>使<rt>つか</rt></ruby>いやすくなります。App Server の<ruby>境界<rt>きょうかい</rt></ruby>では、<ruby>要求<rt>ようきゅう</rt></ruby>に<ruby>対<rt>たい</rt></ruby>する<ruby>返答<rt>へんとう</rt></ruby>と、<ruby>処理中<rt>しょりちゅう</rt></ruby>に<ruby>届<rt>とど</rt></ruby>く<ruby>通知<rt>つうち</rt></ruby>を<ruby>見分<rt>みわ</rt></ruby>けます。

## 01｜図でつかむ

![図16｜TUI と App Server](/assets/codex-reading/day-16.svg)

<ruby>要求<rt>ようきゅう</rt></ruby>と<ruby>返答<rt>へんとう</rt></ruby>だけでなく、<ruby>進行<rt>しんこう</rt></ruby>を<ruby>知<rt>し</rt></ruby>らせる<ruby>通知<rt>つうち</rt></ruby>も UI の<ruby>更新<rt>こうしん</rt></ruby>に<ruby>使<rt>つか</rt></ruby>う。

## 02｜3つのポイントで理解する

### 1. 入力イベントを送信へ結び付ける

TUI のイベント<ruby>処理<rt>しょり</rt></ruby>から AppServerSession や Client の<ruby>呼び出<rt>よびだ</rt></ruby>しを<ruby>探<rt>さが</rt></ruby>します。<ruby>画面上<rt>がめんじょう</rt></ruby>の<ruby>状態<rt>じょうたい</rt></ruby>が<ruby>変<rt>か</rt></ruby>わる<ruby>前<rt>まえ</rt></ruby>に、どんな<ruby>要求<rt>ようきゅう</rt></ruby>を<ruby>送り出<rt>おくりだ</rt></ruby>すかを<ruby>確認<rt>かくにん</rt></ruby>します。

### 2. サーバー側の受付へ進む

MessageProcessor や request processor から Core につながる<ruby>経路<rt>けいろ</rt></ruby>を<ruby>追<rt>お</rt></ruby>います。UI のローカル<ruby>状態<rt>じょうたい</rt></ruby>とサーバーが<ruby>持<rt>も</rt></ruby>つ<ruby>状態<rt>じょうたい</rt></ruby>は、<ruby>別々<rt>べつべつ</rt></ruby>に<ruby>更新<rt>こうしん</rt></ruby>されることを<ruby>意識<rt>いしき</rt></ruby>します。

### 3. 返答と通知を分けて扱う

<ruby>公式<rt>こうしき</rt></ruby> App Server <ruby>文書<rt>ぶんしょ</rt></ruby>でも、<ruby>要求<rt>ようきゅう</rt></ruby>・<ruby>応答<rt>おうとう</rt></ruby>・<ruby>通知<rt>つうち</rt></ruby>のやり<ruby>取<rt>と</rt></ruby>りが<ruby>説明<rt>せつめい</rt></ruby>されています。<ruby>応答<rt>おうとう</rt></ruby>を<ruby>受<rt>う</rt></ruby>けて<ruby>終<rt>お</rt></ruby>わる<ruby>操作<rt>そうさ</rt></ruby>と、<ruby>通知<rt>つうち</rt></ruby>を<ruby>継続<rt>けいぞく</rt></ruby>して<ruby>反映<rt>はんえい</rt></ruby>する<ruby>処理<rt>しょり</rt></ruby>を<ruby>分<rt>わ</rt></ruby>けると、<ruby>表示<rt>ひょうじ</rt></ruby>の<ruby>遅<rt>おく</rt></ruby>れや<ruby>同期<rt>どうき</rt></ruby>の<ruby>問題<rt>もんだい</rt></ruby>を<ruby>調<rt>しら</rt></ruby>べやすくなります。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p><ruby>通信<rt>つうしん</rt></ruby><ruby>境界<rt>きょうかい</rt></ruby>があることと、<ruby>必<rt>かなら</rt></ruby>ず<ruby>別<rt>べつ</rt></ruby>プロセスや<ruby>遠隔<rt>えんかく</rt></ruby>サーバーで<ruby>動<rt>うご</rt></ruby>くことは<ruby>同<rt>おな</rt></ruby>じではありません。<ruby>接続<rt>せつぞく</rt></ruby><ruby>方式<rt>ほうしき</rt></ruby>を<ruby>実装<rt>じっそう</rt></ruby>で<ruby>確認<rt>かくにん</rt></ruby>します。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "AppServerSession|AppServerEvent" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/tui/src/app_server_session.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/tui/src/app_server_session.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>一<rt>ひと</rt></ruby>つの UI <ruby>操作<rt>そうさ</rt></ruby>について、<ruby>要求<rt>ようきゅう</rt></ruby><ruby>名<rt>めい</rt></ruby>、サーバー<ruby>側<rt>がわ</rt></ruby>の<ruby>処理<rt>しょり</rt></ruby>、<ruby>返<rt>かえ</rt></ruby>ってくる<ruby>通知<rt>つうち</rt></ruby>の<ruby>受け取<rt>うけと</rt></ruby>り<ruby>箇所<rt>かしょ</rt></ruby>を<ruby>探<rt>さが</rt></ruby>します。

## 04｜30秒で復習

<div class="codex-recap">

- **UI と<ruby>作業<rt>さぎょう</rt></ruby><ruby>処理<rt>しょり</rt></ruby>は<ruby>境界<rt>きょうかい</rt></ruby>で<ruby>分<rt>わ</rt></ruby>かれる。**
- **<ruby>応答<rt>おうとう</rt></ruby>と<ruby>通知<rt>つうち</rt></ruby>は<ruby>役割<rt>やくわり</rt></ruby>が<ruby>違<rt>ちが</rt></ruby>う。**
- **<ruby>表示<rt>ひょうじ</rt></ruby><ruby>状態<rt>じょうたい</rt></ruby>とサーバー<ruby>状態<rt>じょうたい</rt></ruby>の<ruby>同期<rt>どうき</rt></ruby>を<ruby>見<rt>み</rt></ruby>る。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
