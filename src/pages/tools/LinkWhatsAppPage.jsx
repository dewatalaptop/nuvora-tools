import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import ToolLayout from "../../components/ToolLayout.jsx";
import InputField from "../../components/InputField.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { copyToClipboard } from "../../lib/format.js";

const tool = getToolBySlug("link-whatsapp");

function normalizePhone(raw) {
  let digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) digits = "62" + digits.slice(1);
  else if (!digits.startsWith("62")) digits = "62" + digits;
  return digits;
}

export default function LinkWhatsAppPage() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  function buat() {
    const digits = normalizePhone(phone);
    if (digits.length < 10) return setError("Masukkan nomor WhatsApp yang valid.");
    setError("");
    const url = `https://wa.me/${digits}${message.trim() ? `?text=${encodeURIComponent(message.trim())}` : ""}`;
    setLink(url);
  }

  async function salin() {
    const ok = await copyToClipboard(link);
    setCopied(ok);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Generator Link WhatsApp Online Gratis"
      seoDescription="Buat link WhatsApp (wa.me) dengan pesan otomatis lengkap dengan QR code, gratis dan tanpa perlu login."
      howTo={["Masukkan nomor WhatsApp tujuan.", "Tulis pesan otomatis (opsional).", "Klik Buat Link.", "Salin link atau pindai QR code-nya."]}
      faq={[
        { q: "Apakah ini mengirim pesan otomatis?", a: "Tidak. Tool ini hanya menghasilkan link — pesan baru terkirim setelah orang yang menerima link membuka WhatsApp dan menekan kirim sendiri." },
        { q: "Format nomor apa yang diterima?", a: "Kamu bisa mengetik dengan awalan 08 atau 62, keduanya otomatis dikonversi ke format internasional yang benar." },
      ]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4">
          <InputField label="Nomor WhatsApp" prefix="+62" type="tel" placeholder="812xxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">Pesan (opsional)</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Halo, saya ingin bertanya tentang..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-navy-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </label>
        </div>
        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
        <button onClick={buat} className="mt-5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-brand-600 hover:to-brand-700">
          Buat Link
        </button>
      </div>

      {link && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Link WhatsApp kamu</p>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="break-all rounded-xl bg-slate-50 p-3 text-sm text-brand-700">{link}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={salin} className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white">
                  {copied ? "Tersalin!" : "Salin Link"}
                </button>
                <a href={link} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Buka Link
                </a>
              </div>
            </div>
            <div className="shrink-0 rounded-xl border border-slate-200 p-3">
              <QRCodeSVG value={link} size={128} />
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
