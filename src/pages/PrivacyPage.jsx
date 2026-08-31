import { useSeo } from "../lib/useSeo.js";

export default function PrivacyPage() {
  useSeo({ title: "Kebijakan Privasi", description: "Kebijakan privasi Nuvora Tools.", path: "/privacy" });

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-2xl font-extrabold text-navy-800 md:text-3xl">Kebijakan Privasi</h1>
      <div className="mt-6 space-y-5 text-slate-600">
        <section>
          <h2 className="mb-1.5 font-semibold text-navy-800">Data apa yang diproses</h2>
          <p>
            Untuk tools kalkulator (diskon, cicilan, harga jual, margin, BEP, umur), semua perhitungan dilakukan
            sepenuhnya di browser kamu — tidak ada data yang dikirim ke server kami.
          </p>
        </section>
        <section>
          <h2 className="mb-1.5 font-semibold text-navy-800">Tools yang memproses file</h2>
          <p>
            Kompres Foto, JPG ke PDF, dan Gabungkan PDF memproses file kamu langsung di browser menggunakan library
            client-side. File tersebut tidak diunggah ke server kami dan tidak disimpan di mana pun oleh Nuvora Tools.
          </p>
        </section>
        <section>
          <h2 className="mb-1.5 font-semibold text-navy-800">Cookies & analytics</h2>
          <p>
            Saat ini Nuvora Tools belum mengaktifkan cookies analitik atau iklan pihak ketiga. Jika di masa depan kami
            mengaktifkan Google Analytics atau Google AdSense, halaman ini akan diperbarui untuk menjelaskannya.
          </p>
        </section>
        <section>
          <h2 className="mb-1.5 font-semibold text-navy-800">Perubahan kebijakan</h2>
          <p>Kami dapat memperbarui kebijakan ini sewaktu-waktu. Versi terbaru selalu tersedia di halaman ini.</p>
        </section>
      </div>
    </div>
  );
}
