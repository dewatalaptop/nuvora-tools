import { useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import InputField from "../../components/InputField.jsx";
import { ResultCard, ResultRow } from "../../components/ResultCard.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { formatRupiah, parseNumber } from "../../lib/format.js";

const tool = getToolBySlug("kalkulator-cicilan");

function hitungFlat(pinjaman, tenor, bungaTahun) {
  const bungaBulanan = pinjaman * (bungaTahun / 100 / 12);
  const cicilanPokok = pinjaman / tenor;
  const cicilanPerBulan = cicilanPokok + bungaBulanan;
  const totalBunga = bungaBulanan * tenor;
  return { cicilanPerBulan, totalBunga, totalPembayaran: pinjaman + totalBunga };
}

function hitungEfektif(pinjaman, tenor, bungaTahun) {
  const r = bungaTahun / 100 / 12;
  const cicilanPerBulan = r === 0 ? pinjaman / tenor : (pinjaman * r * Math.pow(1 + r, tenor)) / (Math.pow(1 + r, tenor) - 1);
  const totalPembayaran = cicilanPerBulan * tenor;
  return { cicilanPerBulan, totalBunga: totalPembayaran - pinjaman, totalPembayaran };
}

export default function CicilanPage() {
  const [pinjaman, setPinjaman] = useState("");
  const [tenor, setTenor] = useState("");
  const [bunga, setBunga] = useState("");
  const [metode, setMetode] = useState("flat");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function hitung() {
    const p = parseNumber(pinjaman);
    const t = parseNumber(tenor);
    const b = parseNumber(bunga);
    if (p <= 0) return setError("Jumlah pinjaman harus lebih dari 0.");
    if (t <= 0) return setError("Tenor harus lebih dari 0 bulan.");
    if (b < 0) return setError("Bunga tidak boleh negatif.");
    setError("");
    const r = metode === "flat" ? hitungFlat(p, t, b) : hitungEfektif(p, t, b);
    setResult(r);
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Kalkulator Cicilan Pinjaman Online Gratis"
      seoDescription="Hitung estimasi cicilan per bulan, total bunga, dan total pembayaran pinjaman dengan metode flat atau efektif."
      howTo={["Masukkan jumlah pinjaman.", "Masukkan tenor (jangka waktu) dalam bulan.", "Masukkan bunga per tahun.", "Pilih metode Flat atau Efektif, lalu klik Hitung."]}
      faq={[
        { q: "Apa beda bunga flat dan efektif?", a: "Bunga flat dihitung tetap dari pokok pinjaman awal setiap bulan. Bunga efektif dihitung dari sisa pokok yang belum dibayar, sehingga cicilan pokok makin besar dan bunga makin kecil seiring waktu." },
        { q: "Apakah ini penawaran kredit resmi?", a: "Bukan. Ini hanya simulasi untuk membantu estimasi, bukan penawaran dari lembaga keuangan manapun." },
      ]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Jumlah pinjaman" prefix="Rp" type="number" placeholder="10000000" value={pinjaman} onChange={(e) => setPinjaman(e.target.value)} />
          <InputField label="Tenor" suffix="bulan" type="number" placeholder="12" value={tenor} onChange={(e) => setTenor(e.target.value)} />
          <InputField label="Bunga per tahun" suffix="%" type="number" placeholder="10" value={bunga} onChange={(e) => setBunga(e.target.value)} />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">Metode</span>
            <div className="flex gap-2">
              {["flat", "efektif"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMetode(m)}
                  className={`flex-1 rounded-xl px-3.5 py-2.5 text-sm font-medium capitalize transition ${
                    metode === m ? "bg-brand-600 text-white" : "border border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </label>
        </div>
        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
        <button onClick={hitung} className="mt-5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-brand-600 hover:to-brand-700">
          Hitung
        </button>
        <p className="mt-4 text-xs text-slate-400">Ini adalah simulasi dan bukan penawaran kredit.</p>
      </div>

      {result && (
        <div className="mt-5">
          <ResultCard>
            <ResultRow label="Estimasi cicilan per bulan" value={formatRupiah(result.cicilanPerBulan)} big />
            <ResultRow label="Total bunga" value={formatRupiah(result.totalBunga)} />
            <ResultRow label="Total pembayaran" value={formatRupiah(result.totalPembayaran)} />
          </ResultCard>
        </div>
      )}
    </ToolLayout>
  );
}
