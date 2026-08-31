import { Link, useParams } from "react-router-dom";
import ToolCard from "../components/ToolCard.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { getCategoryBySlug, getToolsByCategory } from "../data/tools.js";
import { useSeo } from "../lib/useSeo.js";

export default function CategoryPage() {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);
  const tools = category ? getToolsByCategory(slug) : [];

  useSeo({
    title: category ? category.name : "Kategori",
    description: category?.description,
    path: `/categories/${slug}`,
  });

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy-800">Kategori tidak ditemukan</h1>
        <Link to="/tools" className="mt-3 inline-block text-brand-600 hover:underline">
          Lihat semua tools →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Semua Tools", to: "/tools" }, { label: category.name }]} />
      <h1 className="mt-3 text-2xl font-extrabold text-navy-800 md:text-3xl">{category.name}</h1>
      <p className="mt-2 text-slate-500">{category.description}</p>

      {tools.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="font-medium text-navy-700">Tools untuk kategori ini segera hadir.</p>
          <Link to="/tools" className="mt-2 inline-block text-sm text-brand-600 hover:underline">
            Lihat tools lain →
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
