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
    <div className="relative w-full max-w-md mx-auto">
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
        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm
          shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
          placeholder:text-slate-400 transition-shadow"
      />
      {focused && filtered.length > 0 && (
        <ul className="absolute top-full mt-1 w-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
          {filtered.map((item) => (
            <li key={`${item.kind}-${item.id}`}>
              <button
                onClick={() => {
                  navigate(item.link);
                  setQuery("");
                }}
                className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors flex items-center gap-3"
              >
                {/* Icon */}
                <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                  ${item.kind === "destination"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"}`}>
                  {item.kind === "destination" ? "城" : "景"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-800 truncate">{item.name}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span>{item.subtitle}</span>
                    {item.tag && (
                      <>
                        <span className="text-slate-300">|</span>
                        <span>{item.tag}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-300 shrink-0">
                  {item.kind === "destination" ? "目的地" : "景点"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {focused && q && filtered.length === 0 && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-50">
          <p className="px-4 py-6 text-center text-sm text-slate-400">未找到匹配的目的地或景点</p>
        </div>
      )}
    </div>
  );
}
