import { useMemo, useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import { ResultCard, ResultRow } from "../../components/ResultCard.jsx";
import { getToolBySlug } from "../../data/tools.js";

const tool = getToolBySlug("average-calculator");

function parseNumbers(text) {
  return text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

function median(sorted) {
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export default function AverageCalculatorPage() {
  const [text, setText] = useState("");

  const numbers = useMemo(() => parseNumbers(text), [text]);
  const stats = useMemo(() => {
    if (numbers.length === 0) return null;
    const sum = numbers.reduce((a, b) => a + b, 0);
    const sorted = [...numbers].sort((a, b) => a - b);
    return {
      average: sum / numbers.length,
      sum,
      count: numbers.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: median(sorted),
    };
  }, [numbers]);

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Average Calculator — Kalkulator Rata-rata Online Gratis"
      seoDescription="Hitung rata-rata, jumlah, minimum, maksimum, dan median dari sekumpulan angka."
      howTo={["Masukkan angka, pisahkan dengan koma atau baris baru.", "Semua statistik muncul otomatis."]}
      faq={[{ q: "Bisa paste angka dari Excel?", a: "Bisa — tempel langsung, tool ini otomatis mendeteksi angka yang dipisah koma atau baris baru." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder={"10\n20\n30\n40"}
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-mono outline-none focus:border-brand-400"
        />
        <p className="mt-2 text-xs text-slate-400">{numbers.length} angka terdeteksi</p>
      </div>

      {stats && (
        <div className="mt-5">
          <ResultCard>
            <ResultRow label="Rata-rata" value={stats.average.toLocaleString("id-ID", { maximumFractionDigits: 4 })} big />
            <ResultRow label="Jumlah (sum)" value={stats.sum.toLocaleString("id-ID")} />
            <ResultRow label="Banyaknya data" value={stats.count} />
            <ResultRow label="Minimum" value={stats.min.toLocaleString("id-ID")} />
            <ResultRow label="Maksimum" value={stats.max.toLocaleString("id-ID")} />
            <ResultRow label="Median" value={stats.median.toLocaleString("id-ID", { maximumFractionDigits: 4 })} />
          </ResultCard>
        </div>
      )}
    </ToolLayout>
  );
}
