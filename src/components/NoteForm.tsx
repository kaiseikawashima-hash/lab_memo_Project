"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { createNote } from "@/lib/actions";
import { SubmitButton } from "./SubmitButton";

export function NoteForm({ sessionId }: { sessionId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleCreateNote(formData: FormData) {
    await createNote(formData);
    formRef.current?.reset();
    router.refresh();
  }

  return (
    <form ref={formRef} action={handleCreateNote} className="glass grid gap-4 rounded-2xl p-4">
      <input type="hidden" name="session_id" value={sessionId} />
      <div className="grid gap-3 sm:grid-cols-[1fr_7rem]">
        <label>
          <span className="label">質問</span>
          <textarea name="question" required rows={3} className="field" placeholder="AI に聞いた質問を貼り付け" />
        </label>
        <label>
          <span className="label">ページ</span>
          <input name="page_number" type="number" min="1" className="field" />
        </label>
      </div>
      <label>
        <span className="label">AI の回答</span>
        <textarea name="answer" rows={5} className="field" />
      </label>
      <label>
        <span className="label">自分の理解メモ</span>
        <textarea name="my_note" rows={4} className="field" placeholder="自分の理解メモ" />
      </label>
      <label>
        <span className="label">タグ</span>
        <input name="tags" className="field" placeholder="convex, duality, transformer" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm">
          <input name="is_important" type="checkbox" className="h-4 w-4 accent-amber-300" />
          重要
        </label>
        <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm">
          <input name="is_before_talk" type="checkbox" className="h-4 w-4 accent-violet-300" />
          発表前に確認したい
        </label>
      </div>
      <p className="text-xs leading-relaxed text-slate-500">
        数式は KaTeX 形式で入力できます。例: $x^2$ や $$\min_x f(x)$$ のように書くと表示が崩れにくいです。
      </p>
      <SubmitButton pendingText="保存中..." className="rounded-xl bg-violet-300 px-4 py-3 font-bold text-slate-950 transition hover:bg-violet-200">
        質問ログを保存
      </SubmitButton>
    </form>
  );
}
