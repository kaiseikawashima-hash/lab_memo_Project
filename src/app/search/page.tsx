import { Filter } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { NoteList } from "@/components/NoteList";
import { SearchBar } from "@/components/SearchBar";
import { SessionCard } from "@/components/SessionCard";
import { SetupNotice } from "@/components/SetupNotice";
import { searchAll } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams
}: {
  searchParams: { q?: string; filter?: string };
}) {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const q = searchParams.q || "";
  const filter = searchParams.filter;
  const { sessions, notes } = await searchAll(q, filter);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 py-8">
        <header className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">グローバル検索</p>
          <h1 className="mt-2 text-4xl font-black text-white">理解メモを探す</h1>
          <div className="mt-5"><SearchBar defaultValue={q} /></div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <Link href={`/search?q=${encodeURIComponent(q)}`}><Badge tone={!filter ? "cyan" : "slate"}>すべて</Badge></Link>
            <Link href={`/search?q=${encodeURIComponent(q)}&filter=important`}><Badge tone={filter === "important" ? "amber" : "slate"}>重要のみ</Badge></Link>
            <Link href={`/search?q=${encodeURIComponent(q)}&filter=before`}><Badge tone={filter === "before" ? "violet" : "slate"}>発表前確認のみ</Badge></Link>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold">発表回の検索結果</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {sessions.map((session) => <SessionCard key={session.id} session={session} />)}
          </div>
          {!sessions.length ? <p className="text-sm text-slate-500">一致する発表回はありません。</p> : null}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold">質問ログの検索結果</h2>
          <NoteList notes={notes} />
        </section>
      </div>
    </AppShell>
  );
}
