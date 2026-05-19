import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import destinations from "../data/index";

interface Result {
  kind: "destination" | "attraction";
  id: string;
  name: string;
  subtitle: string;   // region for destinations, destination name for attractions
  tag?: string;       // type badge for attractions
  link: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  // Prebuild search index once
  const searchIndex = useMemo(() => {
    const items: Result[] = [];
    for (const d of destinations) {
      items.push({
        kind: "destination",
        id: d.id,
        name: d.name,
        subtitle: d.region,
        link: `/destination/${d.id}`,
      });
      for (const a of d.attractions) {
        items.push({
          kind: "attraction",
          id: a.id,
          name: a.name,
          subtitle: d.name,
          tag: a.type,
          link: `/attraction/${a.id}?from=${d.id}`,
        });
      }
    }
    return items;
  }, []);

  const q = query.trim();
  const filtered = q
    ? searchIndex.filter((item) => {
        if (item.name.includes(q)) return true;
        if (item.subtitle.includes(q)) return true;
        if (item.tag && item.tag.includes(q)) return true;
        // Also search by tags stored in the attraction
        if (item.kind === "attraction") {
          for (const d of destinations) {
            const a = d.attractions.find((x) => x.id === item.id);
            if (a && a.tags.some((t) => t.includes(q))) return true;
          }
        }
        return false;
      }).slice(0, 8)
    : [];

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* search icon */}
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </span>
      <input
        type="text"
        placeholder="搜索目的地、景点、类型… 如「徒步」「雪山」「建水」"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && filtered.length > 0) {
            navigate(filtered[0].link);
            setQuery("");
          }
        }}
        className="w-full pl-11 pr-24 py-3.5 rounded-full border border-slate-300 bg-white/90 backdrop-blur text-sm
          shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500
          placeholder:text-slate-400 transition-all"
      />
      {/* keyboard hint */}
      <span className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 items-center gap-1 text-[10px] text-slate-400 pointer-events-none">
        <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 font-mono">Enter</kbd>
        <span>跳转</span>
      </span>
      {/* clear button */}
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-20 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          aria-label="清空"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}

      {focused && filtered.length > 0 && (
        <ul className="absolute top-full mt-2 w-full bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 overflow-hidden z-50 max-h-96 overflow-y-auto">
          <li className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-50/70 border-b border-slate-100">
            匹配 {filtered.length} 项
          </li>
          {filtered.map((item) => (
            <li key={`${item.kind}-${item.id}`}>
              <button
                onClick={() => {
                  navigate(item.link);
                  setQuery("");
                }}
                className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0"
              >
                {/* Icon */}
                <span className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm
                  ${item.kind === "destination"
                    ? "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700"
                    : "bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700"}`}>
                  {item.kind === "destination" ? "城" : "景"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-800 truncate">{item.name}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>{item.subtitle}</span>
                    {item.tag && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span>{item.tag}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`text-[10px] font-semibold shrink-0 px-2 py-0.5 rounded-full
                  ${item.kind === "destination"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-emerald-50 text-emerald-700"}`}>
                  {item.kind === "destination" ? "目的地" : "景点"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {focused && q && filtered.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 overflow-hidden z-50">
          <div className="px-4 py-8 text-center">
            <div className="text-2xl mb-2">🔍</div>
            <p className="text-sm text-slate-500 mb-1">未找到「{q}」匹配的目的地或景点</p>
            <p className="text-xs text-slate-400">试试「徒步」「雪山」「古镇」「温泉」</p>
          </div>
        </div>
      )}
    </div>
  );
}
