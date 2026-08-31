import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import ToolLayout from "../../components/ToolLayout.jsx";
import InputField from "../../components/InputField.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { copyToClipboard } from "../../lib/format.js";
import { trackEvent } from "../../lib/analytics.js";

const tool = getToolBySlug("whatsapp-qr");

const PRESETS = ["Hubungi Kami", "Pesan Sekarang", "Reservasi", "Customer Service"];

function normalizePhone(raw) {
  let digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) digits = "62" + digits.slice(1);
  else if (!digits.startsWith("62")) digits = "62" + digits;
  return digits;
}

export default function WhatsappQrPage() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("Hubungi Kami");
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  function generate() {
    const digits = normalizePhone(phone);
    if (digits.length < 10) return setError("Masukkan nomor WhatsApp yang valid.");
    setError("");
    setLink(`https://wa.me/${digits}${message.trim() ? `?text=${encodeURIComponent(message.trim())}` : ""}`);
    trackEvent("tool_complete", { tool_id: tool.id });
  }

  async function copyLink() {
    const ok = await copyToClipboard(link);
    setCopied(ok);
    trackEvent("copy", { tool_id: tool.id });
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadQr() {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "nuvora-whatsapp-qr.png";
    a.click();
    trackEvent("download", { tool_id: tool.id });
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="WhatsApp QR Generator untuk Bisnis — Gratis"
      seoDescription="Buat QR Code WhatsApp untuk bisnis, siap dicetak dan discan pelanggan. Gratis dan tanpa login."
      howTo={["Masukkan nomor WhatsApp bisnis.", "Pilih atau tulis pesan otomatis.", "Klik Buat QR.", "Download QR PNG untuk dicetak di toko/meja kasir."]}
      faq={[{ q: "Apakah QR ini mengirim pesan otomatis?", a: "Tidak, pelanggan tetap perlu menekan kirim setelah memindai — QR hanya membuka chat dengan pesan sudah terisi." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <InputField label="Nomor WhatsApp bisnis" prefix="+62" type="tel" placeholder="812xxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-navy-700">Pesan otomatis</span>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button key={p} onClick={() => setMessage(p)} className={`rounded-full px-3 py-1 text-xs font-medium transition ${message === p ? "bg-brand-600 text-white" : "border border-slate-200 text-slate-600"}`}>
                {p}
              </button>
            ))}
          </div>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400" />
        </label>
        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
        <button onClick={generate} className="mt-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
          Buat QR
        </button>
      </div>

      {link && (
        <div className="mt-5 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6">
          <div ref={canvasRef}>
            <QRCodeCanvas value={link} size={200} marginSize={2} level="M" />
          </div>
          <p className="max-w-xs break-all text-center text-xs text-slate-500">{link}</p>
          <div className="flex gap-2">
            <button onClick={downloadQr} className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white">
              Download QR PNG
            </button>
            <button onClick={copyLink} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              {copied ? "Tersalin!" : "Copy Link"}
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
