import { useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import FileUploader from "../../components/FileUploader.jsx";
import DownloadButton, { triggerDownload } from "../../components/DownloadButton.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { formatBytes } from "../../lib/format.js";
import { trackEvent } from "../../lib/analytics.js";

const tool = getToolBySlug("image-resizer");
const PRESETS = [1080, 720, 500, 300];
const FORMATS = { JPG: "image/jpeg", PNG: "image/png", WebP: "image/webp" };

function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = url;
  });
}

export default function ImageResizerPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [original, setOriginal] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState("JPG");
  const [quality, setQuality] = useState(0.85);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files) {
    const f = files[0];
    if (!f.type.startsWith("image/")) return setError("File harus berupa gambar (JPG, PNG, atau WebP).");
    setError("");
    setFile(f);
    setResult(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = await loadImage(url);
    setOriginal({ width: img.width, height: img.height });
    setWidth(String(img.width));
    setHeight(String(img.height));
  }

  function setWidthLinked(value) {
    setWidth(value);
    if (lockRatio && original) {
      const ratio = original.height / original.width;
      setHeight(String(Math.round(Number(value) * ratio)));
    }
  }
  function setHeightLinked(value) {
    setHeight(value);
    if (lockRatio && original) {
      const ratio = original.width / original.height;
      setWidth(String(Math.round(Number(value) * ratio)));
    }
  }

  function applyPreset(target) {
    if (!original) return;
    const ratio = original.height / original.width;
    setWidth(String(target));
    setHeight(String(Math.round(target * ratio)));
  }

  async function resize() {
    const w = Number(width);
    const h = Number(height);
    if (!w || !h || w <= 0 || h <= 0) return setError("Masukkan lebar dan tinggi yang valid.");
    setError("");
    setBusy(true);
    try {
      const img = await loadImage(preview);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (format === "JPG") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);
      const mime = FORMATS[format];
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, format === "PNG" ? undefined : quality));
      setResult({ blob, width: w, height: h });
      trackEvent("tool_complete", { tool_id: tool.id });
    } catch {
      setError("Gagal mengubah ukuran foto. Coba file lain.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setOriginal(null);
    setResult(null);
    setError("");
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Image Resizer — Ubah Ukuran Foto Online Gratis"
      seoDescription="Ubah dimensi (lebar & tinggi) foto JPG, PNG, atau WebP langsung di browser, gratis dan tanpa upload ke server."
      howTo={["Upload foto.", "Masukkan lebar & tinggi baru, atau pilih preset.", "Pilih format output.", "Klik Resize Image dan download."]}
      faq={[{ q: "Apa beda tool ini dengan Kompres Foto?", a: "Image Resizer mengubah dimensi (lebar/tinggi) gambar. Kompres Foto menargetkan ukuran file (KB/MB) tanpa mengubah dimensi." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        {!file ? (
          <FileUploader accept="image/*" onFiles={handleFiles} label="Tarik foto ke sini atau klik untuk memilih" />
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row">
            <img src={preview} alt="Preview" className="h-40 w-40 shrink-0 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-medium text-navy-800">{file.name}</p>
              <p className="text-sm text-slate-500">
                {original?.width}×{original?.height}px · {formatBytes(file.size)}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {PRESETS.map((p) => (
                  <button key={p} onClick={() => applyPreset(p)} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-brand-300">
                    {p}px
                  </button>
                ))}
              </div>

              <div className="mt-3 flex items-end gap-2">
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-500">Lebar</span>
                  <input type="number" value={width} onChange={(e) => setWidthLinked(e.target.value)} className="w-24 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400" />
                </label>
                <span className="pb-1.5 text-slate-400">×</span>
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-500">Tinggi</span>
                  <input type="number" value={height} onChange={(e) => setHeightLinked(e.target.value)} className="w-24 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand-400" />
                </label>
                <label className="flex items-center gap-1.5 pb-1.5 text-xs text-slate-500">
                  <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} />
                  Kunci rasio
                </label>
              </div>

              <div className="mt-3 flex flex-wrap items-end gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-500">Format</span>
                  <select value={format} onChange={(e) => setFormat(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-400">
                    {Object.keys(FORMATS).map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </label>
                {format !== "PNG" && (
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">Kualitas ({Math.round(quality * 100)}%)</span>
                    <input type="range" min="0.3" max="1" step="0.05" value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
                  </label>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={resize} disabled={busy} className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50">
                  {busy ? "Memproses..." : "Resize Image"}
                </button>
                <button onClick={reset} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Ganti Foto
                </button>
              </div>
            </div>
          </div>
        )}
        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
      </div>

      {result && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Hasil</p>
          <p className="text-sm text-slate-600">
            {result.width}×{result.height}px · {formatBytes(result.blob.size)}
          </p>
          <div className="mt-3">
            <DownloadButton onClick={() => triggerDownload(result.blob, `resized-${file.name.replace(/\.[^.]+$/, "")}.${format.toLowerCase()}`)}>
              Download
            </DownloadButton>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
