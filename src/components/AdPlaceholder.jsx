// Reusable ad slot placeholder. Not wired to AdSense yet — once an AdSense
// publisher/slot ID exists, this is the single place to swap in the real
// <ins class="adsbygoogle"> unit for every placement across the site.
export default function AdPlaceholder({ variant = "banner", className = "" }) {
  const sizes = {
    banner: "h-24",
    square: "h-64",
    sidebar: "h-96",
  };
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-400 ${sizes[variant] ?? sizes.banner} ${className}`}
    >
      Advertisement
    </div>
  );
}
