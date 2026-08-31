import { useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import { ResultCard, ResultRow } from "../../components/ResultCard.jsx";
import { getToolBySlug } from "../../data/tools.js";

const tool = getToolBySlug("kalkulator-umur");

function hitungUmur(lahir) {
  const now = new Date();
  const birth = new Date(lahir);

  let tahun = now.getFullYear() - birth.getFullYear();
  let bulan = now.getMonth() - birth.getMonth();
  let hari = now.getDate() - birth.getDate();

  if (hari < 0) {
    bulan -= 1;
    hari += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (bulan < 0) {
    tahun -= 1;
    bulan += 12;
  }

  const totalHari = Math.floor((now - birth) / (1000 * 60 * 60 * 24));

  let nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday < now) nextBirthday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
  const daysToNext = Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24));

  return { tahun, bulan, hari, totalHari, daysToNext };
}

export default function UmurPage() {
  const [lahir, setLahir] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function hitung() {
    if (!lahir) return setError("Masukkan tanggal lahir terlebih dahulu.");
    const birth = new Date(lahir);
    if (birth > new Date()) return setError("Tanggal lahir tidak boleh di masa depan.");
    setError("");
    setResult(hitungUmur(lahir));
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Kalkulator Umur Online Gratis"
      seoDescription="Hitung umur tepat dalam tahun, bulan, dan hari dari tanggal lahirmu, lengkap dengan countdown ulang tahun berikutnya."
      howTo={["Masukkan tanggal lahir.", "Klik Hitung.", "Lihat umur dalam tahun, bulan, hari, dan countdown ulang tahun berikutnya."]}
      faq={[{ q: "Apakah tanggal saya disimpan?", a: "Tidak, semua perhitungan dilakukan langsung di browser kamu dan tidak dikirim ke server manapun." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <label className="block max-w-xs">
          <span className="mb-1.5 block text-sm font-medium text-navy-700">Tanggal lahir</span>
          <input
            type="date"
            value={lahir}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setLahir(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-navy-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </label>
        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
        <button onClick={hitung} className="mt-5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-brand-600 hover:to-brand-700">
          Hitung
        </button>
      </div>

      {result && (
        <div className="mt-5">
          <ResultCard>
            <ResultRow label="Umur" value={`${result.tahun} tahun ${result.bulan} bulan ${result.hari} hari`} big />
            <ResultRow label="Total hari" value={`${result.totalHari.toLocaleString("id-ID")} hari`} />
            <ResultRow label="Ulang tahun berikutnya" value={`${result.daysToNext} hari lagi`} />
          </ResultCard>
        </div>
      )}
    </ToolLayout>
  );
}
