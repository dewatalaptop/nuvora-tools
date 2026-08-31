import { useState } from "react";
import { jsPDF } from "jspdf";
import ToolLayout from "../../components/ToolLayout.jsx";
import FileUploader from "../../components/FileUploader.jsx";
import DownloadButton, { triggerDownload } from "../../components/DownloadButton.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { formatBytes } from "../../lib/format.js";
import pdfjsLib, { renderPageToDataUrl } from "../../lib/pdfjs.js";
import { trackEvent } from "../../lib/analytics.js";

const tool = getToolBySlug("pdf-compressor");

// Genuine compression, not a fake percentage: every page is rasterized via
// pdf.js and rebuilt into a new PDF with jsPDF at the chosen JPEG quality —
// pdf-lib alone can't recompress embedded images without low-level XObject
// surgery, so this is the reliable client-side approach. Trade-off (shown to
// the user): text stops being selectable/searchable after compression, since
// every page becomes an image — same limitation most client-side PDF
// compressors have without a server-side rendering engine.
const LEVELS = {
  low: { label: "Low", scale: 1.5, quality: 0.85 },
  medium: { label: "Medium", scale: 1.1, quality: 0.65 },
  high: { label: "High", scale: 0.8, quality: 0.45 },
};

export default function PdfCompressorPage() {
  const [file, setFile] = useState(null);
  const [bytes, setBytes] = useState(null);
  const [level, setLevel] = useState("medium");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleFiles(files) {
    const f = files[0];
    if (f.type !== "application/pdf") return setError("Pilih file PDF.");
    setError("");
    setFile(f);
    setResult(null);
    setBytes(new Uint8Array(await f.arrayBuffer()));
  }

  async function compress() {
    if (!bytes) return;
    setBusy(true);
    setError("");
    setProgress(0);
    try {
      const { scale, quality } = LEVELS[level];
      const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
      let pdf;
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const { dataUrl, width, height } = await renderPageToDataUrl(page, scale, quality);
        const orientation = width > height ? "landscape" : "portrait";
        if (i === 1) pdf = new jsPDF({ orientation, unit: "pt", format: [width, height] });
        else pdf.addPage([width, height], orientation);
        pdf.addImage(dataUrl, "JPEG", 0, 0, width, height);
        setProgress(Math.round((i / doc.numPages) * 100));
      }
      const blob = pdf.output("blob");
      setResult({ blob, pages: doc.numPages });
      trackEvent("tool_complete", { tool_id: tool.id });
    } catch {
      setError("Gagal mengompres PDF. File mungkin rusak atau terkunci password.");
    } finally {
      setBusy(false);
    }
  }

  const reduction = result && file ? Math.round((1 - result.blob.size / file.size) * 100) : null;

  return (
    <ToolLayout
      tool={tool}
      seoTitle="PDF Compressor — Kompres PDF Online Gratis"
      seoDescription="Kecilkan ukuran file PDF langsung di browser, gratis dan tanpa upload ke server."
      howTo={["Upload PDF.", "Pilih level kompresi.", "Klik Compress PDF dan download hasilnya."]}
      faq={[
        { q: "Apakah teks di PDF masih bisa diseleksi setelah dikompres?", a: "Tidak — setiap halaman diubah menjadi gambar terkompresi agar ukurannya benar-benar mengecil. Cocok untuk PDF hasil scan atau yang isinya sudah berupa gambar." },
        { q: "Apakah file saya diupload ke server?", a: "Tidak, seluruh proses kompresi dilakukan di browser kamu." },
      ]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        {!file ? (
          <FileUploader accept="application/pdf" onFiles={handleFiles} label="Tarik file PDF ke sini atau klik untuk memilih" />
        ) : (
          <div>
            <p className="font-medium text-navy-800">{file.name}</p>
            <p className="text-sm text-slate-500">Ukuran asli: {formatBytes(file.size)}</p>
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Setelah dikompres, teks di PDF tidak lagi bisa diseleksi/disalin (halaman diubah menjadi gambar). Cocok untuk PDF hasil scan.
            </p>

            <p className="mt-4 mb-2 text-sm font-medium text-navy-700">Level kompresi</p>
            <div className="flex gap-2">
              {Object.entries(LEVELS).map(([key, l]) => (
                <button
                  key={key}
                  onClick={() => setLevel(key)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    level === key ? "bg-brand-600 text-white" : "border border-slate-200 text-slate-600"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <DownloadButton onClick={compress} disabled={busy}>
                {busy ? `Memproses... ${progress}%` : "Compress PDF"}
              </DownloadButton>
              <button onClick={() => setFile(null)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Ganti File
              </button>
            </div>
          </div>
        )}
        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
      </div>

      {result && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Hasil</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-slate-400">Original</p>
              <p className="font-semibold text-navy-800">{formatBytes(file.size)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Compressed</p>
              <p className="font-semibold text-navy-800">{formatBytes(result.blob.size)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Pengurangan</p>
              <p className={`font-semibold ${reduction >= 0 ? "text-green-600" : "text-red-500"}`}>{reduction}%</p>
            </div>
          </div>
          {reduction < 0 && (
            <p className="mt-2 text-xs text-slate-500">
              File hasil lebih besar dari aslinya — ini bisa terjadi kalau PDF asli sudah sangat ringkas (teks/vektor murni). Coba level "High" atau gunakan PDF ini apa adanya.
            </p>
          )}
          <div className="mt-4">
            <DownloadButton onClick={() => triggerDownload(result.blob, `compressed-${file.name}`)}>Download</DownloadButton>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
