export default function InputField({ label, prefix, suffix, error, hint, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy-700">{label}</span>
      <span
        className={`flex items-center gap-2 rounded-xl border bg-white px-3.5 py-2.5 transition focus-within:ring-2 ${
          error
            ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100"
            : "border-slate-200 focus-within:border-brand-400 focus-within:ring-brand-100"
        }`}
      >
        {prefix && <span className="shrink-0 text-sm font-medium text-slate-400">{prefix}</span>}
        <input
          {...inputProps}
          className="w-full min-w-0 bg-transparent text-navy-800 outline-none placeholder:text-slate-400"
        />
        {suffix && <span className="shrink-0 text-sm font-medium text-slate-400">{suffix}</span>}
      </span>
      {error && <span className="mt-1 block text-xs font-medium text-red-500">{error}</span>}
      {!error && hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}
