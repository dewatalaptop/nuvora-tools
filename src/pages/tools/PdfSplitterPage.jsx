import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { Check } from "lucide-react";
import ToolLayout from "../../components/ToolLayout.jsx";
import FileUploader from "../../components/FileUploader.jsx";
import DownloadButton, { triggerDownload } from "../../components/DownloadButton.jsx";
import { getToolBySlug } from "../../data/tools.js";
import pdfjsLib, { renderPageToDataUrl } from "../../lib/pdfjs.js";
import { trackEvent } from "../../lib/analytics.js";

const tool = getToolBySlug("pdf-splitter");
const MODES = [
  { key: "all", label: "Semua halaman (1 file per halaman)" },
  { key: "range", label: "Page range" },
  { key: "selected", label: "Pilih halaman" },
];

function parseRanges(text, pageCount) {
  const groups = [];
  for (const segment of text.split(",").map((s) => s.trim()).filter(Boolean)) {
    const m = segment.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;
    const start = Math.max(1, parseInt(m[1], 10));
    const end = Math.min(pageCount, parseInt(m[2] ?? m[1], 10));
    if (start > end) continue;
    const indices = [];
    for (let p = start; p <= end; p++) indices.push(p - 1);
    groups.push(indices);
  }
  return groups;
}

export default function PdfSplitterPage() {
  const [file, setFile] = useState(null);
  const [bytes, setBytes] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [mode, setMode] = useState("all");
  const [rangeText, setRangeText] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [loadingThumbs, setLoadingThumbs] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files) {
    const f = files[0];
    if (f.type !== "application/pdf") return setError("Pilih file PDF.");
    setError("");
    setFile(f);
    setSelected(new Set());
    const buf = await f.arrayBuffer();
    setBytes(new Uint8Array(buf));
    setLoadingThumbs(true);
    try {
      const doc = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
      const thumbs = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const { dataUrl } = await renderPageToDataUrl(page, 0.35);
        thumbs.push(dataUrl);
      }
      setThumbnails(thumbs);
    } catch {
      setError("Gagal membaca halaman PDF. File mungkin rusak atau terkunci password.");
    } finally {
      setLoadingThumbs(false);
    }
  }

  function toggleSelect(i) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  async function split() {
    if (!bytes) return;
    setBusy(true);
    setError("");
    try {
      const pageCount = thumbnails.length;
      let groups;
      if (mode === "all") groups = Array.from({ length: pageCount }, (_, i) => [i]);
      else if (mode === "range") {
        groups = parseRanges(rangeText, pageCount);
        if (groups.length === 0) throw new Error("empty");
      } else {
        const indices = [...selected].sort((a, b) => a - b);
        if (indices.length === 0) throw new Error("empty");
        groups = [indices];
      }

      const outputs = [];
      for (const indices of groups) {
        const out = await PDFDocument.create();
        const src = await PDFDocument.load(bytes);
        const copied = await out.copyPages(src, indices);
        copied.forEach((p) => out.addPage(p));
        const outBytes = await out.save();
        outputs.push(new Blob([outBytes], { type: "application/pdf" }));
      }

      if (outputs.length === 1) {
        triggerDownload(outputs[0], "nuvora-tools-split.pdf");
      } else {
        const zip = new JSZip();
        outputs.forEach((blob, i) => zip.file(`bagian-${i + 1}.pdf`, blob));
        const zipBlob = await zip.generateAsync({ type: "blob" });
        triggerDownload(zipBlob, "nuvora-tools-split.zip");
      }
      trackEvent("download", { tool_id: tool.id, files: outputs.length });
    } catch {
      setError("Tidak ada halaman valid untuk dipisah. Periksa kembali input kamu.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="PDF Splitter — Pecah PDF Online Gratis"
      seoDescription="Pecah file PDF menjadi beberapa file berdasarkan halaman, langsung di browser tanpa upload ke server."
      howTo={["Upload PDF.", "Pilih mode: semua halaman, page range, atau pilih halaman manual.", "Klik Split PDF — hasil didownload sebagai PDF atau ZIP jika lebih dari satu file."]}
      faq={[{ q: "Format range seperti apa yang didukung?", a: "Pisahkan dengan koma, contoh: 1-3,5,8-10 — setiap segmen menjadi satu file PDF terpisah." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        {!file ? (
          <FileUploader accept="application/pdf" onFiles={handleFiles} label="Tarik file PDF ke sini atau klik untuk memilih" />
        ) : (
          <div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    mode === m.key ? "bg-brand-600 text-white" : "border border-slate-200 text-slate-600"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {mode === "range" && (
              <input
                value={rangeText}
                onChange={(e) => setRangeText(e.target.value)}
                placeholder="contoh: 1-3,5,8-10"
                className="mb-4 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400"
              />
            )}

            {loadingThumbs ? (
              <p className="text-sm text-slate-400">Memuat halaman...</p>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {thumbnails.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => mode === "selected" && toggleSelect(i)}
                    className={`relative overflow-hidden rounded-lg border-2 ${
                      mode === "selected" && selected.has(i) ? "border-brand-600" : "border-slate-200"
                    }`}
                  >
                    <img src={src} alt={`Halaman ${i + 1}`} className="w-full" />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/50 py-0.5 text-[10px] text-white">{i + 1}</span>
                    {mode === "selected" && selected.has(i) && (
                      <span className="absolute right-1 top-1 rounded-full bg-brand-600 p-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <DownloadButton onClick={split} disabled={busy || loadingThumbs}>
                {busy ? "Memproses..." : "Split PDF"}
              </DownloadButton>
              <button onClick={() => setFile(null)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Ganti File
              </button>
            </div>
          </div>
        )}
        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
      </div>
    </ToolLayout>
  );
}
