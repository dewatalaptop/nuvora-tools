import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import { searchTools, TOOLS, getCategoryBySlug } from "../data/tools.js";
import { getAccent } from "../lib/categoryColors.js";
import Icon from "./Icon.jsx";

const SUGGESTED = TOOLS.filter((t) => t.popular).slice(0, 6);

function ToolChip({ tool, onSelect, compact = false }) {
  const accent = getAccent(getCategoryBySlug(tool.category)?.accent);
  return (
    <button
      onMouseDown={() => onSelect(tool.slug)}
      className={`flex w-full items-center gap-3 rounded-xl text-left transition hover:bg-slate-50 ${compact ? "p-2" : "px-4 py-2.5"}`}
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accent.badgeBg} ${accent.badgeText}`}>
        <Icon name={tool.icon} className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-navy-800">{tool.name}</span>
        {!compact && <span className="block truncate text-xs text-slate-500">{tool.description}</span>}
      </span>
    </button>
  );
}

// Uncontrolled by default (Header/Home: type-to-jump, with an attractive
// suggestions panel shown even before typing). Pass `value`/`onChange` to
// run it as a controlled filter input instead (AllToolsPage: filters the
// grid below it, no dropdown needed).
export default function SearchBar({
  compact = false,
  placeholder = "Apa yang ingin kamu lakukan?",
  autoFocus = false,
  value,
  onChange,
  showDropdown = true,
}) {
  const [internalQuery, setInternalQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const isControlled = value !== undefined;
  const query = isControlled ? value : internalQuery;
  const setQuery = isControlled ? onChange : setInternalQuery;

  const hasQuery = query.trim().length > 0;
  const results = useMemo(() => (showDropdown && hasQuery ? searchTools(query).slice(0, 6) : []), [query, showDropdown, hasQuery]);
  const showPanel = showDropdown && focused;

  function goTo(slug) {
    setQuery("");
    setFocused(false);
    navigate(`/tools/${slug}`);
  }

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-2 rounded-full border border-slate-200 bg-white shadow-sm transition focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 ${
          compact ? "px-3 py-2" : "px-5 py-3.5"
        }`}
      >
        <Search className={compact ? "h-4 w-4 text-slate-400" : "h-5 w-5 text-slate-400"} />
        <input
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          onKeyDown={(e) => e.key === "Enter" && results[0] && goTo(results[0].slug)}
          placeholder={placeholder}
          className={`w-full bg-transparent text-navy-800 outline-none placeholder:text-slate-400 ${
            compact ? "text-sm" : "text-base"
          }`}
        />
      </div>

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {hasQuery ? (
            results.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">Tidak ditemukan tool untuk "{query}".</p>
            ) : (
              <ul className="max-h-80 overflow-y-auto py-1">
                {results.map((tool) => (
                  <li key={tool.id}>
                    <ToolChip tool={tool} onSelect={goTo} />
                  </li>
                ))}
              </ul>
            )
          ) : (
            <div className="p-3">
              <p className="mb-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-brand-500" /> Saran untuk kamu
              </p>
              <div className="grid gap-0.5 sm:grid-cols-2">
                {SUGGESTED.map((tool) => (
                  <ToolChip key={tool.id} tool={tool} onSelect={goTo} compact />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
