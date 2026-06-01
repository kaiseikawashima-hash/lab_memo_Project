# Seminar OS

Personal research knowledge base for ML and Optimization.

研究ゼミ・輪読ゼミで使った PDF スライドや資料を保存し、発表回ごとに「AI への質問・回答・自分の理解メモ」を蓄積する B4 研究用 MVP です。AI 連携はせず、ChatGPT や Claude で得た回答を手動で貼り付けて、あとから検索・復習できるようにします。

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
```

`.env.local` は Git 管理しないでください。

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

ゼミ名が重複してしまった場合は、追加で `supabase/fix_duplicates.sql` を一度だけ実行してください。

同じ発表回を二重作成してしまった場合は、メモ 0 件の重複だけを削除する `supabase/remove_empty_duplicate_sessions.sql` を実行できます。

`schema.sql` は `seminars`, `sessions`, `notes` テーブル、更新日時 trigger、検索・集計用 index を作成します。

`seed.sql` は初期ゼミとして次の 3 件を投入します。

- 研究ゼミ
- 数理最適化ゼミ
- Python 機械学習ゼミ

`policies.sql` は MVP 用に認証なしの read / insert / update policy を作成します。

`storage.sql` は `seminar-pdfs` bucket と MVP 用の public read / anon upload policy を作成します。認証を入れる将来版では、Database と Storage の policy を private bucket + authenticated user policy に移行してください。

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

## Vercel デプロイ時の注意

1. Vercel に GitHub repository を接続します。
2. Environment Variables に以下を登録します。
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Supabase Storage の policy が Vercel からのアップロードを許可していることを確認します。
4. MVP では認証なしの public bucket です。自分専用運用でも、公開 URL を知っている人は PDF を閲覧できる可能性があります。秘匿性が必要な資料は、認証導入後に private bucket へ移行してください。

## 今後の拡張案

- Supabase Auth によるログイン
- private bucket と signed URL
- `react-pdf` によるページ単位 PDF viewer
- ノートの編集・削除
- 全文検索用の PostgreSQL `tsvector`
- タグ別ビュー
- 発表前レビュー用 checklist
- AI API 連携による質問ログ自動整形
- スライド自動要約

## MVP で実装しないもの

- ログイン機能
- AI API 連携
- 複数ユーザー共有
- 権限管理
- 決済
- スライド自動要約
- 音声文字起こし
- Notion 連携
- Slack 連携
