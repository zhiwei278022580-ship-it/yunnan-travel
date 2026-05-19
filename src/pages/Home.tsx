import destinations from "../data/index";
import SearchBar from "../components/SearchBar";
import DestinationCard from "../components/DestinationCard";
import YunnanSVGMap from "../components/YunnanSVGMap";

export default function Home() {
  return (
    <div>
      {/* Hero — compact */}
      <section className="bg-gradient-to-b from-emerald-50 to-slate-50 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
            发现秘境云南
          </h1>
          <p className="text-slate-500 mb-5 max-w-lg mx-auto leading-relaxed text-sm">
            不只是丽江和大理——徒步路线、野生秘境、古老村落，86个景点一站式发现
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Yunnan SVG 地图 — 全宽、大面积 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-3 mb-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-sm font-medium text-slate-600">
              悬停地图区域查看景点列表，点击进入目的地详情
            </span>
          </div>
          <div className="p-5 sm:p-7">
            <YunnanSVGMap />
          </div>
        </div>
      </section>

      {/* 目的地卡片 — 快速浏览 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <h2 className="text-lg font-semibold text-slate-700 mb-5">
          浏览全部目的地
          <span className="text-sm text-slate-400 font-normal ml-2">共 {destinations.length} 个</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {destinations.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      </section>
    </div>
  );
}
