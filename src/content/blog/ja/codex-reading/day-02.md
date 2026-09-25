---
lang: "ja"
title: "Day 02｜Coding Agent を、6つの役割に分けてみる"
summary: "入口・画面・共通メッセージ・Core・Model・Tools の役割を分ける。"
date: "2026-08-26"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-02.svg"
codexReadingDay: 2
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>入口<rt>いりぐち</rt></ruby>・<ruby>画面<rt>がめん</rt></ruby>・<ruby>共通<rt>きょうつう</rt></ruby>メッセージ・Core・Model・Tools の<ruby>役割<rt>やくわり</rt></ruby>を<ruby>分<rt>わ</rt></ruby>ける。</p></div>

「Codex」という<ruby>一<rt>ひと</rt></ruby>つの<ruby>箱<rt>はこ</rt></ruby>を<ruby>開<rt>ひら</rt></ruby>くと、<ruby>入力<rt>にゅうりょく</rt></ruby>を<ruby>受<rt>う</rt></ruby>ける<ruby>部品<rt>ぶひん</rt></ruby>、<ruby>画面<rt>がめん</rt></ruby>を<ruby>描<rt>えが</rt></ruby>く<ruby>部品<rt>ぶひん</rt></ruby>、モデルとツールをつなぐ<ruby>部品<rt>ぶひん</rt></ruby>が<ruby>見<rt>み</rt></ruby>えてきます。<ruby>今日<rt>きょう</rt></ruby>は<ruby>関数<rt>かんすう</rt></ruby>を<ruby>深追<rt>ふかお</rt></ruby>いせず、どこに<ruby>何<rt>なに</rt></ruby>を<ruby>聞<rt>き</rt></ruby>けばよいか<ruby>分<rt>わ</rt></ruby>かる<ruby>地図<rt>ちず</rt></ruby>を<ruby>作<rt>つく</rt></ruby>ります。

## 01｜図でつかむ

![図02｜Coding Agent を、6つの役割に分けてみる](/assets/codex-reading/day-02.svg)

Core から Model と Tools へ。Protocol は<ruby>部品間<rt>ぶひんかん</rt></ruby>の<ruby>共通言語<rt>きょうつうげんご</rt></ruby>で、<ruby>図<rt>ず</rt></ruby>の<ruby>矢印<rt>やじるし</rt></ruby>を<ruby>支<rt>ささ</rt></ruby>える。

## 02｜3つのポイントで理解する

### 1. CLI は入口、TUI は人との接点

CLI は<ruby>引数<rt>ひきすう</rt></ruby>や subcommand を<ruby>読<rt>よ</rt></ruby>み、<ruby>起動<rt>きどう</rt></ruby><ruby>先<rt>さき</rt></ruby>を<ruby>選<rt>えら</rt></ruby>びます。TUI は<ruby>入力<rt>にゅうりょく</rt></ruby><ruby>欄<rt>らん</rt></ruby>だけでなく、<ruby>進行状況<rt>しんこうじょうきょう</rt></ruby>・<ruby>承認<rt>しょうにん</rt></ruby>・<ruby>差分<rt>さぶん</rt></ruby>・<ruby>実行結果<rt>じっこうけっか</rt></ruby>を<ruby>表示<rt>ひょうじ</rt></ruby>します。「<ruby>何<rt>なに</rt></ruby>を<ruby>起動<rt>きどう</rt></ruby>するか」と「<ruby>作業<rt>さぎょう</rt></ruby>をどう<ruby>見<rt>み</rt></ruby>せるか」を<ruby>分<rt>わ</rt></ruby>けて<ruby>考<rt>かんが</rt></ruby>えます。

### 2. Core に、画面から独立した処理を集める

Core は Codex の<ruby>主要<rt>しゅよう</rt></ruby>な<ruby>処理<rt>しょり</rt></ruby>を<ruby>担<rt>にな</rt></ruby>います。モデル<ruby>呼び出<rt>よびだ</rt></ruby>しや<ruby>作業<rt>さぎょう</rt></ruby><ruby>状態<rt>じょうたい</rt></ruby>の<ruby>管理<rt>かんり</rt></ruby>を<ruby>画面<rt>がめん</rt></ruby>コードから<ruby>分<rt>わ</rt></ruby>けることで、<ruby>別<rt>べつ</rt></ruby>の UI からも<ruby>利用<rt>りよう</rt></ruby>しやすくなります。TUI と Core の<ruby>間<rt>あいだ</rt></ruby>にある App Server の<ruby>接続<rt>せつぞく</rt></ruby>は Day 16 で<ruby>詳<rt>くわ</rt></ruby>しく<ruby>見<rt>み</rt></ruby>ます。

