import { FileText } from "lucide-react";

export function PdfViewer({ url }: { url: string | null }) {
  if (!url) {
    return (
      <div className="glass grid min-h-[340px] place-items-center rounded-2xl p-6 text-center md:min-h-[68vh] md:p-8">
        <div>
          <FileText className="mx-auto h-12 w-12 text-slate-500" />
          <p className="mt-4 font-semibold text-slate-200">PDF はまだアップロードされていません。</p>
          <p className="mt-1 text-sm text-slate-500">後から react-pdf に差し替えやすいよう、表示部分を分離しています。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass h-[62vh] min-h-[420px] overflow-hidden rounded-2xl md:h-[72vh] md:min-h-[560px]">
      <iframe src={url} title="PDF Viewer" className="h-full w-full bg-slate-950" />
    </div>
  );
}
