import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import HomePage from "./pages/HomePage.jsx";
import AllToolsPage from "./pages/AllToolsPage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Tool pages are lazy-loaded per-route: each one that pulls in a heavy
// library (jsPDF, pdf-lib, browser-image-compression) would otherwise bundle
// that library into every page's initial load. Simple calculator pages have
// no heavy deps, but splitting them too keeps the pattern uniform and their
// chunks are tiny anyway.
const DiskonPage = lazy(() => import("./pages/tools/DiskonPage.jsx"));
const CicilanPage = lazy(() => import("./pages/tools/CicilanPage.jsx"));
const HargaJualPage = lazy(() => import("./pages/tools/HargaJualPage.jsx"));
const MarginPage = lazy(() => import("./pages/tools/MarginPage.jsx"));
const BepPage = lazy(() => import("./pages/tools/BepPage.jsx"));
const KompresFotoPage = lazy(() => import("./pages/tools/KompresFotoPage.jsx"));
const JpgKePdfPage = lazy(() => import("./pages/tools/JpgKePdfPage.jsx"));
const GabungPdfPage = lazy(() => import("./pages/tools/GabungPdfPage.jsx"));
const LinkWhatsAppPage = lazy(() => import("./pages/tools/LinkWhatsAppPage.jsx"));
const InvoicePage = lazy(() => import("./pages/tools/InvoicePage.jsx"));
const UmurPage = lazy(() => import("./pages/tools/UmurPage.jsx"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageLoading() {
  return <div className="mx-auto max-w-5xl px-4 py-24 text-center text-sm text-slate-400">Memuat...</div>;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<AllToolsPage />} />
            <Route path="/tools/kalkulator-diskon" element={<DiskonPage />} />
            <Route path="/tools/kalkulator-cicilan" element={<CicilanPage />} />
            <Route path="/tools/harga-jual" element={<HargaJualPage />} />
            <Route path="/tools/margin" element={<MarginPage />} />
            <Route path="/tools/bep" element={<BepPage />} />
            <Route path="/tools/kompres-foto" element={<KompresFotoPage />} />
            <Route path="/tools/jpg-ke-pdf" element={<JpgKePdfPage />} />
            <Route path="/tools/gabung-pdf" element={<GabungPdfPage />} />
            <Route path="/tools/link-whatsapp" element={<LinkWhatsAppPage />} />
            <Route path="/tools/invoice" element={<InvoicePage />} />
            <Route path="/tools/kalkulator-umur" element={<UmurPage />} />
            <Route path="/categories/:slug" element={<CategoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
