import Link from "next/link";
import { CalendarDays, ExternalLink, FileText } from "lucide-react";
import { deleteSession } from "@/lib/actions";
import { SessionWithCounts } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { Badge } from "./Badge";
import { DeleteButton } from "./DeleteButton";

export function countOf(value?: { count: number }[]) {
  return value?.[0]?.count ?? 0;
}

export function SessionCard({ session }: { session: SessionWithCounts }) {
  return (
    <article className="glass rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:shadow-glow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
            <CalendarDays className="h-4 w-4" />
            {formatDate(session.date)}
          </div>
          <h3 className="text-lg font-bold text-white">{session.title}</h3>
        </div>
        {session.seminar ? <Badge tone="cyan">{session.seminar.name}</Badge> : null}
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-slate-300">{session.paper_title || "論文タイトル未設定"}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Badge icon="tag">{countOf(session.notes)} 件のメモ</Badge>
        <Badge tone="amber" icon="flag">重要 {countOf(session.important_notes)}</Badge>
        <Badge tone="violet" icon="check">発表前 {countOf(session.before_talk_notes)}</Badge>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <FileText className="h-4 w-4" />
        {session.paper_authors || "著者未設定"}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <Link href={`/sessions/${session.id}`} className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-100 hover:border-cyan-300/50">
          開く <ExternalLink className="h-4 w-4" />
        </Link>
        <form action={deleteSession}>
          <input type="hidden" name="session_id" value={session.id} />
          <input type="hidden" name="pdf_path" value={session.pdf_path || ""} />
          <DeleteButton label="発表回を削除" />
        </form>
      </div>
    </article>
  );
}
