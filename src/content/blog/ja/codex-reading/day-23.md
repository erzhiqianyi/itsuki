---
lang: "ja"
title: "Day 23｜回帰テスト — 関数名より、利用者に届く結果を守る"
summary: "バグの症状が再発したら失敗するテストを、適切な境界に置く。"
date: "2026-09-16"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-23.svg"
codexReadingDay: 23
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p>バグの<ruby>症状<rt>しょうじょう</rt></ruby>が<ruby>再発<rt>さいはつ</rt></ruby>したら<ruby>失敗<rt>しっぱい</rt></ruby>するテストを、<ruby>適切<rt>てきせつ</rt></ruby>な<ruby>境界<rt>きょうかい</rt></ruby>に<ruby>置<rt>お</rt></ruby>く。</p></div>

「ある<ruby>関数<rt>かんすう</rt></ruby>が<ruby>呼<rt>よ</rt></ruby>ばれた」だけを<ruby>確<rt>たし</rt></ruby>かめるテストは、コードの<ruby>整理<rt>せいり</rt></ruby>で<ruby>壊<rt>こわ</rt></ruby>れやすくなります。<ruby>待機<rt>たいき</rt></ruby><ruby>入力<rt>にゅうりょく</rt></ruby>の<ruby>問題<rt>もんだい</rt></ruby>なら、その<ruby>入力<rt>にゅうりょく</rt></ruby>が<ruby>次<rt>つぎ</rt></ruby>の<ruby>処理<rt>しょり</rt></ruby>へ<ruby>渡<rt>わた</rt></ruby>ったかという<ruby>結果<rt>けっか</rt></ruby>を<ruby>捉<rt>とら</rt></ruby>えるほうが、<ruby>守<rt>まも</rt></ruby>りたい<ruby>意味<rt>いみ</rt></ruby>が<ruby>明確<rt>めいかく</rt></ruby>になります。

## 01｜図でつかむ

![図23｜回帰テスト](/assets/codex-reading/day-23.svg)

<ruby>同<rt>おな</rt></ruby>じテストが<ruby>修正前<rt>しゅうせいまえ</rt></ruby>に<ruby>失敗<rt>しっぱい</rt></ruby>し、<ruby>修正後<rt>しゅうせいご</rt></ruby>に<ruby>通<rt>とお</rt></ruby>ることを<ruby>確<rt>たし</rt></ruby>かめる。

## 02｜3つのポイントで理解する

### 1. テストの境界を決める

<ruby>入力<rt>にゅうりょく</rt></ruby><ruby>欄<rt>らん</rt></ruby>の<ruby>見た目<rt>みため</rt></ruby>を<ruby>守<rt>まも</rt></ruby>りたいのか、Core へ<ruby>送<rt>おく</rt></ruby>る<ruby>操作<rt>そうさ</rt></ruby>を<ruby>守<rt>まも</rt></ruby>りたいのかを<ruby>明確<rt>めいかく</rt></ruby>にします。キューの<ruby>進行<rt>しんこう</rt></ruby>が<ruby>問題<rt>もんだい</rt></ruby>なら、<ruby>次<rt>つぎ</rt></ruby>の<ruby>要求<rt>ようきゅう</rt></ruby>が<ruby>観察<rt>かんさつ</rt></ruby>できる<ruby>境界<rt>きょうかい</rt></ruby>を<ruby>選<rt>えら</rt></ruby>びます。

### 2. Arrange を最小にする

<ruby>必要<rt>ひつよう</rt></ruby>な<ruby>待機<rt>たいき</rt></ruby><ruby>入力<rt>にゅうりょく</rt></ruby>や<ruby>失敗<rt>しっぱい</rt></ruby><ruby>条件<rt>じょうけん</rt></ruby>だけを<ruby>用意<rt>ようい</rt></ruby>します。<ruby>内部<rt>ないぶ</rt></ruby>フィールドを<ruby>大量<rt>たいりょう</rt></ruby>に<ruby>直接<rt>ちょくせつ</rt></ruby><ruby>書き換<rt>かきか</rt></ruby>えると、<ruby>現実<rt>げんじつ</rt></ruby>の<ruby>操作<rt>そうさ</rt></ruby>ではできない<ruby>状態<rt>じょうたい</rt></ruby>を<ruby>作<rt>つく</rt></ruby>る<ruby>危険<rt>きけん</rt></ruby>が<ruby>増<rt>ふ</rt></ruby>えます。

