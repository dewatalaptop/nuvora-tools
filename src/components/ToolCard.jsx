import { Link } from "react-router-dom";
import { ArrowRight, Flame, Sparkles, Star, Zap } from "lucide-react";
import Icon from "./Icon.jsx";
import { getCategoryBySlug } from "../data/tools.js";
import { getAccent } from "../lib/categoryColors.js";

// A badge should carry meaning, not decorate every card — only a handful of
// tools in the data model actually set `badge`, keyed to one of these.
export const BADGE_META = {
  populer: { icon: Flame, label: "Populer", cls: "bg-orange-50 text-orange-600" },
  baru: { icon: Sparkles, label: "Baru", cls: "bg-emerald-50 text-emerald-600" },
  pilihan: { icon: Star, label: "Pilihan", cls: "bg-amber-50 text-amber-600" },
  cepat: { icon: Zap, label: "Cepat", cls: "bg-blue-50 text-blue-600" },
};

export default function ToolCard({ tool, showCategory = false }) {
  const category = getCategoryBySlug(tool.category);
  const accent = getAccent(category?.accent);
  const badge = tool.badge && BADGE_META[tool.badge];
  return (
    <Link
      to={`/tools/${tool.slug}`}
      className={`group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98] active:shadow-none ${accent.ring}`}
    >
      <div className="flex items-start justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent.badgeBg} ${accent.badgeText}`}>
          <Icon name={tool.icon} className="h-5 w-5" />
        </span>
        {badge && (
          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge.cls}`}>
            <badge.icon className="h-3 w-3" /> {badge.label}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-navy-800">{tool.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{tool.description}</p>
      </div>
      <div className="mt-auto flex items-center justify-between pt-1">
        {showCategory && category && <span className="text-xs font-medium text-slate-400">{category.name}</span>}
        <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-brand-600 transition group-hover:gap-2">
          Gunakan <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
