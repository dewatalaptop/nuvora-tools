# Nuvora Tools

Platform utility online gratis untuk pengguna Indonesia — kalkulator, konversi foto/PDF, dan
generator dokumen sehari-hari, sebagian besar berjalan sepenuhnya di browser (client-side) tanpa
perlu login.

**Live**: https://nuvora-tools.web.app

## Tools (MVP)

- Kalkulator Diskon, Cicilan, Harga Jual, Margin, BEP, Umur
- Kompres Foto, JPG ke PDF, Gabungkan PDF (semua client-side, file tidak pernah diupload)
- Generator Link WhatsApp (+ QR code), Generator Invoice (+ download PDF, print)

## Arsitektur

- React 18 + Vite, Tailwind CSS v4 (`@tailwindcss/vite`), React Router.
- Data model tool terpusat di `src/data/tools.js` — menambah tool baru = tambah entry di sana +
  komponen halamannya di `src/pages/tools/`.
- Tool pages di-lazy-load per-route (`src/App.jsx`) supaya library berat (jsPDF, pdf-lib,
  browser-image-compression) hanya dimuat saat halaman yang membutuhkannya dibuka, bukan di
  initial bundle.
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
- Kompres Foto, JPG ke PDF, dan Gabungkan PDF memproses file sepenuhnya di browser pengguna —
  tidak ada file yang diupload ke server manapun (lihat `/privacy`).
