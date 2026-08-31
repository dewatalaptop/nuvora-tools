import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { searchTools } from "../data/tools.js";
import Icon from "./Icon.jsx";

// Uncontrolled by default (Header/Home: type-to-jump with a suggestions
// dropdown). Pass `value`/`onChange` to run it as a controlled filter input
// instead (AllToolsPage: filters the grid below it, no dropdown needed).
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

  const results = useMemo(() => (showDropdown ? searchTools(query).slice(0, 6) : []), [query, showDropdown]);
  const showResults = showDropdown && focused && query.trim().length > 0;

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

      {showResults && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">Tidak ditemukan tool untuk "{query}".</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((tool) => (
                <li key={tool.id}>
                  <button
                    onMouseDown={() => goTo(tool.slug)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-brand-50"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <Icon name={tool.icon} className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-navy-800">{tool.name}</span>
                      <span className="block text-xs text-slate-500">{tool.description}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
