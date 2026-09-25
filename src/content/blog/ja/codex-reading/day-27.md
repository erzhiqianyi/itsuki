---
lang: "ja"
title: "Day 27｜Failure Injection — 失敗を、狙った場所で起こす"
summary: "失敗の位置を固定すると、回復処理を繰り返し検証できる。"
date: "2026-09-20"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-27.svg"
codexReadingDay: 27
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>失敗<rt>しっぱい</rt></ruby>の<ruby>位置<rt>いち</rt></ruby>を<ruby>固定<rt>こてい</rt></ruby>すると、<ruby>回復<rt>かいふく</rt></ruby><ruby>処理<rt>しょり</rt></ruby>を<ruby>繰り返<rt>くりかえ</rt></ruby>し<ruby>検証<rt>けんしょう</rt></ruby>できる。</p></div>

<ruby>偶然<rt>ぐうぜん</rt></ruby>ネットワークが<ruby>切<rt>き</rt></ruby>れるのを<ruby>待<rt>ま</rt></ruby>っても、<ruby>同<rt>おな</rt></ruby>じ<ruby>失敗<rt>しっぱい</rt></ruby>を<ruby>何度<rt>なんど</rt></ruby>も<ruby>再現<rt>さいげん</rt></ruby>するのは<ruby>困難<rt>こんなん</rt></ruby>です。<ruby>失敗<rt>しっぱい</rt></ruby>を<ruby>差し込<rt>さしこ</rt></ruby>む<ruby>境界<rt>きょうかい</rt></ruby>を<ruby>選<rt>えら</rt></ruby>び、どこまで<ruby>状態<rt>じょうたい</rt></ruby>が<ruby>変<rt>か</rt></ruby>わったかを<ruby>固定<rt>こてい</rt></ruby>すれば、<ruby>回復<rt>かいふく</rt></ruby><ruby>処理<rt>しょり</rt></ruby>の<ruby>意味<rt>いみ</rt></ruby>を<ruby>検証<rt>けんしょう</rt></ruby>しやすくなります。

## 01｜図でつかむ

![図27｜Failure Injection](/assets/codex-reading/day-27.svg)

<ruby>失敗<rt>しっぱい</rt></ruby>を<ruby>起<rt>お</rt></ruby>こした<ruby>瞬間<rt>しゅんかん</rt></ruby>だけでなく、その<ruby>後<rt>のち</rt></ruby>に<ruby>作業<rt>さぎょう</rt></ruby>が<ruby>進<rt>すす</rt></ruby>めるかまで<ruby>見<rt>み</rt></ruby>る。

## 02｜3つのポイントで理解する

### 1. 差し込む境界を決める

<ruby>入力<rt>にゅうりょく</rt></ruby><ruby>検証<rt>けんしょう</rt></ruby>で<ruby>失敗<rt>しっぱい</rt></ruby>するのか、<ruby>保存<rt>ほぞん</rt></ruby><ruby>処理<rt>しょり</rt></ruby>で<ruby>失敗<rt>しっぱい</rt></ruby>するのかによって、<ruby>検証<rt>けんしょう</rt></ruby>できる<ruby>回復<rt>かいふく</rt></ruby><ruby>処理<rt>しょり</rt></ruby>が<ruby>変<rt>か</rt></ruby>わります。<ruby>変更前<rt>へんこうまえ</rt></ruby>の<ruby>失敗<rt>しっぱい</rt></ruby>を<ruby>作<rt>つく</rt></ruby>っているなら、<ruby>変更後<rt>へんこうご</rt></ruby>の<ruby>失敗<rt>しっぱい</rt></ruby>まで<ruby>確<rt>たし</rt></ruby>かめたとは<ruby>言<rt>い</rt></ruby>えません。

### 2. 準備する状態の妥当性を確認する

