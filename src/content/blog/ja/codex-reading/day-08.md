---
lang: "ja"
title: "Day 08｜Context と History — 保存した情報と渡す情報"
summary: "保持している履歴を、モデルが受け取れる形に整えて送る。"
date: "2026-09-01"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-08.svg"
codexReadingDay: 8
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>保持<rt>ほじ</rt></ruby>している<ruby>履歴<rt>りれき</rt></ruby>を、モデルが<ruby>受け取<rt>うけと</rt></ruby>れる<ruby>形<rt>かたち</rt></ruby>に<ruby>整<rt>ととの</rt></ruby>えて<ruby>送<rt>おく</rt></ruby>る。</p></div>

<ruby>会話<rt>かいわ</rt></ruby><ruby>画面<rt>がめん</rt></ruby>に<ruby>見<rt>み</rt></ruby>えているもの、<ruby>内部<rt>ないぶ</rt></ruby>に<ruby>保持<rt>ほじ</rt></ruby>している<ruby>履歴<rt>りれき</rt></ruby>、<ruby>次<rt>つぎ</rt></ruby>のモデル<ruby>要求<rt>ようきゅう</rt></ruby>に<ruby>含<rt>ふく</rt></ruby>めるもの。この<ruby>三<rt>みっ</rt></ruby>つは<ruby>必<rt>かなら</rt></ruby>ずしも<ruby>同<rt>おな</rt></ruby>じではありません。<ruby>履歴<rt>りれき</rt></ruby>の<ruby>記録<rt>きろく</rt></ruby>から Prompt の<ruby>生成<rt>せいせい</rt></ruby>までを<ruby>追<rt>お</rt></ruby>って<ruby>違<rt>ちが</rt></ruby>いを<ruby>確<rt>たし</rt></ruby>かめます。

## 01｜図でつかむ

![図08｜Context と History](/assets/codex-reading/day-08.svg)

<ruby>履歴<rt>りれき</rt></ruby>はそのまま<ruby>全部<rt>ぜんぶ</rt></ruby><ruby>送<rt>おく</rt></ruby>るとは<ruby>限<rt>かぎ</rt></ruby>らない。<ruby>送信前<rt>そうしんまえ</rt></ruby>に<ruby>整合性<rt>せいごうせい</rt></ruby>や<ruby>対応<rt>たいおう</rt></ruby><ruby>形式<rt>けいしき</rt></ruby>を<ruby>調整<rt>ちょうせい</rt></ruby>する。

## 02｜3つのポイントで理解する

### 1. まず何を記録するか

ContextManager の record_items <ruby>周辺<rt>しゅうへん</rt></ruby>から、メッセージやツール<ruby>結果<rt>けっか</rt></ruby>がどの<ruby>単位<rt>たんい</rt></ruby>で<ruby>加<rt>くわ</rt></ruby>わるかを<ruby>見<rt>み</rt></ruby>ます。<ruby>表示用<rt>ひょうじよう</rt></ruby>の<ruby>文字列<rt>もじれつ</rt></ruby>だけを<ruby>保存<rt>ほぞん</rt></ruby>している、と<ruby>決<rt>き</rt></ruby>めつけないことが<ruby>出発点<rt>しゅっぱつてん</rt></ruby>です。

### 2. for_prompt の前後を比べる

<ruby>確認<rt>かくにん</rt></ruby>した<ruby>実装<rt>じっそう</rt></ruby>では for_prompt が<ruby>正規化<rt>せいきか</rt></ruby>を<ruby>経<rt>へ</rt></ruby>て ResponseItem の<ruby>列<rt>れつ</rt></ruby>を<ruby>返<rt>かえ</rt></ruby>します。<ruby>内部<rt>ないぶ</rt></ruby>メタデータを<ruby>保<rt>たも</rt></ruby>つ<ruby>処理<rt>しょり</rt></ruby>とモデルへ<ruby>渡<rt>わた</rt></ruby>す<ruby>内容<rt>ないよう</rt></ruby>を<ruby>取り出<rt>とりだ</rt></ruby>す<ruby>処理<rt>しょり</rt></ruby>を<ruby>区別<rt>くべつ</rt></ruby>します。

### 3. モデルの対応形式も条件になる

<ruby>正規化<rt>せいきか</rt></ruby>には<ruby>入力<rt>にゅうりょく</rt></ruby>モダリティの<ruby>情報<rt>じょうほう</rt></ruby>が<ruby>関<rt>かか</rt></ruby>わり、<ruby>非対応<rt>ひたいおう</rt></ruby>の<ruby>画像<rt>がぞう</rt></ruby>・<ruby>音声<rt>おんせい</rt></ruby>などを<ruby>調整<rt>ちょうせい</rt></ruby>する<ruby>経路<rt>けいろ</rt></ruby>があります。<ruby>記録<rt>きろく</rt></ruby>されたものが<ruby>送信<rt>そうしん</rt></ruby>されない<ruby>場合<rt>ばあい</rt></ruby>、<ruby>単<rt>たん</rt></ruby>なる<ruby>履歴<rt>りれき</rt></ruby><ruby>消失<rt>しょうしつ</rt></ruby>とは<ruby>限<rt>かぎ</rt></ruby>りません。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p><ruby>画面<rt>がめん</rt></ruby>の<ruby>会話<rt>かいわ</rt></ruby><ruby>履歴<rt>りれき</rt></ruby>だけを<ruby>見<rt>み</rt></ruby>て、モデルにも<ruby>同<rt>おな</rt></ruby>じ<ruby>内容<rt>ないよう</rt></ruby>がすべて<ruby>渡<rt>わた</rt></ruby>ったと<ruby>判断<rt>はんだん</rt></ruby>しません。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "for_prompt|normalize_history" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/core/src/context_manager/history.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/core/src/context_manager/history.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

for_prompt と normalize_history を<ruby>読<rt>よ</rt></ruby>み、<ruby>入力<rt>にゅうりょく</rt></ruby>と<ruby>出力<rt>しゅつりょく</rt></ruby>で<ruby>変<rt>か</rt></ruby>わり<ruby>得<rt>え</rt></ruby>る<ruby>項目<rt>こうもく</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つ<ruby>見<rt>み</rt></ruby>つけます。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>表示<rt>ひょうじ</rt></ruby>・<ruby>保持<rt>ほじ</rt></ruby>・<ruby>送信<rt>そうしん</rt></ruby>は<ruby>別<rt>べつ</rt></ruby>の<ruby>層<rt>そう</rt></ruby>。**
- **for_prompt で<ruby>送信用<rt>そうしんよう</rt></ruby>の<ruby>履歴<rt>りれき</rt></ruby>を<ruby>作<rt>つく</rt></ruby>る。**
- **モデルの<ruby>対応<rt>たいおう</rt></ruby><ruby>形式<rt>けいしき</rt></ruby>も<ruby>正規化<rt>せいきか</rt></ruby>に<ruby>影響<rt>えいきょう</rt></ruby>する。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
