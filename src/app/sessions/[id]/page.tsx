import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import { deleteSession } from "@/lib/actions";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { DeleteButton } from "@/components/DeleteButton";
import { NoteForm } from "@/components/NoteForm";
import { NoteList } from "@/components/NoteList";
import { PdfViewer } from "@/components/PdfViewer";
import { SetupNotice } from "@/components/SetupNotice";
import { getNotes, getSession } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase";
import { formatDate, sessionNumberLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SessionDetailPage({ params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const [session, notes] = await Promise.all([getSession(params.id), getNotes(params.id)]);

  return (
    <AppShell>
      <div className="grid min-h-screen gap-5 px-4 py-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="min-w-0">
          <div className="mb-5 glass rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge tone="cyan">{session.seminar.name}</Badge>
                  {sessionNumberLabel(session.session_number) ? <Badge tone="violet">{sessionNumberLabel(session.session_number)}</Badge> : null}
                  <Badge>{formatDate(session.date)}</Badge>
                  {session.speaker ? <Badge tone="violet">{session.speaker}</Badge> : null}
                </div>
                <h1 className="text-2xl font-black text-white md:text-3xl">{session.title}</h1>
                {session.paper_title ? <p className="mt-2 text-slate-300">{session.paper_title}</p> : null}
                {!session.paper_title && session.summary ? <p className="mt-2 text-slate-300">{session.summary}</p> : null}
                {session.paper_authors ? <p className="mt-1 text-sm text-slate-500">{session.paper_authors}</p> : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {session.paper_url ? (
                  <Link href={session.paper_url} target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-cyan-300/50">
                    論文を開く <ExternalLink className="h-4 w-4" />
                  </Link>
                ) : null}
                <Link href={`/sessions/${session.id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-100 hover:border-cyan-300/50">
                  編集・PDF追加 <Pencil className="h-4 w-4" />
                </Link>
                <form action={deleteSession}>
                  <input type="hidden" name="session_id" value={session.id} />
                  <input type="hidden" name="pdf_path" value={session.pdf_path || ""} />
                  <DeleteButton label="発表回を削除" />
                </form>
              </div>
            </div>
          </div>
          <PdfViewer url={session.pdf_url} />
        </section>

        <aside className="space-y-5">
          <div>
            <h2 className="mb-3 text-lg font-bold">AI 質問ログと理解メモ</h2>
            <NoteForm sessionId={session.id} />
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold">保存済みメモ</h2>
            <NoteList notes={notes} />
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
