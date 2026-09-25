---
lang: "ja"
title: "Day 14｜Sandbox — 許可を、実際の制約に変える"
summary: "権限の設定を、実行環境が強制できる制約へ変換する。"
date: "2026-09-07"
category: "codex"
tags: ["Codex", "ソースコードリーディング", "図解"]
coverImage: "/assets/codex-reading/day-14.svg"
codexReadingDay: 14
---

<div class="codex-answer"><span>この<ruby>章<rt>しょう</rt></ruby>の<ruby>答<rt>こた</rt></ruby>え</span><p><ruby>権限<rt>けんげん</rt></ruby>の<ruby>設定<rt>せってい</rt></ruby>を、<ruby>実行環境<rt>じっこうかんきょう</rt></ruby>が<ruby>強制<rt>きょうせい</rt></ruby>できる<ruby>制約<rt>せいやく</rt></ruby>へ<ruby>変換<rt>へんかん</rt></ruby>する。</p></div>

「この<ruby>操作<rt>そうさ</rt></ruby>を<ruby>認<rt>みと</rt></ruby>める」という<ruby>判断<rt>はんだん</rt></ruby>だけでは、プロセスが<ruby>触<rt>ふ</rt></ruby>れられる<ruby>範囲<rt>はんい</rt></ruby>は<ruby>決<rt>き</rt></ruby>まりません。Sandbox では、ファイルやネットワークへのアクセス<ruby>条件<rt>じょうけん</rt></ruby>が、どのように<ruby>実行環境<rt>じっこうかんきょう</rt></ruby>へ<ruby>渡<rt>わた</rt></ruby>されるかを<ruby>見<rt>み</rt></ruby>ます。

## 01｜図でつかむ

![図14｜Sandbox](/assets/codex-reading/day-14.svg)

Approval は<ruby>実行<rt>じっこう</rt></ruby><ruby>判断<rt>はんだん</rt></ruby>、Sandbox は<ruby>実行<rt>じっこう</rt></ruby><ruby>範囲<rt>はんい</rt></ruby>。<ruby>両者<rt>りょうしゃ</rt></ruby>の<ruby>役割<rt>やくわり</rt></ruby>を<ruby>分<rt>わ</rt></ruby>ける。

## 02｜3つのポイントで理解する

### 1. 設定を具体的な許可範囲にする

PermissionProfile やファイルシステムの<ruby>方針<rt>ほうしん</rt></ruby>から、どこを<ruby>読<rt>よ</rt></ruby>めるか・<ruby>書<rt>か</rt></ruby>けるかなどを<ruby>追<rt>お</rt></ruby>います。プロジェクトのパスだけでなく、<ruby>例外<rt>れいがい</rt></ruby>や<ruby>保護<rt>ほご</rt></ruby><ruby>対象<rt>たいしょう</rt></ruby>も<ruby>確認<rt>かくにん</rt></ruby>します。

### 2. 実行環境ごとの実装を見る

SandboxManager などの<ruby>選択<rt>せんたく</rt></ruby><ruby>処理<rt>しょり</rt></ruby>から、OS や<ruby>実行方式<rt>じっこうほうしき</rt></ruby>に<ruby>対応<rt>たいおう</rt></ruby>する<ruby>実装<rt>じっそう</rt></ruby>へ<ruby>進<rt>すす</rt></ruby>みます。<ruby>設定<rt>せってい</rt></ruby><ruby>名<rt>めい</rt></ruby>が<ruby>同<rt>おな</rt></ruby>じでも、<ruby>内部<rt>ないぶ</rt></ruby>で<ruby>使<rt>つか</rt></ruby>う<ruby>仕組<rt>しく</rt></ruby>みまで<ruby>同<rt>おな</rt></ruby>じとは<ruby>限<rt>かぎ</rt></ruby>りません。

### 3. 失敗の理由を切り分ける

コマンド<ruby>自身<rt>じしん</rt></ruby>のエラー、<ruby>承認<rt>しょうにん</rt></ruby>の<ruby>拒否<rt>きょひ</rt></ruby>、<ruby>環境<rt>かんきょう</rt></ruby>によるアクセス<ruby>拒否<rt>きょひ</rt></ruby>を<ruby>区別<rt>くべつ</rt></ruby>します。Sandbox が<ruby>無効<rt>むこう</rt></ruby>な<ruby>環境<rt>かんきょう</rt></ruby>もあるため、<ruby>実際<rt>じっさい</rt></ruby>に<ruby>選<rt>えら</rt></ruby>ばれた<ruby>設定<rt>せってい</rt></ruby>を<ruby>前提<rt>ぜんてい</rt></ruby>に<ruby>判断<rt>はんだん</rt></ruby>します。

