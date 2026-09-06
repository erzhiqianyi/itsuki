# 写真の取り込み

写真を Cloudflare R2 にアップロードし、`src/content/photos/` にアルバムの Markdown を書き出す仕組みです。
画像はリポジトリに入りません。サムネイルは配信時に Cloudflare 側で生成されます。

- **写真スタジオ**（`npm run photos:studio`）— ブラウザで操作する。ふだんはこちら。
- **コマンドライン**（`npm run photos:add`）— 同じ処理を端末から。
- 共通の処理は [`scripts/photo-lib.mjs`](../scripts/photo-lib.mjs) にあります。

---

## 1. 最初の一回だけ必要な準備

### 1-1. Cloudflare にログインする

```bash
npx wrangler login
```

ブラウザが開くので、サイトを管理している Cloudflare アカウントで許可します。
一度ログインすれば端末に保存され、次回からは不要です。

### 1-2. R2 バケットを作る

```bash
npx wrangler r2 bucket create itsuki-photos
```

名前は自由です。変えた場合は後述の `.env` に書いてください。

### 1-3. バケットにカスタムドメインをつなぐ

画像の配信元になるドメインです。ここでは `img.erzhiqian.cc` を例にします。

Cloudflare ダッシュボードから行う場合：
**R2 → バケットを選ぶ → Settings → Public access → Custom domains → Connect domain**

コマンドから行う場合（ゾーン ID は
ダッシュボードのドメイン概要ページ右側 **API** 欄にある `Zone ID` です）：

```bash
npx wrangler r2 bucket domain add itsuki-photos --domain img.erzhiqian.cc --zone-id <ゾーンID>
```

> `<バケット名>.r2.dev` という公開 URL も使えますが、レート制限があり
> 画像変換も効かないため、本番では使いません。必ずカスタムドメインをつなぎます。

### 1-4. 画像変換を有効にする

サムネイルは `/cdn-cgi/image/width=960,…` という URL で配信時に生成されます。
これはドメイン単位の設定で、ダッシュボードからのみ有効にできます。

**ダッシュボード → 対象ドメインを選ぶ → Images → Transformations →
「Enable for zone」をオンにする**

無料枠は月 5,000 回の変換までです。個人サイトの規模なら通常は超えません。

### 1-5. 設定ファイルを置く

既定値のまま（バケット `itsuki-photos`、ドメイン `img.erzhiqian.cc`）で
よければ何もしなくて構いません。変えたい場合だけ、プロジェクト直下に `.env` を作ります。

```bash
cp .env.example .env
```

```ini
R2_BUCKET=itsuki-photos          # バケット名
PHOTO_CDN_HOST=img.erzhiqian.cc  # 画像の配信ドメイン
R2_PREFIX=photos                 # バケット内のキーの接頭辞
PORT=4477                        # 写真スタジオのポート
```

`.env` は Git に入りません。環境変数を直接指定した場合はそちらが優先されます。

### 1-6. 準備できたか確かめる

```bash
npm run photos:studio
```

開いた画面の右上に接続状態が出ます。

| 表示 | 意味 |
| --- | --- |
| 緑の点：バケット … に接続できました | 準備完了 |
| 赤の点：Cloudflare にログインしていません | 1-1 をやり直す |
| 赤の点：バケット … が見つかりません | 1-2 をやり直す、または `.env` の名前を確認する |

---

## 2. 写真スタジオの使い方

```bash
npm run photos:studio
```

ブラウザが自動で開きます（開かない場合は http://localhost:4477 へ）。
あとは画面の中だけで完結します。

1. **写真をドラッグ＆ドロップする。** クリックして選ぶこともできます。
   読み込んだ時点でメタデータは削除され、サムネイルと寸法が出ます。
2. **右側にアルバム名・場所を入力する。**
   撮影日は EXIF から自動で入ります。スラッグと各タグは英語名から自動生成され、
   自分で書き換えたあとは上書きされません。
3. **並び順と表紙を決める。** サムネイルをドラッグで並び替え、
   「表紙にする」で表紙を指定、「外す」で除外します。
4. **「アップロードして公開」を押す。** 進捗が下のバーに出ます。
   終わると生成された Markdown のパスとプレビューのリンクが表示されます。

同じ日付・スラッグのアルバムが既にある場合は、アップロードを始める前に止まります。

終了するには、起動したターミナルで `Ctrl+C`。

確認するには別のターミナルで `npm run dev` を起動し、表示されたリンクを開きます。
問題なければ、生成された Markdown をコミットしてください。

---

## 3. コマンドラインの使い方

```bash
npm run photos:add -- ~/Pictures/2026-03-kyoto
```

フォルダでも個別のファイルでも渡せます。
アルバム名・場所・撮影日・タグは対話式で尋ねられ、すべてフラグでも指定できます。

```bash
npm run photos:add -- ~/Pictures/2026-03-kyoto \
  --title-ja "京都の春" --title-en "Kyoto in Spring" \
  --location-ja "日本、京都" --location-en "Kyoto, Japan" \
  --date 2026-03-21 --location-tag kyoto --collection-tag nihon \
  --slug kyoto-spring --featured
```

| フラグ | 説明 |
| --- | --- |
| `--dry-run` | アップロードも書き込みもせず、生成される front matter を表示する |
| `--keep-local` | 変換後の画像を一時フォルダに残す |
| `--featured` | トップページに出す |

---

## 4. 内部でやっていること

1. フォルダ内の画像をファイル名順に集める。
2. EXIF の向きを画像に焼き込み、**メタデータをすべて削除する**（GPS の位置情報を含む）。
   撮影地が写真から漏れないよう、アップロード前に必ず取り除かれます。
3. 元の EXIF からカメラ・絞り・シャッター速度・ISO・撮影日を読み取る。
   アルバム内で最も多い値が front matter に入ります。
4. 品質 92 の JPEG として `photos/YYYY/MM/DD/` に置き、R2 へアップロードする。
5. `src/content/photos/YYYY/MM/DD_スラッグ.md` を書き出す。
   各画像の `width` / `height` も記録するため、表示時にレイアウトがずれません。

表示側の [`src/components/photo-preview.ts`](../src/components/photo-preview.ts) は URL で処理を分けます。

- `https://` で始まる URL → Cloudflare の画像変換で配信時に縮小する。
- `/assets/...` のローカルパス → これまで通りビルド時に最適化する。

そのため `public/assets/photos/` にある既存のアルバムは、移行しなくてもそのまま動きます。

---

## 5. うまくいかないとき

| 症状 | 対処 |
| --- | --- |
| 右上が赤で「ログインしていません」 | `npx wrangler login` |
| 右上が赤で「バケットが見つかりません」 | バケット名を確認。無ければ `npx wrangler r2 bucket create <名前>` |
| 起動時に `EADDRINUSE` | 既に起動しています。`.env` の `PORT` を変えるか、先に `Ctrl+C` で止める |
| 「対応していない形式です」 | jpg / jpeg / png / webp / tif / tiff / heic / heif のみ扱えます |
| 「既に存在します」 | 同じ日付とスラッグのアルバムがあります。スラッグを変えてください |
| サイトで画像が出ない（R2 には入っている） | 1-3 のカスタムドメインと 1-4 の画像変換を確認 |
