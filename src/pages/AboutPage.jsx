import { useSeo } from "../lib/useSeo.js";

export default function AboutPage() {
  useSeo({ title: "Tentang Kami", description: "Tentang Nuvora Tools — platform utility gratis untuk pengguna Indonesia.", path: "/about" });

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-2xl font-extrabold text-navy-800 md:text-3xl">Tentang Nuvora Tools</h1>
      <div className="mt-6 space-y-4 text-slate-600">
        <p>
          Nuvora Tools adalah platform utility online gratis untuk pengguna Indonesia — pelajar, mahasiswa, karyawan,
          pelaku UMKM, penjual online, content creator, hingga freelancer.
        </p>
        <p>
          Kami percaya kebutuhan menghitung, mengubah, dan membuat dokumen sehari-hari seharusnya cepat, sederhana, dan
          tidak perlu ribet daftar akun. Karena itu sebagian besar tools kami berjalan langsung di browser kamu —
          lebih cepat, dan lebih menjaga privasi.
        </p>
        <p>Nuvora Tools dikembangkan dan dirawat oleh Nuvora Systems.</p>
      </div>
    </div>
  );
}
