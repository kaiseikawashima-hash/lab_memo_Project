import { AppShell } from "@/components/AppShell";
import { SessionEditForm } from "@/components/SessionEditForm";
import { SetupNotice } from "@/components/SetupNotice";
import { getSeminars, getSession } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function EditSessionPage({ params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const [session, seminars] = await Promise.all([getSession(params.id), getSeminars()]);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-5 py-8">
        <header className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">発表回を編集</p>
          <h1 className="mt-2 text-4xl font-black text-white">資料や情報をあとから追加</h1>
          <p className="mt-3 text-slate-400">
            スライド作成中に発表回だけ先に作り、質問ログを溜めたあとで PDF・論文情報・概要を更新できます。
          </p>
        </header>
        <SessionEditForm session={session} seminars={seminars} />
      </div>
    </AppShell>
  );
}
