import { useEffect } from "react";

const SITE_NAME = "Nuvora Tools";
const BASE_URL = "https://nuvora-tools.web.app";

function setMeta(name, content, attr = "name") {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(path) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", `${BASE_URL}${path}`);
}

// Minimal client-side SEO tag manager — no extra dependency needed since this
// is a single-page app: sets <title>, meta description, canonical URL, and
// Open Graph tags on every route change.
export function useSeo({ title, description, path = "/" }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Tools Gratis untuk Kehidupan Sehari-hari`;
    document.title = fullTitle;
    setMeta("description", description);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", `${BASE_URL}${path}`, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setCanonical(path);
  }, [title, description, path]);
}
