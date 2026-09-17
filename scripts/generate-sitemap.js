// Runs after `vite build` (see package.json's build script) so sitemap.xml
// always matches the real route list — generated from the same TOOLS/
// CATEGORIES data src/data/tools.js already drives every in-app listing
// from, instead of a hand-maintained XML file that silently goes stale
// every time a tool is added.
import { writeFileSync } from "node:fs";
import { TOOLS, CATEGORIES } from "../src/data/tools.js";

const SITE_URL = "https://nuvora-tools.web.app";
const STATIC_PATHS = ["/", "/tools", "/about", "/privacy", "/terms", "/contact"];

const urls = [
  ...STATIC_PATHS,
  ...CATEGORIES.map((c) => `/categories/${c.slug}`),
  ...TOOLS.map((t) => `/tools/${t.slug}`),
];

const today = new Date().toISOString().slice(0, 10);
const body = urls
  .map((path) => {
    const priority = path === "/" ? "1.0" : path.startsWith("/tools/") ? "0.8" : "0.5";
    return `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

writeFileSync(new URL("../dist/sitemap.xml", import.meta.url), xml);
console.log(`sitemap.xml written with ${urls.length} URLs`);
