import { useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import InputField from "../../components/InputField.jsx";
import { ResultCard, ResultRow } from "../../components/ResultCard.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { formatRupiah, parseNumber } from "../../lib/format.js";

const tool = getToolBySlug("bep");

export default function BepPage() {
  const [biayaTetap, setBiayaTetap] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [biayaVariabel, setBiayaVariabel] = useState("");
  const [unitTerjual, setUnitTerjual] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function hitung() {
    const tetap = parseNumber(biayaTetap);
    const jual = parseNumber(hargaJual);
    const variabel = parseNumber(biayaVariabel);
    const unit = parseNumber(unitTerjual);

    if (tetap < 0) return setError("Biaya tetap tidak boleh negatif.");
    if (jual <= variabel) return setError("Harga jual per unit harus lebih besar dari biaya variabel per unit.");
    setError("");

    const marginKontribusi = jual - variabel;
    const bepUnit = tetap / marginKontribusi;
    const bepRupiah = bepUnit * jual;
    const estimasiProfit = unit > 0 ? marginKontribusi * unit - tetap : null;

    setResult({ bepUnit, bepRupiah, estimasiProfit });
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Kalkulator BEP (Break Even Point) Online Gratis"
      seoDescription="Hitung titik impas (break even point) usahamu dalam unit dan Rupiah, lengkap dengan estimasi profit."
      howTo={["Masukkan biaya tetap bulanan.", "Masukkan harga jual per unit.", "Masukkan biaya variabel per unit.", "Klik Hitung untuk melihat titik impas."]}
      faq={[
        { q: "Apa itu BEP?", a: "BEP (Break Even Point) adalah titik di mana total pendapatan sama dengan total biaya — usaha belum untung, tapi juga tidak rugi." },
        { q: "Bagaimana cara menghitung BEP unit?", a: "BEP unit = Biaya tetap ÷ (Harga jual per unit − Biaya variabel per unit)." },
      ]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Biaya tetap" prefix="Rp" type="number" placeholder="5000000" value={biayaTetap} onChange={(e) => setBiayaTetap(e.target.value)} />
          <InputField label="Harga jual per unit" prefix="Rp" type="number" placeholder="50000" value={hargaJual} onChange={(e) => setHargaJual(e.target.value)} />
          <InputField label="Biaya variabel per unit" prefix="Rp" type="number" placeholder="30000" value={biayaVariabel} onChange={(e) => setBiayaVariabel(e.target.value)} />
          <InputField label="Jumlah unit terjual (opsional)" type="number" placeholder="200" value={unitTerjual} onChange={(e) => setUnitTerjual(e.target.value)} hint="Untuk estimasi profit" />
        </div>
        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
        <button onClick={hitung} className="mt-5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-brand-600 hover:to-brand-700">
          Hitung
        </button>
      </div>

      {result && (
        <div className="mt-5">
          <ResultCard>
            <ResultRow label="BEP unit" value={`${Math.ceil(result.bepUnit).toLocaleString("id-ID")} unit`} big />
            <ResultRow label="BEP Rupiah" value={formatRupiah(result.bepRupiah)} />
            {result.estimasiProfit !== null && (
              <ResultRow label="Estimasi profit" value={formatRupiah(result.estimasiProfit)} />
            )}
          </ResultCard>
        </div>
      )}
    </ToolLayout>
  );
}
