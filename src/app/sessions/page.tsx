import Link from "next/link";
import { Library } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SearchBar } from "@/components/SearchBar";
import { SessionCard } from "@/components/SessionCard";
import { SetupNotice } from "@/components/SetupNotice";
import { getSessions } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;
  const sessions = await getSessions();

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">
              <Library className="h-4 w-4" />
              Sessions
            </p>
            <h1 className="mt-2 text-4xl font-black text-white">発表回ライブラリ</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">研究ゼミ、数理最適化ゼミ、Python 機械学習ゼミの発表回をまとめて見返せます。</p>
          </div>
          <Link href="/sessions/new" className="rounded-xl bg-cyan-300 px-5 py-3 font-black text-slate-950 hover:bg-cyan-200">発表回を追加</Link>
        </header>
        <div className="mb-6"><SearchBar /></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => <SessionCard key={session.id} session={session} />)}
        </div>
      </div>
    </AppShell>
  );
}
