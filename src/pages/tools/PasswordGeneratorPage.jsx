import { useState } from "react";
import { RefreshCw } from "lucide-react";
import ToolLayout from "../../components/ToolLayout.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { copyToClipboard } from "../../lib/format.js";
import { trackEvent } from "../../lib/analytics.js";

const tool = getToolBySlug("password-generator");

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}",
};

function generatePassword(length, options) {
  const pool = Object.entries(options)
    .filter(([, enabled]) => enabled)
    .map(([key]) => CHARSETS[key])
    .join("");
  if (!pool) return "";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => pool[b % pool.length]).join("");
}

function strengthOf(length, options) {
  const poolSize = Object.entries(options).filter(([, v]) => v).reduce((sum, [k]) => sum + CHARSETS[k].length, 0);
  const entropy = length * Math.log2(poolSize || 1);
  if (entropy < 40) return { label: "Lemah", color: "bg-red-500", width: "25%" };
  if (entropy < 65) return { label: "Cukup", color: "bg-amber-500", width: "55%" };
  if (entropy < 90) return { label: "Kuat", color: "bg-blue-500", width: "80%" };
  return { label: "Sangat kuat", color: "bg-green-500", width: "100%" };
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: false });
  const [password, setPassword] = useState(() => generatePassword(16, { uppercase: true, lowercase: true, numbers: true, symbols: false }));
  const [copied, setCopied] = useState(false);

  function regenerate(len = length, opts = options) {
    setPassword(generatePassword(len, opts));
    trackEvent("tool_complete", { tool_id: tool.id });
  }

  function toggle(key) {
    const next = { ...options, [key]: !options[key] };
    const anyLeft = Object.values(next).some(Boolean);
    if (!anyLeft) return;
    setOptions(next);
    regenerate(length, next);
  }

  function changeLength(value) {
    setLength(value);
    regenerate(value, options);
  }

  async function copyPassword() {
    const ok = await copyToClipboard(password);
    setCopied(ok);
    trackEvent("copy", { tool_id: tool.id });
    setTimeout(() => setCopied(false), 2000);
  }

  const strength = strengthOf(length, options);

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Password Generator — Buat Password Aman Gratis"
      seoDescription="Buat password acak yang aman menggunakan crypto.getRandomValues() browser. Gratis, cepat, tanpa disimpan di mana pun."
      howTo={["Atur panjang dan jenis karakter yang diinginkan.", "Password dibuat otomatis.", "Salin password dengan tombol Copy."]}
      faq={[
        { q: "Apakah password ini disimpan?", a: "Tidak, password dibuat dan ditampilkan hanya di browser kamu, tidak pernah dikirim atau disimpan di mana pun." },
        { q: "Seberapa acak password ini?", a: "Dibuat menggunakan crypto.getRandomValues(), API kriptografi bawaan browser — bukan Math.random() yang bisa diprediksi." },
      ]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-lg text-navy-800">{password}</code>
          <button onClick={() => regenerate()} className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-white" title="Buat ulang">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
          </div>
          <p className="mt-1 text-xs text-slate-500">Kekuatan: {strength.label}</p>
        </div>

        <button onClick={copyPassword} className="mt-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
          {copied ? "Tersalin!" : "Copy Password"}
        </button>

        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-medium text-navy-700">Panjang ({length})</label>
          <input type="range" min="8" max="64" value={length} onChange={(e) => changeLength(Number(e.target.value))} className="w-full" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["uppercase", "Huruf Besar"],
            ["lowercase", "Huruf Kecil"],
            ["numbers", "Angka"],
            ["symbols", "Simbol"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <input type="checkbox" checked={options[key]} onChange={() => toggle(key)} />
              {label}
            </label>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
