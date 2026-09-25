---
lang: "ja"
title: "Day 10｜Tools — 名前付きの要求を、実装へ届ける"
summary: "ツールの説明・登録・振り分け・実行を分けると、呼び出しの道筋が見える。"
date: "2026-09-03"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-10.svg"
codexReadingDay: 10
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p>ツールの<ruby>説明<rt>せつめい</rt></ruby>・<ruby>登録<rt>とうろく</rt></ruby>・<ruby>振り分<rt>ふりわ</rt></ruby>け・<ruby>実行<rt>じっこう</rt></ruby>を<ruby>分<rt>わ</rt></ruby>けると、<ruby>呼び出<rt>よびだ</rt></ruby>しの<ruby>道筋<rt>みちすじ</rt></ruby>が<ruby>見<rt>み</rt></ruby>える。</p></div>

モデルは Rust の<ruby>関数<rt>かんすう</rt></ruby>を<ruby>直接<rt>ちょくせつ</rt></ruby><ruby>呼<rt>よ</rt></ruby>んでいるわけではありません。ツール<ruby>名<rt>めい</rt></ruby>と<ruby>引数<rt>ひきすう</rt></ruby>を<ruby>持<rt>も</rt></ruby>った<ruby>要求<rt>ようきゅう</rt></ruby>を、<ruby>適切<rt>てきせつ</rt></ruby>な<ruby>実装<rt>じっそう</rt></ruby>へ<ruby>渡<rt>わた</rt></ruby>す<ruby>仕組<rt>しく</rt></ruby>みが<ruby>必要<rt>ひつよう</rt></ruby>です。ここではツールの「メニュー」と「<ruby>実行<rt>じっこう</rt></ruby><ruby>係<rt>かかり</rt></ruby>」を<ruby>区別<rt>くべつ</rt></ruby>します。

## 01｜図でつかむ

![図10｜Tools](/assets/codex-reading/day-10.svg)

Registry は<ruby>名前<rt>なまえ</rt></ruby>と<ruby>実装<rt>じっそう</rt></ruby>の<ruby>対応<rt>たいおう</rt></ruby>を<ruby>持<rt>も</rt></ruby>つ。Spec を<ruby>定義<rt>ていぎ</rt></ruby>しただけでは<ruby>実行<rt>じっこう</rt></ruby>できない。

## 02｜3つのポイントで理解する

### 1. ToolSpec は使い方を伝える

<ruby>名前<rt>なまえ</rt></ruby>、<ruby>説明<rt>せつめい</rt></ruby>、<ruby>引数<rt>ひきすう</rt></ruby>の<ruby>構造<rt>こうぞう</rt></ruby>など、モデルがツールを<ruby>選<rt>えら</rt></ruby>ぶための<ruby>情報<rt>じょうほう</rt></ruby>を<ruby>見<rt>み</rt></ruby>ます。<ruby>説明<rt>せつめい</rt></ruby>が<ruby>実装<rt>じっそう</rt></ruby>とずれると、<ruby>正<rt>ただ</rt></ruby>しい<ruby>処理<rt>しょり</rt></ruby>があっても<ruby>適切<rt>てきせつ</rt></ruby>に<ruby>呼<rt>よ</rt></ruby>ばれません。

### 2. Registry と Router を分ける

<ruby>登録<rt>とうろく</rt></ruby>された<ruby>処理<rt>しょり</rt></ruby>の<ruby>一覧<rt>いちらん</rt></ruby>と、<ruby>届<rt>とど</rt></ruby>いた<ruby>呼び出<rt>よびだ</rt></ruby>しを<ruby>振り分<rt>ふりわ</rt></ruby>ける<ruby>役割<rt>やくわり</rt></ruby>を<ruby>分<rt>わ</rt></ruby>けます。<ruby>知<rt>し</rt></ruby>らない<ruby>名前<rt>なまえ</rt></ruby>や<ruby>不正<rt>ふせい</rt></ruby>な<ruby>引数<rt>ひきすう</rt></ruby>が<ruby>来<rt>き</rt></ruby>た<ruby>場合<rt>ばあい</rt></ruby>の<ruby>返<rt>かえ</rt></ruby>し<ruby>方<rt>ほう</rt></ruby>も、<ruby>通常<rt>つうじょう</rt></ruby>のルートと<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>読<rt>よ</rt></ruby>みます。

### 3. Handler の先にも境界がある

Handler は<ruby>呼び出<rt>よびだ</rt></ruby>しを<ruby>具体的<rt>ぐたいてき</rt></ruby>な<ruby>操作<rt>そうさ</rt></ruby>へ<ruby>変換<rt>へんかん</rt></ruby>します。<ruby>実行<rt>じっこう</rt></ruby><ruby>条件<rt>じょうけん</rt></ruby>の<ruby>確認<rt>かくにん</rt></ruby>やランタイム<ruby>処理<rt>しょり</rt></ruby>を<ruby>経<rt>へ</rt></ruby>たあと、<ruby>結果<rt>けっか</rt></ruby>が ToolOutput などの<ruby>形<rt>かたち</rt></ruby>で<ruby>戻<rt>もど</rt></ruby>ります。ツール<ruby>名<rt>めい</rt></ruby>から<ruby>戻り値<rt>もどりち</rt></ruby>までを<ruby>一本<rt>いっぽん</rt></ruby>で<ruby>追<rt>お</rt></ruby>います。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>ツールが<ruby>一覧<rt>いちらん</rt></ruby>に<ruby>見<rt>み</rt></ruby>えることと、<ruby>必要<rt>ひつよう</rt></ruby>な<ruby>認証<rt>にんしょう</rt></ruby>や<ruby>実行環境<rt>じっこうかんきょう</rt></ruby>がそろっていて<ruby>成功<rt>せいこう</rt></ruby>することは<ruby>別<rt>べつ</rt></ruby>です。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "ToolRouter|ToolInvocation|ToolOutput" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/core/src/tools/router.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/core/src/tools/router.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>一<rt>ひと</rt></ruby>つのツールを<ruby>選<rt>えら</rt></ruby>び、<ruby>定義<rt>ていぎ</rt></ruby>、<ruby>登録<rt>とうろく</rt></ruby>、Handler、<ruby>出力<rt>しゅつりょく</rt></ruby>の<ruby>四<rt>し</rt></ruby><ruby>箇所<rt>かしょ</rt></ruby>を<ruby>探<rt>さが</rt></ruby>します。

## 04｜30秒で復習

<div class="codex-recap">

- **Spec は<ruby>説明<rt>せつめい</rt></ruby>、Registry は<ruby>対応表<rt>たいおうひょう</rt></ruby>。**
- **Router が<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>先<rt>さき</rt></ruby>を<ruby>選<rt>えら</rt></ruby>ぶ。**
- **<ruby>成功<rt>せいこう</rt></ruby>と<ruby>失敗<rt>しっぱい</rt></ruby>を<ruby>共通<rt>きょうつう</rt></ruby>の<ruby>出力<rt>しゅつりょく</rt></ruby><ruby>経路<rt>けいろ</rt></ruby>へ<ruby>戻<rt>もど</rt></ruby>す。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
