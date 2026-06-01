import { NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";

export async function POST(request: Request) {
  const session = await request.json();
  const result = await generateWithGemini({
    pdfUrl: session.pdf_url,
    prompt: `あなたは機械学習・数理最適化分野の研究メモ支援AIです。
アップロード済みPDFまたは以下の発表メタデータを読み、JSONだけを返してください。

発表タイトル: ${session.title || ""}
論文タイトル: ${session.paper_title || ""}
著者: ${session.paper_authors || ""}
概要: ${session.summary || ""}

返すJSON:
{
  "one_line_summary": "日本語で一文",
  "ai_summary": "日本語で2〜4段落",
  "tags": ["研究テーマタグ"],
  "keywords": ["英語中心の重要語"]
}`
  });

  return NextResponse.json(result);
}
