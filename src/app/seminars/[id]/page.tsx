import { AppShell } from "@/components/AppShell";
import { SearchBar } from "@/components/SearchBar";
import { SessionCard } from "@/components/SessionCard";
import { SetupNotice } from "@/components/SetupNotice";
import { getSeminars, getSessions } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase";
import { seminarDescription } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SeminarPage({ params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const [seminars, sessions] = await Promise.all([getSeminars(), getSessions()]);
  const seminar = seminars.find((item) => item.id === params.id);
  const ownSessions = sessions.filter((session) => session.seminar?.name === seminar?.name || session.seminar_id === params.id);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-5 py-8">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">ゼミ別ビュー</p>
          <h1 className="mt-2 text-4xl font-black text-white">{seminar?.name || "ゼミ"}</h1>
          <p className="mt-3 max-w-2xl text-slate-400">{seminar ? seminarDescription(seminar.name, seminar.description) : ""}</p>
          <div className="mt-6 max-w-3xl"><SearchBar compact /></div>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {ownSessions.map((session) => <SessionCard key={session.id} session={session} />)}
        </div>
      </div>
    </AppShell>
  );
}
