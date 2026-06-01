import { NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";

export async function POST(request: Request) {
  const session = await request.json();
  const result = await generateWithGemini({
    pdfUrl: session.pdf_url,
    prompt: `発表PDFまたは以下のメタデータから、後で検索しやすいタグとキーワードを作ってください。JSONだけを返してください。

発表タイトル: ${session.title || ""}
論文タイトル: ${session.paper_title || ""}
概要: ${session.summary || ""}

返すJSON:
{
  "tags": ["Interpretable Optimization", "Optimal Decision Tree"],
  "keywords": ["scenario", "decision tree", "mixed integer programming"]
}`
  });

  return NextResponse.json(result);
}
