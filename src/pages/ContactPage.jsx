import { Mail } from "lucide-react";
import { useSeo } from "../lib/useSeo.js";

export default function ContactPage() {
  useSeo({ title: "Kontak", description: "Hubungi tim Nuvora Tools.", path: "/contact" });

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-2xl font-extrabold text-navy-800 md:text-3xl">Kontak</h1>
      <p className="mt-4 text-slate-600">
        Punya saran tool baru, menemukan bug, atau ingin bekerja sama? Kirim email ke kami.
      </p>
      <a
        href="mailto:halo@nuvoratools.com"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-brand-600 hover:to-brand-700"
      >
        <Mail className="h-4 w-4" />
        halo@nuvoratools.com
      </a>
    </div>
  );
}
