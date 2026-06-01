# OptiLens

説明できる最適化ノート。最適多分木を用いた解釈可能な最適化モデルの研究ログです。

研究ゼミ・輪読ゼミで使った PDF スライドや資料を保存し、発表回ごとに「AI への質問・回答・自分の理解メモ」を蓄積する B4 研究用アプリです。Phase 2 では Papers / Knowledge Map / Tags / Translation Notes と、Gemini API による PDF 要約・タグ生成を追加しています。

## 使用技術

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Database
- Supabase Storage
- Vercel deploy ready

## セットアップ手順

1. 依存関係をインストールします。

```bash
npm install
```

2. `.env.example` を参考に `.env.local` を作成します。

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
GEMINI_API_KEY=your-server-side-gemini-key
```

`.env.local` は Git 管理しないでください。

Gemini API key は必ず `GEMINI_API_KEY` に設定してください。`NEXT_PUBLIC_GEMINI_API_KEY` は使いません。Gemini API の呼び出しは Next.js Route Handler のサーバー側だけで行い、ブラウザへキーを露出しない構成です。

## Supabase プロジェクトの作成方法

1. Supabase で新規プロジェクトを作成します。
2. Project Settings -> API から Project URL と publishable key / anon key を確認します。
3. それぞれ `.env.local` に設定します。

## Supabase SQL Editor で実行する SQL

Supabase dashboard の SQL Editor で、以下の順番で実行してください。

1. `supabase/schema.sql`
2. `supabase/seed.sql`
3. `supabase/policies.sql`
4. `supabase/storage.sql`
5. `supabase/phase2_migration.sql`

ゼミ名が重複してしまった場合は、追加で `supabase/fix_duplicates.sql` を一度だけ実行してください。

同じ発表回を二重作成してしまった場合は、メモ 0 件の重複だけを削除する `supabase/remove_empty_duplicate_sessions.sql` を実行できます。

`schema.sql` は `seminars`, `sessions`, `notes` テーブル、更新日時 trigger、検索・集計用 index を作成します。

`seed.sql` は初期ゼミとして次の 3 件を投入します。

- 研究ゼミ
- 数理最適化ゼミ
- Python 機械学習ゼミ

`policies.sql` は MVP 用に認証なしの read / insert / update policy を作成します。

`storage.sql` は `seminar-pdfs` bucket と MVP 用の public read / anon upload policy を作成します。認証を入れる将来版では、Database と Storage の policy を private bucket + authenticated user policy に移行してください。

`phase2_migration.sql` は `papers`, `translation_notes` テーブルを作成し、既存の `sessions` に `paper_id`, `ai_one_liner`, `ai_summary`, `ai_tags`, `ai_keywords` を追加します。既存データを壊さない `alter table ... add column if not exists` 形式です。

## Storage bucket の作成方法

SQL で作成する場合は `supabase/storage.sql` を実行すれば完了です。

Dashboard で手動作成する場合は、Storage -> New bucket から以下を設定してください。

- Bucket name: `seminar-pdfs`
- Public bucket: enabled

その後、SQL Editor で `supabase/storage.sql` 内の policy 部分を実行してください。

PDF の保存パスはアプリ側で次の形式になります。

```text
sessions/{session_id}/{timestamp}-{filename}
```

## ローカル起動方法

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## できること

- ダッシュボード表示
- ゼミ別の発表回一覧
- 発表回作成
- 第何回かの記録
- PDF アップロード
- 発表回詳細ページでの PDF 表示
- AI 質問ログの手動登録
- ページ番号の任意保存
- 重要フラグ
- 発表前確認フラグ
- タグ保存
- キーワード検索
- 重要メモ / 発表前確認メモのフィルタ
- Papers ページで論文カード一覧・詳細表示
- Knowledge Map でタグごとに論文・発表回・メモを横断表示
- Tags ページでタグ索引と関連データ表示
- 発表回詳細で Related Notes 表示
- Gemini API による PDF 要約・タグ・キーワード生成
- Gemini API による論文カード候補作成
- Translation タブで日本語訳メモを保存

## Phase 2 の使い方

発表回詳細ページで `AIでPDFを要約`, `AIでタグ生成`, `AIで論文カード作成` を押すと、Gemini がアップロード済み PDF または発表回メタデータをもとに候補を生成します。生成結果はすぐ保存されず、確認フォームで内容を見てから保存できます。

`/papers` では論文カードを一覧できます。`/knowledge-map` と `/tags` では、タグ一致を使って論文・発表回・質問ログを横断的に見返せます。

発表回詳細の `Translation` では、PDF や論文の気になる箇所だけを日本語訳メモとして保存します。原文全文の保存や完全翻訳を目的にした機能ではありません。

## PDF 要約機能の制約

Gemini Route Handler はまず Supabase Storage の public URL から PDF を取得し、取得できた場合は PDF を Gemini に渡します。PDF URL がない、Storage policy で取得できない、PDF が大きすぎるなどの場合は、発表タイトル・論文タイトル・概要などの既存メタデータを使った生成になります。

## Vercel デプロイ時の注意

1. Vercel に GitHub repository を接続します。
2. Environment Variables に以下を登録します。
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `GEMINI_API_KEY`
3. Supabase Storage の policy が Vercel からのアップロードを許可していることを確認します。
4. `GEMINI_API_KEY` は Sensitive として登録して構いません。`NEXT_PUBLIC_GEMINI_API_KEY` は登録しないでください。
5. MVP では認証なしの public bucket です。自分専用運用でも、公開 URL を知っている人は PDF を閲覧できる可能性があります。秘匿性が必要な資料は、認証導入後に private bucket へ移行してください。

## 今後の拡張案

- Supabase Auth によるログイン
- private bucket と signed URL
- `react-pdf` によるページ単位 PDF viewer
- ノートの編集・削除
- 全文検索用の PostgreSQL `tsvector`
- タグ別ビュー
- ベクトル検索による関連メモ推薦
- 発表前レビュー用 checklist
- AI API 連携による質問ログ自動整形
- スライド自動要約

## MVP で実装しないもの

- ログイン機能
- 複数ユーザー共有
- 権限管理
- 決済
- スライド自動要約
- 音声文字起こし
- Notion 連携
- Slack 連携
