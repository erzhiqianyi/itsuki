---
lang: "ja"
title: "Day 05｜Session・Task・Turn — 状態の寿命を見分ける"
summary: "長く持つ状態と、一回の処理で使う状態を分けて読む。"
date: "2026-08-29"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-05.svg"
codexReadingDay: 5
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>長<rt>なが</rt></ruby>く<ruby>持<rt>も</rt></ruby>つ<ruby>状態<rt>じょうたい</rt></ruby>と、<ruby>一回<rt>いっかい</rt></ruby>の<ruby>処理<rt>しょり</rt></ruby>で<ruby>使<rt>つか</rt></ruby>う<ruby>状態<rt>じょうたい</rt></ruby>を<ruby>分<rt>わ</rt></ruby>けて<ruby>読<rt>よ</rt></ruby>む。</p></div>

<ruby>会話<rt>かいわ</rt></ruby>を<ruby>続<rt>つづ</rt></ruby>けても<ruby>残<rt>のこ</rt></ruby>る<ruby>情報<rt>じょうほう</rt></ruby>と、<ruby>今回<rt>こんかい</rt></ruby>の<ruby>実行<rt>じっこう</rt></ruby>だけで<ruby>必要<rt>ひつよう</rt></ruby>な<ruby>情報<rt>じょうほう</rt></ruby>があります。<ruby>名前<rt>なまえ</rt></ruby>を<ruby>丸暗記<rt>まるあんき</rt></ruby>するより、「いつ<ruby>作<rt>つく</rt></ruby>られ、<ruby>誰<rt>だれ</rt></ruby>が<ruby>持<rt>も</rt></ruby>ち、いつ<ruby>終<rt>お</rt></ruby>わるか」の<ruby>三点<rt>さんてん</rt></ruby>で<ruby>整理<rt>せいり</rt></ruby>すると、Session と Turn の<ruby>関係<rt>かんけい</rt></ruby>が<ruby>見<rt>み</rt></ruby>えてきます。

## 01｜図でつかむ

![図05｜Session・Task・Turn](/assets/codex-reading/day-05.svg)

<ruby>寿命<rt>じゅみょう</rt></ruby>と<ruby>役割<rt>やくわり</rt></ruby>の<ruby>整理<rt>せいり</rt></ruby><ruby>図<rt>ず</rt></ruby>。<ruby>箱<rt>はこ</rt></ruby>が<ruby>必<rt>かなら</rt></ruby>ず<ruby>単純<rt>たんじゅん</rt></ruby>な<ruby>所有<rt>しょゆう</rt></ruby><ruby>関係<rt>かんけい</rt></ruby>にある、という<ruby>意味<rt>いみ</rt></ruby>ではない。

## 02｜3つのポイントで理解する

### 1. Session は継続の土台

Session <ruby>周辺<rt>しゅうへん</rt></ruby>には<ruby>履歴<rt>りれき</rt></ruby>や<ruby>進行中<rt>しんこうちゅう</rt></ruby>の<ruby>処理<rt>しょり</rt></ruby>など、<ruby>会話<rt>かいわ</rt></ruby>を<ruby>継続<rt>けいぞく</rt></ruby>するための<ruby>情報<rt>じょうほう</rt></ruby>が<ruby>集<rt>あつ</rt></ruby>まります。<ruby>次<rt>つぎ</rt></ruby>の<ruby>入力<rt>にゅうりょく</rt></ruby>でも<ruby>使<rt>つか</rt></ruby>う<ruby>状態<rt>じょうたい</rt></ruby>が、どこに<ruby>保持<rt>ほじ</rt></ruby>されるかを<ruby>確認<rt>かくにん</rt></ruby>します。

### 2. Task は実行を担う抽象化

