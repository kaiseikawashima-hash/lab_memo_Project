import { Tags } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { NoteList } from "@/components/NoteList";
import { PaperCard } from "@/components/PaperCard";
import { SessionCard } from "@/components/SessionCard";
import { SetupNotice } from "@/components/SetupNotice";
import { getTagDetail } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function TagDetailPage({ params }: { params: { tag: string } }) {
  if (!isSupabaseConfigured()) return <SetupNotice />;
  const detail = await getTagDetail(params.tag);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-7">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">
            <Tags className="h-4 w-4" />
            Tag Detail
          </p>
          <h1 className="mt-2 text-4xl font-black text-white">{detail.tag}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="cyan">Papers {detail.papers.length}</Badge>
            <Badge tone="violet">Sessions {detail.sessions.length}</Badge>
            <Badge tone="amber">Notes {detail.notes.length}</Badge>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-black text-white">Papers</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {detail.papers.map((paper) => <PaperCard key={paper.id} paper={paper} />)}
          </div>
          {!detail.papers.length ? <p className="text-sm text-slate-500">関連論文はありません。</p> : null}
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-black text-white">Sessions</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {detail.sessions.map((session) => <SessionCard key={session.id} session={session} />)}
          </div>
          {!detail.sessions.length ? <p className="text-sm text-slate-500">関連発表回はありません。</p> : null}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-black text-white">Notes</h2>
          <NoteList notes={detail.notes} />
        </section>
      </div>
    </AppShell>
  );
}
