---
lang: ja
title: "図解で読む Codex｜はじめに・全30章の読み方"
summary: "Coding Agent はどう作られているのか。ソースのビルドから Agent Loop、ツール、状態管理、テストまでをたどる全30章の総合案内。目的に合わせた読み順と各章への入口をまとめました。"
date: "2026-09-25"
category: codex
tags: [Codex, ソースコードリーディング, 図解]
coverImage: ""
pinnedInCategory: true
---

「コードを<ruby>書<rt>か</rt></ruby>いて」と<ruby>頼<rt>たの</rt></ruby>むと、ファイルを<ruby>読<rt>よ</rt></ruby>み、コマンドを<ruby>実行<rt>じっこう</rt></ruby>し、<ruby>結果<rt>けっか</rt></ruby>を<ruby>確<rt>たし</rt></ruby>かめてから<ruby>返答<rt>へんとう</rt></ruby>する。その<ruby>一連<rt>いちれん</rt></ruby>の<ruby>作業<rt>さぎょう</rt></ruby>は、どんな<ruby>部品<rt>ぶひん</rt></ruby>でできているのでしょうか。

**この<ruby>連載<rt>れんさい</rt></ruby>は、Codex のソースコードを<ruby>手掛<rt>てが</rt></ruby>かりに、Coding Agent の<ruby>仕組<rt>しく</rt></ruby>みを30の<ruby>小<rt>ちい</rt></ruby>さな<ruby>章<rt>しょう</rt></ruby>で<ruby>読<rt>よ</rt></ruby>み<ruby>解<rt>と</rt></ruby>くシリーズです。** <ruby>一<rt>ひと</rt></ruby>つの<ruby>図<rt>ず</rt></ruby>で<ruby>流<rt>なが</rt></ruby>れをつかみ、<ruby>要点<rt>ようてん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んでから、<ruby>実際<rt>じっさい</rt></ruby>のコードへ<ruby>進<rt>すす</rt></ruby>みます。

[Day 01 から<ruby>読み始<rt>よみはじ</rt></ruby>める](/blog/ja/codex-reading/day-01) · [<ruby>図解<rt>ずかい</rt></ruby><ruby>付<rt>つ</rt></ruby>きの<ruby>章一覧<rt>しょういちらん</rt></ruby>を<ruby>見<rt>み</rt></ruby>る](/blog/codex-reading)

## この連載で目指すこと

<ruby>目標<rt>もくひょう</rt></ruby>は、リポジトリの<ruby>全<rt>ぜん</rt></ruby>ファイルを<ruby>覚<rt>おぼ</rt></ruby>えることではありません。ユーザーの<ruby>入力<rt>にゅうりょく</rt></ruby>がどこへ<ruby>渡<rt>わた</rt></ruby>り、モデルが<ruby>選<rt>えら</rt></ruby>んだ<ruby>操作<rt>そうさ</rt></ruby>がどう<ruby>実行<rt>じっこう</rt></ruby>され、<ruby>結果<rt>けっか</rt></ruby>がどのように<ruby>次<rt>つぎ</rt></ruby>の<ruby>判断<rt>はんだん</rt></ruby>へつながるかを、<ruby>自分<rt>じぶん</rt></ruby>の<ruby>言葉<rt>ことば</rt></ruby>で<ruby>説明<rt>せつめい</rt></ruby>できるようになることです。

<ruby>読み終<rt>よみお</rt></ruby>えたとき、<ruby>次<rt>つぎ</rt></ruby>の<ruby>三<rt>みっ</rt></ruby>つを<ruby>手元<rt>てもと</rt></ruby>に<ruby>残<rt>のこ</rt></ruby>すことを<ruby>目指<rt>めざ</rt></ruby>します。

