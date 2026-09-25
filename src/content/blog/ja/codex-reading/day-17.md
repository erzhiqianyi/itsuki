---
lang: "ja"
title: "Day 17｜テスト — 変更した一行を、振る舞いで確かめる"
summary: "変更に近いテストから始め、失敗の意味を確認して検証範囲を広げる。"
date: "2026-09-10"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-17.svg"
codexReadingDay: 17
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>変更<rt>へんこう</rt></ruby>に<ruby>近<rt>ちか</rt></ruby>いテストから<ruby>始<rt>はじ</rt></ruby>め、<ruby>失敗<rt>しっぱい</rt></ruby>の<ruby>意味<rt>いみ</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>して<ruby>検証<rt>けんしょう</rt></ruby><ruby>範囲<rt>はんい</rt></ruby>を<ruby>広<rt>ひろ</rt></ruby>げる。</p></div>

コンパイルが<ruby>通<rt>とお</rt></ruby>っただけでは、<ruby>期待<rt>きたい</rt></ruby>した<ruby>動<rt>うご</rt></ruby>きになったかは<ruby>分<rt>わ</rt></ruby>かりません。<ruby>一方<rt>いっぽう</rt></ruby>、すべてのテストを<ruby>何度<rt>なんど</rt></ruby>も<ruby>回<rt>まわ</rt></ruby>せばよいわけでもありません。<ruby>変更<rt>へんこう</rt></ruby>した<ruby>責務<rt>せきむ</rt></ruby>に<ruby>合<rt>あ</rt></ruby>った<ruby>観察<rt>かんさつ</rt></ruby><ruby>点<rt>てん</rt></ruby>を<ruby>選<rt>えら</rt></ruby>ぶのが<ruby>出発点<rt>しゅっぱつてん</rt></ruby>です。

## 01｜図でつかむ

![図17｜テスト](/assets/codex-reading/day-17.svg)

<ruby>失敗<rt>しっぱい</rt></ruby>は<ruby>調査<rt>ちょうさ</rt></ruby>の<ruby>入口<rt>いりぐち</rt></ruby>。テストの<ruby>数<rt>かず</rt></ruby>より、<ruby>何<rt>なに</rt></ruby>を<ruby>確<rt>たし</rt></ruby>かめたかを<ruby>説明<rt>せつめい</rt></ruby>する。

## 02｜3つのポイントで理解する

### 1. 単体・統合・スナップショットを使い分ける

<ruby>関数<rt>かんすう</rt></ruby>の<ruby>入出力<rt>にゅうしゅつりょく</rt></ruby>、<ruby>部品間<rt>ぶひんかん</rt></ruby>の<ruby>連携<rt>れんけい</rt></ruby>、<ruby>描画<rt>びょうが</rt></ruby><ruby>結果<rt>けっか</rt></ruby>では、<ruby>適<rt>てき</rt></ruby>したテストの<ruby>形<rt>かたち</rt></ruby>が<ruby>違<rt>ちが</rt></ruby>います。<ruby>変更<rt>へんこう</rt></ruby>が<ruby>影響<rt>えいきょう</rt></ruby>する<ruby>境界<rt>きょうかい</rt></ruby>を<ruby>決<rt>き</rt></ruby>めてから、<ruby>近<rt>ちか</rt></ruby>くの<ruby>既存<rt>きぞん</rt></ruby>テストを<ruby>読<rt>よ</rt></ruby>みます。

### 2. 失敗の理由を先に読む

<ruby>実装<rt>じっそう</rt></ruby>の<ruby>不具合<rt>ふぐあい</rt></ruby>なのか、<ruby>期待値<rt>きたいち</rt></ruby>を<ruby>更新<rt>こうしん</rt></ruby>すべき<ruby>仕様変更<rt>しようへんこう</rt></ruby>なのかを<ruby>区別<rt>くべつ</rt></ruby>します。スナップショットの<ruby>差分<rt>さぶん</rt></ruby>は、<ruby>承認<rt>しょうにん</rt></ruby>すれば<ruby>正<rt>ただ</rt></ruby>しくなるわけではありません。<ruby>表示内容<rt>ひょうじないよう</rt></ruby>や<ruby>順序<rt>じゅんじょ</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>します。

