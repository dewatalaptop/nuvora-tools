import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/tools.js";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-extrabold text-navy-800">
            NUVORA <span className="text-brand-600">TOOLS</span>
          </p>
          <p className="mt-2 text-sm text-slate-500">Tools online gratis untuk semua.</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-navy-800">Tools</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to={`/categories/${c.slug}`} className="hover:text-brand-600">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-navy-800">Perusahaan</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <Link to="/about" className="hover:text-brand-600">About</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-brand-600">Contact</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-brand-600">Privacy</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-brand-600">Terms</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-navy-800">Semua Tools</p>
          <p className="mt-3 text-sm text-slate-500">
            Lihat daftar lengkap tools yang tersedia di{" "}
            <Link to="/tools" className="font-medium text-brand-600 hover:underline">
              halaman Semua Tools
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Nuvora Tools · Gratis digunakan untuk semua orang · by Nuvora Systems
      </div>
    </footer>
  );
}
