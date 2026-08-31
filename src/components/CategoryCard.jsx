import { Link } from "react-router-dom";
import { getToolsByCategory } from "../data/tools.js";

export default function CategoryCard({ category }) {
  const count = getToolsByCategory(category.slug).length;
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
    >
      <h3 className="font-semibold text-navy-800">{category.name}</h3>
      <p className="text-sm text-slate-500">{category.description}</p>
      <span className="mt-2 text-xs font-medium text-brand-600">{count} tools</span>
    </Link>
  );
}
