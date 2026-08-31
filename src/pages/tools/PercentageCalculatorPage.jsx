import { useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { parseNumber } from "../../lib/format.js";

const tool = getToolBySlug("percentage-calculator");

const MODES = [
  { key: "of", label: "Persentase dari angka" },
  { key: "isWhatPercent", label: "Berapa persen A dari B?" },
  { key: "increase", label: "Kenaikan persentase" },
  { key: "decrease", label: "Penurunan persentase" },
  { key: "difference", label: "Selisih persentase" },
];

function fmt(n) {
  return Number.isFinite(n) ? n.toLocaleString("id-ID", { maximumFractionDigits: 4 }) : "-";
}

export default function PercentageCalculatorPage() {
  const [mode, setMode] = useState("of");
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const A = parseNumber(a);
  const B = parseNumber(b);

  let result = null;
  let label = "";
  if (mode === "of" && a !== "" && b !== "") {
    result = (A / 100) * B;
    label = `${A}% dari ${B}`;
  } else if (mode === "isWhatPercent" && a !== "" && b !== "" && B !== 0) {
    result = (A / B) * 100;
    label = `${A} dari ${B}`;
  } else if (mode === "increase" && a !== "" && b !== "" && A !== 0) {
    result = ((B - A) / A) * 100;
    label = `Kenaikan dari ${A} ke ${B}`;
  } else if (mode === "decrease" && a !== "" && b !== "" && A !== 0) {
    result = ((A - B) / A) * 100;
    label = `Penurunan dari ${A} ke ${B}`;
  } else if (mode === "difference" && a !== "" && b !== "" && (A + B) !== 0) {
    result = (Math.abs(A - B) / ((A + B) / 2)) * 100;
    label = `Selisih antara ${A} dan ${B}`;
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Percentage Calculator — Kalkulator Persentase Online Gratis"
      seoDescription="Hitung persentase dari angka, kenaikan, penurunan, dan selisih persentase dengan cepat dan gratis."
      howTo={["Pilih mode perhitungan yang kamu butuhkan.", "Masukkan dua angka.", "Hasil muncul otomatis."]}
      faq={[{ q: "Apa beda 'kenaikan' dan 'selisih' persentase?", a: "Kenaikan/penurunan mengukur perubahan relatif terhadap nilai awal. Selisih persentase mengukur perbedaan relatif terhadap rata-rata kedua nilai — dipakai saat tidak ada nilai 'awal' yang jelas." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
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

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">{mode === "of" ? "Persen (%)" : "Angka A"}</span>
            <input type="number" value={a} onChange={(e) => setA(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">{mode === "of" ? "Angka" : "Angka B"}</span>
            <input type="number" value={b} onChange={(e) => setB(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400" />
          </label>
        </div>
      </div>

      {result !== null && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-center">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
          <p className="text-3xl font-extrabold text-brand-600">
            {fmt(result)}
            {mode === "isWhatPercent" || mode === "increase" || mode === "decrease" || mode === "difference" ? "%" : ""}
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
