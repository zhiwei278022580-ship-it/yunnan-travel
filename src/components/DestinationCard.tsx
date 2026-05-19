import { Link } from "react-router-dom";
import type { Destination } from "../data/destinations";

export default function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      to={`/destination/${destination.id}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-slate-200
        shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={destination.coverImage}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-800">{destination.name}</h3>
          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {destination.region}
          </span>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {destination.description}
        </p>
        <div className="mt-3 text-xs text-slate-400">
          {destination.attractions.length} 个景点 & 路线
        </div>
      </div>
    </Link>
  );
}
