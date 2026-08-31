import { Link } from "react-router-dom";
import { getToolsByCategory } from "../data/tools.js";
import { getAccent } from "../lib/categoryColors.js";
import Icon from "./Icon.jsx";

export default function CategoryCard({ category }) {
  const count = getToolsByCategory(category.slug).length;
  const accent = getAccent(category.accent);
  return (
    <Link
      to={`/categories/${category.slug}`}
      className={`flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${accent.ring}`}
    >
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accent.heroBg} ${accent.heroText}`}>
        <Icon name={category.icon} className="h-6 w-6" />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-navy-800">{category.name}</h3>
        <p className="text-sm text-slate-500">{category.description}</p>
        <span className={`mt-1 text-xs font-semibold ${accent.badgeText}`}>{count} tools</span>
      </div>
    </Link>
  );
}
