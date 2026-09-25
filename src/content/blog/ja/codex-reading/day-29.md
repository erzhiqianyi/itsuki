---
lang: "ja"
title: "Day 29｜Protocol の変更 — 型・JSON・意味の3層で見る"
summary: "コンパイル、通信形式、実行時の意味を別々に比べて互換性を判断する。"
date: "2026-09-22"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-29.svg"
codexReadingDay: 29
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p>コンパイル、<ruby>通信<rt>つうしん</rt></ruby><ruby>形式<rt>けいしき</rt></ruby>、<ruby>実行時<rt>じっこうじ</rt></ruby>の<ruby>意味<rt>いみ</rt></ruby>を<ruby>別々<rt>べつべつ</rt></ruby>に<ruby>比<rt>くら</rt></ruby>べて<ruby>互換性<rt>ごかんせい</rt></ruby>を<ruby>判断<rt>はんだん</rt></ruby>する。</p></div>

Rust の<ruby>型<rt>かた</rt></ruby>が<ruby>変<rt>か</rt></ruby>わっても JSON は<ruby>同<rt>おな</rt></ruby>じかもしれません。<ruby>逆<rt>ぎゃく</rt></ruby>に JSON が<ruby>読<rt>よ</rt></ruby>めても、<ruby>操作<rt>そうさ</rt></ruby>の<ruby>意味<rt>いみ</rt></ruby>が<ruby>変<rt>か</rt></ruby>わればクライアントは<ruby>壊<rt>こわ</rt></ruby>れます。<ruby>互換性<rt>ごかんせい</rt></ruby>は<ruby>一<rt>ひと</rt></ruby>つのチェックで<ruby>済<rt>す</rt></ruby>ませず、<ruby>三<rt>みっ</rt></ruby>つの<ruby>層<rt>そう</rt></ruby>で<ruby>見<rt>み</rt></ruby>る<ruby>必要<rt>ひつよう</rt></ruby>があります。

## 01｜図でつかむ

![図29｜Protocol の変更](/assets/codex-reading/day-29.svg)

Source・Wire・Semantic の<ruby>三<rt>みっ</rt></ruby>つを<ruby>別々<rt>べつべつ</rt></ruby>に<ruby>検証<rt>けんしょう</rt></ruby>する。

## 02｜3つのポイントで理解する

### 1. Source compatibility を見る

<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>側<rt>がわ</rt></ruby>が<ruby>再<rt>さい</rt></ruby>コンパイルできるか、<ruby>型名<rt>かためい</rt></ruby>やフィールドの<ruby>変更<rt>へんこう</rt></ruby>がどこへ<ruby>影響<rt>えいきょう</rt></ruby>するかを<ruby>調<rt>しら</rt></ruby>べます。<ruby>内部<rt>ないぶ</rt></ruby>リネームだけなら<ruby>通信上<rt>つうしんじょう</rt></ruby>の<ruby>名前<rt>なまえ</rt></ruby>が<ruby>維持<rt>いじ</rt></ruby>される<ruby>場合<rt>ばあい</rt></ruby>もあります。

### 2. Wire compatibility を見る

serde や<ruby>型<rt>かた</rt></ruby><ruby>生成<rt>せいせい</rt></ruby>の<ruby>設定<rt>せってい</rt></ruby>から、<ruby>実際<rt>じっさい</rt></ruby>の JSON <ruby>名<rt>めい</rt></ruby>・<ruby>必須<rt>ひっす</rt></ruby><ruby>項目<rt>こうもく</rt></ruby>・null の<ruby>扱<rt>あつか</rt></ruby>いを<ruby>確認<rt>かくにん</rt></ruby>します。Rust の before_turn_id が camelCase の beforeTurnId として<ruby>流<rt>なが</rt></ruby>れる、といった<ruby>変換<rt>へんかん</rt></ruby>も<ruby>対象<rt>たいしょう</rt></ruby>です。

### 3. Semantic compatibility を見る

<ruby>同<rt>おな</rt></ruby>じ JSON でも、<ruby>対象<rt>たいしょう</rt></ruby> turn を<ruby>含<rt>ふく</rt></ruby>めるか<ruby>除外<rt>じょがい</rt></ruby>するか、<ruby>返答<rt>へんとう</rt></ruby><ruby>時点<rt>じてん</rt></ruby>で<ruby>何<rt>なに</rt></ruby>が<ruby>完了<rt>かんりょう</rt></ruby>しているかが<ruby>変<rt>か</rt></ruby>われば、<ruby>利用<rt>りよう</rt></ruby><ruby>側<rt>がわ</rt></ruby>の<ruby>期待<rt>きたい</rt></ruby>が<ruby>壊<rt>こわ</rt></ruby>れます。schema の<ruby>差分<rt>さぶん</rt></ruby>に<ruby>出<rt>で</rt></ruby>ない<ruby>意味<rt>いみ</rt></ruby>もテストで<ruby>確認<rt>かくにん</rt></ruby>します。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p><ruby>生成<rt>せいせい</rt></ruby>した TypeScript がコンパイルできるだけでは、<ruby>旧<rt>きゅう</rt></ruby>クライアントとの<ruby>通信<rt>つうしん</rt></ruby>や<ruby>意味<rt>いみ</rt></ruby>の<ruby>互換性<rt>ごかんせい</rt></ruby>までは<ruby>証明<rt>しょうめい</rt></ruby>できません。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "before_turn_id|rename_all" codex-rs
# schema の生成差分も確認する場合
just write-app-server-schema
just test -p codex-app-server-protocol
```

テスト<ruby>用<rt>よう</rt></ruby>ツールはリポジトリの<ruby>手順<rt>てじゅん</rt></ruby>に<ruby>従<rt>したが</rt></ruby>って<ruby>用意<rt>ようい</rt></ruby>します。ここに<ruby>載<rt>の</rt></ruby>せたコマンドは<ruby>学習用<rt>がくしゅうよう</rt></ruby>で、この<ruby>編集作業<rt>へんしゅうさぎょう</rt></ruby>で Codex <ruby>本体<rt>ほんたい</rt></ruby>のテストを<ruby>実行<rt>じっこう</rt></ruby>したという<ruby>記録<rt>きろく</rt></ruby>ではありません。

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/app-server-protocol/src/protocol/v2/thread.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/app-server-protocol/src/protocol/v2/thread.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>一<rt>ひと</rt></ruby>つの API フィールドを<ruby>選<rt>えら</rt></ruby>び、Rust <ruby>名<rt>めい</rt></ruby>、JSON <ruby>名<rt>めい</rt></ruby>、<ruby>実行時<rt>じっこうじ</rt></ruby>の<ruby>意味<rt>いみ</rt></ruby>を<ruby>三<rt>さん</rt></ruby><ruby>列<rt>れつ</rt></ruby>で<ruby>書<rt>か</rt></ruby>きます。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>型<rt>かた</rt></ruby>の<ruby>互換性<rt>ごかんせい</rt></ruby>と<ruby>通信<rt>つうしん</rt></ruby>の<ruby>互換性<rt>ごかんせい</rt></ruby>を<ruby>分<rt>わ</rt></ruby>ける。**
- **serde と<ruby>生成<rt>せいせい</rt></ruby> schema の<ruby>変換<rt>へんかん</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>する。**
- **<ruby>同<rt>おな</rt></ruby>じ<ruby>形式<rt>けいしき</rt></ruby>でも<ruby>意味<rt>いみ</rt></ruby>が<ruby>変<rt>か</rt></ruby>われば<ruby>影響<rt>えいきょう</rt></ruby>がある。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
