import destinations from "../data/index";
import SearchBar from "../components/SearchBar";
import DestinationCard from "../components/DestinationCard";
import YunnanSVGMap from "../components/YunnanSVGMap";

export default function Home() {
  const totalAttractions = destinations.reduce((s, d) => s + d.attractions.length, 0);

  return (
    <div>
      {/* Hero — layered with decorative mountain silhouette */}
      <section className="relative overflow-hidden">
        {/* gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-amber-50/50 to-white" />
        {/* decorative blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -top-16 -right-10 w-80 h-80 rounded-full bg-amber-300/20 blur-3xl" />
        {/* subtle mountain silhouette */}
        <svg
          aria-hidden
          viewBox="0 0 1200 200"
          className="absolute bottom-0 left-0 right-0 w-full h-24 sm:h-32 opacity-[0.18]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,200 L0,140 L120,80 L220,130 L340,50 L460,120 L580,70 L700,130 L820,60 L940,110 L1060,80 L1200,120 L1200,200 Z"
            fill="url(#heroMountain)"
          />
          <defs>
            <linearGradient id="heroMountain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative max-w-6xl mx-auto text-center px-4 pt-10 pb-12 sm:pt-14 sm:pb-16">
          {/* small kicker badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-emerald-700 bg-white/70 border border-emerald-100 backdrop-blur-sm mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {destinations.length} 个目的地 · {totalAttractions} 个景点
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight mb-3 leading-tight">
            发现
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
              {" "}秘境云南{" "}
            </span>
          </h1>
          <p className="text-slate-500 mb-6 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            不只是丽江和大理 —— 徒步路线、野生秘境、温泉湿地、古老村落，一站式发现云南九大区域。
          </p>

          <SearchBar />

          {/* hero quick-links */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
            {["徒步", "雪山", "古镇", "温泉", "野生", "湖泊"].map((kw) => (
              <a
                key={kw}
                href={`#search-${kw}`}
                className="px-3 py-1.5 rounded-full bg-white/70 border border-slate-200 text-slate-600 hover:bg-white hover:border-emerald-300 hover:text-emerald-700 transition-colors backdrop-blur-sm"
              >
                {kw}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Yunnan SVG 地图 — 主舞台 */}
      <section id="yunnan-map" className="max-w-7xl mx-auto px-4 sm:px-6 -mt-3 mb-12">
        <div className="bg-white/90 backdrop-blur rounded-3xl border border-slate-200 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)] overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </span>
              <span className="text-sm font-medium text-slate-700 truncate">
                云南互动地图
              </span>
              <span className="hidden sm:inline text-xs text-slate-400">
                · 悬停查看景点 · 点击进入目的地
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              9 区域
            </span>
          </div>
          <div className="p-5 sm:p-7">
            <YunnanSVGMap />
          </div>
        </div>
      </section>

      {/* 目的地卡片 — 快速浏览 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
              浏览全部目的地
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              共 {destinations.length} 个目的地 · {totalAttractions} 个景点与路线
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            按区域分类
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {destinations.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      </section>
    </div>
  );
}
