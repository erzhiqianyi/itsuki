---
lang: "ja"
title: "Day 25｜再トリアージ — 古い報告を、今の実装で問い直す"
summary: "昔の再現手順・原因仮説・現在守るべき条件を切り離して評価する。"
date: "2026-09-18"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-25.svg"
codexReadingDay: 25
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>昔<rt>むかし</rt></ruby>の<ruby>再現手順<rt>さいげんてじゅん</rt></ruby>・<ruby>原因<rt>げんいん</rt></ruby><ruby>仮説<rt>かせつ</rt></ruby>・<ruby>現在<rt>げんざい</rt></ruby><ruby>守<rt>まも</rt></ruby>るべき<ruby>条件<rt>じょうけん</rt></ruby>を<ruby>切り離<rt>きりはな</rt></ruby>して<ruby>評価<rt>ひょうか</rt></ruby>する。</p></div>

Issue に<ruby>詳<rt>くわ</rt></ruby>しい<ruby>分析<rt>ぶんせき</rt></ruby>があっても、<ruby>時間<rt>じかん</rt></ruby>が<ruby>経<rt>へ</rt></ruby>てば<ruby>実装<rt>じっそう</rt></ruby>は<ruby>変<rt>か</rt></ruby>わります。<ruby>同<rt>おな</rt></ruby>じ<ruby>症状<rt>しょうじょう</rt></ruby>が<ruby>残<rt>のこ</rt></ruby>っているか、<ruby>原因<rt>げんいん</rt></ruby>だけ<ruby>変<rt>か</rt></ruby>わったか、<ruby>再現<rt>さいげん</rt></ruby><ruby>条件<rt>じょうけん</rt></ruby>が<ruby>成立<rt>せいりつ</rt></ruby>しなくなったかを、<ruby>現在<rt>げんざい</rt></ruby>の<ruby>状態遷移<rt>じょうたいせんい</rt></ruby>から<ruby>判断<rt>はんだん</rt></ruby>します。

## 01｜図でつかむ

![図25｜再トリアージ](/assets/codex-reading/day-25.svg)

<ruby>名前<rt>なまえ</rt></ruby>が<ruby>消<rt>き</rt></ruby>えたことだけで、<ruby>問題<rt>もんだい</rt></ruby>が<ruby>解決<rt>かいけつ</rt></ruby>したとは<ruby>言<rt>い</rt></ruby>えない。

## 02｜3つのポイントで理解する

### 1. 古い手順をそのまま実行する前に読む

<ruby>対象<rt>たいしょう</rt></ruby>バージョン、<ruby>必要<rt>ひつよう</rt></ruby>な<ruby>状態<rt>じょうたい</rt></ruby>、<ruby>失敗<rt>しっぱい</rt></ruby>する<ruby>操作<rt>そうさ</rt></ruby>を<ruby>抽出<rt>ちゅうしゅつ</rt></ruby>します。<ruby>存在<rt>そんざい</rt></ruby>しなくなったコマンドや<ruby>処理<rt>しょり</rt></ruby><ruby>名<rt>めい</rt></ruby>があれば、<ruby>現在<rt>げんざい</rt></ruby>の<ruby>操作<rt>そうさ</rt></ruby>へ<ruby>対応付<rt>たいおうづ</rt></ruby>ける<ruby>必要<rt>ひつよう</rt></ruby>があります。

### 2. 変わらず守りたい条件を決める

<ruby>例<rt>たと</rt></ruby>えば「<ruby>送信<rt>そうしん</rt></ruby><ruby>可能<rt>かのう</rt></ruby>な<ruby>待機<rt>たいき</rt></ruby><ruby>入力<rt>にゅうりょく</rt></ruby>が、<ruby>回復後<rt>かいふくご</rt></ruby>に<ruby>取り残<rt>とりのこ</rt></ruby>されない」という<ruby>条件<rt>じょうけん</rt></ruby>は、<ruby>関数名<rt>かんすうめい</rt></ruby>が<ruby>変<rt>か</rt></ruby>わっても<ruby>意味<rt>いみ</rt></ruby>があります。これを invariant として<ruby>現在<rt>げんざい</rt></ruby>の<ruby>経路<rt>けいろ</rt></ruby>を<ruby>読み直<rt>よみなお</rt></ruby>します。

### 3. 結論を証拠に合わせる

<ruby>再現<rt>さいげん</rt></ruby>した、<ruby>手順<rt>てじゅん</rt></ruby>の<ruby>前提<rt>ぜんてい</rt></ruby>が<ruby>成立<rt>せいりつ</rt></ruby>しない、<ruby>別<rt>べつ</rt></ruby>の<ruby>原因<rt>げんいん</rt></ruby><ruby>候補<rt>こうほ</rt></ruby>がある、まだ<ruby>確認<rt>かくにん</rt></ruby>できない、を<ruby>分<rt>わ</rt></ruby>けます。<ruby>再現<rt>さいげん</rt></ruby>しなかった<ruby>一回<rt>いっかい</rt></ruby>だけで、あらゆる<ruby>経路<rt>けいろ</rt></ruby>が<ruby>直<rt>なお</rt></ruby>ったとは<ruby>結論<rt>けつろん</rt></ruby>しません。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>「<ruby>関数<rt>かんすう</rt></ruby>が<ruby>見<rt>み</rt></ruby>つからない」と「<ruby>不具合<rt>ふぐあい</rt></ruby>がなくなった」は<ruby>別<rt>べつ</rt></ruby>の<ruby>情報<rt>じょうほう</rt></ruby>です。<ruby>状態<rt>じょうたい</rt></ruby>と<ruby>利用者<rt>りようしゃ</rt></ruby>の<ruby>操作<rt>そうさ</rt></ruby>に<ruby>戻<rt>もど</rt></ruby>って<ruby>追<rt>お</rt></ruby>います。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "on_task_complete|maybe_send_next_queued_input" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/tui/src/chatwidget/turn_runtime.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/tui/src/chatwidget/turn_runtime.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>古<rt>ふる</rt></ruby>い Issue の<ruby>説明<rt>せつめい</rt></ruby>から<ruby>関数名<rt>かんすうめい</rt></ruby>を<ruby>外<rt>はず</rt></ruby>し、<ruby>利用者<rt>りようしゃ</rt></ruby>が<ruby>観察<rt>かんさつ</rt></ruby>できる<ruby>症状<rt>しょうじょう</rt></ruby>と<ruby>期待<rt>きたい</rt></ruby>だけで<ruby>二<rt>に</rt></ruby><ruby>文<rt>ぶん</rt></ruby>にまとめます。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>症状<rt>しょうじょう</rt></ruby>と<ruby>古<rt>ふる</rt></ruby>い<ruby>原因<rt>げんいん</rt></ruby><ruby>仮説<rt>かせつ</rt></ruby>を<ruby>分<rt>わ</rt></ruby>ける。**
- **<ruby>現在<rt>げんざい</rt></ruby>の<ruby>状態遷移<rt>じょうたいせんい</rt></ruby>で<ruby>条件<rt>じょうけん</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>する。**
- **<ruby>再現<rt>さいげん</rt></ruby><ruby>結果<rt>けっか</rt></ruby>に<ruby>見合<rt>みあ</rt></ruby>う<ruby>結論<rt>けつろん</rt></ruby>を<ruby>出<rt>だ</rt></ruby>す。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
