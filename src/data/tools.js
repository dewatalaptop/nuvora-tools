export const CATEGORIES = [
  { slug: "keuangan", name: "Keuangan", description: "Hitung diskon, cicilan, harga jual, margin, dan BEP." },
  { slug: "foto", name: "Foto & Gambar", description: "Kompres dan ubah format foto langsung di browser." },
  { slug: "pdf", name: "PDF & Dokumen", description: "Ubah dan gabungkan dokumen PDF dengan mudah." },
  { slug: "bisnis", name: "Bisnis", description: "Buat invoice dan dokumen bisnis dalam hitungan detik." },
  { slug: "whatsapp", name: "WhatsApp", description: "Buat link WhatsApp otomatis untuk chat & promosi." },
  { slug: "kehidupan", name: "Kehidupan", description: "Tools praktis untuk kebutuhan sehari-hari." },
];

// Central data model — adding a new tool later only needs an entry here plus
// its page component; every listing (home, /tools, /categories/:slug,
// search) is derived from this single source.
export const TOOLS = [
  {
    id: "kalkulator-diskon",
    slug: "kalkulator-diskon",
    name: "Kalkulator Diskon",
    description: "Hitung harga setelah diskon dengan cepat.",
    category: "keuangan",
    icon: "Percent",
    keywords: ["diskon", "potongan harga", "sale", "cuci gudang"],
    popular: true,
  },
  {
    id: "kalkulator-cicilan",
    slug: "kalkulator-cicilan",
    name: "Kalkulator Cicilan",
    description: "Hitung estimasi cicilan pinjaman per bulan.",
    category: "keuangan",
    icon: "Landmark",
    keywords: ["cicilan", "kredit", "pinjaman", "angsuran", "bunga"],
    popular: true,
  },
  {
    id: "harga-jual",
    slug: "harga-jual",
    name: "Kalkulator Harga Jual",
    description: "Hitung harga jual berdasarkan modal dan keuntungan.",
    category: "keuangan",
    icon: "Tag",
    keywords: ["harga jual", "jualan", "modal", "reseller", "hpp"],
    popular: true,
  },
  {
    id: "margin",
    slug: "margin",
    name: "Kalkulator Margin",
    description: "Hitung margin dan keuntungan bisnis.",
    category: "keuangan",
    icon: "TrendingUp",
    keywords: ["margin", "markup", "profit", "jualan", "untung"],
    popular: false,
  },
  {
    id: "bep",
    slug: "bep",
    name: "Kalkulator BEP",
    description: "Hitung titik impas (break even point) usahamu.",
    category: "keuangan",
    icon: "Scale",
    keywords: ["bep", "break even point", "titik impas", "biaya tetap"],
    popular: false,
  },
  {
    id: "kompres-foto",
    slug: "kompres-foto",
    name: "Kompres Foto",
    description: "Kecilkan ukuran foto tanpa ribet, langsung di browser.",
    category: "foto",
    icon: "Image",
    keywords: ["foto", "kompres", "kecilkan ukuran", "resize", "jpg", "png"],
    popular: true,
  },
  {
    id: "jpg-ke-pdf",
    slug: "jpg-ke-pdf",
    name: "JPG ke PDF",
    description: "Ubah gambar menjadi PDF dalam sekejap.",
    category: "pdf",
    icon: "FileImage",
    keywords: ["jpg ke pdf", "gambar ke pdf", "convert", "scan"],
    popular: true,
  },
  {
    id: "gabung-pdf",
    slug: "gabung-pdf",
    name: "Gabungkan PDF",
    description: "Satukan beberapa file PDF jadi satu dokumen.",
    category: "pdf",
    icon: "Files",
    keywords: ["gabung pdf", "merge pdf", "satukan dokumen"],
    popular: false,
  },
  {
    id: "link-whatsapp",
    slug: "link-whatsapp",
    name: "Generator Link WhatsApp",
    description: "Buat link WhatsApp dengan pesan otomatis.",
    category: "whatsapp",
    icon: "MessageCircle",
    keywords: ["whatsapp", "wa.me", "link chat", "promosi"],
    popular: true,
  },
  {
    id: "invoice",
    slug: "invoice",
    name: "Generator Invoice",
    description: "Buat invoice sederhana secara gratis.",
    category: "bisnis",
    icon: "Receipt",
    keywords: ["invoice", "kwitansi", "faktur", "tagihan"],
    popular: true,
  },
  {
    id: "kalkulator-umur",
    slug: "kalkulator-umur",
    name: "Kalkulator Umur",
    description: "Hitung umur tepat dari tanggal lahirmu.",
    category: "kehidupan",
    icon: "Cake",
    keywords: ["umur", "usia", "tanggal lahir", "ulang tahun"],
    popular: false,
  },
];

export function getToolBySlug(slug) {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(categorySlug) {
  return TOOLS.filter((t) => t.category === categorySlug);
}

export function getCategoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function searchTools(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return TOOLS.filter((t) => {
    const haystack = [t.name, t.description, t.category, ...t.keywords].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
