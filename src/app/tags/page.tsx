import Link from "next/link";
import { Tags } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { SetupNotice } from "@/components/SetupNotice";
import { getAllTags } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;
  const tags = await getAllTags();

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-7">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">
            <Tags className="h-4 w-4" />
            Tags
          </p>
          <h1 className="mt-2 text-4xl font-black text-white">タグ索引</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">論文、発表回、質問ログに散らばったタグを入口にして、研究メモを横断できます。</p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {tags.map((tag) => (
            <Link key={tag.tag} href={`/tags/${encodeURIComponent(tag.tag)}`} className="glass rounded-2xl p-5 hover:border-cyan-300/30">
              <div className="mb-4">
                <Badge icon="tag">{tag.tag}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-3">
                  <div className="text-xl font-black text-white">{tag.papers}</div>
                  <div className="text-xs text-slate-500">Papers</div>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-3">
                  <div className="text-xl font-black text-white">{tag.sessions}</div>
                  <div className="text-xs text-slate-500">Sessions</div>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-3">
                  <div className="text-xl font-black text-white">{tag.notes}</div>
                  <div className="text-xs text-slate-500">Notes</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {!tags.length ? <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-slate-400">タグはまだありません。</div> : null}
      </div>
    </AppShell>
  );
}
