import { Link } from "react-router-dom";
import type { Attraction } from "../data/destinations";

const typeStyles: Record<string, { chip: string; ring: string }> = {
  "国家级景区":   { chip: "bg-blue-50 text-blue-700 border-blue-200",       ring: "from-blue-400 to-blue-600" },
  "徒步路线":     { chip: "bg-orange-50 text-orange-700 border-orange-200", ring: "from-orange-400 to-orange-600" },
  "野生秘境":     { chip: "bg-emerald-50 text-emerald-700 border-emerald-200", ring: "from-emerald-400 to-emerald-600" },
  "古镇村落":     { chip: "bg-amber-50 text-amber-700 border-amber-200",   ring: "from-amber-400 to-amber-600" },
  "湖泊雪山":     { chip: "bg-cyan-50 text-cyan-700 border-cyan-200",       ring: "from-cyan-400 to-cyan-600" },
  "温泉湿地":     { chip: "bg-teal-50 text-teal-700 border-teal-200",       ring: "from-teal-400 to-teal-600" },
  "文化遗迹":     { chip: "bg-purple-50 text-purple-700 border-purple-200", ring: "from-purple-400 to-purple-600" },
  "峡谷江河":     { chip: "bg-indigo-50 text-indigo-700 border-indigo-200", ring: "from-indigo-400 to-indigo-600" },
  "观景台":       { chip: "bg-pink-50 text-pink-700 border-pink-200",       ring: "from-pink-400 to-pink-600" },
};

const typeIcon: Record<string, string> = {
  "国家级景区": "★",
  "徒步路线": "↗",
  "野生秘境": "❀",
  "古镇村落": "▦",
  "湖泊雪山": "▲",
  "温泉湿地": "♨",
  "文化遗迹": "❖",
  "峡谷江河": "～",
  "观景台": "◎",
};

export default function AttractionCard({
  attraction,
  destinationId,
}: {
  attraction: Attraction;
  destinationId: string;
}) {
  const style = typeStyles[attraction.type] || { chip: "bg-slate-50 text-slate-600 border-slate-200", ring: "from-slate-400 to-slate-600" };
  const icon = typeIcon[attraction.type] || "•";

  return (
    <Link
      to={`/attraction/${attraction.id}?from=${destinationId}`}
      className="group relative block rounded-2xl overflow-hidden bg-white border border-slate-200
        shadow-sm hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1
        hover:border-slate-300"
    >
      {/* top accent stripe */}
      <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${style.ring} opacity-0 group-hover:opacity-100 transition-opacity z-10`} />

      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={attraction.images[0]}
          alt={attraction.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        {/* image gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
        {/* type chip floating top-left */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${style.chip}`}>
            <span className="text-[10px] leading-none">{icon}</span>
            {attraction.type}
          </span>
        </div>
        {/* name on image */}
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="text-base font-extrabold text-white drop-shadow tracking-tight line-clamp-1">
            {attraction.name}
          </h3>
        </div>
      </div>

      <div className="p-3.5">
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {attraction.oneLiner}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-1">
          {attraction.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
          {attraction.tags.length > 3 && (
            <span className="text-[11px] text-slate-400">+{attraction.tags.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
