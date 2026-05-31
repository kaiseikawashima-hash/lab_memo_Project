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
    "数理最適化ゼミ": "最適化理論、凸解析、数理モデルの輪読メモをまとめます。",
    "Python 機械学習ゼミ": "Python 実装、機械学習モデル、実験まわりの輪読メモをまとめます。"
  };

  return descriptions[name] || fallback || "";
}
