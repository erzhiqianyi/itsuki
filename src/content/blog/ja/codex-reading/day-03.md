---
lang: "ja"
title: "Day 03｜一つの入力を、モデルとツールの往復まで追う"
summary: "文字列が型付きの入力になり、Turn の処理へ渡る境界を追う。"
date: "2026-08-27"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-03.svg"
codexReadingDay: 3
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>文字列<rt>もじれつ</rt></ruby>が<ruby>型付<rt>かたつ</rt></ruby>きの<ruby>入力<rt>にゅうりょく</rt></ruby>になり、Turn の<ruby>処理<rt>しょり</rt></ruby>へ<ruby>渡<rt>わた</rt></ruby>る<ruby>境界<rt>きょうかい</rt></ruby>を<ruby>追<rt>お</rt></ruby>う。</p></div>

「git status を<ruby>確認<rt>かくにん</rt></ruby>して」という<ruby>短<rt>みじか</rt></ruby>い<ruby>依頼<rt>いらい</rt></ruby>にも、<ruby>入力<rt>にゅうりょく</rt></ruby>の<ruby>受付<rt>うけつけ</rt></ruby>、モデルへの<ruby>送信<rt>そうしん</rt></ruby>、コマンド<ruby>実行<rt>じっこう</rt></ruby>、<ruby>結果<rt>けっか</rt></ruby>の<ruby>説明<rt>せつめい</rt></ruby>という<ruby>段階<rt>だんかい</rt></ruby>があります。<ruby>同<rt>おな</rt></ruby>じ<ruby>入力<rt>にゅうりょく</rt></ruby>を<ruby>追<rt>お</rt></ruby>い<ruby>続<rt>つづ</rt></ruby>けると、ファイル<ruby>一覧<rt>いちらん</rt></ruby>だけでは<ruby>見<rt>み</rt></ruby>えない<ruby>実行<rt>じっこう</rt></ruby><ruby>経路<rt>けいろ</rt></ruby>がつながります。

## 01｜図でつかむ

![図03｜一つの入力を、モデルとツールの往復まで追う](/assets/codex-reading/day-03.svg)

<ruby>結果<rt>けっか</rt></ruby>は<ruby>次<rt>つぎ</rt></ruby>の<ruby>判断<rt>はんだん</rt></ruby>の<ruby>材料<rt>ざいりょう</rt></ruby>になる。ツールを<ruby>使<rt>つか</rt></ruby>わず、<ruby>直接回答<rt>ちょくせつかいとう</rt></ruby>する<ruby>経路<rt>けいろ</rt></ruby>もある。

## 02｜3つのポイントで理解する

### 1. 画面の文字から、処理用の入力へ

<ruby>入力<rt>にゅうりょく</rt></ruby><ruby>欄<rt>らん</rt></ruby>に<ruby>見<rt>み</rt></ruby>えるテキストと、<ruby>内部<rt>ないぶ</rt></ruby>で<ruby>渡<rt>わた</rt></ruby>される UserInput は<ruby>同<rt>おな</rt></ruby>じ<ruby>層<rt>そう</rt></ruby>ではありません。<ruby>送信<rt>そうしん</rt></ruby>ボタンやキー<ruby>操作<rt>そうさ</rt></ruby>の<ruby>先<rt>さき</rt></ruby>で、どの<ruby>型<rt>かた</rt></ruby>へ<ruby>変換<rt>へんかん</rt></ruby>されるかを<ruby>探<rt>さが</rt></ruby>します。

### 2. Turn の開始地点を見つける

