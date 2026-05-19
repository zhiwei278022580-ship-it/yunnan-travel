import { useParams, Link } from "react-router-dom";
import destinations from "../data/index";
import DestinationHubMap from "../components/DestinationHubMap";

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
      {/* Top bar */}
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

      {/* Description + Map section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Destination brief */}
        <div className="mb-6 max-w-3xl">
          <p className="text-sm text-slate-600 leading-relaxed">{destination.description}</p>
        </div>

        {/* Hub map with integrated cards */}
        <DestinationHubMap destination={destination} />
      </section>
    </div>
  );
}
