export function formatDate(value: string | null) {
  if (!value) return "日付未設定";
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date(value));
}

export function splitTags(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function fileNameSafe(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function seminarDescription(name: string, fallback?: string | null) {
  const descriptions: Record<string, string> = {
    "研究ゼミ": "研究テーマの議論、進捗、関連論文の理解メモを蓄積します。",
    "輪読ゼミA": "理論・数理最適化・基礎寄りの輪読メモをまとめます。",
    "輪読ゼミB": "機械学習モデル、システム、応用寄りの輪読メモをまとめます。"
  };

  return descriptions[name] || fallback || "";
}
