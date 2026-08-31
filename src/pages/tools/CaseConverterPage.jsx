import { useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { copyToClipboard } from "../../lib/format.js";

const tool = getToolBySlug("case-converter");

function toTitleCase(s) {
  return s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}
function toSentenceCase(s) {
  const lower = s.toLowerCase();
  return lower.replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
}
function words(s) {
  return s.trim().split(/[\s_-]+/).filter(Boolean);
}
function toCamelCase(s) {
  return words(s).map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())).join("");
}
function toPascalCase(s) {
  return words(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("");
}
function toSnakeCase(s) {
  return words(s).map((w) => w.toLowerCase()).join("_");
}
function toKebabCase(s) {
  return words(s).map((w) => w.toLowerCase()).join("-");
}

const CONVERTERS = [
  { key: "lower", label: "lowercase", fn: (s) => s.toLowerCase() },
  { key: "upper", label: "UPPERCASE", fn: (s) => s.toUpperCase() },
  { key: "title", label: "Title Case", fn: toTitleCase },
  { key: "sentence", label: "Sentence case", fn: toSentenceCase },
  { key: "camel", label: "camelCase", fn: toCamelCase },
  { key: "pascal", label: "PascalCase", fn: toPascalCase },
  { key: "snake", label: "snake_case", fn: toSnakeCase },
  { key: "kebab", label: "kebab-case", fn: toKebabCase },
];

export default function CaseConverterPage() {
  const [text, setText] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);

  async function copy(key, value) {
    await copyToClipboard(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Case Converter — Ubah UPPERCASE, camelCase, snake_case Gratis"
      seoDescription="Ubah teks ke lowercase, UPPERCASE, Title Case, Sentence case, camelCase, PascalCase, snake_case, dan kebab-case secara realtime."
      howTo={["Ketik atau tempel teks.", "Semua format muncul otomatis di bawah.", "Klik Copy pada format yang kamu butuhkan."]}
      faq={[{ q: "Apakah teks saya dikirim ke server?", a: "Tidak, semua konversi terjadi langsung di browser kamu." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Ketik atau tempel teks di sini..."
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400"
        />
      </div>

      {text.trim() && (
        <div className="mt-5 grid gap-2">
          {CONVERTERS.map((c) => {
            const value = c.fn(text);
            return (
              <div key={c.key} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-400">{c.label}</p>
                  <p className="truncate text-sm text-navy-800">{value}</p>
                </div>
                <button onClick={() => copy(c.key, value)} className="shrink-0 text-xs font-medium text-brand-600 hover:underline">
                  {copiedKey === c.key ? "Tersalin!" : "Copy"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ToolLayout>
  );
}
