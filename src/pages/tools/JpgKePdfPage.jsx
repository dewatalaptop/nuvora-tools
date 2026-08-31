import { useState } from "react";
import { jsPDF } from "jspdf";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import ToolLayout from "../../components/ToolLayout.jsx";
import FileUploader from "../../components/FileUploader.jsx";
import DownloadButton from "../../components/DownloadButton.jsx";
import { getToolBySlug } from "../../data/tools.js";

const tool = getToolBySlug("jpg-ke-pdf");

function loadImage(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = dataUrl;
  });
}

// Quality < 1 re-encodes through a canvas at that JPEG quality (this is
// what actually shrinks file size — jsPDF's own addImage compression hint
// doesn't re-encode pixel data, it only affects internal PDF stream
// compression, so without this the "Kualitas" control would do nothing).
async function prepareImage(dataUrl, quality) {
  const img = await loadImage(dataUrl);
  if (quality >= 1) return { img, dataUrl, format: dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG" };
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);
  return { img, dataUrl: jpegDataUrl, format: "JPEG" };
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function JpgKePdfPage() {
  const [images, setImages] = useState([]); // { id, file, dataUrl }
  const [orientation, setOrientation] = useState("portrait");
  const [margin, setMargin] = useState(10);
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files) {
    const valid = files.filter((f) => f.type.startsWith("image/"));
    if (valid.length === 0) return setError("Pilih file gambar (JPG/PNG).");
    setError("");
    const entries = await Promise.all(
      valid.map(async (file) => ({ id: `${file.name}-${file.lastModified}-${Math.random()}`, file, dataUrl: await readAsDataURL(file) }))
    );
    setImages((prev) => [...prev, ...entries]);
  }

  function remove(id) {
    setImages((prev) => prev.filter((i) => i.id !== id));
  }

  function move(id, dir) {
    setImages((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  async function buildPdf() {
    if (images.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxW = pageWidth - margin * 2;
      const maxH = pageHeight - margin * 2;

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage();
        const { dataUrl, format, img } = await prepareImage(images[i].dataUrl, quality);
        const ratio = Math.min(maxW / img.width, maxH / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const x = (pageWidth - w) / 2;
        const y = (pageHeight - h) / 2;
        doc.addImage(dataUrl, format, x, y, w, h);
      }
      doc.save("nuvora-tools.pdf");
    } catch {
      setError("Gagal membuat PDF. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="JPG ke PDF Online Gratis"
      seoDescription="Ubah satu atau beberapa gambar JPG/PNG menjadi satu file PDF langsung di browser, gratis dan tanpa upload ke server."
      howTo={["Upload satu atau beberapa gambar.", "Atur urutan halaman jika perlu.", "Pilih orientasi halaman.", "Klik Buat PDF dan download hasilnya."]}
      faq={[{ q: "Apakah gambar saya diupload ke server?", a: "Tidak, seluruh proses pembuatan PDF dilakukan di browser kamu." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <FileUploader accept="image/*" multiple onFiles={handleFiles} label="Tarik gambar ke sini atau klik untuk memilih (bisa lebih dari satu)" />

        {images.length > 0 && (
          <div className="mt-5 space-y-2">
            {images.map((img, i) => (
              <div key={img.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-2">
                <img src={img.dataUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <span className="flex-1 truncate text-sm text-navy-700">{img.file.name}</span>
                <button onClick={() => move(img.id, -1)} disabled={i === 0} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 disabled:opacity-30">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button onClick={() => move(img.id, 1)} disabled={i === images.length - 1} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 disabled:opacity-30">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button onClick={() => remove(img.id)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">Orientasi</span>
            <div className="flex gap-2">
              {["portrait", "landscape"].map((o) => (
                <button
                  key={o}
                  onClick={() => setOrientation(o)}
                  className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium capitalize transition ${
                    orientation === o ? "bg-brand-600 text-white" : "border border-slate-200 text-slate-600"
                  }`}
                >
                  {o === "portrait" ? "Potret" : "Lanskap"}
                </button>
              ))}
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">Margin (mm)</span>
            <input
              type="number"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-navy-800 outline-none focus:border-brand-400"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">Kualitas</span>
            <select
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-navy-800 outline-none focus:border-brand-400"
            >
              <option value={1}>Tinggi</option>
              <option value={0.9}>Sedang</option>
              <option value={0.7}>Rendah (ukuran lebih kecil)</option>
            </select>
          </label>
        </div>

        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}

        <div className="mt-5">
          <DownloadButton onClick={buildPdf} disabled={images.length === 0 || busy}>
            {busy ? "Membuat PDF..." : "Buat PDF"}
          </DownloadButton>
        </div>
      </div>
    </ToolLayout>
  );
}
