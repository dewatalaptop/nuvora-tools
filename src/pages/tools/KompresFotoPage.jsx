import { useState } from "react";
import imageCompression from "browser-image-compression";
import ToolLayout from "../../components/ToolLayout.jsx";
import FileUploader from "../../components/FileUploader.jsx";
import DownloadButton, { triggerDownload } from "../../components/DownloadButton.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { formatBytes } from "../../lib/format.js";

const tool = getToolBySlug("kompres-foto");

const PRESETS = [
  { label: "100 KB", value: 0.1 },
  { label: "200 KB", value: 0.2 },
  { label: "500 KB", value: 0.5 },
  { label: "1 MB", value: 1 },
];

export default function KompresFotoPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [targetMB, setTargetMB] = useState(0.2);
  const [customKB, setCustomKB] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [compressed, setCompressed] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(files) {
    const f = files[0];
    if (!f.type.startsWith("image/")) return setError("File harus berupa gambar (JPG, PNG, atau WebP).");
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setCompressed(null);
  }

  async function compress() {
    if (!file) return;
    const target = isCustom ? Math.max(0.01, (parseFloat(customKB) || 0) / 1024) : targetMB;
    setBusy(true);
    setError("");
    try {
      const result = await imageCompression(file, { maxSizeMB: target, useWebWorker: true, maxIteration: 12 });
      setCompressed(result);
    } catch {
      setError("Gagal mengompres foto. Coba file lain.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setCompressed(null);
    setError("");
  }

  const reduction = compressed && file ? Math.round((1 - compressed.size / file.size) * 100) : null;

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Kompres Foto Online Gratis"
      seoDescription="Kecilkan ukuran foto JPG, PNG, atau WebP langsung di browser tanpa upload ke server. Gratis dan cepat."
      howTo={["Upload atau tarik foto ke area upload.", "Pilih target ukuran file.", "Klik Kompres Foto.", "Download hasilnya."]}
      faq={[
        { q: "Apakah foto saya diupload ke server?", a: "Tidak. Proses kompresi dilakukan sepenuhnya di browser kamu — foto tidak pernah meninggalkan perangkatmu." },
        { q: "Format apa saja yang didukung?", a: "JPG, JPEG, PNG, dan WebP." },
      ]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        {!file ? (
          <FileUploader accept="image/*" onFiles={handleFiles} label="Tarik foto ke sini atau klik untuk memilih" />
        ) : (
          <div>
            <p className="mb-3 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-brand-700">
              Foto diproses langsung di browser kamu.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <img src={preview} alt="Preview" className="h-40 w-40 shrink-0 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-medium text-navy-800">{file.name}</p>
                <p className="text-sm text-slate-500">Ukuran asli: {formatBytes(file.size)}</p>

                <p className="mt-4 mb-2 text-sm font-medium text-navy-700">Target ukuran</p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => {
                        setIsCustom(false);
                        setTargetMB(p.value);
                      }}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                        !isCustom && targetMB === p.value ? "bg-brand-600 text-white" : "border border-slate-200 text-slate-600"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setIsCustom(true)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                      isCustom ? "bg-brand-600 text-white" : "border border-slate-200 text-slate-600"
                    }`}
                  >
                    Custom
                  </button>
                  {isCustom && (
                    <input
                      type="number"
                      value={customKB}
                      onChange={(e) => setCustomKB(e.target.value)}
                      placeholder="KB"
                      className="w-24 rounded-full border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-brand-400"
                    />
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={compress}
                    disabled={busy}
                    className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-brand-600 hover:to-brand-700 disabled:opacity-50"
                  >
                    {busy ? "Memproses..." : "Kompres Foto"}
                  </button>
                  <button onClick={reset} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    Ganti Foto
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
      </div>

      {compressed && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Hasil</p>
          <div className="mt-2 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-slate-400">Original</p>
              <p className="font-semibold text-navy-800">{formatBytes(file.size)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Compressed</p>
              <p className="font-semibold text-navy-800">{formatBytes(compressed.size)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Pengurangan</p>
              <p className="font-semibold text-green-600">{reduction}%</p>
            </div>
          </div>
          <div className="mt-4">
            <DownloadButton onClick={() => triggerDownload(compressed, `compressed-${file.name}`)}>Download</DownloadButton>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
