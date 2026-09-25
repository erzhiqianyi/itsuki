---
lang: "ja"
title: "Day 20｜Issue から読む — 成功時と失敗時の差を探す"
summary: "同じ処理の成功経路と失敗経路を比べると、回復処理の抜けが見える。"
date: "2026-09-13"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-20.svg"
codexReadingDay: 20
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>同<rt>おな</rt></ruby>じ<ruby>処理<rt>しょり</rt></ruby>の<ruby>成功<rt>せいこう</rt></ruby><ruby>経路<rt>けいろ</rt></ruby>と<ruby>失敗<rt>しっぱい</rt></ruby><ruby>経路<rt>けいろ</rt></ruby>を<ruby>比<rt>くら</rt></ruby>べると、<ruby>回復<rt>かいふく</rt></ruby><ruby>処理<rt>しょり</rt></ruby>の<ruby>抜<rt>ぬ</rt></ruby>けが<ruby>見<rt>み</rt></ruby>える。</p></div>

<ruby>原稿<rt>げんこう</rt></ruby>は Issue #37974 を<ruby>題材<rt>だいざい</rt></ruby>に、プロンプト<ruby>編集<rt>へんしゅう</rt></ruby>の<ruby>分岐<rt>ぶんき</rt></ruby><ruby>処理<rt>しょり</rt></ruby>が<ruby>失敗<rt>しっぱい</rt></ruby>したあと、<ruby>待機中<rt>たいきちゅう</rt></ruby>の<ruby>入力<rt>にゅうりょく</rt></ruby>が<ruby>進<rt>すす</rt></ruby>まなくなる<ruby>報告<rt>ほうこく</rt></ruby>を<ruby>調<rt>しら</rt></ruby>べています。ここでは<ruby>報告<rt>ほうこく</rt></ruby>の<ruby>内容<rt>ないよう</rt></ruby>を<ruby>再現<rt>さいげん</rt></ruby><ruby>確認済<rt>かくにんずみ</rt></ruby>みの<ruby>結論<rt>けつろん</rt></ruby>と<ruby>混同<rt>こんどう</rt></ruby>せず、<ruby>原因<rt>げんいん</rt></ruby><ruby>候補<rt>こうほ</rt></ruby>を<ruby>絞<rt>しぼ</rt></ruby>る<ruby>手順<rt>てじゅん</rt></ruby>を<ruby>学<rt>まな</rt></ruby>びます。

## 01｜図でつかむ

![図20｜Issue から読む](/assets/codex-reading/day-20.svg)

<ruby>症状<rt>しょうじょう</rt></ruby> → エラー<ruby>文<rt>ぶん</rt></ruby> → <ruby>分岐<rt>ぶんき</rt></ruby>の<ruby>比較<rt>ひかく</rt></ruby> → <ruby>仮説<rt>かせつ</rt></ruby>。<ruby>修正<rt>しゅうせい</rt></ruby>の<ruby>前<rt>まえ</rt></ruby>に<ruby>再現<rt>さいげん</rt></ruby><ruby>条件<rt>じょうけん</rt></ruby>を<ruby>確<rt>たし</rt></ruby>かめる。

## 02｜3つのポイントで理解する

### 1. 利用者が見た文字から探す

<ruby>報告<rt>ほうこく</rt></ruby>のエラー<ruby>文<rt>ぶん</rt></ruby>を<ruby>完全<rt>かんぜん</rt></ruby><ruby>一致<rt>いっち</rt></ruby>で<ruby>検索<rt>けんさく</rt></ruby>すると、<ruby>表示<rt>ひょうじ</rt></ruby>する<ruby>場所<rt>ばしょ</rt></ruby>を<ruby>絞<rt>しぼ</rt></ruby>れます。そこから<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>へ<ruby>戻<rt>もど</rt></ruby>り、どの<ruby>操作<rt>そうさ</rt></ruby>が<ruby>失敗<rt>しっぱい</rt></ruby><ruby>経路<rt>けいろ</rt></ruby>へ<ruby>到達<rt>とうたつ</rt></ruby>するかを<ruby>調<rt>しら</rt></ruby>べます。

### 2. 復元する状態を比べる

