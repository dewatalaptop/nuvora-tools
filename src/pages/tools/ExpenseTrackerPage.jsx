import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Download, ShieldCheck } from "lucide-react";
import ToolLayout from "../../components/ToolLayout.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { formatRupiah, parseNumber } from "../../lib/format.js";
import { triggerDownload } from "../../components/DownloadButton.jsx";
import { trackEvent } from "../../lib/analytics.js";

const tool = getToolBySlug("pencatat-pengeluaran");
const STORAGE_KEY = "nuvora-expense-tracker";

const CATEGORIES = ["Makanan", "Transportasi", "Tagihan", "Belanja", "Kesehatan", "Pendidikan", "Hiburan", "Lainnya"];
const CATEGORY_COLORS = {
  Makanan: "bg-orange-100 text-orange-700",
  Transportasi: "bg-blue-100 text-blue-700",
  Tagihan: "bg-red-100 text-red-700",
  Belanja: "bg-pink-100 text-pink-700",
  Kesehatan: "bg-emerald-100 text-emerald-700",
  Pendidikan: "bg-indigo-100 text-indigo-700",
  Hiburan: "bg-purple-100 text-purple-700",
  Lainnya: "bg-slate-100 text-slate-700",
};

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage unavailable (private window, blocked) — data just won't persist this session
  }
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function ExpenseTrackerPage() {
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [confirmingClear, setConfirmingClear] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveEntries(entries);
  }, [entries, loaded]);

  function addEntry() {
    const amt = parseNumber(amount);
    if (!date || amt <= 0) return;
    const entry = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date, category, description: description.trim(), amount: amt };
    setEntries((prev) => [entry, ...prev]);
    setDescription("");
    setAmount("");
    trackEvent("tool_complete", { tool_id: tool.id });
  }

  function removeEntry(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function clearAll() {
    if (!confirmingClear) {
      setConfirmingClear(true);
      setTimeout(() => setConfirmingClear(false), 3000);
      return;
    }
    setEntries([]);
    setConfirmingClear(false);
  }

  function exportCsv() {
    const header = "Tanggal,Kategori,Deskripsi,Jumlah\n";
    const rows = entries.map((e) => `${e.date},${e.category},"${(e.description || "").replace(/"/g, '""')}",${e.amount}`).join("\n");
    triggerDownload(new Blob([header + rows], { type: "text/csv" }), "pengeluaran-nuvora-tools.csv");
    trackEvent("download", { tool_id: tool.id });
  }

  const sorted = useMemo(() => [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)), [entries]);

  const thisMonthKey = todayISO().slice(0, 7);
  const summary = useMemo(() => {
    const thisMonth = entries.filter((e) => e.date.startsWith(thisMonthKey));
    const totalAll = entries.reduce((s, e) => s + e.amount, 0);
    const totalMonth = thisMonth.reduce((s, e) => s + e.amount, 0);
    const byCategory = {};
    for (const e of thisMonth) byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    const breakdown = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    return { totalAll, totalMonth, breakdown };
  }, [entries, thisMonthKey]);

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Pencatat Pengeluaran Rumah Tangga — Gratis & Privat"
      seoDescription="Catat dan lacak pengeluaran rumah tangga harian, tersimpan aman hanya di perangkatmu sendiri — tanpa akun, tanpa server."
      howTo={["Isi tanggal, kategori, deskripsi, dan jumlah pengeluaran.", "Klik Tambah.", "Lihat ringkasan bulanan dan breakdown per kategori secara otomatis."]}
      faq={[
        { q: "Di mana data pengeluaran saya disimpan?", a: "Hanya di browser/perangkat kamu sendiri (localStorage) — tidak pernah dikirim atau disimpan di server manapun. Kalau kamu membersihkan data browser atau ganti perangkat, catatan ini akan hilang, jadi gunakan tombol Export CSV secara berkala kalau ingin cadangan." },
        { q: "Apakah bisa diakses dari HP dan laptop sekaligus?", a: "Tidak otomatis — karena datanya lokal per perangkat/browser, catatan di HP dan laptop terpisah." },
      ]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="mb-4 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          Data tersimpan hanya di perangkat ini — tidak pernah dikirim ke server manapun.
        </p>

        <div className="grid gap-3 sm:grid-cols-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">Tanggal</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-400" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">Kategori</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-brand-400">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-1">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">Deskripsi</span>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Belanja bulanan" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-400" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-700">Jumlah</span>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="50000" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-brand-400" />
          </label>
        </div>

        <button onClick={addEntry} className="mt-4 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-brand-600 hover:to-brand-700">
          <Plus className="h-4 w-4" /> Tambah
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Bulan ini</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-600">{formatRupiah(summary.totalMonth)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total keseluruhan</p>
          <p className="mt-1 text-2xl font-extrabold text-navy-800">{formatRupiah(summary.totalAll)}</p>
        </div>
      </div>

      {summary.breakdown.length > 0 && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Breakdown bulan ini</p>
          <div className="space-y-2">
            {summary.breakdown.map(([cat, amt]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className={`w-24 shrink-0 rounded-full px-2 py-0.5 text-center text-[11px] font-semibold ${CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.Lainnya}`}>{cat}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(100, (amt / summary.totalMonth) * 100)}%` }} />
                </div>
                <span className="w-24 shrink-0 text-right text-xs font-medium text-slate-600">{formatRupiah(amt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Riwayat ({sorted.length})</p>
          <div className="flex gap-2">
            {entries.length > 0 && (
              <button onClick={exportCsv} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </button>
            )}
            {entries.length > 0 && (
              <button onClick={clearAll} className="text-xs font-medium text-red-500 hover:underline">
                {confirmingClear ? "Yakin hapus semua?" : "Hapus semua"}
              </button>
            )}
          </div>
        </div>

        {sorted.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">Belum ada catatan pengeluaran. Tambahkan yang pertama di atas.</p>
        ) : (
          <div className="space-y-1.5">
            {sorted.map((e) => (
              <div key={e.id} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50">
                <span className="w-20 shrink-0 text-xs text-slate-400">{e.date}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${CATEGORY_COLORS[e.category] ?? CATEGORY_COLORS.Lainnya}`}>{e.category}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-navy-700">{e.description || "-"}</span>
                <span className="shrink-0 text-sm font-semibold text-navy-800">{formatRupiah(e.amount)}</span>
                <button onClick={() => removeEntry(e.id)} className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
