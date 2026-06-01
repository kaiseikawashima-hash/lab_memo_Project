import { NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";

export async function POST(request: Request) {
  const session = await request.json();
  const result = await generateWithGemini({
    pdfUrl: session.pdf_url,
    prompt: `発表PDFまたは以下のメタデータから、論文カード候補を作ってください。推測できない項目は空文字またはnullにしてください。JSONだけを返してください。

発表タイトル: ${session.title || ""}
論文タイトル: ${session.paper_title || ""}
著者: ${session.paper_authors || ""}
URL: ${session.paper_url || ""}
概要: ${session.summary || ""}

返すJSON:
{
  "suggested_paper_info": {
    "title": "論文タイトル",
    "authors": "著者",
    "year": 2026,
    "venue": "会議・雑誌名",
    "url": "URL",
    "abstract": "abstract",
    "one_line_summary": "日本語で一文",
    "japanese_summary": "日本語で数段落",
    "tags": ["タグ"]
  }
}`
  });

  return NextResponse.json(result);
}
