import { useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import InputField from "../../components/InputField.jsx";
import { ResultCard, ResultRow } from "../../components/ResultCard.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { parseNumber } from "../../lib/format.js";

const tool = getToolBySlug("tile-calculator");
const TILE_SIZES = ["20x20", "30x30", "40x40", "50x50", "60x60", "custom"];

export default function TileCalculatorPage() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [tileSize, setTileSize] = useState("40x40");
  const [customSize, setCustomSize] = useState("");
  const [waste, setWaste] = useState("10");
  const [perBox, setPerBox] = useState("");

  const L = parseNumber(length);
  const W = parseNumber(width);
  const sizeCm = tileSize === "custom" ? parseNumber(customSize) : parseNumber(tileSize.split("x")[0]);
  const filled = L > 0 && W > 0 && sizeCm > 0;

  let result = null;
  if (filled) {
    const roomArea = L * W;
    const tileArea = (sizeCm / 100) ** 2;
    const baseTiles = Math.ceil(roomArea / tileArea);
    const wastePct = parseNumber(waste) || 0;
    const withWaste = Math.ceil(baseTiles * (1 + wastePct / 100));
    const boxes = parseNumber(perBox) > 0 ? Math.ceil(withWaste / parseNumber(perBox)) : null;
    result = { roomArea, baseTiles, extra: withWaste - baseTiles, totalTiles: withWaste, boxes };
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Tile Calculator — Kalkulator Kebutuhan Keramik Gratis"
      seoDescription="Hitung kebutuhan keramik/ubin lantai berdasarkan ukuran ruangan dan ukuran keramik, lengkap dengan cadangan waste."
      howTo={["Masukkan ukuran ruangan.", "Pilih ukuran keramik.", "Atur persentase waste (cadangan).", "Estimasi jumlah keramik muncul otomatis."]}
      faq={[{ q: "Kenapa perlu waste percentage?", a: "Untuk mengantisipasi potongan keramik di tepi ruangan dan kerusakan saat pemasangan. Default 10% adalah asumsi umum di lapangan." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <InputField label="Panjang ruangan" suffix="m" type="number" value={length} onChange={(e) => setLength(e.target.value)} />
          <InputField label="Lebar ruangan" suffix="m" type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">Ukuran keramik</span>
            <select value={tileSize} onChange={(e) => setTileSize(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none focus:border-brand-400">
              {TILE_SIZES.map((s) => (
                <option key={s} value={s}>{s === "custom" ? "Custom" : `${s} cm`}</option>
              ))}
            </select>
          </label>
          {tileSize === "custom" && (
            <InputField label="Ukuran custom" suffix="cm" type="number" value={customSize} onChange={(e) => setCustomSize(e.target.value)} hint="Sisi keramik persegi" />
          )}
          <InputField label="Waste" suffix="%" type="number" value={waste} onChange={(e) => setWaste(e.target.value)} />
          <InputField label="Keramik per box (opsional)" type="number" value={perBox} onChange={(e) => setPerBox(e.target.value)} />
        </div>
        <p className="mt-3 text-xs text-slate-400">Disarankan membeli sedikit material tambahan untuk potongan dan kerusakan.</p>
      </div>

      {result && (
        <div className="mt-5">
          <ResultCard>
            <ResultRow label="Luas ruangan" value={`${result.roomArea.toFixed(2)} m²`} />
            <ResultRow label="Keramik dasar" value={`${result.baseTiles} pcs`} />
            <ResultRow label="Cadangan waste" value={`${result.extra} pcs`} />
            <ResultRow label="Total keramik" value={`${result.totalTiles} pcs`} big />
            {result.boxes !== null && <ResultRow label="Estimasi box" value={`${result.boxes} box`} />}
          </ResultCard>
        </div>
      )}
    </ToolLayout>
  );
}
