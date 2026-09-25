---
lang: "ja"
title: "Day 24｜修正の移植 — 同じ一行でも、前提が変わる"
summary: "古い修正を移す前に、状態の所有者と失敗時の保証を読み直す。"
date: "2026-09-17"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-24.svg"
codexReadingDay: 24
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>古<rt>ふる</rt></ruby>い<ruby>修正<rt>しゅうせい</rt></ruby>を<ruby>移<rt>うつ</rt></ruby>す<ruby>前<rt>まえ</rt></ruby>に、<ruby>状態<rt>じょうたい</rt></ruby>の<ruby>所有者<rt>しょゆうしゃ</rt></ruby>と<ruby>失敗時<rt>しっぱいじ</rt></ruby>の<ruby>保証<rt>ほしょう</rt></ruby>を<ruby>読み直<rt>よみなお</rt></ruby>す。</p></div>

<ruby>原稿<rt>げんこう</rt></ruby>では Fork から Revert への<ruby>変更<rt>へんこう</rt></ruby>を<ruby>題材<rt>だいざい</rt></ruby>に、<ruby>以前<rt>いぜん</rt></ruby>の<ruby>一行<rt>いちぎょう</rt></ruby><ruby>修正<rt>しゅうせい</rt></ruby>をそのまま<ruby>移<rt>うつ</rt></ruby>してよいかを<ruby>考<rt>かんが</rt></ruby>えています。<ruby>処理<rt>しょり</rt></ruby><ruby>名<rt>めい</rt></ruby>が<ruby>似<rt>に</rt></ruby>ていても、<ruby>新<rt>あたら</rt></ruby>しい<ruby>会話<rt>かいわ</rt></ruby>を<ruby>作<rt>つく</rt></ruby>る<ruby>操作<rt>そうさ</rt></ruby>と<ruby>既存<rt>きぞん</rt></ruby>の<ruby>履歴<rt>りれき</rt></ruby>を<ruby>変<rt>か</rt></ruby>える<ruby>操作<rt>そうさ</rt></ruby>では、<ruby>守<rt>まも</rt></ruby>るべき<ruby>状態<rt>じょうたい</rt></ruby>が<ruby>異<rt>こと</rt></ruby>なります。

## 01｜図でつかむ

![図24｜修正の移植](/assets/codex-reading/day-24.svg)

<ruby>歴史的<rt>れきしてき</rt></ruby>な<ruby>原稿<rt>げんこう</rt></ruby>の<ruby>設計<rt>せっけい</rt></ruby><ruby>比較<rt>ひかく</rt></ruby>。<ruby>現在<rt>げんざい</rt></ruby>の main が<ruby>必<rt>かなら</rt></ruby>ず<ruby>同<rt>おな</rt></ruby>じ<ruby>移行<rt>いこう</rt></ruby><ruby>状態<rt>じょうたい</rt></ruby>にあるという<ruby>意味<rt>いみ</rt></ruby>ではない。

## 02｜3つのポイントで理解する

### 1. 修正が守っていた条件を書き出す

<ruby>古<rt>ふる</rt></ruby>い<ruby>処理<rt>しょり</rt></ruby>で、<ruby>失敗時<rt>しっぱいじ</rt></ruby>に<ruby>元<rt>もと</rt></ruby>の thread が<ruby>使<rt>つか</rt></ruby>える、キューの<ruby>内容<rt>ないよう</rt></ruby>が<ruby>有効<rt>ゆうこう</rt></ruby>である、といった<ruby>前提<rt>ぜんてい</rt></ruby>が<ruby>何<rt>なん</rt></ruby>だったかを<ruby>明確<rt>めいかく</rt></ruby>にします。コード<ruby>一行<rt>いちぎょう</rt></ruby>ではなく<ruby>前提<rt>ぜんてい</rt></ruby>を<ruby>移植<rt>いしょく</rt></ruby>の<ruby>単位<rt>たんい</rt></ruby>にします。

### 2. 状態変更の位置を比べる