### 3. 結果と副作用を検証する

<ruby>期待<rt>きたい</rt></ruby>する<ruby>入力<rt>にゅうりょく</rt></ruby>が<ruby>送<rt>おく</rt></ruby>られたことに<ruby>加<rt>くわ</rt></ruby>え、<ruby>二重<rt>にじゅう</rt></ruby><ruby>送信<rt>そうしん</rt></ruby>や<ruby>順序<rt>じゅんじょ</rt></ruby>の<ruby>崩<rt>くず</rt></ruby>れがないかを<ruby>確認<rt>かくにん</rt></ruby>します。<ruby>無関係<rt>むかんけい</rt></ruby>な<ruby>描画<rt>びょうが</rt></ruby><ruby>文字列<rt>もじれつ</rt></ruby>に<ruby>依存<rt>いぞん</rt></ruby>しすぎないよう、<ruby>守<rt>まも</rt></ruby>る<ruby>契約<rt>けいやく</rt></ruby>を<ruby>絞<rt>しぼ</rt></ruby>ります。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p><ruby>修正後<rt>しゅうせいご</rt></ruby>に<ruby>一回<rt>いっかい</rt></ruby><ruby>通<rt>とお</rt></ruby>っただけでは、バグを<ruby>検出<rt>けんしゅつ</rt></ruby>できるテストか<ruby>分<rt>わ</rt></ruby>かりません。<ruby>修正<rt>しゅうせい</rt></ruby>を<ruby>外<rt>はず</rt></ruby>したときに<ruby>失敗<rt>しっぱい</rt></ruby>する<ruby>理由<rt>りゆう</rt></ruby>も<ruby>確認<rt>かくにん</rt></ruby>します。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "backtrack_branch_failure|next_user_turn_op" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/tui/src/app_backtrack.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/tui/src/app_backtrack.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>原稿<rt>げんこう</rt></ruby>の backtrack の<ruby>例<rt>れい</rt></ruby>を、<ruby>準備<rt>じゅんび</rt></ruby>・<ruby>操作<rt>そうさ</rt></ruby>・<ruby>期待<rt>きたい</rt></ruby><ruby>結果<rt>けっか</rt></ruby>の<ruby>三文<rt>さんぶん</rt></ruby>へ<ruby>書き換<rt>かきか</rt></ruby>えます。テスト<ruby>名<rt>めい</rt></ruby>が<ruby>現在<rt>げんざい</rt></ruby><ruby>存在<rt>そんざい</rt></ruby>するかも<ruby>実行前<rt>じっこうまえ</rt></ruby>に<ruby>検索<rt>けんさく</rt></ruby>します。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>関数<rt>かんすう</rt></ruby>の<ruby>呼び方<rt>よびかた</rt></ruby>より<ruby>観察<rt>かんさつ</rt></ruby><ruby>可能<rt>かのう</rt></ruby>な<ruby>結果<rt>けっか</rt></ruby>を<ruby>守<rt>まも</rt></ruby>る。**
- **<ruby>準備<rt>じゅんび</rt></ruby>する<ruby>状態<rt>じょうたい</rt></ruby>を<ruby>最小<rt>さいしょう</rt></ruby>にする。**
- **RED と GREEN が<ruby>同<rt>おな</rt></ruby>じ<ruby>問題<rt>もんだい</rt></ruby>を<ruby>示<rt>しめ</rt></ruby>すか<ruby>確認<rt>かくにん</rt></ruby>する。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
