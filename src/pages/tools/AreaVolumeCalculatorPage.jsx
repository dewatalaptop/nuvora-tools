import { useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import InputField from "../../components/InputField.jsx";
import { ResultCard, ResultRow } from "../../components/ResultCard.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { parseNumber } from "../../lib/format.js";

const tool = getToolBySlug("area-volume-calculator");

const SHAPES = {
  rectangle: { label: "Rectangle", fields: ["length", "width"], formula: "Panjang × Lebar", calc: (v) => ({ Area: v.length * v.width }) },
  square: { label: "Square", fields: ["side"], formula: "Sisi × Sisi", calc: (v) => ({ Area: v.side * v.side }) },
  triangle: { label: "Triangle", fields: ["base", "height"], formula: "½ × Alas × Tinggi", calc: (v) => ({ Area: 0.5 * v.base * v.height }) },
  circle: { label: "Circle", fields: ["radius"], formula: "π × r²", calc: (v) => ({ Area: Math.PI * v.radius ** 2, Keliling: 2 * Math.PI * v.radius }) },
  cylinder: { label: "Cylinder", fields: ["radius", "height"], formula: "π × r² × Tinggi", calc: (v) => ({ Volume: Math.PI * v.radius ** 2 * v.height }) },
  box: { label: "Box", fields: ["length", "width", "height"], formula: "Panjang × Lebar × Tinggi", calc: (v) => ({ Volume: v.length * v.width * v.height }) },
  room: { label: "Room", fields: ["length", "width", "height"], formula: "Panjang × Lebar × Tinggi", calc: (v) => ({ Volume: v.length * v.width * v.height, "Luas Lantai": v.length * v.width }) },
};

const FIELD_LABELS = { length: "Panjang", width: "Lebar", height: "Tinggi", side: "Sisi", base: "Alas", radius: "Radius" };

export default function AreaVolumeCalculatorPage() {
  const [shape, setShape] = useState("rectangle");
  const [values, setValues] = useState({});

  const def = SHAPES[shape];
  const filled = def.fields.every((f) => parseNumber(values[f]) > 0);
  const result = filled ? def.calc(Object.fromEntries(def.fields.map((f) => [f, parseNumber(values[f])]))) : null;

  function changeShape(key) {
    setShape(key);
    setValues({});
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Area & Volume Calculator Online Gratis"
      seoDescription="Hitung luas dan volume bangun ruang umum: persegi, segitiga, lingkaran, tabung, balok, dan ruangan."
      howTo={["Pilih bentuk bangun ruang.", "Isi ukurannya.", "Hasil luas/volume muncul otomatis."]}
      faq={[{ q: "Satuan apa yang digunakan?", a: "Tool ini satuan-agnostik — hasilnya mengikuti satuan input kamu (misalnya meter → hasil dalam m² atau m³)." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {Object.entries(SHAPES).map(([key, s]) => (
            <button
              key={key}
              onClick={() => changeShape(key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                shape === key ? "bg-brand-600 text-white" : "border border-slate-200 text-slate-600"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="mb-3 text-xs text-slate-400">Rumus: {def.formula}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {def.fields.map((f) => (
            <InputField
              key={f}
              label={FIELD_LABELS[f]}
              type="number"
              value={values[f] || ""}
              onChange={(e) => setValues((v) => ({ ...v, [f]: e.target.value }))}
            />
          ))}
        </div>
      </div>

      {result && (
        <div className="mt-5">
          <ResultCard>
            {Object.entries(result).map(([label, value]) => (
              <ResultRow key={label} label={label} value={value.toLocaleString("id-ID", { maximumFractionDigits: 2 })} big={label === "Area" || label === "Volume"} />
            ))}
          </ResultCard>
        </div>
      )}
    </ToolLayout>
  );
}
