import { createTranslationNote } from "@/lib/actions";
import { TranslationNote } from "@/lib/supabase";
import { Badge } from "./Badge";
import { SubmitButton } from "./SubmitButton";
import { MathText } from "./MathText";

export function TranslationPanel({ sessionId, notes }: { sessionId: string; notes: TranslationNote[] }) {
  return (
    <section className="space-y-4">
      <div className="glass rounded-2xl p-4">
        <div className="mb-3">
          <h3 className="text-base font-black text-white">Translation</h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">論文やPDFの気になる箇所だけ、日本語訳メモとして残します。全文翻訳の保存用ではありません。</p>
        </div>
        <form action={createTranslationNote} className="space-y-3">
          <input type="hidden" name="session_id" value={sessionId} />
          <div className="grid gap-3 sm:grid-cols-[110px_1fr]">
            <input name="page_number" type="number" min="1" placeholder="ページ" className="field" />
            <input name="section_title" placeholder="節タイトル・見出し" className="field" />
          </div>
          <textarea name="original_text" rows={4} placeholder="原文の一部" className="field" />
          <textarea name="japanese_translation" rows={4} placeholder="日本語訳メモ" className="field" />
          <textarea name="my_comment" rows={3} placeholder="自分のコメント・理解" className="field" />
          <input name="tags" placeholder="タグ（カンマ区切り）" className="field" />
          <SubmitButton pendingText="保存中..." className="w-full rounded-xl bg-cyan-300 px-4 py-3 font-black text-slate-950 hover:bg-cyan-200">
            翻訳メモを保存
          </SubmitButton>
        </form>
      </div>

      <div className="space-y-3">
        {notes.length ? notes.map((note) => (
          <article key={note.id} className="glass rounded-2xl p-4">
            <div className="mb-2 flex flex-wrap gap-2">
              {note.page_number ? <Badge tone="cyan">p.{note.page_number}</Badge> : null}
              {note.section_title ? <Badge tone="violet">{note.section_title}</Badge> : null}
              {note.tags?.map((tag) => <Badge key={tag} icon="tag">{tag}</Badge>)}
            </div>
            {note.original_text ? (
              <section className="mb-3">
                <h4 className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Original</h4>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                  <MathText text={note.original_text} />
                </p>
              </section>
            ) : null}
            {note.japanese_translation ? (
              <section className="mb-3">
                <h4 className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">日本語訳</h4>
                <p className="whitespace-pre-wrap text-sm leading-6 text-white">
                  <MathText text={note.japanese_translation} />
                </p>
              </section>
            ) : null}
            {note.my_comment ? <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{note.my_comment}</p> : null}
          </article>
        )) : <div className="rounded-2xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">翻訳メモはまだありません。</div>}
      </div>
    </section>
  );
}