- **<ruby>部品<rt>ぶひん</rt></ruby>の<ruby>地図<rt>ちず</rt></ruby>**：<ruby>画面<rt>がめん</rt></ruby>、Core、Model、Tools、<ruby>履歴<rt>りれき</rt></ruby>が、それぞれ<ruby>何<rt>なに</rt></ruby>を<ruby>担<rt>にな</rt></ruby>うか。
- **<ruby>処理<rt>しょり</rt></ruby>を<ruby>追<rt>お</rt></ruby>う<ruby>方法<rt>ほうほう</rt></ruby>**：<ruby>観察<rt>かんさつ</rt></ruby>した<ruby>動作<rt>どうさ</rt></ruby>やエラーから<ruby>検索<rt>けんさく</rt></ruby>し、<ruby>型<rt>かた</rt></ruby>と<ruby>関数<rt>かんすう</rt></ruby>の<ruby>境界<rt>きょうかい</rt></ruby>をたどる<ruby>方法<rt>ほうほう</rt></ruby>。
- **<ruby>正<rt>ただ</rt></ruby>しさを<ruby>確<rt>たし</rt></ruby>かめる<ruby>視点<rt>してん</rt></ruby>**：<ruby>成功<rt>せいこう</rt></ruby>と<ruby>失敗<rt>しっぱい</rt></ruby>、<ruby>状態<rt>じょうたい</rt></ruby>の<ruby>寿命<rt>じゅみょう</rt></ruby>、テスト、API の<ruby>約束<rt>やくそく</rt></ruby>を<ruby>分<rt>わ</rt></ruby>けて<ruby>考<rt>かんが</rt></ruby>える<ruby>習慣<rt>しゅうかん</rt></ruby>。

![図30｜全体地図](/assets/codex-reading/day-30.svg)

これは<ruby>責務<rt>せきむ</rt></ruby>を<ruby>整理<rt>せいり</rt></ruby>した<ruby>概念図<rt>がいねんず</rt></ruby>です。<ruby>矢印<rt>やじるし</rt></ruby>をたどりながら、<ruby>各章<rt>かくしょう</rt></ruby>で<ruby>状態<rt>じょうたい</rt></ruby>・<ruby>権限<rt>けんげん</rt></ruby>・<ruby>失敗時<rt>しっぱいじ</rt></ruby>の<ruby>回復<rt>かいふく</rt></ruby>を<ruby>少<rt>すこ</rt></ruby>しずつ<ruby>書き加<rt>かきくわ</rt></ruby>えていきます。

## こんな人に向いています

Coding Agent を<ruby>日常的<rt>にちじょうてき</rt></ruby>に<ruby>使<rt>つか</rt></ruby>いながら、その<ruby>中<rt>なか</rt></ruby>で<ruby>何<rt>なに</rt></ruby>が<ruby>起<rt>お</rt></ruby>きているのか<ruby>知<rt>し</rt></ruby>りたい<ruby>人<rt>ひと</rt></ruby>。<ruby>大<rt>おお</rt></ruby>きなオープンソースのコードを<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>が<ruby>欲<rt>ほ</rt></ruby>しい<ruby>人<rt>ひと</rt></ruby>。<ruby>自分<rt>じぶん</rt></ruby>のアプリでモデルとツールをつなぐ<ruby>設計<rt>せっけい</rt></ruby>を<ruby>考<rt>かんが</rt></ruby>えたい<ruby>人<rt>ひと</rt></ruby>に<ruby>向<rt>む</rt></ruby>けています。

<ruby>図<rt>ず</rt></ruby>と<ruby>説明<rt>せつめい</rt></ruby>は<ruby>最初<rt>さいしょ</rt></ruby>から<ruby>順<rt>じゅん</rt></ruby>に<ruby>読<rt>よ</rt></ruby>めます。<ruby>手<rt>て</rt></ruby>を<ruby>動<rt>うご</rt></ruby>かす<ruby>章<rt>しょう</rt></ruby>では、ターミナル、Git、<ruby>基本的<rt>きほんてき</rt></ruby>なプログラミングの<ruby>知識<rt>ちしき</rt></ruby>が<ruby>役立<rt>やくた</rt></ruby>ちます。Rust の<ruby>細<rt>こま</rt></ruby>かな<ruby>文法<rt>ぶんぽう</rt></ruby>を<ruby>最初<rt>さいしょ</rt></ruby>から<ruby>網羅<rt>もうら</rt></ruby>する<ruby>必要<rt>ひつよう</rt></ruby>はありませんが、<ruby>型<rt>かた</rt></ruby>・enum・<ruby>関数<rt>かんすう</rt></ruby>の<ruby>入出力<rt>にゅうしゅつりょく</rt></ruby>を、その<ruby>都度<rt>つど</rt></ruby><ruby>確認<rt>かくにん</rt></ruby>しながら<ruby>進<rt>すす</rt></ruby>めましょう。

## 目的に合わせて読み始める

