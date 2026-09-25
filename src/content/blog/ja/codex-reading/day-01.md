---
lang: "ja"
title: "Day 01｜ソースから動かすと、コードに意味が生まれる"
summary: "まず動作を観察し、その動きを生むコードを探す。"
date: "2026-08-25"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-01.svg"
codexReadingDay: 1
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p>まず<ruby>動作<rt>どうさ</rt></ruby>を<ruby>観察<rt>かんさつ</rt></ruby>し、その<ruby>動<rt>うご</rt></ruby>きを<ruby>生<rt>う</rt></ruby>むコードを<ruby>探<rt>さが</rt></ruby>す。</p></div>

<ruby>巨大<rt>きょだい</rt></ruby>なリポジトリを<ruby>先頭<rt>せんとう</rt></ruby>から<ruby>読<rt>よ</rt></ruby>むと、<ruby>部品<rt>ぶひん</rt></ruby>の<ruby>名前<rt>なまえ</rt></ruby>ばかりが<ruby>増<rt>ふ</rt></ruby>えてしまいます。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>自分<rt>じぶん</rt></ruby>でビルドした Codex を<ruby>起動<rt>きどう</rt></ruby>し、「<ruby>入力<rt>にゅうりょく</rt></ruby>したら<ruby>何<rt>なに</rt></ruby>が<ruby>起<rt>お</rt></ruby>きるか」を<ruby>観察<rt>かんさつ</rt></ruby>しましょう。<ruby>実行<rt>じっこう</rt></ruby>ファイルとユーザー<ruby>状態<rt>じょうたい</rt></ruby>、モデルを<ruby>動<rt>うご</rt></ruby>かすサービスの<ruby>違<rt>ちが</rt></ruby>いも、ここで<ruby>整理<rt>せいり</rt></ruby>します。

## 01｜図でつかむ

![図01｜ソースから動かすと、コードに意味が生まれる](/assets/codex-reading/day-01.svg)

<ruby>取得<rt>しゅとく</rt></ruby> → ビルド → <ruby>起動<rt>きどう</rt></ruby> → <ruby>観察<rt>かんさつ</rt></ruby>。<ruby>観察<rt>かんさつ</rt></ruby>した<ruby>言葉<rt>ことば</rt></ruby>が、<ruby>次<rt>つぎ</rt></ruby>に<ruby>検索<rt>けんさく</rt></ruby>するキーワードになる。

## 02｜3つのポイントで理解する

### 1. ビルドは、ソースを実行できる形に変えること

Rust の crate はコンパイルの<ruby>単位<rt>たんい</rt></ruby>、package は Cargo.toml で<ruby>管理<rt>かんり</rt></ruby>する<ruby>単位<rt>たんい</rt></ruby>、workspace は<ruby>複数<rt>ふくすう</rt></ruby>の package をまとめる<ruby>単位<rt>たんい</rt></ruby>です。codex-rs は workspace なので、<ruby>最初<rt>さいしょ</rt></ruby>は CLI の package と binary を<ruby>指定<rt>してい</rt></ruby>して<ruby>作<rt>つく</rt></ruby>ります。<ruby>全<rt>ぜん</rt></ruby> crate の<ruby>役割<rt>やくわり</rt></ruby>を<ruby>暗記<rt>あんき</rt></ruby>する<ruby>必要<rt>ひつよう</rt></ruby>はありません。

### 2. 自作した実行ファイルを、パスで指定する

<ruby>単<rt>たん</rt></ruby>に codex と<ruby>入力<rt>にゅうりょく</rt></ruby>すると、PATH <ruby>上<rt>うえ</rt></ruby>のインストール<ruby>済<rt>す</rt></ruby>み<ruby>版<rt>はん</rt></ruby>が<ruby>動<rt>うご</rt></ruby>く<ruby>可能性<rt>かのうせい</rt></ruby>があります。<ruby>通常<rt>つうじょう</rt></ruby>の<ruby>出力先<rt>しゅつりょくさき</rt></ruby>なら codex-rs で ./target/debug/codex を<ruby>実行<rt>じっこう</rt></ruby>します。CARGO_TARGET_DIR などで<ruby>出力先<rt>しゅつりょくさき</rt></ruby>を<ruby>変<rt>か</rt></ruby>えている<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>実際<rt>じっさい</rt></ruby>の<ruby>生成<rt>せいせい</rt></ruby><ruby>先<rt>さき</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>します。

### 3. プログラム・状態・サービスを分ける

