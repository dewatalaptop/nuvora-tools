# Nuvora Tools

Platform utility online gratis untuk pengguna Indonesia — kalkulator, konversi, foto/PDF, dan
generator dokumen sehari-hari, sebagian besar berjalan sepenuhnya di browser (client-side) tanpa
perlu login.

**Live**: https://nuvora-tools.web.app

## Tools (32)

- **Keuangan**: Diskon, Cicilan (flat/efektif), Harga Jual, Margin, BEP
- **Foto & Gambar**: Kompres Foto, Image Resizer, Image Cropper, Color Converter, Background
  Remover (interface siap, butuh model AI/API eksternal yang belum dikonfigurasi)
- **PDF & Dokumen**: JPG ke PDF, Gabungkan PDF, PDF Compressor, PDF Splitter
- **Bisnis**: Generator Invoice
- **WhatsApp**: Generator Link, WhatsApp QR
- **Produktivitas**: QR Code Generator, Word/Character Counter, Case Converter
- **Keamanan**: Password Generator
- **Kalkulator Lainnya**: Percentage, Average, Date, Countdown, Scientific, Area & Volume
- **Rumah Tangga**: Paint Calculator, Tile Calculator, **Pencatat Pengeluaran** (tool unggulan —
  localStorage saja, tidak pernah dikirim ke server)
- **Konversi**: Unit Converter
- **Kehidupan**: Kalkulator Umur

Setiap kategori punya warna aksen sendiri (`src/lib/categoryColors.js`) yang otomatis mewarnai
badge ikon, hero banner tiap halaman tool, dan kartu kategori — supaya 32 tool terasa bervariasi
tanpa tiap tool punya desain ad-hoc berbeda-beda (variasi sistematis lewat kategori, bukan lewat
one-off styling per tool).

Semua tool yang memproses file (foto/PDF) melakukannya sepenuhnya di browser — tidak ada upload ke
server manapun.

## Arsitektur

- React 18 + Vite, Tailwind CSS v4 (`@tailwindcss/vite`), React Router.
- Data model tool terpusat di `src/data/tools.js` (termasuk related-tools & search synonyms) —
  menambah tool baru = tambah entry di sana + komponen halamannya di `src/pages/tools/`.
- Tool pages di-lazy-load per-route (`src/App.jsx`) supaya library berat (jsPDF, pdf-lib, pdf.js,
  jszip, browser-image-compression) hanya dimuat saat halaman yang membutuhkannya dibuka.
- Ikon dari `lucide-react` di-import eksplisit per nama di `src/components/Icon.jsx` (bukan
  `import *`) supaya tree-shaking benar-benar memangkas ikon yang tidak dipakai.
- Scientific Calculator pakai parser ekspresi matematika sendiri (`src/lib/mathParser.js`) —
  bukan `eval()`.
- PDF Compressor & PDF Splitter pakai `pdfjs-dist` (baca/render halaman) + `pdf-lib` (tulis ulang
  PDF) — helper worker-nya ada di `src/lib/pdfjs.js`.
- "Terakhir Digunakan" (localStorage, hanya toolId + timestamp — tidak pernah file/password) di
  `src/lib/useRecentTools.js`. Analytics abstraction (no-op sampai provider dipasang) di
  `src/lib/analytics.js`.
- SEO tag (title/description/canonical/OG) diatur per halaman lewat hook ringan
  `src/lib/useSeo.js` — tanpa dependency tambahan karena ini SPA client-rendered.
- Tidak ada backend — situs ini statis sepenuhnya, di-deploy ke Firebase Hosting.

## Setup

```bash
npm install
npm run dev     # http://localhost:5173 (atau port lain kalau 5173 terpakai)
npm run build
npm run lint
```

## Catatan

- Google AdSense belum diaktifkan — `src/components/AdPlaceholder.jsx` adalah satu-satunya
  tempat yang perlu diubah begitu ada publisher/slot ID.
- Background Remover butuh model AI client-side atau API eksternal yang belum dikonfigurasi —
  interface-nya sudah production-ready (`src/lib/backgroundRemoval.js` adalah satu-satunya
  tempat yang perlu diisi begitu ada model/endpoint), tapi tombolnya menampilkan pesan jujur
  alih-alih pura-pura berhasil.
- PDF Compressor mengubah tiap halaman jadi gambar terkompresi (rasterisasi) — cara paling andal
  untuk kompresi PDF client-side tanpa server, tapi teks jadi tidak bisa diseleksi setelahnya.
  Ini didisclose di UI tool-nya sendiri.
