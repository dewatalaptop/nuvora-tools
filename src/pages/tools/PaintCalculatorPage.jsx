import { useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import InputField from "../../components/InputField.jsx";
import { ResultCard, ResultRow } from "../../components/ResultCard.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { parseNumber } from "../../lib/format.js";

const tool = getToolBySlug("paint-calculator");
const DOOR_AREA = 1.8; // m², standard door approximation
const WINDOW_AREA = 1.2; // m², standard window approximation

export default function PaintCalculatorPage() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("2.8");
  const [doors, setDoors] = useState("1");
  const [windows, setWindows] = useState("1");
  const [coverage, setCoverage] = useState("10");
  const [coats, setCoats] = useState("2");

  const L = parseNumber(length);
  const W = parseNumber(width);
  const H = parseNumber(height);
  const filled = L > 0 && W > 0 && H > 0;

  let result = null;
  if (filled) {
    const wallArea = 2 * (L + W) * H;
    const openings = parseNumber(doors) * DOOR_AREA + parseNumber(windows) * WINDOW_AREA;
    const paintable = Math.max(0, wallArea - openings);
    const litersPerCoat = paintable / (parseNumber(coverage) || 10);
    const totalLiters = litersPerCoat * (parseNumber(coats) || 1);
    result = { wallArea, openings, paintable, totalLiters, cans: Math.ceil(totalLiters / 2.5) };
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Paint Calculator — Kalkulator Kebutuhan Cat Tembok Gratis"
      seoDescription="Hitung kebutuhan cat tembok berdasarkan ukuran ruangan, jumlah pintu/jendela, dan daya sebar cat."
      howTo={["Masukkan ukuran ruangan (panjang, lebar, tinggi).", "Masukkan jumlah pintu & jendela.", "Atur daya sebar cat dan jumlah lapisan.", "Estimasi liter cat muncul otomatis."]}
      faq={[{ q: "Seberapa akurat estimasi ini?", a: "Ini estimasi kasar berdasarkan asumsi standar ukuran pintu/jendela dan daya sebar cat rata-rata — hasil sebenarnya bisa berbeda tergantung kondisi permukaan, jenis cat, dan metode aplikasi." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <InputField label="Panjang ruangan" suffix="m" type="number" value={length} onChange={(e) => setLength(e.target.value)} />
          <InputField label="Lebar ruangan" suffix="m" type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
          <InputField label="Tinggi dinding" suffix="m" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          <InputField label="Jumlah pintu" type="number" value={doors} onChange={(e) => setDoors(e.target.value)} />
          <InputField label="Jumlah jendela" type="number" value={windows} onChange={(e) => setWindows(e.target.value)} />
          <InputField label="Daya sebar cat" suffix="m²/liter" type="number" value={coverage} onChange={(e) => setCoverage(e.target.value)} />
          <InputField label="Jumlah lapisan" type="number" value={coats} onChange={(e) => setCoats(e.target.value)} />
        </div>
        <p className="mt-3 text-xs text-slate-400">Estimasi dapat berbeda tergantung kondisi permukaan, jenis cat, dan metode aplikasi.</p>
      </div>

      {result && (
        <div className="mt-5">
          <ResultCard>
            <ResultRow label="Total luas dinding" value={`${result.wallArea.toFixed(1)} m²`} />
            <ResultRow label="Dikurangi pintu/jendela" value={`${result.openings.toFixed(1)} m²`} />
            <ResultRow label="Luas yang dicat" value={`${result.paintable.toFixed(1)} m²`} />
            <ResultRow label="Estimasi cat dibutuhkan" value={`${result.totalLiters.toFixed(1)} liter`} big />
            <ResultRow label="Estimasi kaleng (2.5L)" value={`${result.cans} kaleng`} />
          </ResultCard>
        </div>
      )}
    </ToolLayout>
  );
}
