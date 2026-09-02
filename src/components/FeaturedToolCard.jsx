import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Icon from "./Icon.jsx";
import { BADGE_META } from "./ToolCard.jsx";
import { getCategoryBySlug } from "../data/tools.js";
import { getAccent } from "../lib/categoryColors.js";

// Larger, higher-weight card for the homepage "Pilihan Nuvora" section —
// visually distinct from the regular ToolCard grid so the 3-4 tools singled
// out there read as a deliberate pick, not just more of the same grid.
export default function FeaturedToolCard({ tool }) {
  const category = getCategoryBySlug(tool.category);
  const accent = getAccent(category?.accent);
  const badge = tool.badge && BADGE_META[tool.badge];
  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-sm active:scale-[0.98] active:shadow-none"
    >
      <div className="flex items-center justify-between">
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent.badgeBg} ${accent.badgeText}`}>
          <Icon name={tool.icon} className="h-6 w-6" />
        </span>
        {badge ? (
          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge.cls}`}>
            <badge.icon className="h-3 w-3" /> {badge.label}
          </span>
        ) : (
          category && <span className="text-xs font-medium text-slate-400">{category.name}</span>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-navy-800">{tool.name}</h3>
        <p className="mt-1.5 text-sm text-slate-500">{tool.description}</p>
      </div>
      <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-brand-600 transition group-hover:gap-2">
        Gunakan <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
