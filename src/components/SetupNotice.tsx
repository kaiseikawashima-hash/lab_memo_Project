import { TerminalSquare } from "lucide-react";

export function SetupNotice() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <section className="glass max-w-3xl rounded-2xl p-7">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-100">
          <TerminalSquare className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">セットアップが必要です</p>
        <h1 className="mt-2 text-3xl font-black text-white">Supabase を接続すると OptiLens を開始できます</h1>
        <p className="mt-3 text-slate-300">
          `.env.local` に Supabase URL と publishable key を設定し、README の SQL を実行してください。
        </p>
        <pre className="mt-5 overflow-auto rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-sm text-cyan-100">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key`}
        </pre>
        <p className="mt-4 text-sm text-slate-500">
          SQL 実行順: supabase/schema.sql, supabase/seed.sql, supabase/policies.sql, supabase/storage.sql
        </p>
      </section>
    </main>
  );
}
