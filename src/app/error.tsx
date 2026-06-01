"use client";

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="glass max-w-2xl rounded-2xl p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">セットアップ確認</p>
        <h1 className="mt-2 text-2xl font-black text-white">OptiLens がデータを読み込めませんでした</h1>
        <p className="mt-3 text-slate-300">{error.message}</p>
        <p className="mt-4 text-sm text-slate-500">
          Supabase の環境変数、README の SQL、seminar-pdfs bucket を確認してください。
        </p>
      </div>
    </main>
  );
}