ビルドしてできるのはクライアントです。<ruby>同<rt>おな</rt></ruby>じユーザー<ruby>設定<rt>せってい</rt></ruby>を<ruby>使<rt>つか</rt></ruby>えば、<ruby>以前<rt>いぜん</rt></ruby>の<ruby>認証<rt>にんしょう</rt></ruby><ruby>状態<rt>じょうたい</rt></ruby>を<ruby>参照<rt>さんしょう</rt></ruby>することがあります。モデル<ruby>自体<rt>じたい</rt></ruby>をローカルで<ruby>作<rt>つく</rt></ruby>ったわけではなく、<ruby>同<rt>おな</rt></ruby>じアカウントなら<ruby>利用<rt>りよう</rt></ruby><ruby>枠<rt>わく</rt></ruby>も<ruby>別<rt>べつ</rt></ruby>にはなりません。<ruby>初回<rt>しょかい</rt></ruby>ビルドの<ruby>時間<rt>じかん</rt></ruby>は<ruby>依存関係<rt>いぞんかんけい</rt></ruby>や<ruby>環境<rt>かんきょう</rt></ruby>で<ruby>変<rt>か</rt></ruby>わります。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p><ruby>起動<rt>きどう</rt></ruby>できたことと、ファイル<ruby>編集<rt>へんしゅう</rt></ruby>や<ruby>会話<rt>かいわ</rt></ruby>の<ruby>再開<rt>さいかい</rt></ruby>が<ruby>正<rt>ただ</rt></ruby>しく<ruby>動<rt>うご</rt></ruby>くことは<ruby>別々<rt>べつべつ</rt></ruby>に<ruby>確<rt>たし</rt></ruby>かめます。<ruby>原稿<rt>げんこう</rt></ruby>にある<ruby>約<rt>やく</rt></ruby>10<ruby>分<rt>ふん</rt></ruby>という<ruby>初回<rt>しょかい</rt></ruby>ビルド<ruby>時間<rt>じかん</rt></ruby>は、<ruby>当時<rt>とうじ</rt></ruby>の M1 / 16GB <ruby>環境<rt>かんきょう</rt></ruby>での<ruby>観察<rt>かんさつ</rt></ruby><ruby>値<rt>あたい</rt></ruby>です。</p></aside>

## 03｜ソースで確かめる

<ruby>新<rt>あたら</rt></ruby>しく<ruby>取得<rt>しゅとく</rt></ruby>する<ruby>場合<rt>ばあい</rt></ruby>の<ruby>例<rt>れい</rt></ruby>です。Rust などの<ruby>前提<rt>ぜんてい</rt></ruby>はリポジトリのビルド<ruby>手順<rt>てじゅん</rt></ruby>で<ruby>確認<rt>かくにん</rt></ruby>してください。<ruby>既<rt>すで</rt></ruby>に<ruby>取得<rt>しゅとく</rt></ruby><ruby>済<rt>す</rt></ruby>みなら clone は<ruby>不要<rt>ふよう</rt></ruby>です。

```bash
git clone https://github.com/openai/codex.git
cd codex/codex-rs
cargo build -p codex-cli --bin codex
./target/debug/codex
# 認証状態を確認する場合
./target/debug/codex login status
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/cli/src/main.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/cli/src/main.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

ビルド<ruby>後<rt>のち</rt></ruby>に「<ruby>現在<rt>げんざい</rt></ruby>のディレクトリと git status を<ruby>確認<rt>かくにん</rt></ruby>してください」と<ruby>依頼<rt>いらい</rt></ruby>し、<ruby>実行<rt>じっこう</rt></ruby>したコマンドと<ruby>返<rt>かえ</rt></ruby>ってきた<ruby>結果<rt>けっか</rt></ruby>を<ruby>見比<rt>みくら</rt></ruby>べます。<ruby>次<rt>つぎ</rt></ruby>に<ruby>同<rt>おな</rt></ruby>じ<ruby>語<rt>ご</rt></ruby>を rg で<ruby>検索<rt>けんさく</rt></ruby>してください。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>動作<rt>どうさ</rt></ruby> → <ruby>検索<rt>けんさく</rt></ruby> → ソースの<ruby>順<rt>じゅん</rt></ruby>に<ruby>読<rt>よ</rt></ruby>む。**
- **workspace・package・crate を<ruby>区別<rt>くべつ</rt></ruby>する。**
- **<ruby>実行<rt>じっこう</rt></ruby>ファイルと<ruby>認証<rt>にんしょう</rt></ruby>・<ruby>履歴<rt>りれき</rt></ruby>は<ruby>別<rt>べつ</rt></ruby>のもの。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
