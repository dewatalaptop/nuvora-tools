import { useRef, useState } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import ToolLayout from "../../components/ToolLayout.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { copyToClipboard } from "../../lib/format.js";
import { trackEvent } from "../../lib/analytics.js";

const tool = getToolBySlug("qr-code-generator");

const TYPES = [
  { key: "text", label: "Teks" },
  { key: "url", label: "URL" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Telepon" },
  { key: "wifi", label: "WiFi" },
];

function buildContent(type, fields) {
  switch (type) {
    case "url":
      return fields.url?.trim() || "";
    case "whatsapp": {
      const digits = (fields.phone || "").replace(/[^\d]/g, "").replace(/^0/, "62");
      if (!digits) return "";
      return `https://wa.me/${digits}${fields.message ? `?text=${encodeURIComponent(fields.message)}` : ""}`;
    }
    case "email":
      return fields.email ? `mailto:${fields.email}${fields.subject ? `?subject=${encodeURIComponent(fields.subject)}` : ""}` : "";
    case "phone":
      return fields.phone ? `tel:${fields.phone.replace(/[^\d+]/g, "")}` : "";
    case "wifi":
      return fields.ssid ? `WIFI:T:${fields.security || "WPA"};S:${fields.ssid};P:${fields.password || ""};;` : "";
    default:
      return fields.text?.trim() || "";
  }
}

export default function QrCodeGeneratorPage() {
  const [type, setType] = useState("text");
  const [fields, setFields] = useState({});
  const [size, setSize] = useState(220);
  const [margin, setMargin] = useState(2);
  const [fg, setFg] = useState("#0f172a");
  const [bg, setBg] = useState("#ffffff");
  const canvasRef = useRef(null);
  const svgWrapRef = useRef(null);

  const content = buildContent(type, fields);

  function setField(key, value) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function downloadPng() {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "nuvora-qr.png";
    a.click();
    trackEvent("download", { tool_id: tool.id, format: "png" });
  }

  function downloadSvg() {
    const svg = svgWrapRef.current?.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nuvora-qr.svg";
    a.click();
    URL.revokeObjectURL(url);
    trackEvent("download", { tool_id: tool.id, format: "svg" });
  }

  async function copyContent() {
    await copyToClipboard(content);
    trackEvent("copy", { tool_id: tool.id });
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="QR Code Generator Gratis Online"
      seoDescription="Buat QR Code gratis untuk URL, WhatsApp, WiFi, teks, email, dan nomor telepon. Cepat, mudah, dan tanpa login."
      howTo={["Pilih tipe QR (teks, URL, WhatsApp, email, telepon, atau WiFi).", "Isi datanya.", "QR muncul otomatis — atur ukuran & warna jika perlu.", "Download PNG atau SVG."]}
      faq={[
        { q: "Apakah QR ini bisa dipindai smartphone biasa?", a: "Ya, ini standar QR code biasa dan bisa dipindai kamera HP mana pun." },
        { q: "Apakah data saya dikirim ke server?", a: "Tidak, QR dibuat langsung di browser kamu." },
      ]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                type === t.key ? "bg-brand-600 text-white" : "border border-slate-200 text-slate-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          {type === "text" && (
            <textarea
              value={fields.text || ""}
              onChange={(e) => setField("text", e.target.value)}
              rows={3}
              placeholder="Tulis teks apa saja..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400"
            />
          )}
          {type === "url" && (
            <input
              value={fields.url || ""}
              onChange={(e) => setField("url", e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400"
            />
          )}
          {type === "whatsapp" && (
            <>
              <input
                value={fields.phone || ""}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="08123456789"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400"
              />
              <input
                value={fields.message || ""}
                onChange={(e) => setField("message", e.target.value)}
                placeholder="Pesan otomatis (opsional)"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400"
              />
            </>
          )}
          {type === "email" && (
            <>
              <input
                value={fields.email || ""}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400"
              />
              <input
                value={fields.subject || ""}
                onChange={(e) => setField("subject", e.target.value)}
                placeholder="Subjek (opsional)"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400"
              />
            </>
          )}
          {type === "phone" && (
            <input
              value={fields.phone || ""}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="+62812xxxxxxx"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400"
            />
          )}
          {type === "wifi" && (
            <>
              <input
                value={fields.ssid || ""}
                onChange={(e) => setField("ssid", e.target.value)}
                placeholder="Nama WiFi (SSID)"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400"
              />
              <input
                value={fields.password || ""}
                onChange={(e) => setField("password", e.target.value)}
                placeholder="Password WiFi"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400"
              />
              <select
                value={fields.security || "WPA"}
                onChange={(e) => setField("security", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none focus:border-brand-400"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Tanpa password</option>
              </select>
            </>
          )}
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-brand-600">Kustomisasi</summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-slate-600">Ukuran ({size}px)</span>
              <input type="range" min="120" max="400" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full" />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-600">Margin ({margin})</span>
              <input type="range" min="0" max="8" value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full" />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-600">Warna QR</span>
              <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-full rounded-lg" />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-600">Warna latar</span>
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-full rounded-lg" />
            </label>
          </div>
        </details>
      </div>

      {content ? (
        <div className="mt-5 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6">
          <div ref={canvasRef}>
            <QRCodeCanvas value={content} size={size} marginSize={margin} fgColor={fg} bgColor={bg} level="M" />
          </div>
          <div ref={svgWrapRef} className="hidden">
            <QRCodeSVG value={content} size={size} marginSize={margin} fgColor={fg} bgColor={bg} level="M" />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={downloadPng} className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white">
              Download PNG
            </button>
            <button onClick={downloadSvg} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Download SVG
            </button>
            <button onClick={copyContent} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Copy Konten
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-5 text-center text-sm text-slate-400">Isi data di atas untuk melihat QR code-nya.</p>
      )}
    </ToolLayout>
  );
}