<ruby>成功<rt>せいこう</rt></ruby><ruby>時<rt>とき</rt></ruby>と<ruby>失敗時<rt>しっぱいじ</rt></ruby>で、<ruby>入力<rt>にゅうりょく</rt></ruby><ruby>欄<rt>らん</rt></ruby>やキューに<ruby>対<rt>たい</rt></ruby>する<ruby>処理<rt>しょり</rt></ruby>を<ruby>比<rt>くら</rt></ruby>べます。<ruby>見た目<rt>みため</rt></ruby>が Ready に<ruby>戻<rt>もど</rt></ruby>っても、<ruby>待機<rt>たいき</rt></ruby><ruby>入力<rt>にゅうりょく</rt></ruby>を<ruby>再<rt>ふたた</rt></ruby>び<ruby>送り出<rt>おくりだ</rt></ruby>すきっかけが<ruby>残<rt>のこ</rt></ruby>っているとは<ruby>限<rt>かぎ</rt></ruby>りません。

### 3. 候補をテスト可能な言葉にする

「<ruby>回復後<rt>かいふくご</rt></ruby>、<ruby>送信<rt>そうしん</rt></ruby><ruby>可能<rt>かのう</rt></ruby>な<ruby>待機<rt>たいき</rt></ruby><ruby>入力<rt>にゅうりょく</rt></ruby>が<ruby>次<rt>つぎ</rt></ruby>の<ruby>処理<rt>しょり</rt></ruby>へ<ruby>渡<rt>わた</rt></ruby>る」という<ruby>観察<rt>かんさつ</rt></ruby><ruby>可能<rt>かのう</rt></ruby>な<ruby>期待<rt>きたい</rt></ruby>へ<ruby>落<rt>お</rt></ruby>とします。<ruby>報告<rt>ほうこく</rt></ruby>の<ruby>提案<rt>ていあん</rt></ruby>をそのまま<ruby>正解<rt>せいかい</rt></ruby>とせず、<ruby>送信<rt>そうしん</rt></ruby>を<ruby>止<rt>と</rt></ruby>める<ruby>別条<rt>べつじょう</rt></ruby><ruby>件<rt>けん</rt></ruby>も<ruby>確認<rt>かくにん</rt></ruby>します。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p><ruby>失敗<rt>しっぱい</rt></ruby><ruby>関数<rt>かんすう</rt></ruby>の<ruby>中<rt>なか</rt></ruby>に<ruby>呼び出<rt>よびだ</rt></ruby>しがないという<ruby>事実<rt>じじつ</rt></ruby>だけでは、<ruby>実際<rt>じっさい</rt></ruby>の<ruby>停止<rt>ていし</rt></ruby>を<ruby>証明<rt>しょうめい</rt></ruby>できません。<ruby>別<rt>べつ</rt></ruby>のイベントが<ruby>後<rt>あと</rt></ruby>からキューを<ruby>動<rt>うご</rt></ruby>かす<ruby>可能性<rt>かのうせい</rt></ruby>も<ruby>調<rt>しら</rt></ruby>べます。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "restore_backtrack_prompt_after_branch_error|maybe_send_next_queued_input" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/tui/src/app_backtrack.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/tui/src/app_backtrack.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

restore_backtrack_prompt_after_branch_error と maybe_send_next_queued_input の<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>並<rt>なら</rt></ruby>べ、<ruby>状態<rt>じょうたい</rt></ruby>の<ruby>復元<rt>ふくげん</rt></ruby>と<ruby>再送信<rt>さいそうしん</rt></ruby>の<ruby>違<rt>ちが</rt></ruby>いを<ruby>説明<rt>せつめい</rt></ruby>します。

## 04｜30秒で復習

<div class="codex-recap">

- **エラー<ruby>表示<rt>ひょうじ</rt></ruby>を<ruby>検索<rt>けんさく</rt></ruby>の<ruby>入口<rt>いりぐち</rt></ruby>にする。**
- **<ruby>成功<rt>せいこう</rt></ruby>と<ruby>失敗<rt>しっぱい</rt></ruby>で<ruby>回復<rt>かいふく</rt></ruby><ruby>処理<rt>しょり</rt></ruby>を<ruby>比較<rt>ひかく</rt></ruby>する。**
- **<ruby>原因<rt>げんいん</rt></ruby><ruby>候補<rt>こうほ</rt></ruby>は<ruby>振<rt>ふ</rt></ruby>る<ruby>舞<rt>ま</rt></ruby>いのテストで<ruby>確<rt>たし</rt></ruby>かめる。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
