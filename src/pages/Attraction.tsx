import { useParams, Link } from "react-router-dom";
import destinations from "../data/index";
import ImageWithFallback from "../components/ImageWithFallback";

const typeStyles: Record<string, { chip: string; ring: string; accent: string }> = {
  "国家级景区":   { chip: "bg-blue-50 text-blue-700 border-blue-200",         ring: "from-blue-400 to-blue-600",       accent: "text-blue-700" },
  "徒步路线":     { chip: "bg-orange-50 text-orange-700 border-orange-200",   ring: "from-orange-400 to-orange-600",   accent: "text-orange-700" },
  "野生秘境":     { chip: "bg-emerald-50 text-emerald-700 border-emerald-200", ring: "from-emerald-400 to-emerald-600", accent: "text-emerald-700" },
  "古镇村落":     { chip: "bg-amber-50 text-amber-700 border-amber-200",     ring: "from-amber-400 to-amber-600",     accent: "text-amber-700" },
  "湖泊雪山":     { chip: "bg-cyan-50 text-cyan-700 border-cyan-200",         ring: "from-cyan-400 to-cyan-600",       accent: "text-cyan-700" },
  "温泉湿地":     { chip: "bg-teal-50 text-teal-700 border-teal-200",         ring: "from-teal-400 to-teal-600",       accent: "text-teal-700" },
  "文化遗迹":     { chip: "bg-purple-50 text-purple-700 border-purple-200",   ring: "from-purple-400 to-purple-600",   accent: "text-purple-700" },
  "峡谷江河":     { chip: "bg-indigo-50 text-indigo-700 border-indigo-200",   ring: "from-indigo-400 to-indigo-600",   accent: "text-indigo-700" },
  "观景台":       { chip: "bg-pink-50 text-pink-700 border-pink-200",         ring: "from-pink-400 to-pink-600",       accent: "text-pink-700" },
};

