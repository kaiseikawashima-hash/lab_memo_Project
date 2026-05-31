import katex from "katex";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderMath(source: string) {
  const parts = source.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g);

  return parts
    .map((part) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        return katex.renderToString(part.slice(2, -2), {
          displayMode: true,
          throwOnError: false,
          trust: false
        });
      }

      if (part.startsWith("$") && part.endsWith("$")) {
        return katex.renderToString(part.slice(1, -1), {
          displayMode: false,
          throwOnError: false,
          trust: false
        });
      }

      return escapeHtml(part).replaceAll("\n", "<br />");
    })
    .join("");
}

export function MathText({ text, className = "" }: { text: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: renderMath(text) }} />;
}
