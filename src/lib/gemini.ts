type GeminiPayload = {
  prompt: string;
  pdfUrl?: string | null;
};

export async function generateWithGemini({ prompt, pdfUrl }: GeminiPayload) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallbackJson("GEMINI_API_KEY が未設定です。Vercel と .env.local にサーバー側のキーを設定してください。");
  }

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [{ text: prompt }];
  const pdfPart = await pdfUrlToPart(pdfUrl);
  if (pdfPart) parts.push(pdfPart);

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: { responseMimeType: "application/json" }
    })
  });

  if (!response.ok) {
    return fallbackJson(`Gemini API error: ${response.status} ${await response.text()}`);
  }

  const json = await response.json();
  const text = json?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("") || "{}";
  return parseJson(text);
}

async function pdfUrlToPart(pdfUrl?: string | null) {
  if (!pdfUrl) return null;
  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const data = Buffer.from(arrayBuffer).toString("base64");
    return { inlineData: { mimeType: "application/pdf", data } };
  } catch {
    return null;
  }
}

function parseJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return fallbackJson("Gemini の返答を JSON として読めませんでした。");
    try {
      return JSON.parse(match[0]);
    } catch {
      return fallbackJson("Gemini の返答を JSON として読めませんでした。");
    }
  }
}

function fallbackJson(message: string) {
  return {
    one_line_summary: "",
    ai_summary: message,
    tags: [],
    keywords: [],
    suggested_paper_info: null,
    warning: message
  };
}
