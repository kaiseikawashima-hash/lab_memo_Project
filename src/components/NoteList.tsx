import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { deleteNote } from "@/lib/actions";
import { Note, Seminar, Session } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { Badge } from "./Badge";
import { DeleteButton } from "./DeleteButton";
import { MathText } from "./MathText";

type NoteWithSession = Note & {
  session?: Session & { seminar?: Pick<Seminar, "id" | "name" | "color"> };
};

export function NoteList({ notes, compact = false }: { notes: NoteWithSession[]; compact?: boolean }) {
  if (!notes.length) {
    return <div className="rounded-2xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">まだメモはありません。</div>;
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <article key={note.id} className="glass rounded-2xl p-4 hover:border-cyan-300/30">
          <details className="group">
            <summary className="cursor-pointer list-none">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {note.session ? (
                    <div className="mb-2 text-xs text-slate-400">
                      {note.session.seminar?.name} · {note.session.title} · {formatDate(note.created_at)}
                    </div>
                  ) : null}
                  <h4 className="line-clamp-2 text-sm font-semibold text-white group-open:line-clamp-none">
                    <MathText text={note.question} />
                  </h4>
                </div>
                <span className="shrink-0 rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-400 group-open:border-cyan-300/40 group-open:text-cyan-100">
                  詳細
                </span>
              </div>
            </summary>
            <div className="mt-4 space-y-4 border-t border-slate-700/70 pt-4">
              {note.answer ? (
                <section>
                  <h5 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">AI の回答</h5>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                    <MathText text={note.answer} />
                  </p>
                </section>
              ) : null}
              {note.my_note ? (
                <section>
                  <h5 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-200">自分の理解メモ</h5>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                    <MathText text={note.my_note} />
                  </p>
                </section>
              ) : null}
            </div>
          </details>
          {compact ? null : (
            <p className="mt-3 line-clamp-3 text-sm text-slate-300">
              <MathText text={note.my_note || note.answer || "回答・理解メモは未入力です。"} />
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {note.page_number ? <Badge tone="cyan">p.{note.page_number}</Badge> : null}
            {note.is_important ? <Badge tone="amber" icon="flag">重要</Badge> : null}
            {note.is_before_talk ? <Badge tone="violet" icon="check">発表前確認</Badge> : null}
            {note.tags?.map((tag) => <Badge key={tag} icon="tag">{tag}</Badge>)}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <Link href={`/sessions/${note.session_id}`} className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-100 hover:text-cyan-50">
              発表回を開く <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <form action={deleteNote}>
              <input type="hidden" name="note_id" value={note.id} />
              <input type="hidden" name="session_id" value={note.session_id} />
              <DeleteButton label="メモを削除" />
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}
