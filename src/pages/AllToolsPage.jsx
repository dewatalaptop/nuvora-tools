import { useMemo, useState } from "react";
import ToolCard from "../components/ToolCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { CATEGORIES, TOOLS } from "../data/tools.js";
import { useSeo } from "../lib/useSeo.js";

const SORTS = [
  { key: "populer", label: "Populer" },
  { key: "terbaru", label: "Terbaru" },
  { key: "az", label: "A-Z" },
];

export default function AllToolsPage() {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("populer");
  const [query, setQuery] = useState("");

  useSeo({
    title: "Semua Tools",
    description: "Jelajahi semua tools gratis dari Nuvora Tools — filter berdasarkan kategori dan urutkan sesuai kebutuhanmu.",
    path: "/tools",
  });

  const filtered = useMemo(() => {
    let list = TOOLS;
    if (category !== "all") list = list.filter((t) => t.category === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((t) => [t.name, t.description, ...t.keywords].join(" ").toLowerCase().includes(q));
    }
    list = [...list];
    if (sort === "populer") list.sort((a, b) => Number(b.popular) - Number(a.popular));
    else if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "terbaru") list.reverse();
    return list;
  }, [category, sort, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-navy-800 md:text-3xl">Semua Tools</h1>
      <p className="mt-2 text-slate-500">{TOOLS.length} Tools Gratis</p>

      <div className="mt-6 max-w-md">
        <SearchBar compact placeholder="Cari tool..." value={query} onChange={setQuery} showDropdown={false} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-700"
        >
          <option value="all">Semua Kategori</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex gap-1.5">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                sort === s.key ? "bg-brand-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-brand-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-400">{filtered.length} tools ditemukan</p>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500">Tidak ada tool yang cocok. Coba kata kunci lain.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} showCategory />
          ))}
        </div>
      )}
    </div>
  );
}
