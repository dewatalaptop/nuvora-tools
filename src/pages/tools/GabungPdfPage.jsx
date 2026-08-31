import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import ToolLayout from "../../components/ToolLayout.jsx";
import FileUploader from "../../components/FileUploader.jsx";
import DownloadButton, { triggerDownload } from "../../components/DownloadButton.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { formatBytes } from "../../lib/format.js";

const tool = getToolBySlug("gabung-pdf");

export default function GabungPdfPage() {
  const [files, setFiles] = useState([]); // { id, file }
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(newFiles) {
    const valid = newFiles.filter((f) => f.type === "application/pdf");
    if (valid.length === 0) return setError("Pilih file PDF.");
    setError("");
    setFiles((prev) => [...prev, ...valid.map((file) => ({ id: `${file.name}-${file.lastModified}-${Math.random()}`, file }))]);
  }

  function remove(id) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function move(id, dir) {
    setFiles((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  async function merge() {
    if (files.length < 2) return setError("Pilih minimal 2 file PDF untuk digabungkan.");
    setBusy(true);
    setError("");
    try {
      const merged = await PDFDocument.create();
      for (const { file } of files) {
        const bytes = await file.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const bytes = await merged.save();
      triggerDownload(new Blob([bytes], { type: "application/pdf" }), "nuvora-tools-gabungan.pdf");
    } catch {
      setError("Gagal menggabungkan PDF. Pastikan semua file valid dan tidak terkunci password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Gabungkan PDF Online Gratis"
      seoDescription="Satukan beberapa file PDF jadi satu dokumen langsung di browser, gratis dan tanpa upload ke server."
      howTo={["Upload minimal dua file PDF.", "Atur urutan file sesuai kebutuhan.", "Klik Gabungkan PDF dan download hasilnya."]}
      faq={[{ q: "Apakah file saya diupload ke server?", a: "Tidak, penggabungan PDF dilakukan sepenuhnya di browser kamu." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <FileUploader accept="application/pdf" multiple onFiles={handleFiles} label="Tarik file PDF ke sini atau klik untuk memilih (minimal 2 file)" />

        {files.length > 0 && (
          <div className="mt-5 space-y-2">
            {files.map((f, i) => (
              <div key={f.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-2.5">
                <span className="flex-1 truncate text-sm text-navy-700">{f.file.name}</span>
                <span className="shrink-0 text-xs text-slate-400">{formatBytes(f.file.size)}</span>
                <button onClick={() => move(f.id, -1)} disabled={i === 0} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 disabled:opacity-30">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button onClick={() => move(f.id, 1)} disabled={i === files.length - 1} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 disabled:opacity-30">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button onClick={() => remove(f.id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}

        <div className="mt-5">
          <DownloadButton onClick={merge} disabled={files.length < 2 || busy}>
            {busy ? "Menggabungkan..." : "Gabungkan PDF"}
          </DownloadButton>
        </div>
      </div>
    </ToolLayout>
  );
}
