import { useMemo, useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { copyToClipboard } from "../../lib/format.js";

const tool = getToolBySlug("color-converter");

function hexToRgb(hex) {
  const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  const s = max === 0 ? 0 : d / max;
  return { h: Math.round(h), s: Math.round(s * 100), v: Math.round(max * 100) };
}

function rgbToCmyk({ r, g, b }) {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const k = 1 - Math.max(rf, gf, bf);
  const c = (1 - rf - k) / (1 - k);
  const m = (1 - gf - k) / (1 - k);
  const y = (1 - bf - k) / (1 - k);
  return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
}

function Row({ label, value }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="font-mono text-sm text-navy-800">{value}</p>
      </div>
      <button
        onClick={async () => {
          await copyToClipboard(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="text-xs font-medium text-brand-600 hover:underline"
      >
        {copied ? "Tersalin!" : "Copy"}
      </button>
    </div>
  );
}

export default function ColorConverterPage() {
  const [hex, setHex] = useState("#2563EB");

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = rgb ? rgbToHsl(rgb) : null;
  const hsv = rgb ? rgbToHsv(rgb) : null;
  const cmyk = rgb ? rgbToCmyk(rgb) : null;

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Color Converter — HEX ke RGB, HSL, HSV, CMYK Gratis"
      seoDescription="Ubah kode warna HEX ke RGB, HSL, HSV, dan CMYK secara akurat dan instan."
      howTo={["Masukkan kode HEX atau pilih warna lewat color picker.", "Semua format lain (RGB, HSL, HSV, CMYK) muncul otomatis."]}
      faq={[{ q: "Apakah hasil CMYK akurat untuk cetak?", a: "Konversi ini pakai formula standar RGB→CMYK, cocok untuk referensi desain — untuk cetak profesional sebaiknya cek profil warna dari percetakan." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <input type="color" value={rgb ? hex : "#2563EB"} onChange={(e) => setHex(e.target.value)} className="h-14 w-14 shrink-0 rounded-xl border border-slate-200" />
          <input
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            placeholder="#2563EB"
            className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 font-mono outline-none focus:border-brand-400"
          />
        </div>
        {!rgb && <p className="mt-3 text-sm font-medium text-red-500">Format HEX tidak valid. Gunakan format #RRGGBB.</p>}
      </div>

      {rgb && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Row label="HEX" value={hex.toUpperCase()} />
          <Row label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
          <Row label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
          <Row label="HSV" value={`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`} />
          <Row label="CMYK" value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`} />
        </div>
      )}
    </ToolLayout>
  );
}
