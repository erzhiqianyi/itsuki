---
lang: "ja"
title: "Day 11｜exec — コマンドが OS のプロセスになるまで"
summary: "コマンドの文字列を、起動条件・実行中の状態・終了結果に分けて追う。"
date: "2026-09-04"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-11.svg"
codexReadingDay: 11
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p>コマンドの<ruby>文字列<rt>もじれつ</rt></ruby>を、<ruby>起動条件<rt>きどうじょうけん</rt></ruby>・<ruby>実行中<rt>じっこうちゅう</rt></ruby>の<ruby>状態<rt>じょうたい</rt></ruby>・<ruby>終了<rt>しゅうりょう</rt></ruby><ruby>結果<rt>けっか</rt></ruby>に<ruby>分<rt>わ</rt></ruby>けて<ruby>追<rt>お</rt></ruby>う。</p></div>

git status は<ruby>短<rt>みじか</rt></ruby>いコマンドですが、<ruby>実行<rt>じっこう</rt></ruby><ruby>場所<rt>ばしょ</rt></ruby>が<ruby>違<rt>ちが</rt></ruby>えば<ruby>結果<rt>けっか</rt></ruby>も<ruby>変<rt>か</rt></ruby>わります。exec を<ruby>読<rt>よ</rt></ruby>むときは、コマンド<ruby>本体<rt>ほんたい</rt></ruby>だけでなく、<ruby>作業<rt>さぎょう</rt></ruby>ディレクトリ、<ruby>入出力<rt>にゅうしゅつりょく</rt></ruby>、<ruby>実行時間<rt>じっこうじかん</rt></ruby>をまとめて<ruby>見<rt>み</rt></ruby>る<ruby>必要<rt>ひつよう</rt></ruby>があります。

## 01｜図でつかむ

![図11｜exec](/assets/codex-reading/day-11.svg)

<ruby>短<rt>みじか</rt></ruby>い<ruby>処理<rt>しょり</rt></ruby>は<ruby>終了<rt>しゅうりょう</rt></ruby><ruby>結果<rt>けっか</rt></ruby>を<ruby>返<rt>かえ</rt></ruby>す。<ruby>長<rt>なが</rt></ruby>い<ruby>処理<rt>しょり</rt></ruby>では、<ruby>継続中<rt>けいぞくちゅう</rt></ruby>のセッションを<ruby>扱<rt>あつか</rt></ruby>う<ruby>必要<rt>ひつよう</rt></ruby>がある。

## 02｜3つのポイントで理解する

### 1. 引数には実行環境も含まれる

ExecCommandArgs から<ruby>要求<rt>ようきゅう</rt></ruby>へ<ruby>変換<rt>へんかん</rt></ruby>する<ruby>部分<rt>ぶぶん</rt></ruby>を<ruby>見<rt>み</rt></ruby>ます。<ruby>同<rt>おな</rt></ruby>じコマンドでも cwd や<ruby>環境変数<rt>かんきょうへんすう</rt></ruby>、タイムアウトなどが<ruby>違<rt>ちが</rt></ruby>えば<ruby>挙動<rt>きょどう</rt></ruby>は<ruby>変<rt>か</rt></ruby>わるため、<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>記録<rt>きろく</rt></ruby>します。

### 2. 実行中のプロセスを管理する

UnifiedExecProcessManager <ruby>周辺<rt>しゅうへん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>むと、<ruby>起動後<rt>きどうご</rt></ruby>の<ruby>状態<rt>じょうたい</rt></ruby>をどこで<ruby>持<rt>も</rt></ruby>つかを<ruby>追<rt>お</rt></ruby>えます。write_stdin のような<ruby>後続<rt>こうぞく</rt></ruby><ruby>操作<rt>そうさ</rt></ruby>が、どの<ruby>実行<rt>じっこう</rt></ruby>セッションを<ruby>対象<rt>たいしょう</rt></ruby>にするかにも<ruby>着目<rt>ちゃくもく</rt></ruby>します。

### 3. 出力と終了は別々に確認する

<ruby>標準出力<rt>ひょうじゅんしゅつりょく</rt></ruby>が<ruby>返<rt>かえ</rt></ruby>ってきても、プロセスが<ruby>終<rt>お</rt></ruby>わったとは<ruby>限<rt>かぎ</rt></ruby>りません。<ruby>終了<rt>しゅうりょう</rt></ruby>コード、<ruby>実行中<rt>じっこうちゅう</rt></ruby>の<ruby>識別子<rt>しきべつし</rt></ruby>、<ruby>打ち切<rt>うちき</rt></ruby>りや<ruby>出力<rt>しゅつりょく</rt></ruby><ruby>省略<rt>しょうりゃく</rt></ruby>の<ruby>情報<rt>じょうほう</rt></ruby>を<ruby>組み合<rt>くみあ</rt></ruby>わせて<ruby>判断<rt>はんだん</rt></ruby>します。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p><ruby>途中<rt>とちゅう</rt></ruby>のログに<ruby>成功<rt>せいこう</rt></ruby>らしい<ruby>文言<rt>もんごん</rt></ruby>があっても、<ruby>最終的<rt>さいしゅうてき</rt></ruby>な<ruby>終了<rt>しゅうりょう</rt></ruby>コードや<ruby>生成物<rt>せいせいぶつ</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>するまでは<ruby>完了<rt>かんりょう</rt></ruby>を<ruby>断定<rt>だんてい</rt></ruby>しません。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "ExecCommandHandler|ExecCommandRequest" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/core/src/tools/handlers/unified_exec/exec_command.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/core/src/tools/handlers/unified_exec/exec_command.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>短<rt>みじか</rt></ruby>い<ruby>読み取<rt>よみと</rt></ruby>りコマンドの<ruby>要求<rt>ようきゅう</rt></ruby>と<ruby>結果<rt>けっか</rt></ruby>を<ruby>観察<rt>かんさつ</rt></ruby>し、cwd・<ruby>出力<rt>しゅつりょく</rt></ruby>・<ruby>終了<rt>しゅうりょう</rt></ruby>コードを<ruby>並<rt>なら</rt></ruby>べて<ruby>記録<rt>きろく</rt></ruby>します。

## 04｜30秒で復習

<div class="codex-recap">

- **コマンドと<ruby>環境<rt>かんきょう</rt></ruby>を<ruby>一組<rt>ひとくみ</rt></ruby>で<ruby>読<rt>よ</rt></ruby>む。**
- **<ruby>継続中<rt>けいぞくちゅう</rt></ruby>のプロセスには<ruby>状態<rt>じょうたい</rt></ruby><ruby>管理<rt>かんり</rt></ruby>が<ruby>必要<rt>ひつよう</rt></ruby>。**
- **<ruby>出力<rt>しゅつりょく</rt></ruby><ruby>受信<rt>じゅしん</rt></ruby>と<ruby>実行<rt>じっこう</rt></ruby><ruby>完了<rt>かんりょう</rt></ruby>を<ruby>区別<rt>くべつ</rt></ruby>する。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
