import { FileText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PaperCard } from "@/components/PaperCard";
import { SearchBar } from "@/components/SearchBar";
import { SetupNotice } from "@/components/SetupNotice";
import { getPapers } from "@/lib/queries";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function PapersPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;
  const papers = await getPapers();

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-7">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">
            <FileText className="h-4 w-4" />
            Papers
          </p>
          <h1 className="mt-2 text-4xl font-black text-white">論文カード</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">発表回から作った論文メタデータ、要約、タグを研究テーマ単位で見返せます。</p>
          <div className="mt-5"><SearchBar /></div>
        </header>

        {papers.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {papers.map((paper) => <PaperCard key={paper.id} paper={paper} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-slate-400">論文カードはまだありません。発表回詳細の「AIで論文カード作成」から追加できます。</div>
        )}
      </div>
    </AppShell>
  );
}
