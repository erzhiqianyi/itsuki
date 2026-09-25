---
lang: "ja"
title: "Day 18｜小さな改造 — alias は既存の処理へつなぐ"
summary: "新しい名前を既存のコマンドへ解決し、処理を重複させない。"
date: "2026-09-11"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-18.svg"
codexReadingDay: 18
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>新<rt>あたら</rt></ruby>しい<ruby>名前<rt>なまえ</rt></ruby>を<ruby>既存<rt>きぞん</rt></ruby>のコマンドへ<ruby>解決<rt>かいけつ</rt></ruby>し、<ruby>処理<rt>しょり</rt></ruby>を<ruby>重複<rt>ちょうふく</rt></ruby>させない。</p></div>

<ruby>原稿<rt>げんこう</rt></ruby>の<ruby>演習<rt>えんしゅう</rt></ruby>は /where を /pwd の<ruby>別名<rt>べつめい</rt></ruby>にする<ruby>小<rt>ちい</rt></ruby>さな<ruby>変更<rt>へんこう</rt></ruby>です。<ruby>目的<rt>もくてき</rt></ruby>は<ruby>機能<rt>きのう</rt></ruby>を<ruby>増<rt>ふ</rt></ruby>やすことより、<ruby>入力<rt>にゅうりょく</rt></ruby>の<ruby>解釈<rt>かいしゃく</rt></ruby>と<ruby>実際<rt>じっさい</rt></ruby>の<ruby>処理<rt>しょり</rt></ruby>を<ruby>分<rt>わ</rt></ruby>け、<ruby>既存<rt>きぞん</rt></ruby>の<ruby>抽象化<rt>ちゅうしょうか</rt></ruby>を<ruby>再利用<rt>さいりよう</rt></ruby>する<ruby>練習<rt>れんしゅう</rt></ruby>にあります。

## 01｜図でつかむ

![図18｜小さな改造](/assets/codex-reading/day-18.svg)

<ruby>演習<rt>えんしゅう</rt></ruby>の<ruby>設計図<rt>せっけいず</rt></ruby>。/where が<ruby>配布<rt>はいふ</rt></ruby><ruby>版<rt>はん</rt></ruby>に<ruby>標準搭載<rt>ひょうじゅんとうさい</rt></ruby>されているという<ruby>説明<rt>せつめい</rt></ruby>ではない。

## 02｜3つのポイントで理解する

### 1. どこで文字列を解釈するか

SlashCommand の<ruby>定義<rt>ていぎ</rt></ruby>と find_builtin_command <ruby>周辺<rt>しゅうへん</rt></ruby>を<ruby>探<rt>さが</rt></ruby>します。<ruby>文字列<rt>もじれつ</rt></ruby>からコマンド<ruby>型<rt>かた</rt></ruby>へ<ruby>変<rt>か</rt></ruby>わる<ruby>場所<rt>ばしょ</rt></ruby>が<ruby>分<rt>わ</rt></ruby>かれば、<ruby>別名<rt>べつめい</rt></ruby>を<ruby>受け付<rt>うけつ</rt></ruby>ける<ruby>責務<rt>せきむ</rt></ruby>を<ruby>絞<rt>しぼ</rt></ruby>れます。

### 2. 実行処理を増やさない

/where <ruby>専用<rt>せんよう</rt></ruby>の cwd <ruby>表示<rt>ひょうじ</rt></ruby>を<ruby>新<rt>あたら</rt></ruby>しく<ruby>書<rt>か</rt></ruby>くと、/pwd と<ruby>挙動<rt>きょどう</rt></ruby>がずれる<ruby>原因<rt>げんいん</rt></ruby>になります。<ruby>同<rt>おな</rt></ruby>じコマンド<ruby>型<rt>かた</rt></ruby>へ<ruby>解決<rt>かいけつ</rt></ruby>し、<ruby>既存<rt>きぞん</rt></ruby>の dispatch に<ruby>流<rt>なが</rt></ruby>す<ruby>設計<rt>せっけい</rt></ruby>を<ruby>考<rt>かんが</rt></ruby>えます。

