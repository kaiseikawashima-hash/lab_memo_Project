"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/40 font-semibold text-slate-200 hover:border-cyan-300/50 ${
        compact ? "px-2.5 py-2 text-xs" : "px-3 py-2 text-sm"
      }`}
    >
      <ArrowLeft className="h-4 w-4 text-cyan-200" />
      戻る
    </button>
  );
}
