import Link from "next/link";
import { updateSession } from "@/lib/actions";
import { Seminar, Session } from "@/lib/supabase";
import { SubmitButton } from "./SubmitButton";

export function SessionEditForm({
  seminars,
  session
}: {
  seminars: Seminar[];
  session: Session & { seminar?: Pick<Seminar, "id" | "name" | "color"> | null };
}) {
  const selectedSeminarId = seminars.find((seminar) => seminar.name === session.seminar?.name)?.id || session.seminar_id;

  return (
    <form action={updateSession} className="glass grid gap-5 rounded-2xl p-6">
      <input type="hidden" name="session_id" value={session.id} />
      <input type="hidden" name="old_pdf_path" value={session.pdf_path || ""} />

      <div className="grid gap-4 md:grid-cols-3">
        <label>
          <span className="label">ゼミ</span>
          <select name="seminar_id" required className="field" defaultValue={selectedSeminarId}>
            {seminars.map((seminar) => (
              <option key={seminar.id} value={seminar.id}>
                {seminar.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">第何回</span>
          <input name="session_number" type="number" min="1" className="field" defaultValue={session.session_number || ""} />
        </label>
        <label>
          <span className="label">日付</span>
          <input name="date" type="date" className="field" defaultValue={session.date || ""} />
        </label>
      </div>

      <label>
        <span className="label">発表・内容タイトル</span>
        <input name="title" required className="field" defaultValue={session.title} />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="label">発表者</span>
          <input name="speaker" className="field" defaultValue={session.speaker || ""} />
        </label>
        <label>
          <span className="label">論文 URL</span>
          <input name="paper_url" type="url" className="field" defaultValue={session.paper_url || ""} />
        </label>
      </div>

      <label>
        <span className="label">論文タイトル（研究ゼミ向け・任意）</span>
        <input name="paper_title" className="field" defaultValue={session.paper_title || ""} />
      </label>

      <label>
        <span className="label">論文著者（任意）</span>
        <input name="paper_authors" className="field" defaultValue={session.paper_authors || ""} />
      </label>

      <label>
        <span className="label">内容メモ・概要</span>
        <textarea name="summary" rows={4} className="field" defaultValue={session.summary || ""} />
      </label>

      <label>
        <span className="label">{session.pdf_url ? "PDF ファイルを差し替え" : "PDF ファイルを追加"}</span>
        <input name="pdf_file" type="file" accept="application/pdf" className="field file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400/15 file:px-3 file:py-2 file:text-cyan-100" />
      </label>

      {session.pdf_url ? (
        <p className="text-sm text-slate-400">現在の PDF は、新しい PDF を選んで保存すると差し替わります。</p>
      ) : (
        <p className="text-sm text-slate-400">スライド作成前に発表回だけ作っておき、完成後にここから PDF を追加できます。</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton pendingText="保存中..." className="rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-200">
          変更を保存
        </SubmitButton>
        <Link href={`/sessions/${session.id}`} className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-cyan-300/50">
          キャンセル
        </Link>
      </div>
    </form>
  );
}
