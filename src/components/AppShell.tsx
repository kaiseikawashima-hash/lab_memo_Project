import Link from "next/link";
import {
  BrainCircuit,
  ChevronDown,
  FilePlus2,
  FileText,
  Home,
  Layers3,
  Library,
  Network,
  Search,
  Settings,
  Tags
} from "lucide-react";
import { getSeminars, getSessions } from "@/lib/queries";
import { sessionNavLabel } from "@/lib/utils";
import { BackButton } from "./BackButton";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: Home, tone: "text-cyan-200" },
  { href: "/sessions", label: "発表回", icon: Library, tone: "text-violet-200" },
  { href: "/papers", label: "論文カード", icon: FileText, tone: "text-sky-200" },
  { href: "/knowledge-map", label: "知識マップ", icon: Network, tone: "text-cyan-200" },
  { href: "/tags", label: "タグ一覧", icon: Tags, tone: "text-violet-200" },
  { href: "/search", label: "検索", icon: Search, tone: "text-sky-200" },
  { href: "/settings", label: "設定", icon: Settings, tone: "text-slate-300" }
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const [seminars, sessions] = await Promise.all([getSeminars(), getSessions()]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-slate-950/86 px-3 py-2 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-2">
          <BackButton compact />
          <Link href="/" className="min-w-0 flex-1 truncate text-center text-sm font-black text-white">
            OptiLens
          </Link>
          <Link href="/sessions/new" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-100" aria-label="発表回を追加">
            <FilePlus2 className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-line bg-slate-950/72 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="shrink-0 p-5 pb-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-100">
              <BrainCircuit className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-lg font-bold tracking-wide">OptiLens</span>
              <span className="block text-xs text-slate-400">説明できる最適化ノート</span>
            </span>
          </Link>

          <nav className="mt-7 space-y-1">
            <BackButton />
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5" href={item.href}>
                  <Icon className={`h-4 w-4 ${item.tone}`} />
                  {item.label}
                </Link>
              );
            })}
            <Link className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-3 py-2.5 text-sm font-black text-slate-950 hover:bg-cyan-200" href="/sessions/new">
              <FilePlus2 className="h-4 w-4" />
              発表回を追加
            </Link>
          </nav>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-5 [scrollbar-color:rgba(34,211,238,0.45)_transparent]">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            <Layers3 className="h-4 w-4" />
            ゼミ一覧
          </div>
          <div className="space-y-4">
            {seminars.map((seminar) => {
              const ownSessions = sessions.filter((session) => session.seminar?.name === seminar.name || session.seminar_id === seminar.id);
              return (
                <details key={seminar.id} className="group rounded-xl" open={ownSessions.length > 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2 hover:bg-white/5">
                    <Link href={`/seminars/${seminar.id}`} className="flex min-w-0 items-center gap-2 text-sm font-semibold" title={`${seminar.name}を開く`}>
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: seminar.color || "#22d3ee" }} />
                      <span className="truncate">{seminar.name}</span>
                    </Link>
                    <span className="ml-2 flex shrink-0 items-center gap-2 text-xs text-slate-500">
                      {ownSessions.length}
                      <ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" />
                    </span>
                  </summary>
                  <div className="mt-1 space-y-1 pl-6">
                    {ownSessions.map((session) => (
                      <Link key={session.id} href={`/sessions/${session.id}`} className="block truncate rounded-lg px-2 py-1.5 text-xs text-slate-400 hover:bg-white/5 hover:text-cyan-100">
                        {sessionNavLabel(session)}
                      </Link>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </aside>
      <main className="lg:pl-72">{children}</main>
    </div>
  );
}
