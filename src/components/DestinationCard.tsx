import { Link } from "react-router-dom";
import type { Destination } from "../data/destinations";

// destinationId → accent color (matches the YunnanSVGMap palette so card and map feel like one product)
const accentById: Record<string, { dot: string; chip: string }> = {
  nujiang:        { dot: "bg-amber-500",   chip: "bg-amber-50 text-amber-700 border-amber-200" },
  shangrila:      { dot: "bg-violet-500",  chip: "bg-violet-50 text-violet-700 border-violet-200" },
  lijiang:        { dot: "bg-blue-500",    chip: "bg-blue-50 text-blue-700 border-blue-200" },
  dali:           { dot: "bg-yellow-500",  chip: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  tengchong:      { dot: "bg-orange-500",  chip: "bg-orange-50 text-orange-700 border-orange-200" },
  kunming:        { dot: "bg-pink-500",    chip: "bg-pink-50 text-pink-700 border-pink-200" },
  honghe:         { dot: "bg-red-500",     chip: "bg-red-50 text-red-700 border-red-200" },
  puer:           { dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  xishuangbanna:  { dot: "bg-teal-500",    chip: "bg-teal-50 text-teal-700 border-teal-200" },
};

export default function DestinationCard({ destination }: { destination: Destination }) {
  const accent = accentById[destination.id] || {
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <Link
      to={`/destination/${destination.id}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-slate-200
        shadow-sm hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1
        hover:border-slate-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={destination.coverImage}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        {/* gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        {/* region badge floating on image */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${accent.chip}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
            {destination.region}
          </span>
        </div>
        {/* attractions count chip bottom-right */}
        <div className="absolute bottom-2.5 right-2.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2 7h7l-5.5 4.5 2 7L12 16l-5.5 4.5 2-7L3 9h7z" />
            </svg>
            {destination.attractions.length}
          </span>
        </div>
        {/* name overlay on image */}
        <div className="absolute bottom-2.5 left-2.5">
          <h3 className="text-base font-extrabold text-white drop-shadow tracking-tight">
            {destination.name}
          </h3>
        </div>
      </div>
      <div className="p-3.5">
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {destination.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {destination.attractions.length} 景点 · 路线
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:gap-2 transition-all">
            探索
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
