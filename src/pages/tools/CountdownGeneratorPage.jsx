import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ToolLayout from "../../components/ToolLayout.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { copyToClipboard } from "../../lib/format.js";

const tool = getToolBySlug("countdown-generator");

function encodeConfig(name, targetIso) {
  return btoa(encodeURIComponent(JSON.stringify({ n: name, t: targetIso })));
}
function decodeConfig(encoded) {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}

function useCountdown(targetIso) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!targetIso) return null;
  const diff = new Date(targetIso).getTime() - now;
  if (diff <= 0) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    done: false,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownGeneratorPage() {
  const [searchParams] = useSearchParams();
  const shared = searchParams.get("c") ? decodeConfig(searchParams.get("c")) : null;

  const [name, setName] = useState(shared?.n ?? "");
  const [date, setDate] = useState(shared?.t?.split("T")[0] ?? "");
  const [time, setTime] = useState(shared?.t?.split("T")[1]?.slice(0, 5) ?? "00:00");
  const [copied, setCopied] = useState(false);

  const targetIso = date ? `${date}T${time || "00:00"}:00` : null;
  const countdown = useCountdown(targetIso);

  const shareUrl = useMemo(() => {
    if (!targetIso || !name) return "";
    return `${window.location.origin}/tools/countdown-generator?c=${encodeConfig(name, targetIso)}`;
  }, [name, targetIso]);

  async function share() {
    const ok = await copyToClipboard(shareUrl);
    setCopied(ok);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Countdown Generator — Hitung Mundur Online Gratis"
      seoDescription="Buat hitung mundur ke tanggal & waktu tertentu, realtime, dan bisa dibagikan lewat link. Tanpa login."
      howTo={["Isi nama acara.", "Pilih tanggal & waktu target.", "Bagikan linknya lewat tombol Share Countdown."]}
      faq={[{ q: "Apakah perlu login untuk membuat countdown?", a: "Tidak, semua tersimpan dalam link itu sendiri — tidak perlu akun." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block sm:col-span-1">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">Nama acara</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ulang Tahun Toko" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">Tanggal</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">Waktu</span>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400" />
          </label>
        </div>
      </div>

      {countdown && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 text-center">
          {name && <p className="mb-3 font-semibold text-navy-800">{name}</p>}
          {countdown.done ? (
            <p className="text-2xl font-extrabold text-brand-600">Waktunya sudah tiba! 🎉</p>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {[
                ["Hari", countdown.days],
                ["Jam", countdown.hours],
                ["Menit", countdown.minutes],
                ["Detik", countdown.seconds],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-3xl font-extrabold text-navy-800 tabular-nums">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          )}
          {shareUrl && (
            <button onClick={share} className="mt-5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              {copied ? "Link tersalin!" : "Share Countdown"}
            </button>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