### 3. 検証を一段ずつ広げる

<ruby>関連<rt>かんれん</rt></ruby>するテストが<ruby>通<rt>とお</rt></ruby>ったら、<ruby>必要<rt>ひつよう</rt></ruby>に<ruby>応<rt>おう</rt></ruby>じて crate <ruby>単位<rt>たんい</rt></ruby>の<ruby>確認<rt>かくにん</rt></ruby>へ<ruby>進<rt>すす</rt></ruby>みます。<ruby>使用<rt>しよう</rt></ruby>したコマンド、<ruby>対象<rt>たいしょう</rt></ruby><ruby>範囲<rt>はんい</rt></ruby>、<ruby>失敗<rt>しっぱい</rt></ruby>やスキップを<ruby>記録<rt>きろく</rt></ruby>し、<ruby>実際<rt>じっさい</rt></ruby>に<ruby>確<rt>たし</rt></ruby>かめた<ruby>範囲<rt>はんい</rt></ruby>を<ruby>明確<rt>めいかく</rt></ruby>にします。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p><ruby>名前<rt>なまえ</rt></ruby>で<ruby>絞<rt>しぼ</rt></ruby>ったテストが<ruby>存在<rt>そんざい</rt></ruby>せず、0<ruby>件<rt>けん</rt></ruby>のまま<ruby>成功<rt>せいこう</rt></ruby><ruby>終了<rt>しゅうりょう</rt></ruby>する<ruby>場合<rt>ばあい</rt></ruby>があります。<ruby>実行<rt>じっこう</rt></ruby><ruby>件数<rt>けんすう</rt></ruby>も<ruby>必<rt>かなら</rt></ruby>ず<ruby>確認<rt>かくにん</rt></ruby>します。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
just test -p codex-tui
# スナップショットの差分を確認
cargo insta pending-snapshots -p codex-tui
```

テスト<ruby>用<rt>よう</rt></ruby>ツールはリポジトリの<ruby>手順<rt>てじゅん</rt></ruby>に<ruby>従<rt>したが</rt></ruby>って<ruby>用意<rt>ようい</rt></ruby>します。ここに<ruby>載<rt>の</rt></ruby>せたコマンドは<ruby>学習用<rt>がくしゅうよう</rt></ruby>で、この<ruby>編集作業<rt>へんしゅうさぎょう</rt></ruby>で Codex <ruby>本体<rt>ほんたい</rt></ruby>のテストを<ruby>実行<rt>じっこう</rt></ruby>したという<ruby>記録<rt>きろく</rt></ruby>ではありません。

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `justfile` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/justfile)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>変更<rt>へんこう</rt></ruby><ruby>候補<rt>こうほ</rt></ruby>に<ruby>近<rt>ちか</rt></ruby>いテストを<ruby>一<rt>ひと</rt></ruby>つ<ruby>読<rt>よ</rt></ruby>み、Arrange・Act・Assert に<ruby>相当<rt>そうとう</rt></ruby>する<ruby>箇所<rt>かしょ</rt></ruby>へ<ruby>印<rt>しるし</rt></ruby>を<ruby>付<rt>つ</rt></ruby>けます。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>期待<rt>きたい</rt></ruby>する<ruby>振<rt>ふ</rt></ruby>る<ruby>舞<rt>ま</rt></ruby>いからテストを<ruby>選<rt>えら</rt></ruby>ぶ。**
- **スナップショットは<ruby>差分<rt>さぶん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んで<ruby>判断<rt>はんだん</rt></ruby>する。**
- **<ruby>成功<rt>せいこう</rt></ruby>だけでなく<ruby>対象<rt>たいしょう</rt></ruby>と<ruby>実行<rt>じっこう</rt></ruby><ruby>件数<rt>けんすう</rt></ruby>を<ruby>記録<rt>きろく</rt></ruby>する。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