export default function AttractionDetail() {
  const { id } = useParams<{ id: string }>();
  let attraction = null;
  let parentDestination = null;

  for (const d of destinations) {
    const found = d.attractions.find((a) => a.id === id);
    if (found) {
      attraction = found;
      parentDestination = d;
      break;
    }
  }

  if (!attraction || !parentDestination) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">景点未找到</h2>
        <Link to="/" className="text-emerald-600 hover:underline">返回首页</Link>
      </div>
    );
  }

  const style = typeStyles[attraction.type] || { chip: "bg-slate-50 text-slate-600 border-slate-200", ring: "from-slate-400 to-slate-600", accent: "text-emerald-700" };

  return (
    <div className="pb-16">
      {/* Hero gallery — full-bleed cover with title overlay */}
      <section className="relative">
        <div className="relative h-[42vh] sm:h-[52vh] min-h-[300px] overflow-hidden bg-slate-200">
          <ImageWithFallback
            src={attraction.images[0]}
            alt={attraction.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          {/* Breadcrumb */}
          <div className="absolute top-4 left-0 right-0">
            <nav className="max-w-3xl mx-auto px-4 text-xs text-white/80">
              <Link to="/" className="hover:text-white transition-colors">目的地</Link>
              <span className="mx-1.5 text-white/40">/</span>
              <Link to={`/destination/${parentDestination.id}`} className="hover:text-white transition-colors">{parentDestination.name}</Link>
              <span className="mx-1.5 text-white/40">/</span>
              <span className="text-white">{attraction.name}</span>
            </nav>
          </div>

          {/* Title block */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-3xl mx-auto px-4 pb-6 sm:pb-8">
              <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm bg-white/90 ${style.chip}`}>
                {attraction.type}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight drop-shadow-lg">
                {attraction.name}
              </h1>
              <p className="text-base sm:text-lg text-white/90 mt-1.5 drop-shadow font-medium">
                {attraction.oneLiner}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4">
        {/* Image strip below hero */}
        {attraction.images.length > 1 && (
          <div className="grid grid-cols-3 gap-2 -mt-6 relative z-10 mb-8">
            {attraction.images.slice(1, 4).map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 ring-2 ring-white shadow-md">
                <ImageWithFallback
                  src={img}
                  alt={`${attraction.name} ${i + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10 mt-6">
          {attraction.tags.map((tag) => (
            <span key={tag} className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* 为什么要去 */}
        <section className="mb-10 relative pl-5">
          <div className={`absolute left-0 top-1 bottom-1 w-1 rounded-full bg-gradient-to-b ${style.ring}`} />
          <h2 className="text-xl font-extrabold text-slate-800 mb-2 tracking-tight">为什么要去</h2>
          <p className="text-slate-600 leading-relaxed">{attraction.whyGo}</p>
        </section>

        {/* 核心看点 */}
        <section className="mb-10">
          <h2 className="text-xl font-extrabold text-slate-800 mb-4 tracking-tight flex items-center gap-2">
            <span className={`w-1 h-5 rounded-full bg-gradient-to-b ${style.ring}`} />
            核心看点
          </h2>
          <ul className="space-y-3">
            {attraction.highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed group">
                <span className={`shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${style.ring} text-white text-xs font-bold flex items-center justify-center mt-0.5 shadow-sm`}>
                  {i + 1}
                </span>
                <span className="pt-0.5">{h}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 路线概览（徒步路线专用） */}
        {attraction.routeOverview && (
          <section className="mb-10">
            <h2 className="text-xl font-extrabold text-slate-800 mb-4 tracking-tight flex items-center gap-2">
              <span className={`w-1 h-5 rounded-full bg-gradient-to-b ${style.ring}`} />
              路线概览
            </h2>
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{attraction.routeOverview}</p>
            </div>
          </section>
        )}

        {/* 详细介绍 */}
        <section className="mb-10">
          <h2 className="text-xl font-extrabold text-slate-800 mb-4 tracking-tight flex items-center gap-2">
            <span className={`w-1 h-5 rounded-full bg-gradient-to-b ${style.ring}`} />
            详细介绍
          </h2>
          <p className="text-slate-600 leading-relaxed">{attraction.description}</p>
        </section>

        {/* 准备清单（徒步/户外专用） */}
        {attraction.preparation && attraction.preparation.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-extrabold text-slate-800 mb-4 tracking-tight flex items-center gap-2">
              <span className={`w-1 h-5 rounded-full bg-gradient-to-b ${style.ring}`} />
              出发前准备
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {attraction.preparation.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-slate-600 bg-white border border-slate-100 rounded-lg p-2.5">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                    ✓
                  </span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 实操信息 */}
        <section className="mb-10">
          <h2 className="text-xl font-extrabold text-slate-800 mb-4 tracking-tight flex items-center gap-2">
            <span className={`w-1 h-5 rounded-full bg-gradient-to-b ${style.ring}`} />
            实操信息
          </h2>
          <div className="bg-gradient-to-br from-slate-50 via-white to-amber-50/30 border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                  <span>🚗</span> 怎么去
                </dt>
                <dd className="text-sm text-slate-700 leading-relaxed">{attraction.practical.howToGo}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                  <span>🗓</span> 最佳季节
                </dt>
                <dd className="text-sm text-slate-700">{attraction.practical.bestSeason}</dd>
              </div>
              {attraction.practical.difficulty && (
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <span>⛰</span> 难度
                  </dt>
                  <dd className="text-sm text-slate-700">{attraction.practical.difficulty}</dd>
                </div>
              )}
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                  <span>💴</span> 费用
                </dt>
                <dd className="text-sm text-slate-700">{attraction.practical.cost}</dd>
              </div>
              {attraction.practical.tips && (
                <div className="sm:col-span-2">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <span>💡</span> Tips
                  </dt>
                  <dd className="text-sm text-slate-700 leading-relaxed">{attraction.practical.tips}</dd>
                </div>
              )}
            </dl>
          </div>
        </section>

        {/* Back */}
        <Link
          to={`/destination/${parentDestination.id}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50 font-medium text-sm transition-all shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          返回{parentDestination.name}的所有景点
        </Link>
      </div>
    </div>
  );
}
