import { createSession } from "@/lib/actions";
import { Seminar } from "@/lib/supabase";
import { SubmitButton } from "./SubmitButton";

export function SessionForm({ seminars }: { seminars: Seminar[] }) {
  return (
    <form action={createSession} className="glass grid gap-5 rounded-2xl p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <label>
          <span className="label">ゼミ</span>
          <select name="seminar_id" required className="field">
            {seminars.length ? (
              seminars.map((seminar) => <option key={seminar.id} value={seminar.id}>{seminar.name}</option>)
            ) : (
              <option value="">ゼミがありません。seed.sql を実行してください</option>
            )}
          </select>
        </label>
        <label>
          <span className="label">第何回</span>
          <input name="session_number" type="number" min="1" className="field" placeholder="例: 3" />
        </label>
        <label>
          <span className="label">日付</span>
          <input name="date" type="date" className="field" />
        </label>
      </div>
      <label>
        <span className="label">発表・内容タイトル</span>
        <input name="title" required className="field" placeholder="例: Big-M法と解釈可能性 / Pythonで学ぶSVM" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="label">発表者</span>
          <input name="speaker" className="field" />
        </label>
        <label>
          <span className="label">論文 URL</span>
          <input name="paper_url" type="url" className="field" placeholder="https://arxiv.org/..." />
        </label>
      </div>
      <label>
        <span className="label">論文タイトル（研究ゼミ向け・任意）</span>
        <input name="paper_title" className="field" />
      </label>
      <label>
        <span className="label">論文著者（任意）</span>
        <input name="paper_authors" className="field" />
      </label>
      <label>
        <span className="label">内容メモ・概要</span>
        <textarea name="summary" rows={4} className="field" />
      </label>
      <label>
        <span className="label">PDF ファイル</span>
        <input name="pdf_file" type="file" accept="application/pdf" className="field file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400/15 file:px-3 file:py-2 file:text-cyan-100" />
      </label>
      <SubmitButton pendingText="作成中..." className="rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-200">
        発表回を作成
      </SubmitButton>
    </form>
  );
}
