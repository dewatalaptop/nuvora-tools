import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Home, LayoutGrid, Flame, MoreHorizontal, X } from "lucide-react";
import { CATEGORIES } from "../data/tools.js";
import { getAccent } from "../lib/categoryColors.js";
import Icon from "./Icon.jsx";

const TABS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/tools", label: "Tools", icon: LayoutGrid },
  { to: "/tools?sort=populer", label: "Populer", icon: Flame },
];

function TabLink({ to, label, icon: TabIcon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition ${
          isActive ? "text-brand-600" : "text-slate-400"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <TabIcon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
          {label}
        </>
      )}
    </NavLink>
  );
}

// Native-app-style bottom tab bar for mobile only (md:hidden) — the header's
// own nav/hamburger stays as-is for desktop, this is a parallel primary-nav
// surface just for small screens, plus a "Lainnya" sheet for the rest.
export default function MobileBottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {TABS.map((tab) => (
          <TabLink key={tab.to} {...tab} />
        ))}
        <button
          onClick={() => setMoreOpen(true)}
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition ${
            moreOpen ? "text-brand-600" : "text-slate-400"
          }`}
        >
          <MoreHorizontal className="h-5 w-5" />
          Lainnya
        </button>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMoreOpen(false)} />
          <div
            className="animate-sheet-slide-up absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-8"
            style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-800">Kategori</h2>
              <button
                onClick={() => setMoreOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((c) => {
                const accent = getAccent(c.accent);
                return (
                  <Link
                    key={c.slug}
                    to={`/categories/${c.slug}`}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-200 p-3 active:scale-[0.97]"
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent.badgeBg} ${accent.badgeText}`}>
                      <Icon name={c.icon} className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-navy-700">{c.name}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
              <Link to="/about" onClick={() => setMoreOpen(false)} className="hover:text-brand-600">About</Link>
              <Link to="/contact" onClick={() => setMoreOpen(false)} className="hover:text-brand-600">Contact</Link>
              <Link to="/privacy" onClick={() => setMoreOpen(false)} className="hover:text-brand-600">Privacy</Link>
              <Link to="/terms" onClick={() => setMoreOpen(false)} className="hover:text-brand-600">Terms</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
