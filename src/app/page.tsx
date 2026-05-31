import Link from "next/link";
import { AlertTriangle, Database, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { NoteList } from "@/components/NoteList";
import { SearchBar } from "@/components/SearchBar";
import { SessionCard } from "@/components/SessionCard";
import { SetupNotice } from "@/components/SetupNotice";
import { getNotes, getSeminars, getSessions } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase";
import { seminarDescription } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const [seminars, sessions, notes] = await Promise.all([getSeminars(), getSessions(), getNotes()]);
  const beforeTalk = notes.filter((note) => note.is_before_talk).slice(0, 5);
  const important = notes.filter((note) => note.is_important).slice(0, 5);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-5 py-8">
        <header className="mb-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                <Sparkles className="h-3.5 w-3.5" />
                ML・数理最適化のための個人研究ナレッジベース
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">Seminar OS</h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                研究テーマは「AIや最適化モデルがなぜその答えを選んだのか」を、人間にも説明できる形にすることです。
                複雑な意思決定をただ当てるだけでなく、根拠まで追える仕組みを作ることで、医療・金融・社会システムのような重要な場面でも安心して使える最適化を目指しています。
              </p>
            </div>
            <Link href="/sessions/new" className="rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-200">
              発表回を追加
            </Link>
          </div>
          <SearchBar />
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          {seminars.map((seminar) => {
            const ownSessions = sessions.filter((session) => session.seminar?.name === seminar.name || session.seminar_id === seminar.id);
            return (
              <Link key={seminar.id} href={`/seminars/${seminar.id}`} className="glass rounded-2xl p-5 hover:border-cyan-300/30">
                <div className="mb-4 flex items-center justify-between">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: seminar.color || "#22d3ee" }} />
                  <Badge tone="cyan">{ownSessions.length} 件の発表回</Badge>
                </div>
                <h2 className="text-xl font-bold text-white">{seminar.name}</h2>
                <p className="mt-2 min-h-10 text-sm text-slate-400">{seminarDescription(seminar.name, seminar.description)}</p>
              </Link>
            );
          })}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-cyan-200" />
              <h2 className="text-xl font-bold">最近追加した発表回</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {sessions.slice(0, 6).map((session) => <SessionCard key={session.id} session={session} />)}
            </div>
          </section>

          <aside className="space-y-6">
            <section>
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-violet-200" />
                <h2 className="text-xl font-bold">発表前に確認したいメモ</h2>
              </div>
              <NoteList notes={beforeTalk} compact />
            </section>
            <section>
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-200" />
                <h2 className="text-xl font-bold">重要メモ</h2>
              </div>
              <NoteList notes={important} compact />
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
