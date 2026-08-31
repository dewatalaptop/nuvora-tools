import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Icon from "./Icon.jsx";
import { getCategoryBySlug } from "../data/tools.js";
import { getAccent } from "../lib/categoryColors.js";

export default function ToolCard({ tool, showCategory = false }) {
  const category = getCategoryBySlug(tool.category);
  const accent = getAccent(category?.accent);
  return (
    <Link
      to={`/tools/${tool.slug}`}
      className={`group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${accent.ring}`}
    >
      <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent.gradient}`} aria-hidden="true" />
      <div className="flex items-start justify-between">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.badgeBg} ${accent.badgeText}`}>
          <Icon name={tool.icon} className="h-6 w-6" />
        </span>
        {tool.popular && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">Populer</span>
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
