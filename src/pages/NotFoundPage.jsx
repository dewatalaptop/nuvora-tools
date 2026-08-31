import { Link } from "react-router-dom";
import { useSeo } from "../lib/useSeo.js";

export default function NotFoundPage() {
  useSeo({ title: "Halaman Tidak Ditemukan", description: "Halaman yang kamu cari tidak ditemukan.", path: "/404" });

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-5xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-3 text-xl font-bold text-navy-800">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-slate-500">Sepertinya halaman ini tidak ada atau sudah dipindahkan.</p>
      <Link to="/" className="mt-6 inline-block rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white">
        Kembali ke Home
      </Link>
    </div>
  );
}