| <ruby>知<rt>し</rt></ruby>りたいこと | <ruby>読<rt>よ</rt></ruby>む<ruby>章<rt>しょう</rt></ruby> | まず<ruby>確<rt>たし</rt></ruby>かめること |
| --- | --- | --- |
| <ruby>手元<rt>てもと</rt></ruby>で<ruby>動<rt>うご</rt></ruby>かし、<ruby>全体<rt>ぜんたい</rt></ruby>の<ruby>入口<rt>いりぐち</rt></ruby>を<ruby>知<rt>し</rt></ruby>りたい | Day 01–05 | <ruby>実行<rt>じっこう</rt></ruby>ファイル、<ruby>主要<rt>しゅよう</rt></ruby>な<ruby>責務<rt>せきむ</rt></ruby>、<ruby>入力<rt>にゅうりょく</rt></ruby>と<ruby>状態<rt>じょうたい</rt></ruby>の<ruby>単位<rt>たんい</rt></ruby> |
| モデルが<ruby>何度<rt>なんど</rt></ruby>も<ruby>判断<rt>はんだん</rt></ruby>できる<ruby>理由<rt>りゆう</rt></ruby>を<ruby>知<rt>し</rt></ruby>りたい | Day 06–09 | Agent Loop、<ruby>通信<rt>つうしん</rt></ruby>、<ruby>履歴<rt>りれき</rt></ruby>、Compaction |
| ツールの<ruby>実行<rt>じっこう</rt></ruby>と<ruby>制約<rt>せいやく</rt></ruby>を<ruby>知<rt>し</rt></ruby>りたい | Day 10–16 | <ruby>実行<rt>じっこう</rt></ruby><ruby>経路<rt>けいろ</rt></ruby>、Approval、Sandbox、MCP、<ruby>画面<rt>がめん</rt></ruby>との<ruby>接続<rt>せつぞく</rt></ruby> |
| <ruby>小<rt>ちい</rt></ruby>さな<ruby>変更<rt>へんこう</rt></ruby>やバグ<ruby>調査<rt>ちょうさ</rt></ruby>を<ruby>試<rt>ため</rt></ruby>したい | Day 17–23 | テスト、alias の<ruby>演習<rt>えんしゅう</rt></ruby>、Issue、Git の<ruby>履歴<rt>りれき</rt></ruby> |
| <ruby>状態<rt>じょうたい</rt></ruby>や API の<ruby>境界<rt>きょうかい</rt></ruby>を<ruby>深<rt>ふか</rt></ruby>く<ruby>読<rt>よ</rt></ruby>みたい | Day 24–30 | <ruby>修正<rt>しゅうせい</rt></ruby>の<ruby>前提<rt>ぜんてい</rt></ruby>、<ruby>到達可能<rt>とうたつかのう</rt></ruby><ruby>性<rt>せい</rt></ruby>、<ruby>失敗<rt>しっぱい</rt></ruby><ruby>注入<rt>ちゅうにゅう</rt></ruby>、<ruby>契約<rt>けいやく</rt></ruby>と<ruby>互換性<rt>ごかんせい</rt></ruby> |

<ruby>初<rt>はじ</rt></ruby>めてなら **Day 01 → Day 02 → Day 03** の<ruby>順<rt>じゅん</rt></ruby>がおすすめです。「<ruby>動<rt>うご</rt></ruby>かす → <ruby>地図<rt>ちず</rt></ruby>を<ruby>作<rt>つく</rt></ruby>る → <ruby>一<rt>ひと</rt></ruby>つの<ruby>入力<rt>にゅうりょく</rt></ruby>を<ruby>追<rt>お</rt></ruby>う」という<ruby>土台<rt>どだい</rt></ruby>ができます。<ruby>概要<rt>がいよう</rt></ruby>だけ<ruby>先<rt>さき</rt></ruby>につかみたい<ruby>場合<rt>ばあい</rt></ruby>は [Day 30 の<ruby>全体<rt>ぜんたい</rt></ruby><ruby>地図<rt>ちず</rt></ruby>](/blog/ja/codex-reading/day-30) を<ruby>眺<rt>なが</rt></ruby>め、<ruby>気<rt>き</rt></ruby>になった<ruby>部品<rt>ぶひん</rt></ruby>の<ruby>章<rt>しょう</rt></ruby>へ<ruby>戻<rt>もど</rt></ruby>っても<ruby>構<rt>かま</rt></ruby>いません。

## 一章の読み方

