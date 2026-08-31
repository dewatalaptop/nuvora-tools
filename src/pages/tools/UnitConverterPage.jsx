import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import ToolLayout from "../../components/ToolLayout.jsx";
import { getToolBySlug } from "../../data/tools.js";

const tool = getToolBySlug("unit-converter");

// Every category except temperature converts via a simple base-unit factor
// (value * factor = base unit, base unit / factor = target). Temperature
// needs real formulas since C/F/K aren't linearly related through a shared
// zero point.
const CATEGORIES = {
  length: {
    label: "Panjang",
    base: "m",
    units: { km: 1000, m: 1, cm: 0.01, mm: 0.001, mile: 1609.344, yard: 0.9144, feet: 0.3048, inch: 0.0254 },
  },
  weight: {
    label: "Berat",
    base: "kg",
    units: { ton: 1000, kg: 1, gram: 0.001, mg: 0.000001, pound: 0.45359237, ounce: 0.028349523 },
  },
  volume: {
    label: "Volume",
    base: "liter",
    units: { liter: 1, ml: 0.001, gallon: 3.785411784, cup: 0.2365882365 },
  },
  area: {
    label: "Luas",
    base: "m2",
    units: { "m²": 1, "km²": 1000000, "cm²": 0.0001, hectare: 10000, acre: 4046.8564224 },
  },
  digital: {
    label: "Digital",
    base: "byte",
    units: { bit: 0.125, byte: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4 },
  },
};

const TEMP_UNITS = ["Celsius", "Fahrenheit", "Kelvin"];

function toCelsius(value, unit) {
  if (unit === "Celsius") return value;
  if (unit === "Fahrenheit") return ((value - 32) * 5) / 9;
  return value - 273.15;
}
function fromCelsius(celsius, unit) {
  if (unit === "Celsius") return celsius;
  if (unit === "Fahrenheit") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

function formatResult(n) {
  if (!Number.isFinite(n)) return "-";
  return Number(n.toPrecision(10)).toLocaleString("id-ID", { maximumFractionDigits: 6 });
}

export default function UnitConverterPage() {
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("km");
  const [toUnit, setToUnit] = useState("m");
  const [value, setValue] = useState("1");

  const isTemp = category === "temperature";
  const units = isTemp ? TEMP_UNITS : Object.keys(CATEGORIES[category].units);

  function changeCategory(cat) {
    setCategory(cat);
    const list = cat === "temperature" ? TEMP_UNITS : Object.keys(CATEGORIES[cat].units);
    setFromUnit(list[0]);
    setToUnit(list[1] ?? list[0]);
  }

  const result = useMemo(() => {
    const n = parseFloat(value);
    if (!Number.isFinite(n)) return null;
    if (isTemp) return fromCelsius(toCelsius(n, fromUnit), toUnit);
    const { units: u } = CATEGORIES[category];
    return (n * u[fromUnit]) / u[toUnit];
  }, [value, fromUnit, toUnit, category, isTemp]);

  function swap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Unit Converter — Konversi Satuan Online Gratis"
      seoDescription="Ubah satuan panjang, berat, suhu, volume, luas, dan digital dengan cepat dan akurat, langsung di browser."
      howTo={["Pilih kategori satuan.", "Pilih satuan asal dan tujuan.", "Masukkan angka — hasil muncul otomatis."]}
      faq={[{ q: "Apakah hasilnya akurat?", a: "Ya, menggunakan faktor konversi standar internasional." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {[...Object.entries(CATEGORIES).map(([k, v]) => [k, v.label]), ["temperature", "Suhu"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => changeCategory(key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                category === key ? "bg-brand-600 text-white" : "border border-slate-200 text-slate-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">Dari</span>
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none focus:border-brand-400">
              {units.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </label>
          <button onClick={swap} className="mx-auto rounded-full border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50" title="Tukar">
            <ArrowLeftRight className="h-4 w-4" />
          </button>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">Ke</span>
            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 outline-none focus:border-brand-400">
              {units.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-navy-700">Nilai</span>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400"
          />
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Hasil</p>
        <p className="text-3xl font-extrabold text-brand-600">
          {result === null ? "-" : formatResult(result)} <span className="text-lg text-slate-400">{toUnit}</span>
        </p>
      </div>
    </ToolLayout>
  );
}
