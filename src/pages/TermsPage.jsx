import { useSeo } from "../lib/useSeo.js";

export default function TermsPage() {
  useSeo({ title: "Syarat & Ketentuan", description: "Syarat dan ketentuan penggunaan Nuvora Tools.", path: "/terms" });

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-2xl font-extrabold text-navy-800 md:text-3xl">Syarat & Ketentuan</h1>
      <div className="mt-6 space-y-5 text-slate-600">
        <section>
          <h2 className="mb-1.5 font-semibold text-navy-800">Penggunaan layanan</h2>
          <p>
            Nuvora Tools disediakan gratis "sebagaimana adanya". Kamu bebas menggunakan tools yang tersedia untuk
            keperluan pribadi maupun bisnis, tanpa perlu membuat akun.
          </p>
        </section>
        <section>
          <h2 className="mb-1.5 font-semibold text-navy-800">Batasan tanggung jawab</h2>
          <p>
            Hasil perhitungan (misalnya estimasi cicilan) bersifat simulasi dan bukan penawaran resmi dari lembaga
            keuangan manapun. Selalu verifikasi angka penting sebelum mengambil keputusan finansial.
          </p>
        </section>
        <section>
          <h2 className="mb-1.5 font-semibold text-navy-800">Perubahan layanan</h2>
          <p>Kami dapat menambah, mengubah, atau menghentikan sebagian tools sewaktu-waktu tanpa pemberitahuan sebelumnya.</p>
        </section>
      </div>
    </div>
  );
}
