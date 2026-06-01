import { Settings } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-7">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">
            <Settings className="h-4 w-4" />
            Settings
          </p>
          <h1 className="mt-2 text-4xl font-black text-white">セットアップ状態</h1>
        </header>

        <div className="space-y-4">
          <section className="glass rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-white">Gemini API</h2>
              <Badge tone={geminiConfigured ? "cyan" : "amber"}>{geminiConfigured ? "設定済み" : "未設定"}</Badge>
            </div>
            <p className="text-sm leading-7 text-slate-300">
              Gemini API key は <code className="text-cyan-100">GEMINI_API_KEY</code> としてサーバー側だけで使います。
              <code className="text-cyan-100">NEXT_PUBLIC_GEMINI_API_KEY</code> は使いません。
            </p>
          </section>

          <section className="glass rounded-2xl p-5">
            <h2 className="mb-3 text-xl font-black text-white">Phase 2 SQL</h2>
            <p className="text-sm leading-7 text-slate-300">
              Papers、AI要約、Translation を使う前に Supabase SQL Editor で
              <code className="text-cyan-100"> supabase/phase2_migration.sql </code>
              を実行してください。
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