<aside class="codex-note"><strong>ここを<ruby>混同<rt>こんどう</rt></ruby>しない</strong><p>ツールが<ruby>失敗<rt>しっぱい</rt></ruby>した<ruby>理由<rt>りゆう</rt></ruby>を、すべて「AI が<ruby>判断<rt>はんだん</rt></ruby>を<ruby>間違<rt>まちが</rt></ruby>えた」で<ruby>片付<rt>かたづ</rt></ruby>けません。<ruby>実行<rt>じっこう</rt></ruby><ruby>条件<rt>じょうけん</rt></ruby>の<ruby>制約<rt>せいやく</rt></ruby>による<ruby>失敗<rt>しっぱい</rt></ruby>もあります。</p></aside>

## 03｜ソースで確かめる

<ruby>以下<rt>いか</rt></ruby>の<ruby>検索<rt>けんさく</rt></ruby>は **Codex リポジトリのルート**で<ruby>実行<rt>じっこう</rt></ruby>します。<ruby>最初<rt>さいしょ</rt></ruby>に<ruby>対象<rt>たいしょう</rt></ruby> commit を<ruby>記録<rt>きろく</rt></ruby>し、<ruby>検索結果<rt>けんさくけっか</rt></ruby>から<ruby>定義<rt>ていぎ</rt></ruby>と<ruby>呼び出<rt>よびだ</rt></ruby>し<ruby>元<rt>もと</rt></ruby>を<ruby>一<rt>ひと</rt></ruby>つずつ<ruby>開<rt>ひら</rt></ruby>いてください。

```bash
git rev-parse --short HEAD
rg -n "SandboxManager|SandboxType" codex-rs
```

<ruby>読<rt>よ</rt></ruby>む<ruby>入口<rt>いりぐち</rt></ruby>：[ `codex-rs/sandboxing/src/manager.rs` ](https://github.com/openai/codex/blob/4582c0a498158063760309c48214a0416a81488a/codex-rs/sandboxing/src/manager.rs)。リンク<ruby>先<rt>さき</rt></ruby>は<ruby>照合<rt>しょうごう</rt></ruby>に<ruby>使<rt>つか</rt></ruby>った<ruby>固定<rt>こてい</rt></ruby> commit のファイルです。<ruby>手元<rt>てもと</rt></ruby>の<ruby>版<rt>はん</rt></ruby>と<ruby>異<rt>こと</rt></ruby>なる<ruby>場合<rt>ばあい</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の<ruby>検索語<rt>けんさくご</rt></ruby>から<ruby>探<rt>さが</rt></ruby>し<ruby>直<rt>なお</rt></ruby>します。

### 小さく試す

<ruby>権限<rt>けんげん</rt></ruby><ruby>設定<rt>せってい</rt></ruby>から Sandbox の<ruby>選択<rt>せんたく</rt></ruby>までを<ruby>追<rt>お</rt></ruby>い、ファイルアクセスの<ruby>制約<rt>せいやく</rt></ruby>がどこで<ruby>渡<rt>わた</rt></ruby>されるかを<ruby>探<rt>さが</rt></ruby>します。

## 04｜30秒で復習

<div class="codex-recap">

- **<ruby>承認<rt>しょうにん</rt></ruby>とアクセス<ruby>制約<rt>せいやく</rt></ruby>は<ruby>別<rt>べつ</rt></ruby>の<ruby>役割<rt>やくわり</rt></ruby>。**
- **<ruby>設定<rt>せってい</rt></ruby>は<ruby>実行環境<rt>じっこうかんきょう</rt></ruby>に<ruby>合<rt>あ</rt></ruby>う<ruby>形<rt>かたち</rt></ruby>へ<ruby>変換<rt>へんかん</rt></ruby>される。**
- **<ruby>失敗<rt>しっぱい</rt></ruby><ruby>原因<rt>げんいん</rt></ruby>を<ruby>判断<rt>はんだん</rt></ruby>・<ruby>環境<rt>かんきょう</rt></ruby>・コマンドに<ruby>分<rt>わ</rt></ruby>ける。**

</div>

[<ruby>全<rt>ぜん</rt></ruby>30<ruby>章<rt>しょう</rt></ruby>の<ruby>目次<rt>もくじ</rt></ruby>へ](/blog/codex-reading)