1. **<ruby>図<rt>ず</rt></ruby>でつかむ**：<ruby>箱<rt>はこ</rt></ruby>の<ruby>役割<rt>やくわり</rt></ruby>と<ruby>矢印<rt>やじるし</rt></ruby>の<ruby>方向<rt>ほうこう</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>します。
2. **3つのポイントで<ruby>理解<rt>りかい</rt></ruby>する**：<ruby>何<rt>なに</rt></ruby>を<ruby>入力<rt>にゅうりょく</rt></ruby>し、<ruby>何<rt>なに</rt></ruby>を<ruby>変<rt>か</rt></ruby>え、<ruby>何<rt>なに</rt></ruby>を<ruby>返<rt>かえ</rt></ruby>すのかを<ruby>読<rt>よ</rt></ruby>みます。
3. **ソースで<ruby>確<rt>たし</rt></ruby>かめる**：<ruby>検索語<rt>けんさくご</rt></ruby>を<ruby>使<rt>つか</rt></ruby>い、<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>きます。
4. **30<ruby>秒<rt>びょう</rt></ruby>で<ruby>復習<rt>ふくしゅう</rt></ruby>する**：<ruby>要点<rt>ようてん</rt></ruby>を<ruby>見<rt>み</rt></ruby>ずに<ruby>説明<rt>せつめい</rt></ruby>し、<ruby>分<rt>わ</rt></ruby>からない<ruby>境界<rt>きょうかい</rt></ruby>だけ<ruby>読み直<rt>よみなお</rt></ruby>します。

<ruby>読<rt>よ</rt></ruby>む<ruby>速<rt>はや</rt></ruby>さより、<ruby>一<rt>ひと</rt></ruby>つの<ruby>動作<rt>どうさ</rt></ruby>と<ruby>一<rt>ひと</rt></ruby>つのコードの<ruby>対応<rt>たいおう</rt></ruby>が<ruby>分<rt>わ</rt></ruby>かることを<ruby>大切<rt>たいせつ</rt></ruby>にしてください。<ruby>各章<rt>かくしょう</rt></ruby>の「<ruby>小<rt>ちい</rt></ruby>さく<ruby>試<rt>ため</rt></ruby>す」は<ruby>学習用<rt>がくしゅうよう</rt></ruby>の<ruby>提案<rt>ていあん</rt></ruby>です。<ruby>書<rt>か</rt></ruby>かれているコマンドや<ruby>操作<rt>そうさ</rt></ruby>は、<ruby>実行<rt>じっこう</rt></ruby>する<ruby>目的<rt>もくてき</rt></ruby>と<ruby>作業場所<rt>さぎょうばしょ</rt></ruby>を<ruby>理解<rt>りかい</rt></ruby>してから<ruby>使<rt>つか</rt></ruby>います。

## 全30章の目次

### Day 01–05｜動かす。地図をつくる。

- [Day 01｜ソースから<ruby>動<rt>うご</rt></ruby>かすと、コードに<ruby>意味<rt>いみ</rt></ruby>が<ruby>生<rt>う</rt></ruby>まれる](/blog/ja/codex-reading/day-01)
- [Day 02｜Coding Agent を、6つの<ruby>役割<rt>やくわり</rt></ruby>に<ruby>分<rt>わ</rt></ruby>けてみる](/blog/ja/codex-reading/day-02)
- [Day 03｜<ruby>一<rt>ひと</rt></ruby>つの<ruby>入力<rt>にゅうりょく</rt></ruby>を、モデルとツールの<ruby>往復<rt>おうふく</rt></ruby>まで<ruby>追<rt>お</rt></ruby>う](/blog/ja/codex-reading/day-03)
- [Day 04｜Op と EventMsg — お<ruby>願<rt>ねが</rt></ruby>いと<ruby>報告<rt>ほうこく</rt></ruby>を<ruby>分<rt>わ</rt></ruby>ける](/blog/ja/codex-reading/day-04)
- [Day 05｜Session・Task・Turn — <ruby>状態<rt>じょうたい</rt></ruby>の<ruby>寿命<rt>じゅみょう</rt></ruby>を<ruby>見分<rt>みわ</rt></ruby>ける](/blog/ja/codex-reading/day-05)

### Day 06–09｜判断と記憶をつなぐ。

