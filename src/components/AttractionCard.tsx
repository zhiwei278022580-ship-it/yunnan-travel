import { Link } from "react-router-dom";
import type { Attraction } from "../data/destinations";

const typeColors: Record<string, string> = {
  "国家级景区": "bg-blue-50 text-blue-700",
  "徒步路线": "bg-orange-50 text-orange-700",
  "野生秘境": "bg-emerald-50 text-emerald-700",
  "古镇村落": "bg-amber-50 text-amber-700",
  "湖泊雪山": "bg-cyan-50 text-cyan-700",
  "温泉湿地": "bg-teal-50 text-teal-700",
  "文化遗迹": "bg-purple-50 text-purple-700",
  "峡谷江河": "bg-indigo-50 text-indigo-700",
};

export default function AttractionCard({
  attraction,
  destinationId,
}: {
  attraction: Attraction;
  destinationId: string;
}) {
  return (
    <Link
      to={`/attraction/${attraction.id}?from=${destinationId}`}
      className="group block rounded-xl overflow-hidden bg-white border border-slate-200
        shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={attraction.images[0]}
          alt={attraction.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[attraction.type] || "bg-slate-50 text-slate-600"}`}>
            {attraction.type}
          </span>
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">{attraction.name}</h3>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
          {attraction.oneLiner}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {attraction.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
