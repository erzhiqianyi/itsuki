---
title: "YOUGUIDE PRO" 
description: "YouTube動画制作を劇的に効率化する、AI搭載型ナレーション制作・分析アシスタント。台本の構成分析から、お手本音声の生成、録音データの逐一分析、そして字幕・音声の一括書き出しまでをシームレスに行います。"
url: "https://gemini.google.com/u/1/share/768baeae7f55" 
componentId: "YouGuidePro"
icon: "Play" 
date: "2025-12-29" 
featured: false
lang: "ja" 
category: ["YouTube Tools", "AI Coach", "Creator Workflow"]
---

## ツール概要 (Tool Overview)

YouGuide Proは、YouTube動画のナレーション制作をプロフェッショナルなレベルへ引き上げるためのオールインワン支援ツールです。Gemini
2.5 Flashの高度な多言語・多モード解析能力を活用し、日本語特有の表現やリズムを重視したナレーション練習と素材作成を実現します。

## 主な機能 (Core Capabilities)

インテリジェント・チャプター分析: 長い台本を日本語の「起承転結」に基づき、録音しやすい最適な長さに自動分割。ユーザーのフィードバックによる再微調も可能です。

ロール別AI音声合成 (TTS): Puck（プロ）、Aoede（女性）など、動画のスタイルに合わせた複数の音声キャラクターと語速設定（0.5x〜2.0x）が可能。

自動オーディオ・スライシング: チャプター全体を録音するだけで、AIが時間軸を解析し、一文ずつの個別音声ファイルを自動生成。

逐一比較スコアリング: 「お手本（AI） vs 自分の録音（切片）」を一行ごとに並べて表示。テキスト認識（Transcription）を通じ、誤読やリズムの乱れを詳細に分析。

パブリッシング・パッケージ作成: 選択したベストTakeに基づき、YouTube投稿にそのまま使える「SRT字幕」「標準音合集」「最終録音完稿」を一括ダウンロード。

## 制作フローの遊び方 (Workflow)

### 台本入力: 編集したいスクリプトを貼り付け、分析並開始制作ボタンでチャプターに分けます。

お手本を確認: 各行の「標準音」を聞いて、プロのイントネーションを把握します。

### フル録音: チャプター全体を一気に録音します。

### AI分析と選択: 自動で切り分けられた各行のスコアを確認。納得がいくまでTakeを重ね、最高の1枚を「ベスト」に設定します。

### 一括エクスポート: 画面下の「一键导出」で、編集ソフトに即投入可能な素材を揃えます。

## 技術スタック (Technical Stack)

### Framework: React

### AI Models: Gemini 2.5 Flash (Transcription / Segmenting / Pitch Analysis / TTS)

### Audio Engine: Web Audio API (Audio Contextによるリアルタイム切片化と無縫合合成)

### Storage: Browser LocalStorage (プロジェクト履歴の永続化)

### UI System: Tailwind CSS & Inline SVG Icons