- [Day 06｜Agent Loop — <ruby>結果<rt>けっか</rt></ruby>を<ruby>受け取<rt>うけと</rt></ruby>り、もう<ruby>一度<rt>いちど</rt></ruby><ruby>判断<rt>はんだん</rt></ruby>する](/blog/ja/codex-reading/day-06)
- [Day 07｜Model Client — <ruby>応答<rt>おうとう</rt></ruby>を<ruby>少<rt>すこ</rt></ruby>しずつ<ruby>受け取<rt>うけと</rt></ruby>る<ruby>仕組<rt>しく</rt></ruby>み](/blog/ja/codex-reading/day-07)
- [Day 08｜Context と History — <ruby>保存<rt>ほぞん</rt></ruby>した<ruby>情報<rt>じょうほう</rt></ruby>と<ruby>渡<rt>わた</rt></ruby>す<ruby>情報<rt>じょうほう</rt></ruby>](/blog/ja/codex-reading/day-08)
- [Day 09｜Compaction — <ruby>長<rt>なが</rt></ruby>い<ruby>会話<rt>かいわ</rt></ruby>を、<ruby>続<rt>つづ</rt></ruby>けられる<ruby>形<rt>かたち</rt></ruby>にする](/blog/ja/codex-reading/day-09)

### Day 10–16｜道具と画面をつなぐ。

- [Day 10｜Tools — <ruby>名前付<rt>なまえつ</rt></ruby>きの<ruby>要求<rt>ようきゅう</rt></ruby>を、<ruby>実装<rt>じっそう</rt></ruby>へ<ruby>届<rt>とど</rt></ruby>ける](/blog/ja/codex-reading/day-10)
- [Day 11｜exec — コマンドが OS のプロセスになるまで](/blog/ja/codex-reading/day-11)
- [Day 12｜apply_patch — <ruby>変更<rt>へんこう</rt></ruby>の<ruby>意図<rt>いと</rt></ruby>を、ファイルへの<ruby>差分<rt>さぶん</rt></ruby>にする](/blog/ja/codex-reading/day-12)
- [Day 13｜Approval — <ruby>方針<rt>ほうしん</rt></ruby>と、<ruby>一回<rt>いっかい</rt></ruby>の<ruby>判断<rt>はんだん</rt></ruby>を<ruby>分<rt>わ</rt></ruby>ける](/blog/ja/codex-reading/day-13)
- [Day 14｜Sandbox — <ruby>許可<rt>きょか</rt></ruby>を、<ruby>実際<rt>じっさい</rt></ruby>の<ruby>制約<rt>せいやく</rt></ruby>に<ruby>変<rt>か</rt></ruby>える](/blog/ja/codex-reading/day-14)
- [Day 15｜MCP — <ruby>外部<rt>がいぶ</rt></ruby>の<ruby>道具<rt>どうぐ</rt></ruby>を、<ruby>同<rt>おな</rt></ruby>じ<ruby>作業<rt>さぎょう</rt></ruby>の<ruby>輪<rt>わ</rt></ruby>につなぐ](/blog/ja/codex-reading/day-15)
- [Day 16｜TUI と App Server — <ruby>画面<rt>がめん</rt></ruby>と<ruby>処理<rt>しょり</rt></ruby>の<ruby>間<rt>あいだ</rt></ruby>にある<ruby>橋<rt>はし</rt></ruby>](/blog/ja/codex-reading/day-16)

### Day 17–23｜試す。調べる。確かめる。