### 3. Protocol は配線の途中に置く装置ではない

UserInput や ThreadId などの<ruby>型<rt>かた</rt></ruby>は、<ruby>部品<rt>ぶひん</rt></ruby>が<ruby>同<rt>おな</rt></ruby>じ<ruby>意味<rt>いみ</rt></ruby>で<ruby>情報<rt>じょうほう</rt></ruby>をやり<ruby>取<rt>と</rt></ruby>りするための<ruby>約束<rt>やくそく</rt></ruby>です。Model は<ruby>判断<rt>はんだん</rt></ruby>を<ruby>返<rt>かえ</rt></ruby>し、Tools はファイルやプロセスへ<ruby>働<rt>はたら</rt></ruby>きかけます。<ruby>図<rt>ず</rt></ruby>の<ruby>箱<rt>はこ</rt></ruby>を<ruby>順番<rt>じゅんばん</rt></ruby>に<ruby>通<rt>とお</rt></ruby>るだけでなく、<ruby>誰<rt>だれ</rt></ruby>がどの<ruby>型<rt>かた</rt></ruby>を<ruby>送受信<rt>そうじゅしん</rt></ruby>するかを<ruby>読<rt>よ</rt></ruby>みます。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>ディレクトリ<ruby>構成<rt>こうせい</rt></ruby>と<ruby>実行順序<rt>じっこうじゅんじょ</rt></ruby>は<ruby>一致<rt>いっち</rt></ruby>しません。<ruby>地図<rt>ちず</rt></ruby>は<ruby>責務<rt>せきむ</rt></ruby>を<ruby>把握<rt>はあく</rt></ruby>するための<ruby>概念図<rt>がいねんず</rt></ruby>であり、<ruby>正確<rt>せいかく</rt></ruby>な<ruby>関数呼<rt>かんすうよ</rt></ruby>び<ruby>出<rt>だ</rt></ruby>し<ruby>図<rt>ず</rt></ruby>ではありません。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "MultitoolCli|AppServerClient|codex_protocol" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/tui/src/lib.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/tui/src/lib.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

cli/src/main.rs、tui/src/lib.rs、core/README.md、protocol/src/lib.rs を<ruby>開<rt>ひら</rt></ruby>き、それぞれの<ruby>責務<rt>せきむ</rt></ruby>を<ruby>一文<rt>いちぶん</rt></ruby>で<ruby>書<rt>か</rt></ruby>きます。AI に<ruby>聞<rt>き</rt></ruby>いた<ruby>説明<rt>せつめい</rt></ruby>は<ruby>検索<rt>けんさく</rt></ruby>の<ruby>出発点<rt>しゅっぱつてん</rt></ruby>として<ruby>使<rt>つか</rt></ruby>い、<ruby>実際<rt>じっさい</rt></ruby>のファイルで<ruby>確認<rt>かくにん</rt></ruby>します。

## 04｜30秒で復習

<div class="codex-recap">

- **CLI は<ruby>起動<rt>きどう</rt></ruby><ruby>先<rt>さき</rt></ruby>を<ruby>選<rt>えら</rt></ruby>ぶ。TUI は<ruby>作業<rt>さぎょう</rt></ruby>を<ruby>見<rt>み</rt></ruby>せる。**
- **Core は UI から<ruby>独立<rt>どくりつ</rt></ruby>した<ruby>中核<rt>ちゅうかく</rt></ruby>を<ruby>担<rt>にな</rt></ruby>う。**
- **Protocol は<ruby>共通<rt>きょうつう</rt></ruby>の<ruby>型<rt>かた</rt></ruby>、Model は<ruby>判断<rt>はんだん</rt></ruby>、Tools は<ruby>操作<rt>そうさ</rt></ruby>。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
