import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { NoteList } from "@/components/NoteList";
import { SessionCard } from "@/components/SessionCard";
import { SetupNotice } from "@/components/SetupNotice";
import { getPaper } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function PaperDetailPage({ params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) return <SetupNotice />;
  const { paper, sessions, notes } = await getPaper(params.id);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="glass mb-7 rounded-2xl p-6">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">
            <FileText className="h-4 w-4" />
            Paper Card
          </p>
          <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">{paper.title}</h1>
          {paper.authors ? <p className="mt-3 text-slate-300">{paper.authors}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {paper.year ? <Badge tone="cyan">{paper.year}</Badge> : null}
            {paper.venue ? <Badge tone="violet">{paper.venue}</Badge> : null}
            {paper.tags?.map((tag) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                <Badge icon="tag">{tag}</Badge>
              </Link>
            ))}
          </div>
          {paper.url ? (
            <Link href={paper.url} target="_blank" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-300/25 px-3 py-2 text-sm font-bold text-cyan-100 hover:border-cyan-300/50">
              論文URLを開く <ExternalLink className="h-4 w-4" />
            </Link>
          ) : null}
        </header>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="space-y-5">
            {paper.one_line_summary ? (
              <div className="glass rounded-2xl p-5">
                <h2 className="mb-2 text-lg font-black text-white">一言要約</h2>
                <p className="leading-7 text-cyan-100">{paper.one_line_summary}</p>
              </div>
            ) : null}
            {paper.japanese_summary ? (
              <div className="glass rounded-2xl p-5">
                <h2 className="mb-2 text-lg font-black text-white">日本語要約</h2>
                <p className="whitespace-pre-wrap leading-8 text-slate-300">{paper.japanese_summary}</p>
              </div>
            ) : null}
            {paper.abstract ? (
              <div className="glass rounded-2xl p-5">
                <h2 className="mb-2 text-lg font-black text-white">Abstract</h2>
                <p className="whitespace-pre-wrap leading-8 text-slate-300">{paper.abstract}</p>
              </div>
            ) : null}
          </section>

          <aside className="space-y-6">
            <section>
              <h2 className="mb-3 text-xl font-black text-white">関連発表回</h2>
              <div className="space-y-3">
                {sessions.map((session) => <SessionCard key={session.id} session={session} />)}
                {!sessions.length ? <p className="text-sm text-slate-500">関連発表回はまだありません。</p> : null}
              </div>
            </section>
            <section>
              <h2 className="mb-3 text-xl font-black text-white">関連メモ</h2>
              <NoteList notes={notes} compact />
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