- [Day 17｜テスト — <ruby>変更<rt>へんこう</rt></ruby>した<ruby>一行<rt>いちぎょう</rt></ruby>を、<ruby>振<rt>ふ</rt></ruby>る<ruby>舞<rt>ま</rt></ruby>いで<ruby>確<rt>たし</rt></ruby>かめる](/blog/ja/codex-reading/day-17)
- [Day 18｜<ruby>小<rt>ちい</rt></ruby>さな<ruby>改造<rt>かいぞう</rt></ruby> — alias は<ruby>既存<rt>きぞん</rt></ruby>の<ruby>処理<rt>しょり</rt></ruby>へつなぐ](/blog/ja/codex-reading/day-18)
- [Day 19｜コントリビューション — <ruby>差分<rt>さぶん</rt></ruby>を、<ruby>伝<rt>つた</rt></ruby>わる<ruby>問題<rt>もんだい</rt></ruby><ruby>分析<rt>ぶんせき</rt></ruby>へ](/blog/ja/codex-reading/day-19)
- [Day 20｜Issue から<ruby>読<rt>よ</rt></ruby>む — <ruby>成功<rt>せいこう</rt></ruby><ruby>時<rt>とき</rt></ruby>と<ruby>失敗時<rt>しっぱいじ</rt></ruby>の<ruby>差<rt>さ</rt></ruby>を<ruby>探<rt>さが</rt></ruby>す](/blog/ja/codex-reading/day-20)
- [Day 21｜git の<ruby>履歴<rt>りれき</rt></ruby> — <ruby>一行<rt>いちぎょう</rt></ruby>の<ruby>変更<rt>へんこう</rt></ruby>から、<ruby>設計<rt>せっけい</rt></ruby>の<ruby>理由<rt>りゆう</rt></ruby>をたどる](/blog/ja/codex-reading/day-21)
- [Day 22｜git bisect — <ruby>変化<rt>へんか</rt></ruby>した<ruby>地点<rt>ちてん</rt></ruby>を、<ruby>半分<rt>はんぶん</rt></ruby>ずつ<ruby>絞<rt>しぼ</rt></ruby>る](/blog/ja/codex-reading/day-22)
- [Day 23｜<ruby>回帰<rt>かいき</rt></ruby>テスト — <ruby>関数名<rt>かんすうめい</rt></ruby>より、<ruby>利用者<rt>りようしゃ</rt></ruby>に<ruby>届<rt>とど</rt></ruby>く<ruby>結果<rt>けっか</rt></ruby>を<ruby>守<rt>まも</rt></ruby>る](/blog/ja/codex-reading/day-23)

### Day 24–30｜状態と境界を読み解く。

- [Day 24｜<ruby>修正<rt>しゅうせい</rt></ruby>の<ruby>移植<rt>いしょく</rt></ruby> — <ruby>同<rt>おな</rt></ruby>じ<ruby>一行<rt>いちぎょう</rt></ruby>でも、<ruby>前提<rt>ぜんてい</rt></ruby>が<ruby>変<rt>か</rt></ruby>わる](/blog/ja/codex-reading/day-24)
- [Day 25｜<ruby>再<rt>さい</rt></ruby>トリアージ — <ruby>古<rt>ふる</rt></ruby>い<ruby>報告<rt>ほうこく</rt></ruby>を、<ruby>今<rt>いま</rt></ruby>の<ruby>実装<rt>じっそう</rt></ruby>で<ruby>問<rt>と</rt></ruby>い<ruby>直<rt>なお</rt></ruby>す](/blog/ja/codex-reading/day-25)
- [Day 26｜State Reachability — その<ruby>状態<rt>じょうたい</rt></ruby>は、<ruby>本当<rt>ほんとう</rt></ruby>に<ruby>起<rt>お</rt></ruby>きる？](/blog/ja/codex-reading/day-26)
- [Day 27｜Failure Injection — <ruby>失敗<rt>しっぱい</rt></ruby>を、<ruby>狙<rt>ねら</rt></ruby>った<ruby>場所<rt>ばしょ</rt></ruby>で<ruby>起<rt>お</rt></ruby>こす](/blog/ja/codex-reading/day-27)
- [Day 28｜Contract Test — <ruby>境界<rt>きょうかい</rt></ruby>の<ruby>約束<rt>やくそく</rt></ruby>を、<ruby>両側<rt>りょうがわ</rt></ruby>から<ruby>確<rt>たし</rt></ruby>かめる](/blog/ja/codex-reading/day-28)
- [Day 29｜Protocol の<ruby>変更<rt>へんこう</rt></ruby> — <ruby>型<rt>かた</rt></ruby>・JSON・<ruby>意味<rt>いみ</rt></ruby>の3<ruby>層<rt>そう</rt></ruby>で<ruby>見<rt>み</rt></ruby>る](/blog/ja/codex-reading/day-29)
- [Day 30｜<ruby>全体<rt>ぜんたい</rt></ruby><ruby>地図<rt>ちず</rt></ruby> — <ruby>入力<rt>にゅうりょく</rt></ruby>・<ruby>判断<rt>はんだん</rt></ruby>・<ruby>実行<rt>じっこう</rt></ruby>・<ruby>状態<rt>じょうたい</rt></ruby>をつなぐ](/blog/ja/codex-reading/day-30)

[Day 01：ソースから<ruby>動<rt>うご</rt></ruby>かす](/blog/ja/codex-reading/day-01) · [技術の<ruby>記事<rt>きじ</rt></ruby><ruby>一覧<rt>いちらん</rt></ruby>へ](/category/codex)
