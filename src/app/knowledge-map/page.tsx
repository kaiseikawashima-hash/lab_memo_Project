import Link from "next/link";
import { Network } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { SetupNotice } from "@/components/SetupNotice";
import { getKnowledgeMap } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function KnowledgeMapPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;
  const map = await getKnowledgeMap();

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">
            <Network className="h-4 w-4" />
            Knowledge Map
          </p>
          <h1 className="mt-2 text-4xl font-black text-white">研究テーマを探索する</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">タグの一致を使って、論文・発表回・メモをテーマごとに束ねています。ベクトル検索は次フェーズで拡張できます。</p>
        </header>

        <div className="grid gap-4 xl:grid-cols-2">
          {map.map((item) => (
            <Link key={item.tag} href={`/tags/${encodeURIComponent(item.tag)}`} className="group glass rounded-2xl p-5 hover:border-cyan-300/30">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-white group-hover:text-cyan-100">{item.tag}</h2>
                <Badge tone="cyan">{item.papers.length + item.sessions.length + item.notes.length} links</Badge>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <MapColumn title="Papers" items={item.papers.map((paper) => paper.title)} />
                <MapColumn title="Sessions" items={item.sessions.map((session) => session.title)} />
                <MapColumn title="Notes" items={item.notes.map((note) => note.question)} />
              </div>
            </Link>
          ))}
        </div>
        {!map.length ? <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-slate-400">タグ付きの知識ノードはまだありません。</div> : null}
      </div>
    </AppShell>
  );
}

function MapColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-950/40 p-3">
      <h3 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-200">{title}</h3>
      <div className="space-y-2">
        {items.slice(0, 4).map((item) => (
          <p key={item} className="line-clamp-2 text-xs leading-5 text-slate-300">{item}</p>
        ))}
        {!items.length ? <p className="text-xs text-slate-600">none</p> : null}
      </div>
    </div>
  );
}
