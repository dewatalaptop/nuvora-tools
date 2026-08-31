import { useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import { ResultCard, ResultRow } from "../../components/ResultCard.jsx";
import { getToolBySlug } from "../../data/tools.js";

const tool = getToolBySlug("date-calculator");
const DAY_MS = 1000 * 60 * 60 * 24;

const MODES = [
  { key: "difference", label: "Selisih Tanggal" },
  { key: "addsub", label: "Tambah/Kurang Hari" },
  { key: "business", label: "Hari Kerja" },
];

function countBusinessDays(start, end) {
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export default function DateCalculatorPage() {
  const [mode, setMode] = useState("difference");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState("30");
  const [direction, setDirection] = useState("add");

  let result = null;
  if (mode === "difference" && startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.round((end - start) / DAY_MS);
    result = {
      days: Math.abs(diffDays),
      weeks: (Math.abs(diffDays) / 7).toFixed(1),
      months: Math.abs(end.getMonth() - start.getMonth() + 12 * (end.getFullYear() - start.getFullYear())),
      years: Math.abs(end.getFullYear() - start.getFullYear()),
    };
  } else if (mode === "addsub" && startDate && days !== "") {
    const start = new Date(startDate);
    const delta = (direction === "add" ? 1 : -1) * Number(days);
    const target = new Date(start.getTime() + delta * DAY_MS);
    result = { resultDate: target.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) };
  } else if (mode === "business" && startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start <= end) result = { businessDays: countBusinessDays(start, end) };
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Date Calculator — Kalkulator Tanggal Online Gratis"
      seoDescription="Hitung selisih tanggal, tambah/kurang hari, dan jumlah hari kerja dengan cepat dan gratis."
      howTo={["Pilih mode perhitungan.", "Isi tanggal yang dibutuhkan.", "Hasil muncul otomatis."]}
      faq={[{ q: "Apakah hari kerja menghitung hari libur nasional?", a: "Belum — perhitungan hari kerja saat ini hanya mengecualikan Sabtu & Minggu, belum termasuk hari libur nasional." }]}
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

        {mode === "addsub" ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-navy-700">Tanggal awal</span>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-navy-700">Jumlah hari</span>
              <input type="number" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-navy-700">Arah</span>
              <select value={direction} onChange={(e) => setDirection(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none focus:border-brand-400">
                <option value="add">Tambah</option>
                <option value="subtract">Kurangi</option>
              </select>
            </label>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-navy-700">Tanggal awal</span>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-navy-700">Tanggal akhir</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400" />
            </label>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-5">
          <ResultCard>
            {mode === "difference" && (
              <>
                <ResultRow label="Selisih hari" value={`${result.days} hari`} big />
                <ResultRow label="Minggu" value={`${result.weeks} minggu`} />
                <ResultRow label="Bulan (perkiraan)" value={`${result.months} bulan`} />
                <ResultRow label="Tahun (perkiraan)" value={`${result.years} tahun`} />
              </>
            )}
            {mode === "addsub" && <ResultRow label="Tanggal hasil" value={result.resultDate} big />}
            {mode === "business" && <ResultRow label="Hari kerja" value={`${result.businessDays} hari`} big />}
          </ResultCard>
        </div>
      )}
    </ToolLayout>
  );
}
