---
title: "FlashSpeak AI"
description: "このツールは、SRT字幕ファイルを読み込み、AIが一行ずつ発音の練習をサポートする「パーソナルスピーキングコーチ」です。Geminiの最新の音声解析モデルを搭載しており、ユーザーの録音データを多角的に分析します。"
url: "https://gemini.google.com/share/b0cec622c403"
componentId: "ReadingMock"
icon: "Mic"
date: "2025-12-27"
featured: true
lang: "ja"
category: ["日本語", "AI Coach"]
---

### ツール概要 (Tool Overview)
このツールは、SRT字幕ファイルを読み込み、AIが一行ずつ発音の練習をサポートする「パーソナルスピーキングコーチ」です。Geminiの最新の音声解析モデルを搭載しており、ユーザーの録音データを多角的に分析します。

### 主な機能 (Core Capabilities)
- **SRTスクリプト解析**: 時間軸に沿って練習リストを自動生成。

- **AI音声合成 (TTS)**: ネイティブの発音モデルによるお手本音声を生成。

- **マルチリンガル・フィードバック**: 解析結果は日本語、中国語、英語で出力可能。

- **詳細な発音スコア**: 発音、リズム、抑揚をS〜Cランクで評価。

### デモの遊び方 (How to Play)
1.  **スクリプト読込**: 右上の `LOAD SCRIPT` ボタンをクリックして、サンプルスクリプトを展開します。
2.  **お手本を聞く**: 各行の `Volume` アイコンをクリックすると、AIが生成したお手本（シミュレーション）が流れます。
3.  **録音練習**: `Mic` アイコンをクリックして録音を開始（デモでは3秒間）。
4.  **AI評価を確認**: 録音終了後、AIが数秒間考えて「評価テーブル」を出力します。Markdown形式の綺麗な解析結果をご覧ください。


### 技術スタック (Technical Stack)
* **Framework**: React (Astro Integration)
* **AI Models**: Gemini 2.5 Flash (Text-to-Speech & Audio Analysis)
* **UI System**: Tailwind CSS & Lucide Icons
* **Arch**: Islands Architecture (Client-side Hydration)