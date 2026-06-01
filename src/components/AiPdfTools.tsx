"use client";

import { useState, useTransition } from "react";
import { Bot, FileText, Sparkles, Tags } from "lucide-react";
import { createPaperFromAi, saveAiSessionResult } from "@/lib/actions";
import { Session } from "@/lib/supabase";
import { SubmitButton } from "./SubmitButton";

type AiResult = {
  one_line_summary?: string;
  ai_summary?: string;
  tags?: string[];
  keywords?: string[];
  warning?: string;
  suggested_paper_info?: {
    title?: string;
    authors?: string;
    year?: number | null;
    venue?: string;
    url?: string;
    abstract?: string;
    one_line_summary?: string;
    japanese_summary?: string;
    tags?: string[];
  } | null;
};

export function AiPdfTools({ session }: { session: Session }) {
  const [result, setResult] = useState<AiResult | null>(null);
  const [mode, setMode] = useState<"summary" | "tags" | "paper" | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const run = (nextMode: "summary" | "tags" | "paper", endpoint: string) => {
    setError("");
    setResult(null);
    setMode(nextMode);
    startTransition(async () => {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(session)
        });
        if (!response.ok) throw new Error(await response.text());
        setResult(await response.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "AI生成に失敗しました。");
      }
    });
  };

  const paper = result?.suggested_paper_info;

  return (
    <section className="glass rounded-2xl p-4">
      <div className="mb-4 flex items-center gap-2">
        <Bot className="h-5 w-5 text-cyan-200" />
        <h2 className="text-lg font-black text-white">AI PDF Tools</h2>
      </div>
      <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
        <button type="button" disabled={isPending} onClick={() => run("summary", "/api/ai/summarize-pdf")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100 hover:border-cyan-300/50 disabled:opacity-60">
          <Sparkles className="h-4 w-4" />
          AIでPDFを要約
        </button>
        <button type="button" disabled={isPending} onClick={() => run("tags", "/api/ai/generate-tags")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-300/25 bg-violet-300/10 px-3 py-2 text-sm font-bold text-violet-100 hover:border-violet-300/50 disabled:opacity-60">
          <Tags className="h-4 w-4" />
          AIでタグ生成
        </button>
        <button type="button" disabled={isPending} onClick={() => run("paper", "/api/ai/create-paper-card")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-300/25 bg-sky-300/10 px-3 py-2 text-sm font-bold text-sky-100 hover:border-sky-300/50 disabled:opacity-60">
          <FileText className="h-4 w-4" />
          AIで論文カード作成
        </button>
      </div>

      {isPending ? <p className="mt-4 text-sm text-slate-400">PDFとメタデータを読んで生成中です...</p> : null}
      {error ? <p className="mt-4 rounded-xl border border-rose-300/30 bg-rose-300/10 p-3 text-sm text-rose-100">{error}</p> : null}
      {result?.warning ? <p className="mt-4 rounded-xl border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">{result.warning}</p> : null}

      {result && mode !== "paper" ? (
        <form action={saveAiSessionResult} className="mt-5 space-y-3 rounded-2xl border border-slate-700/70 bg-slate-950/40 p-4">
          <input type="hidden" name="session_id" value={session.id} />
          <label className="block text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">一言要約</label>
          <textarea name="ai_one_liner" rows={2} defaultValue={result.one_line_summary || session.ai_one_liner || ""} className="field" />
          <label className="block text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">要約</label>
          <textarea name="ai_summary" rows={6} defaultValue={result.ai_summary || session.ai_summary || ""} className="field" />
          <label className="block text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">タグ</label>
          <input name="ai_tags" defaultValue={(result.tags || session.ai_tags || []).join(", ")} className="field" />
          <label className="block text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">キーワード</label>
          <input name="ai_keywords" defaultValue={(result.keywords || session.ai_keywords || []).join(", ")} className="field" />
          <SubmitButton pendingText="保存中..." className="w-full rounded-xl bg-cyan-300 px-4 py-3 font-black text-slate-950 hover:bg-cyan-200">
            この内容で発表回に保存
          </SubmitButton>
        </form>
      ) : null}

      {paper ? (
        <form action={createPaperFromAi} className="mt-5 space-y-3 rounded-2xl border border-slate-700/70 bg-slate-950/40 p-4">
          <input type="hidden" name="session_id" value={session.id} />
          <label className="block text-xs font-bold uppercase tracking-[0.16em] text-sky-200">Title</label>
          <input name="title" defaultValue={paper.title || session.paper_title || session.title} className="field" required />
          <input name="authors" defaultValue={paper.authors || session.paper_authors || ""} placeholder="authors" className="field" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="year" type="number" defaultValue={paper.year || ""} placeholder="year" className="field" />
            <input name="venue" defaultValue={paper.venue || ""} placeholder="venue" className="field" />
          </div>
          <input name="url" defaultValue={paper.url || session.paper_url || ""} placeholder="url" className="field" />
          <textarea name="abstract" rows={4} defaultValue={paper.abstract || ""} placeholder="abstract" className="field" />
          <textarea name="one_line_summary" rows={2} defaultValue={paper.one_line_summary || result.one_line_summary || ""} placeholder="one line summary" className="field" />
          <textarea name="japanese_summary" rows={5} defaultValue={paper.japanese_summary || result.ai_summary || ""} placeholder="japanese summary" className="field" />
          <input name="tags" defaultValue={(paper.tags || result.tags || []).join(", ")} placeholder="tags" className="field" />
          <SubmitButton pendingText="保存中..." className="w-full rounded-xl bg-sky-300 px-4 py-3 font-black text-slate-950 hover:bg-sky-200">
            この内容で論文カードを保存
          </SubmitButton>
        </form>
      ) : null}
    </section>
  );
}
