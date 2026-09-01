import { useEffect } from "react";
import Breadcrumb from "./Breadcrumb.jsx";
import AdPlaceholder from "./AdPlaceholder.jsx";
import FAQ from "./FAQ.jsx";
import RelatedTools from "./RelatedTools.jsx";
import Icon from "./Icon.jsx";
import { useSeo } from "../lib/useSeo.js";
import { getCategoryBySlug } from "../data/tools.js";
import { getAccent } from "../lib/categoryColors.js";
import { recordRecentTool } from "../lib/useRecentTools.js";
import { trackEvent } from "../lib/analytics.js";

export default function ToolLayout({ tool, seoTitle, seoDescription, howTo, faq, children }) {
  const category = getCategoryBySlug(tool.category);
  const accent = getAccent(category?.accent);
  useSeo({
    title: seoTitle ?? `${tool.name} Online Gratis`,
    description: seoDescription ?? tool.description,
    path: `/tools/${tool.slug}`,
  });

  useEffect(() => {
    recordRecentTool(tool.id);
    trackEvent("tool_view", { tool_id: tool.id });
  }, [tool.id]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          category ? { label: category.name, to: `/categories/${category.slug}` } : null,
          { label: tool.name },
        ].filter(Boolean)}
      />

      <div className="mt-4 flex items-center gap-4 border-b border-slate-200 pb-6">
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${accent.heroBg} ${accent.heroText}`}>
          <Icon name={tool.icon} className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-navy-800 md:text-3xl">{tool.name}</h1>
          <p className="mt-1 max-w-2xl text-slate-500">{tool.description}</p>
        </div>
      </div>

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

      <RelatedTools tool={tool} />
    </div>
  );
}