SessionTask や RegularTask を<ruby>読<rt>よ</rt></ruby>むと、<ruby>通常<rt>つうじょう</rt></ruby>の<ruby>会話<rt>かいわ</rt></ruby><ruby>処理<rt>しょり</rt></ruby>などをどの<ruby>共通<rt>きょうつう</rt></ruby>の<ruby>仕組<rt>しく</rt></ruby>みで<ruby>動<rt>うご</rt></ruby>かすかが<ruby>分<rt>わ</rt></ruby>かります。UI <ruby>上<rt>うえ</rt></ruby>の「タスク」という<ruby>呼び名<rt>よびな</rt></ruby>と、Rust の Task <ruby>型<rt>かた</rt></ruby>は<ruby>区別<rt>くべつ</rt></ruby>します。

### 3. TurnContext は今回の条件を運ぶ

<ruby>今回<rt>こんかい</rt></ruby>の<ruby>処理<rt>しょり</rt></ruby>に<ruby>必要<rt>ひつよう</rt></ruby>な<ruby>設定<rt>せってい</rt></ruby>や<ruby>識別<rt>しきべつ</rt></ruby><ruby>情報<rt>じょうほう</rt></ruby>が、どの<ruby>呼び出<rt>よびだ</rt></ruby>しへ<ruby>渡<rt>わた</rt></ruby>されるかを<ruby>追<rt>お</rt></ruby>います。<ruby>正常終了<rt>せいじょうしゅうりょう</rt></ruby>だけでなくキャンセル<ruby>時<rt>とき</rt></ruby>にも<ruby>着目<rt>ちゃくもく</rt></ruby>すると、<ruby>次<rt>つぎ</rt></ruby>の Turn に<ruby>残<rt>のこ</rt></ruby>してはいけない<ruby>状態<rt>じょうたい</rt></ruby>を<ruby>見<rt>み</rt></ruby>つけやすくなります。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>Session・Task・Turn を、<ruby>必<rt>かなら</rt></ruby>ず<ruby>一対一<rt>いったいいち</rt></ruby>の<ruby>入れ子<rt>いれこ</rt></ruby>になるものと<ruby>決<rt>き</rt></ruby>めつけません。<ruby>所有者<rt>しょゆうしゃ</rt></ruby>と<ruby>生成<rt>せいせい</rt></ruby>・<ruby>破棄<rt>はき</rt></ruby>の<ruby>経路<rt>けいろ</rt></ruby>で<ruby>関係<rt>かんけい</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>します。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "struct Session|RegularTask|TurnContext" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/core/src/tasks/regular.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/core/src/tasks/regular.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>一<rt>ひと</rt></ruby>つの<ruby>状態<rt>じょうたい</rt></ruby>フィールドを<ruby>選<rt>えら</rt></ruby>び、<ruby>生成<rt>せいせい</rt></ruby>、<ruby>参照<rt>さんしょう</rt></ruby>、<ruby>更新<rt>こうしん</rt></ruby>、<ruby>終了時<rt>しゅうりょうじ</rt></ruby>の<ruby>扱<rt>あつか</rt></ruby>いを<ruby>四行<rt>よんぎょう</rt></ruby>で<ruby>書<rt>か</rt></ruby>きます。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>状態<rt>じょうたい</rt></ruby>は<ruby>寿命<rt>じゅみょう</rt></ruby>で<ruby>分類<rt>ぶんるい</rt></ruby>する。**
- **Task は<ruby>実行<rt>じっこう</rt></ruby>の<ruby>仕組<rt>しく</rt></ruby>み、Turn は<ruby>会話<rt>かいわ</rt></ruby><ruby>処理<rt>しょり</rt></ruby>の<ruby>単位<rt>たんい</rt></ruby>。**
- **<ruby>終了<rt>しゅうりょう</rt></ruby>・<ruby>中断後<rt>ちゅうだんご</rt></ruby>に<ruby>何<rt>なに</rt></ruby>が<ruby>残<rt>のこ</rt></ruby>るかを<ruby>見<rt>み</rt></ruby>る。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
