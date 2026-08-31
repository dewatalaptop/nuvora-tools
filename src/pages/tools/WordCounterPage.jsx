import { useMemo, useState } from "react";
import ToolLayout from "../../components/ToolLayout.jsx";
import { getToolBySlug } from "../../data/tools.js";
import { copyToClipboard } from "../../lib/format.js";
import { trackEvent } from "../../lib/analytics.js";

const tool = getToolBySlug("word-counter");
const WORDS_PER_MINUTE = 200;

export default function WordCounterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.trim() ? (text.match(/[.!?]+(?:\s|$)/g) ?? []).length || (text.trim() ? 1 : 0) : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter((p) => p.trim()).length : 0;
    const readingMinutes = words / WORDS_PER_MINUTE;
    return { words, characters, charactersNoSpaces, sentences, paragraphs, readingMinutes };
  }, [text]);

  async function copyText() {
    const ok = await copyToClipboard(text);
    setCopied(ok);
    trackEvent("copy", { tool_id: tool.id });
    setTimeout(() => setCopied(false), 2000);
  }

  function readingTimeLabel(minutes) {
    if (minutes < 1) return `${Math.max(1, Math.round(minutes * 60))} detik`;
    return `${minutes.toFixed(1)} menit`;
  }

  return (
    <ToolLayout
      tool={tool}
      seoTitle="Word & Character Counter Online Gratis"
      seoDescription="Hitung jumlah kata, karakter, kalimat, paragraf, dan estimasi waktu baca teks secara realtime."
      howTo={["Tempel atau ketik teks di kotak.", "Semua statistik terupdate otomatis saat kamu mengetik."]}
      faq={[{ q: "Apakah teks saya dikirim ke server?", a: "Tidak, semua dihitung langsung di browser kamu." }]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Tempel atau ketik teks di sini..."
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <div className="mt-3 flex gap-2">
          <button onClick={copyText} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            {copied ? "Tersalin!" : "Copy"}
          </button>
          <button onClick={() => setText("")} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Clear
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          ["Kata", stats.words],
          ["Karakter", stats.characters],
          ["Karakter (tanpa spasi)", stats.charactersNoSpaces],
          ["Kalimat", stats.sentences],
          ["Paragraf", stats.paragraphs],
          ["Waktu baca", readingTimeLabel(stats.readingMinutes)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-2xl font-extrabold text-navy-800">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
