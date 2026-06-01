import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Note, Seminar, Session } from "@/lib/supabase";
import { Badge } from "./Badge";
import { MathText } from "./MathText";

type RelatedNote = Note & {
  session?: Session & { seminar?: Pick<Seminar, "id" | "name" | "color"> };
};

export function RelatedNotes({ notes }: { notes: RelatedNote[] }) {
  if (!notes.length) {
    return <div className="rounded-2xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">タグが一致する過去メモはまだありません。</div>;
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <article key={note.id} className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4">
          <div className="mb-2 text-xs text-slate-400">
            {note.session?.seminar?.name || "ゼミ未設定"} · {note.session?.title || "発表回未設定"}
            {note.session?.paper_title ? ` · ${note.session.paper_title}` : ""}
          </div>
          <h4 className="line-clamp-2 text-sm font-bold text-white">
            <MathText text={note.question} />
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {note.page_number ? <Badge tone="cyan">p.{note.page_number}</Badge> : null}
            {note.tags?.map((tag) => <Badge key={tag} icon="tag">{tag}</Badge>)}
          </div>
          <Link href={`/sessions/${note.session_id}`} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-cyan-100 hover:text-cyan-50">
            発表回を開く <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </article>
      ))}
    </div>
  );
}
