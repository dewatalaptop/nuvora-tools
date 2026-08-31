import { ShieldCheck, Zap, MousePointerClick } from "lucide-react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import ToolCard from "../components/ToolCard.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import AdPlaceholder from "../components/AdPlaceholder.jsx";
import FAQ from "../components/FAQ.jsx";
import { CATEGORIES, TOOLS } from "../data/tools.js";
import { useSeo } from "../lib/useSeo.js";
import { useRecentTools } from "../lib/useRecentTools.js";

const POPULAR = TOOLS.filter((t) => t.popular);
// Tools added in the 2026-08-31 expansion — everything after the original
// 11 in the registry. Shown as "Tools Baru" so new additions get visibility
// without needing a separate "new" flag maintained per-tool.
const NEW_TOOLS = TOOLS.slice(11, 19);

const NEED_SHORTCUTS = [
  { emoji: "💰", label: "Uang", category: "keuangan" },
  { emoji: "📸", label: "Foto", category: "foto" },
  { emoji: "📄", label: "PDF", category: "pdf" },
  { emoji: "📱", label: "WhatsApp", category: "whatsapp" },
  { emoji: "🏠", label: "Rumah", category: "rumah-tangga" },
  { emoji: "🧰", label: "Produktivitas", category: "produktivitas" },
  { emoji: "🔐", label: "Keamanan", category: "keamanan" },
];

const VALUE_PROPS = [
  { icon: ShieldCheck, title: "Gratis Tanpa Login", desc: "Gunakan tools tanpa perlu membuat akun." },
  { icon: Zap, title: "Cepat", desc: "Sebagian besar tools bekerja langsung di browser." },
  { icon: MousePointerClick, title: "Mudah", desc: "Interface sederhana sehingga siapa pun dapat langsung menggunakannya." },
];

const FAQ_ITEMS = [
  { q: "Apakah Nuvora Tools gratis?", a: "Ya. Tools dasar dapat digunakan secara gratis." },
  { q: "Apakah harus membuat akun?", a: "Tidak. Tool yang tersedia dapat digunakan tanpa login." },
  { q: "Apakah file saya disimpan?", a: "Tool yang memproses file secara client-side memprosesnya langsung di browser kamu, bukan di server kami." },
  { q: "Apakah Nuvora Tools bisa digunakan di HP?", a: "Ya. Website dibuat mobile-first dan responsive." },
];

export default function HomePage() {
  const recentTools = useRecentTools();

  useSeo({
    title: null,
    description: "Kumpulan tools online gratis untuk menghitung, mengubah, dan membuat berbagai kebutuhan sehari-hari. Cepat, gratis, tanpa perlu login.",
    path: "/",
  });

  return (
    <div>
      <section className="border-b border-slate-100 bg-gradient-to-b from-brand-50/60 to-white px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-navy-800 md:text-5xl">
            Tools Gratis untuk Kehidupan Sehari-hari
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-500 md:text-lg">
            Hitung, ubah, buat, dan selesaikan berbagai kebutuhanmu secara online. Cepat, gratis, dan tanpa perlu login.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <SearchBar />
          </div>
          <p className="mt-4 text-sm text-slate-400">{TOOLS.length}+ Tools Gratis</p>
        </div>
      </section>

      {recentTools.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-10">
          <h2 className="mb-4 text-lg font-bold text-navy-800">Terakhir Digunakan</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentTools.slice(0, 4).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-bold text-navy-800 md:text-2xl">Tools Populer</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-6 text-xl font-bold text-navy-800 md:text-2xl">Pilih Berdasarkan Kebutuhan</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {NEED_SHORTCUTS.map((n) => (
            <Link
              key={n.category}
              to={`/categories/${n.category}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              <span className="text-2xl">{n.emoji}</span>
              <span className="text-sm font-medium text-navy-700">{n.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <AdPlaceholder variant="banner" />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-6 text-xl font-bold text-navy-800 md:text-2xl">Tools Baru</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NEW_TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-6 text-xl font-bold text-navy-800 md:text-2xl">Kategori</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 sm:grid-cols-3">
          {VALUE_PROPS.map((v) => (
            <div key={v.title} className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <v.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-3 font-semibold text-navy-800">{v.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 text-center">
        <h2 className="text-xl font-bold text-navy-800">Nuvora Tools</h2>
        <p className="mt-3 text-slate-500">
          Nuvora Tools adalah kumpulan tools online gratis yang membantu kamu menghitung, mengubah, membuat, dan
          menyelesaikan berbagai kebutuhan sehari-hari — tanpa perlu login dan sebagian besar bekerja langsung di
          browser.
        </p>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-14">
        <FAQ items={FAQ_ITEMS} />
      </div>
    </div>
  );
}
