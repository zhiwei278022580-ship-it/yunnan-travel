import { useParams, Link } from "react-router-dom";
import destinations from "../data/index";
import DestinationHubMap from "../components/DestinationHubMap";
import ImageWithFallback from "../components/ImageWithFallback";

const typeDot: Record<string, string> = {
  "国家级景区": "bg-blue-500",
  "徒步路线": "bg-orange-500",
  "野生秘境": "bg-emerald-500",
  "古镇村落": "bg-amber-500",
  "湖泊雪山": "bg-cyan-500",
  "温泉湿地": "bg-teal-500",
  "文化遗迹": "bg-purple-500",
  "峡谷江河": "bg-indigo-500",
  "观景台": "bg-rose-500",
};

export default function Destination() {
  const { id } = useParams<{ id: string }>();
  const destination = destinations.find((d) => d.id === id);

  if (!destination) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">目的地未找到</h2>
        <Link to="/" className="text-emerald-600 hover:underline">返回首页</Link>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* Minimal top bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center gap-3">
          <Link to="/" className="text-slate-400 hover:text-emerald-600 transition-colors shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-base font-bold text-slate-800">{destination.name}</h1>
            <span className="text-xs text-slate-400 hidden sm:inline truncate">{destination.region}</span>
          </div>
          <span className="ml-auto text-xs text-slate-400 shrink-0">
            {destination.attractions.length} 个景点
          </span>
        </div>
      </header>

      {/* Hero hub map — the star of the page */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-4 pb-6">
          <DestinationHubMap destination={destination} />
        </div>
      </section>

      {/* Separator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs font-medium text-slate-400 tracking-wider uppercase">探索全部景点</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
      </div>

      {/* Mini-card grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destination.attractions.map((a) => (
            <Link
              key={a.id}
              to={`/attraction/${a.id}?from=${destination.id}`}
              className="group flex gap-4 p-4 rounded-2xl bg-white border border-slate-100
                hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50
                transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <ImageWithFallback
                  src={a.images[0]}
                  alt={a.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="min-w-0 flex flex-col justify-center gap-1">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${typeDot[a.type] || "bg-slate-400"}`} />
                  <h3 className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                    {a.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {a.oneLiner}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {a.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
