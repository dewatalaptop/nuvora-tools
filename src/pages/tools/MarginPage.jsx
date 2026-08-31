import { useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import InputField from "../../components/InputField.jsx";
import { ResultCard, ResultRow } from "../../components/ResultCard.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { formatRupiah, parseNumber } from "../../lib/format.js";

const tool = getToolBySlug("margin");

export default function MarginPage() {
  const [hargaJual, setHargaJual] = useState("");
  const [modal, setModal] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function hitung() {
    const jual = parseNumber(hargaJual);
    const hpp = parseNumber(modal);
    if (jual <= 0) return setError("Harga jual harus lebih dari 0.");
    if (hpp <= 0) return setError("Modal / HPP harus lebih dari 0.");
    setError("");
    const profit = jual - hpp;
    const margin = (profit / jual) * 100;
    const markup = (profit / hpp) * 100;
    setResult({ profit, margin, markup });
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Kalkulator Margin & Markup Online Gratis"
      seoDescription="Hitung profit, margin, dan markup keuntungan bisnis dari harga jual dan modal."
      howTo={["Masukkan harga jual.", "Masukkan modal / HPP.", "Klik Hitung untuk melihat profit, margin, dan markup."]}
      faq={[
        { q: "Apa beda margin dan markup?", a: "Margin dihitung dari harga jual (profit ÷ harga jual), sedangkan markup dihitung dari modal (profit ÷ modal). Keduanya mengukur keuntungan yang sama dengan basis pembagi berbeda." },
      ]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Harga jual" prefix="Rp" type="number" placeholder="100000" value={hargaJual} onChange={(e) => setHargaJual(e.target.value)} />
          <InputField label="Modal / HPP" prefix="Rp" type="number" placeholder="70000" value={modal} onChange={(e) => setModal(e.target.value)} />
        </div>
        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
        <button onClick={hitung} className="mt-5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-brand-600 hover:to-brand-700">
          Hitung
        </button>
      </div>

      {result && (
        <div className="mt-5">
          <ResultCard>
            <ResultRow label="Profit" value={formatRupiah(result.profit)} big />
            <ResultRow label="Margin" value={`${result.margin.toFixed(1)}%`} />
            <ResultRow label="Markup" value={`${result.markup.toFixed(1)}%`} />
          </ResultCard>
        </div>
      )}
    </ToolLayout>
  );
}
