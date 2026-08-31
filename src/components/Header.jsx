import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Sparkles, X } from "lucide-react";
import SearchBar from "./SearchBar.jsx";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/tools", label: "Semua Tools" },
  { to: "/tools?sort=populer", label: "Populer" },
  { to: "/tools", label: "Kategori" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
    setMobileSearchOpen(false);
  }, [navigate]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-extrabold text-navy-800">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-lg tracking-tight">
            NUVORA <span className="text-brand-600">TOOLS</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className="transition hover:text-brand-600">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden w-64 md:block">
          <SearchBar compact placeholder="Cari tool..." />
        </div>

        <span className="ml-2 hidden shrink-0 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 md:inline-block">
          Gratis
        </span>

        <button
          className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-600 hover:bg-slate-50 md:hidden"
          onClick={() => setMobileSearchOpen((v) => !v)}
          aria-label="Cari"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-600 hover:bg-slate-50 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileSearchOpen && (
        <div className="border-t border-slate-100 bg-white p-3 md:hidden">
          <SearchBar compact placeholder="Cari tool..." autoFocus />
        </div>
      )}

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-slate-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className="flex items-center rounded-lg px-3 py-3 hover:bg-slate-50">
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
