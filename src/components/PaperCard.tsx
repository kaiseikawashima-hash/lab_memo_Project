import Link from "next/link";
import { ExternalLink, FileText, Link as LinkIcon } from "lucide-react";
import { Paper } from "@/lib/supabase";
import { Badge } from "./Badge";

type PaperWithCounts = Paper & {
  related_sessions_count?: number;
  related_notes_count?: number;
};

export function PaperCard({ paper }: { paper: PaperWithCounts }) {
  return (
    <article className="glass rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:shadow-glow">
      <Link href={`/papers/${paper.id}`} className="block">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {paper.year ? <Badge tone="cyan">{paper.year}</Badge> : null}
          {paper.venue ? <Badge tone="violet">{paper.venue}</Badge> : null}
          <Badge icon="tag">{paper.related_sessions_count ?? 0} sessions</Badge>
          <Badge tone="amber" icon="check">{paper.related_notes_count ?? 0} notes</Badge>
        </div>
        <h2 className="line-clamp-2 text-xl font-black text-white">{paper.title}</h2>
        {paper.authors ? <p className="mt-2 line-clamp-1 text-sm text-slate-400">{paper.authors}</p> : null}
        {paper.one_line_summary ? <p className="mt-4 line-clamp-2 text-sm leading-6 text-cyan-100">{paper.one_line_summary}</p> : null}
        {paper.japanese_summary ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{paper.japanese_summary}</p> : null}
      </Link>

      <div className="mt-4 flex flex-wrap gap-2">
        {paper.tags?.slice(0, 7).map((tag) => (
          <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
            <Badge icon="tag">{tag}</Badge>
          </Link>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-800 pt-4">
        <Link href={`/papers/${paper.id}`} className="inline-flex items-center gap-2 text-xs font-bold text-cyan-100 hover:text-cyan-50">
          論文カードを開く <FileText className="h-3.5 w-3.5" />
        </Link>
        {paper.url ? (
          <Link href={paper.url} target="_blank" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white">
            URL <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 text-xs text-slate-600">
            URL未設定 <LinkIcon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </article>
  );
}
