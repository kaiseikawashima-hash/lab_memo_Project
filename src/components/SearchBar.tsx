import { Search } from "lucide-react";

export function SearchBar({ defaultValue = "", compact = false }: { defaultValue?: string; compact?: boolean }) {
  return (
    <form action="/search" className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-200/70" />
      <input
        className={`field !pl-14 ${compact ? "h-11" : "h-14 text-base"}`}
        name="q"
        defaultValue={defaultValue}
        placeholder="発表・論文・質問・回答・理解メモ・タグを検索..."
      />
    </form>
  );
}
