import { useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import InputField from "../../components/InputField.jsx";
import { ResultCard, ResultRow } from "../../components/ResultCard.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { formatRupiah, parseNumber, copyToClipboard } from "../../lib/format.js";

const tool = getToolBySlug("kalkulator-diskon");

export default function DiskonPage() {
  const [harga, setHarga] = useState("");
  const [diskon, setDiskon] = useState("");
  const [pajak, setPajak] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function hitung() {
    const hargaAwal = parseNumber(harga);
    const persenDiskon = parseNumber(diskon);
    const persenPajak = parseNumber(pajak);

    if (hargaAwal <= 0) return setError("Harga awal harus lebih dari 0.");
    if (persenDiskon < 0 || persenDiskon > 100) return setError("Diskon harus antara 0-100%.");
    setError("");

    const hemat = hargaAwal * (persenDiskon / 100);
    const setelahDiskon = hargaAwal - hemat;
    const setelahPajak = setelahDiskon * (1 + persenPajak / 100);

    setResult({ hargaAwal, persenDiskon, hemat, setelahDiskon, setelahPajak, persenPajak });
  }

  function reset() {
    setHarga("");
    setDiskon("");
    setPajak("");
    setResult(null);
    setError("");
  }

  async function salin() {
    if (!result) return;
    const ok = await copyToClipboard(
      `Harga awal: ${formatRupiah(result.hargaAwal)}\nDiskon: ${result.persenDiskon}%\nHemat: ${formatRupiah(result.hemat)}\nHarga setelah diskon: ${formatRupiah(result.setelahDiskon)}`
    );
    setCopied(ok);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Kalkulator Diskon Online Gratis"
      seoDescription="Hitung diskon, harga setelah diskon, dan jumlah penghematan dengan kalkulator diskon online gratis dari Nuvora Tools. Tanpa login."
      howTo={["Masukkan harga awal.", "Masukkan persentase diskon.", "Klik Hitung.", "Lihat hasilnya."]}
      faq={[
        { q: "Bagaimana cara menghitung diskon?", a: "Hemat = Harga awal × (Diskon / 100). Harga setelah diskon = Harga awal − Hemat." },
        { q: "Apakah kalkulator ini gratis?", a: "Ya, sepenuhnya gratis dan tanpa batas penggunaan." },
        { q: "Apakah perlu login?", a: "Tidak, semua perhitungan dilakukan langsung di browser kamu." },
      ]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Harga awal"
            prefix="Rp"
            type="number"
            inputMode="decimal"
            placeholder="100000"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
          />
          <InputField
            label="Diskon"
            suffix="%"
            type="number"
            inputMode="decimal"
            placeholder="20"
            value={diskon}
            onChange={(e) => setDiskon(e.target.value)}
          />
          <InputField
            label="Pajak (opsional)"
            suffix="%"
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={pajak}
            onChange={(e) => setPajak(e.target.value)}
          />
        </div>
        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={hitung} className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-brand-600 hover:to-brand-700">
            Hitung
          </button>
          <button onClick={reset} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-5">
          <ResultCard>
            <ResultRow label="Harga awal" value={formatRupiah(result.hargaAwal)} />
            <ResultRow label="Diskon" value={`${result.persenDiskon}%`} />
            <ResultRow label="Hemat" value={formatRupiah(result.hemat)} />
            <ResultRow label="Harga setelah diskon" value={formatRupiah(result.setelahDiskon)} big />
            {result.persenPajak > 0 && <ResultRow label="Harga setelah pajak" value={formatRupiah(result.setelahPajak)} />}
          </ResultCard>
          <button onClick={salin} className="mt-3 text-sm font-medium text-brand-600 hover:underline">
            {copied ? "Tersalin!" : "Salin hasil"}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
