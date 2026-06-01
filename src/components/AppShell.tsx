import Link from "next/link";
import { BrainCircuit, FilePlus2, Home, Layers3 } from "lucide-react";
import { getSeminars, getSessions } from "@/lib/queries";
import { formatDate, sessionNumberLabel } from "@/lib/utils";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const [seminars, sessions] = await Promise.all([getSeminars(), getSessions()]);

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-line bg-slate-950/72 p-5 backdrop-blur-xl lg:block">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-100">
            <BrainCircuit className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-wide">Seminar OS</span>
            <span className="block text-xs text-slate-400">研究メモ / 輪読ログ</span>
          </span>
        </Link>

        <nav className="mt-8 space-y-2">
          <Link className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5" href="/">
            <Home className="h-4 w-4 text-cyan-200" />
            ダッシュボード
          </Link>
          <Link className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5" href="/sessions/new">
            <FilePlus2 className="h-4 w-4 text-violet-200" />
            発表回を追加
          </Link>
        </nav>

        <div className="mt-8">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            <Layers3 className="h-4 w-4" />
            ゼミ一覧
          </div>
          <div className="space-y-4">
            {seminars.map((seminar) => {
              const ownSessions = sessions.filter((session) => session.seminar?.name === seminar.name || session.seminar_id === seminar.id);
              return (
                <section key={seminar.id}>
                  <Link href={`/seminars/${seminar.id}`} className="group flex items-center justify-between rounded-xl px-3 py-2 hover:bg-white/5">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seminar.color || "#22d3ee" }} />
                      {seminar.name}
                    </span>
                    <span className="text-xs text-slate-500">{ownSessions.length}</span>
                  </Link>
                  <div className="mt-1 space-y-1 pl-6">
                    {ownSessions.slice(0, 5).map((session) => (
                      <Link key={session.id} href={`/sessions/${session.id}`} className="block truncate rounded-lg px-2 py-1.5 text-xs text-slate-400 hover:bg-white/5 hover:text-cyan-100">
                        {sessionNumberLabel(session.session_number) ? `${sessionNumberLabel(session.session_number)} · ` : ""}
                        {formatDate(session.date)} · {session.title}
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </aside>
      <main className="lg:pl-72">{children}</main>
    </div>
  );
}
