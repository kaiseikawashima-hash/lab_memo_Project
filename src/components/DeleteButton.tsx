"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function DeleteButton({ label = "削除" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(`${label}します。よろしいですか？`)) {
          event.preventDefault();
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-red-300/20 bg-red-400/10 px-2.5 py-1.5 text-xs font-semibold text-red-100 hover:border-red-300/40 disabled:cursor-not-allowed disabled:opacity-60"
      type="submit"
    >
      <Trash2 className="h-3.5 w-3.5" />
      {pending ? "削除中..." : label}
    </button>
  );
}