<ruby>受付<rt>うけつけ</rt></ruby><ruby>後<rt>のち</rt></ruby>の<ruby>処理<rt>しょり</rt></ruby>は、<ruby>会話<rt>かいわ</rt></ruby>の<ruby>状態<rt>じょうたい</rt></ruby>や<ruby>実行<rt>じっこう</rt></ruby><ruby>条件<rt>じょうけん</rt></ruby>と<ruby>結び付<rt>むすびつ</rt></ruby>きます。Turn の<ruby>入口<rt>いりぐち</rt></ruby>からモデル<ruby>呼び出<rt>よびだ</rt></ruby>しまでを<ruby>追<rt>お</rt></ruby>い、<ruby>入力<rt>にゅうりょく</rt></ruby>だけでなく<ruby>既存<rt>きぞん</rt></ruby>の<ruby>履歴<rt>りれき</rt></ruby>も<ruby>材料<rt>ざいりょう</rt></ruby>になることを<ruby>確認<rt>かくにん</rt></ruby>します。

### 3. Tool Call と Tool Result を対で読む

モデルが<ruby>出<rt>だ</rt></ruby>すのは<ruby>実行<rt>じっこう</rt></ruby>の<ruby>要求<rt>ようきゅう</rt></ruby>です。<ruby>実際<rt>じっさい</rt></ruby>の<ruby>操作<rt>そうさ</rt></ruby>はツール<ruby>側<rt>がわ</rt></ruby>が<ruby>行<rt>おこな</rt></ruby>い、その<ruby>結果<rt>けっか</rt></ruby>をモデルに<ruby>返<rt>かえ</rt></ruby>します。<ruby>同<rt>おな</rt></ruby>じ<ruby>呼び出<rt>よびだ</rt></ruby>しの<ruby>識別子<rt>しきべつし</rt></ruby>と<ruby>出力<rt>しゅつりょく</rt></ruby>をたどると、<ruby>別<rt>べつ</rt></ruby>の<ruby>操作<rt>そうさ</rt></ruby>と<ruby>混同<rt>こんどう</rt></ruby>せずに<ruby>追跡<rt>ついせき</rt></ruby>できます。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p><ruby>画面<rt>がめん</rt></ruby>にコマンドらしい<ruby>文字<rt>もじ</rt></ruby>が<ruby>出<rt>で</rt></ruby>ただけでは<ruby>実行<rt>じっこう</rt></ruby><ruby>済<rt>す</rt></ruby>みとは<ruby>言<rt>い</rt></ruby>えません。<ruby>要求<rt>ようきゅう</rt></ruby>・<ruby>実行<rt>じっこう</rt></ruby>・<ruby>結果<rt>けっか</rt></ruby>の<ruby>三<rt>みっ</rt></ruby>つを<ruby>分<rt>わ</rt></ruby>けて<ruby>観察<rt>かんさつ</rt></ruby>します。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "UserInput|run_turn" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/core/src/session/turn.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/core/src/session/turn.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>変更<rt>へんこう</rt></ruby>を<ruby>行<rt>おこな</rt></ruby>わない git status の<ruby>依頼<rt>いらい</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つだけ<ruby>使<rt>つか</rt></ruby>い、<ruby>入力<rt>にゅうりょく</rt></ruby><ruby>受付<rt>うけつけ</rt></ruby>、ツール<ruby>呼び出<rt>よびだ</rt></ruby>し、ツール<ruby>結果<rt>けっか</rt></ruby>の<ruby>順<rt>じゅん</rt></ruby>にメモします。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>一<rt>ひと</rt></ruby>つの<ruby>入力<rt>にゅうりょく</rt></ruby>を<ruby>固定<rt>こてい</rt></ruby>して<ruby>経路<rt>けいろ</rt></ruby>を<ruby>追<rt>お</rt></ruby>う。**
- **<ruby>型<rt>かた</rt></ruby>が<ruby>変<rt>か</rt></ruby>わる<ruby>境界<rt>きょうかい</rt></ruby>で<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>と<ruby>先<rt>さき</rt></ruby>を<ruby>見<rt>み</rt></ruby>る。**
- **ツール<ruby>結果<rt>けっか</rt></ruby>はモデルの<ruby>次<rt>つぎ</rt></ruby>の<ruby>入力<rt>にゅうりょく</rt></ruby>になる。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
