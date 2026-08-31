export function ResultCard({ children, highlight = false }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Hasil</p>
      {highlight && <div className="mb-3 border-b border-dashed border-slate-200 pb-3" />}
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function ResultRow({ label, value, big = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={big ? "text-2xl font-extrabold text-brand-600" : "font-semibold text-navy-800"}>{value}</span>
    </div>
  );
}