### 3. RED と GREEN を確認する

<ruby>追加<rt>ついか</rt></ruby><ruby>前<rt>まえ</rt></ruby>に alias の<ruby>解決<rt>かいけつ</rt></ruby>テストが<ruby>失敗<rt>しっぱい</rt></ruby>し、<ruby>追加<rt>ついか</rt></ruby><ruby>後<rt>のち</rt></ruby>に<ruby>通<rt>とお</rt></ruby>ることを<ruby>確<rt>たし</rt></ruby>かめます。<ruby>候補<rt>こうほ</rt></ruby><ruby>表示<rt>ひょうじ</rt></ruby>やヘルプまで<ruby>変更<rt>へんこう</rt></ruby>する<ruby>必要<rt>ひつよう</rt></ruby>があるかは、<ruby>検索<rt>けんさく</rt></ruby>・<ruby>解決<rt>かいけつ</rt></ruby>・<ruby>表示<rt>ひょうじ</rt></ruby>の<ruby>責務<rt>せきむ</rt></ruby>を<ruby>分<rt>わ</rt></ruby>けて<ruby>判断<rt>はんだん</rt></ruby>します。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p><ruby>原稿<rt>げんこう</rt></ruby>に<ruby>出<rt>で</rt></ruby>てくるテスト<ruby>名<rt>めい</rt></ruby>は<ruby>演習<rt>えんしゅう</rt></ruby>で<ruby>作<rt>つく</rt></ruby>る<ruby>名前<rt>なまえ</rt></ruby>を<ruby>含<rt>ふく</rt></ruby>みます。その<ruby>名前<rt>なまえ</rt></ruby>で<ruby>実行<rt>じっこう</rt></ruby>して0<ruby>件<rt>けん</rt></ruby>なら、<ruby>成功<rt>せいこう</rt></ruby>の<ruby>証拠<rt>しょうこ</rt></ruby>にはなりません。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "Pwd|find_builtin_command" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/tui/src/slash_command.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/tui/src/slash_command.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

まず /pwd の<ruby>解決<rt>かいけつ</rt></ruby><ruby>経路<rt>けいろ</rt></ruby>を<ruby>調<rt>しら</rt></ruby>べ、<ruby>別名<rt>べつめい</rt></ruby>をどの<ruby>一箇所<rt>いっかしょ</rt></ruby>に<ruby>加<rt>くわ</rt></ruby>えるのが<ruby>自然<rt>しぜん</rt></ruby>かを<ruby>説明<rt>せつめい</rt></ruby>します。<ruby>実装<rt>じっそう</rt></ruby>する<ruby>場合<rt>ばあい</rt></ruby>は<ruby>練習用<rt>れんしゅうよう</rt></ruby>の<ruby>作業場所<rt>さぎょうばしょ</rt></ruby>で<ruby>行<rt>おこな</rt></ruby>います。

## 04｜30秒で復習

<div class="codex-recap">

- **alias は<ruby>入力<rt>にゅうりょく</rt></ruby>の<ruby>解決<rt>かいけつ</rt></ruby>に<ruby>関<rt>かん</rt></ruby>する<ruby>変更<rt>へんこう</rt></ruby>。**
- **<ruby>既存<rt>きぞん</rt></ruby>のコマンド<ruby>処理<rt>しょり</rt></ruby>を<ruby>再利用<rt>さいりよう</rt></ruby>する。**
- **<ruby>追加<rt>ついか</rt></ruby><ruby>前<rt>まえ</rt></ruby>の<ruby>失敗<rt>しっぱい</rt></ruby>と<ruby>追加<rt>ついか</rt></ruby><ruby>後<rt>のち</rt></ruby>の<ruby>成功<rt>せいこう</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>する。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
