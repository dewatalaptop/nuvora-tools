import Breadcrumb from "./Breadcrumb.jsx";
import AdPlaceholder from "./AdPlaceholder.jsx";
import FAQ from "./FAQ.jsx";
import { useSeo } from "../lib/useSeo.js";
import { getCategoryBySlug } from "../data/tools.js";

export default function ToolLayout({ tool, seoTitle, seoDescription, howTo, faq, children }) {
  const category = getCategoryBySlug(tool.category);
  useSeo({
    title: seoTitle ?? `${tool.name} Online Gratis`,
    description: seoDescription ?? tool.description,
    path: `/tools/${tool.slug}`,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          category ? { label: category.name, to: `/categories/${category.slug}` } : null,
          { label: tool.name },
        ].filter(Boolean)}
      />

      <h1 className="mt-3 text-2xl font-extrabold text-navy-800 md:text-3xl">{tool.name}</h1>
      <p className="mt-2 max-w-2xl text-slate-500">{tool.description}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>{children}</div>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <AdPlaceholder variant="sidebar" />
          </div>
        </aside>
      </div>

      <div className="mt-10 lg:hidden">
        <AdPlaceholder variant="banner" />
      </div>

      {howTo && howTo.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-navy-800">Cara Menggunakan {tool.name}</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
            {howTo.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      <div className="mt-10">
        <AdPlaceholder variant="banner" />
      </div>

      {faq && faq.length > 0 && (
        <div className="mt-12">
          <FAQ items={faq} />
        </div>
      )}
    </div>
  );
}