<ruby>新<rt>あたら</rt></ruby>しい<ruby>処理<rt>しょり</rt></ruby>が<ruby>履歴<rt>りれき</rt></ruby>や<ruby>入力<rt>にゅうりょく</rt></ruby>キューをどこで<ruby>変<rt>か</rt></ruby>えるかを<ruby>追<rt>お</rt></ruby>います。<ruby>変更前<rt>へんこうまえ</rt></ruby>の<ruby>失敗<rt>しっぱい</rt></ruby>と、<ruby>一部<rt>いちぶ</rt></ruby>を<ruby>変更<rt>へんこう</rt></ruby>した<ruby>後<rt>のち</rt></ruby>の<ruby>失敗<rt>しっぱい</rt></ruby>では、<ruby>同<rt>おな</rt></ruby>じ<ruby>回復<rt>かいふく</rt></ruby><ruby>処理<rt>しょり</rt></ruby>を<ruby>呼<rt>よ</rt></ruby>べるとは<ruby>限<rt>かぎ</rt></ruby>りません。

### 3. 無効になった入力を送り出さない

<ruby>古<rt>ふる</rt></ruby>い<ruby>会話<rt>かいわ</rt></ruby><ruby>状態<rt>じょうたい</rt></ruby>に<ruby>結<rt>むす</rt></ruby>び<ruby>付<rt>つ</rt></ruby>いた<ruby>待機<rt>たいき</rt></ruby><ruby>入力<rt>にゅうりょく</rt></ruby>を、そのまま<ruby>新<rt>あたら</rt></ruby>しい<ruby>状態<rt>じょうたい</rt></ruby>へ<ruby>送<rt>おく</rt></ruby>ってよいかを<ruby>調<rt>しら</rt></ruby>べます。クリアや<ruby>再構築<rt>さいこうちく</rt></ruby>の<ruby>責務<rt>せきむ</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>し、<ruby>重複<rt>ちょうふく</rt></ruby><ruby>送信<rt>そうしん</rt></ruby>・<ruby>誤<rt>あやま</rt></ruby>った<ruby>文脈<rt>ぶんみゃく</rt></ruby>への<ruby>送信<rt>そうしん</rt></ruby>を<ruby>検討<rt>けんとう</rt></ruby>します。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p><ruby>今回<rt>こんかい</rt></ruby><ruby>確認<rt>かくにん</rt></ruby>したローカル<ruby>版<rt>はん</rt></ruby>には、<ruby>原稿<rt>げんこう</rt></ruby>の RevertSessionForPromptEdit と reset_after_prompt_revert という<ruby>名前<rt>なまえ</rt></ruby>は<ruby>見<rt>み</rt></ruby>つかりません。<ruby>歴史的<rt>れきしてき</rt></ruby>な<ruby>検索語<rt>けんさくご</rt></ruby>として<ruby>扱<rt>あつか</rt></ruby>い、<ruby>現行<rt>げんこう</rt></ruby>の backtrack と thread/revert から<ruby>調<rt>しら</rt></ruby>べ<ruby>直<rt>なお</rt></ruby>します。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "ForkSessionForPromptEdit|thread_revert" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/app-server/src/request_processors/thread_processor.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/app-server/src/request_processors/thread_processor.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>旧<rt>きゅう</rt></ruby><ruby>処理<rt>しょり</rt></ruby>と<ruby>新<rt>しん</rt></ruby><ruby>処理<rt>しょり</rt></ruby>について、<ruby>失敗<rt>しっぱい</rt></ruby><ruby>前<rt>まえ</rt></ruby>に<ruby>変<rt>か</rt></ruby>える<ruby>状態<rt>じょうたい</rt></ruby>、<ruby>失敗<rt>しっぱい</rt></ruby><ruby>後<rt>のち</rt></ruby>に<ruby>残<rt>のこ</rt></ruby>る<ruby>状態<rt>じょうたい</rt></ruby>、<ruby>再開<rt>さいかい</rt></ruby>のきっかけを<ruby>表<rt>ひょう</rt></ruby>にします。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>修正<rt>しゅうせい</rt></ruby>の<ruby>成立条件<rt>せいりつじょうけん</rt></ruby>を<ruby>先<rt>さき</rt></ruby>に<ruby>書<rt>か</rt></ruby>く。**
- **<ruby>状態<rt>じょうたい</rt></ruby><ruby>変更<rt>へんこう</rt></ruby>の<ruby>前後<rt>ぜんご</rt></ruby>で<ruby>失敗<rt>しっぱい</rt></ruby>を<ruby>分<rt>わ</rt></ruby>ける。**
- **<ruby>残<rt>のこ</rt></ruby>った<ruby>入力<rt>にゅうりょく</rt></ruby>が<ruby>今<rt>いま</rt></ruby>も<ruby>有効<rt>ゆうこう</rt></ruby>か<ruby>確<rt>たし</rt></ruby>かめる。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
