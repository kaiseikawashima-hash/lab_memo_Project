import { AppShell } from "@/components/AppShell";
import { SessionForm } from "@/components/SessionForm";
import { SetupNotice } from "@/components/SetupNotice";
import { getSeminars } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function NewSessionPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const seminars = await getSeminars();

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-5 py-8">
        <header className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">発表回を作成</p>
          <h1 className="mt-2 text-4xl font-black text-white">新しい発表回</h1>
          <p className="mt-3 text-slate-400">PDF は Supabase Storage の sessions/[session_id]/[filename] に保存されます。</p>
        </header>
        <SessionForm seminars={seminars} />
      </div>
    </AppShell>
  );
}
