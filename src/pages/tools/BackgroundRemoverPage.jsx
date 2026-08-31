import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import ToolLayout from "../../components/ToolLayout.jsx";
import FileUploader from "../../components/FileUploader.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { removeBackground } from "../../lib/backgroundRemoval.js";

const tool = getToolBySlug("background-remover");

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(files) {
    const f = files[0];
    if (!f.type.startsWith("image/")) return setError("File harus berupa gambar.");
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function process() {
    setBusy(true);
    setError("");
    try {
      await removeBackground(file);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Background Remover Online Gratis"
      seoDescription="Hapus background foto secara otomatis. Cepat dan mudah digunakan."
      howTo={["Upload foto.", "Klik Remove Background.", "Download hasil PNG dengan latar transparan."]}
      faq={[{ q: "Kenapa fitur ini belum bisa dipakai?", a: "Background Remover butuh model AI atau API eksternal yang belum dikonfigurasi di Nuvora Tools. Kami tampilkan ini secara jujur daripada berpura-pura berhasil — coba lagi nanti, atau gunakan Image Cropper / Kompres Foto sementara." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        {!file ? (
          <FileUploader accept="image/*" onFiles={handleFiles} label="Tarik foto ke sini atau klik untuk memilih" />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <img src={preview} alt="Preview" className="h-48 w-48 rounded-xl object-cover" />
            <div className="flex gap-2">
              <button onClick={process} disabled={busy} className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50">
                {busy ? "Processing image..." : "Remove Background"}
              </button>
              <button onClick={() => { setFile(null); setError(""); }} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Ganti Foto
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3.5 text-sm text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
