import { useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import InputField from "../../components/InputField.jsx";
import { ResultCard, ResultRow } from "../../components/ResultCard.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { formatRupiah, parseNumber } from "../../lib/format.js";

const tool = getToolBySlug("harga-jual");

export default function HargaJualPage() {
  const [modal, setModal] = useState("");
  const [operasional, setOperasional] = useState("");
  const [feePlatform, setFeePlatform] = useState("");
  const [targetProfit, setTargetProfit] = useState("");
  const [diskonRencana, setDiskonRencana] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function hitung() {
    const hpp = parseNumber(modal);
    const biayaOps = parseNumber(operasional);
    const fee = parseNumber(feePlatform);
    const profit = parseNumber(targetProfit);
    const diskon = parseNumber(diskonRencana);

    if (hpp <= 0) return setError("Modal / HPP harus lebih dari 0.");
    if (fee >= 100) return setError("Biaya platform tidak boleh 100% atau lebih.");
    setError("");

    const baseCost = hpp + biayaOps;
    const hargaMinimum = baseCost / (1 - fee / 100);
    const hargaRekomendasi = (baseCost * (1 + profit / 100)) / (1 - fee / 100);
    const pendapatanBersih = hargaRekomendasi * (1 - fee / 100);
    const keuntungan = pendapatanBersih - baseCost;
    const margin = (keuntungan / hargaRekomendasi) * 100;
    const hargaSetelahDiskon = hargaRekomendasi * (1 - diskon / 100);

    setResult({ hargaMinimum, hargaRekomendasi, keuntungan, margin, hargaSetelahDiskon, diskon });
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Kalkulator Harga Jual Online Gratis"
      seoDescription="Hitung harga jual minimum dan rekomendasi berdasarkan modal, biaya operasional, biaya platform, dan target keuntungan."
      howTo={[
        "Masukkan modal / HPP produk.",
        "Masukkan biaya operasional per unit (opsional).",
        "Masukkan biaya platform/marketplace (%) jika ada.",
        "Masukkan target keuntungan yang diinginkan, lalu klik Hitung.",
      ]}
      faq={[
        { q: "Apa beda harga jual minimum dan rekomendasi?", a: "Harga jual minimum adalah harga balik modal (profit 0%) setelah dikurangi biaya platform. Harga rekomendasi sudah menyertakan target keuntungan kamu." },
        { q: "Kenapa perlu memasukkan biaya platform?", a: "Marketplace biasanya memotong komisi dari harga jual, jadi harga jual perlu dinaikkan agar keuntungan bersih tetap sesuai target setelah potongan." },
      ]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Modal / HPP" prefix="Rp" type="number" placeholder="50000" value={modal} onChange={(e) => setModal(e.target.value)} />
          <InputField label="Biaya operasional" prefix="Rp" type="number" placeholder="5000" value={operasional} onChange={(e) => setOperasional(e.target.value)} />
          <InputField label="Biaya platform" suffix="%" type="number" placeholder="5" value={feePlatform} onChange={(e) => setFeePlatform(e.target.value)} />
          <InputField label="Target keuntungan" suffix="%" type="number" placeholder="30" value={targetProfit} onChange={(e) => setTargetProfit(e.target.value)} />
          <InputField label="Diskon yang direncanakan" suffix="%" type="number" placeholder="0" value={diskonRencana} onChange={(e) => setDiskonRencana(e.target.value)} />
        </div>
        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
        <button onClick={hitung} className="mt-5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-brand-600 hover:to-brand-700">
          Hitung
        </button>
      </div>

      {result && (
        <div className="mt-5">
          <ResultCard>
            <ResultRow label="Harga jual minimum" value={formatRupiah(result.hargaMinimum)} />
            <ResultRow label="Harga jual rekomendasi" value={formatRupiah(result.hargaRekomendasi)} big />
            <ResultRow label="Estimasi keuntungan" value={formatRupiah(result.keuntungan)} />
            <ResultRow label="Margin" value={`${result.margin.toFixed(1)}%`} />
            {result.diskon > 0 && <ResultRow label="Harga setelah diskon" value={formatRupiah(result.hargaSetelahDiskon)} />}
          </ResultCard>
        </div>
      )}
    </ToolLayout>
  );
}