<ruby>原稿<rt>げんこう</rt></ruby>は InProgress の turn を<ruby>使<rt>つか</rt></ruby>う<ruby>演習<rt>えんしゅう</rt></ruby>を<ruby>紹介<rt>しょうかい</rt></ruby>しています。<ruby>現在<rt>げんざい</rt></ruby>の<ruby>実装<rt>じっそう</rt></ruby>が<ruby>同<rt>おな</rt></ruby>じ<ruby>条件<rt>じょうけん</rt></ruby>で<ruby>拒否<rt>きょひ</rt></ruby>するかを<ruby>先<rt>さき</rt></ruby>に<ruby>確認<rt>かくにん</rt></ruby>し、<ruby>存在<rt>そんざい</rt></ruby>しない<ruby>経路<rt>けいろ</rt></ruby>を<ruby>無理<rt>むり</rt></ruby>に<ruby>作<rt>つく</rt></ruby>らないようにします。

### 3. 回復後のライフサイクルを追う

エラーが<ruby>表示<rt>ひょうじ</rt></ruby>されたあと、<ruby>入力<rt>にゅうりょく</rt></ruby><ruby>欄<rt>らん</rt></ruby>、<ruby>履歴<rt>りれき</rt></ruby>、キュー、<ruby>次<rt>つぎ</rt></ruby>の<ruby>操作<rt>そうさ</rt></ruby>がどうなるかを<ruby>確認<rt>かくにん</rt></ruby>します。<ruby>復元<rt>ふくげん</rt></ruby>の<ruby>二重<rt>にじゅう</rt></ruby><ruby>実行<rt>じっこう</rt></ruby>や、あとから<ruby>届<rt>とど</rt></ruby>くイベントとの<ruby>競合<rt>きょうごう</rt></ruby>も<ruby>観察<rt>かんさつ</rt></ruby><ruby>点<rt>てん</rt></ruby>になります。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>テスト<ruby>用<rt>よう</rt></ruby>の<ruby>失敗<rt>しっぱい</rt></ruby>を<ruby>作<rt>つく</rt></ruby>っただけでは、<ruby>本番<rt>ほんばん</rt></ruby>で<ruby>同<rt>おな</rt></ruby>じ<ruby>状態<rt>じょうたい</rt></ruby>から<ruby>同<rt>おな</rt></ruby>じ<ruby>回復<rt>かいふく</rt></ruby><ruby>経路<rt>けいろ</rt></ruby>へ<ruby>入<rt>い</rt></ruby>れることは<ruby>保証<rt>ほしょう</rt></ruby>されません。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "TurnStatus::InProgress|thread_revert" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/app-server/src/request_processors/thread_processor.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/app-server/src/request_processors/thread_processor.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>失敗<rt>しっぱい</rt></ruby><ruby>直前<rt>ちょくぜん</rt></ruby>・<ruby>直後<rt>ちょくご</rt></ruby>・<ruby>次<rt>つぎ</rt></ruby>の<ruby>入力<rt>にゅうりょく</rt></ruby>の<ruby>三時<rt>さんじ</rt></ruby><ruby>点<rt>てん</rt></ruby>で、<ruby>変<rt>か</rt></ruby>わるべき<ruby>状態<rt>じょうたい</rt></ruby>と<ruby>変<rt>か</rt></ruby>わってはいけない<ruby>状態<rt>じょうたい</rt></ruby>を<ruby>書き出<rt>かきだ</rt></ruby>します。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>失敗<rt>しっぱい</rt></ruby>を<ruby>差し込<rt>さしこ</rt></ruby>む<ruby>位置<rt>いち</rt></ruby>を<ruby>固定<rt>こてい</rt></ruby>する。**
- **<ruby>状態<rt>じょうたい</rt></ruby><ruby>変更<rt>へんこう</rt></ruby>の<ruby>前<rt>まえ</rt></ruby>か<ruby>後<rt>あと</rt></ruby>かを<ruby>明確<rt>めいかく</rt></ruby>にする。**
- **<ruby>回復後<rt>かいふくご</rt></ruby>の<ruby>次<rt>つぎ</rt></ruby>の<ruby>操作<rt>そうさ</rt></ruby>まで<ruby>確<rt>たし</rt></ruby>かめる。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
