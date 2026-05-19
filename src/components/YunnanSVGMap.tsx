import { useState } from "react";
import { useNavigate } from "react-router-dom";
import destinations from "../data/index";

const YUNNAN_OUTLINE =
  "M 106,41 L 137,26 L 176,21 L 215,23 L 254,28 L 299,31 L 345,45 L 384,62 L 422,83 L 455,109 L 478,141 L 494,179 L 502,218 L 501,256 L 494,295 L 486,333 L 478,365 L 465,398 L 449,430 L 427,459 L 402,486 L 368,508 L 335,526 L 310,544 L 284,560 L 258,574 L 236,586 L 212,593 L 186,597 L 160,593 L 134,580 L 108,555 L 84,528 L 64,491 L 50,455 L 38,416 L 32,371 L 30,326 L 33,281 L 41,236 L 45,192 L 59,149 L 68,102 L 78,71 L 88,51 Z";

interface RegionDef {
  id: string;
  name: string;
  destinationId: string;
  color: string;
  hover: string;
  stroke: string;
  path: string;
  labelX: number; labelY: number;
}

// Scaled-up regions (~1.3x from original 400x500 → 520x640)
const regionDefs: RegionDef[] = [
  {
    id: "nujiang", name: "怒江", destinationId: "nujiang",
    color: "#fce7f3", hover: "#fbcfe8", stroke: "#f9a8d4",
    labelX: 75, labelY: 183,
    path: "M 106,41 L 88,51 L 78,71 L 68,102 L 59,149 L 45,192 L 41,236 L 33,281 L 58,268 L 78,248 L 95,225 L 112,188 L 119,153 L 119,130 L 105,108 Z",
  },
  {
    id: "diqing", name: "迪庆", destinationId: "shangrila",
    color: "#ede9fe", hover: "#ddd6fe", stroke: "#c4b5fd",
    labelX: 144, labelY: 82,
    path: "M 106,41 L 137,26 L 176,21 L 215,23 L 228,51 L 228,108 L 208,128 L 169,138 L 130,138 L 119,130 L 105,108 Z",
  },
  {
    id: "lijiang", name: "丽江", destinationId: "lijiang",
    color: "#dbeafe", hover: "#bfdbfe", stroke: "#93c5fd",
    labelX: 244, labelY: 104,
    path: "M 215,23 L 254,28 L 299,31 L 312,57 L 299,96 L 280,128 L 254,155 L 228,179 L 208,173 L 169,138 L 208,128 L 228,108 L 228,51 Z",
  },
  {
    id: "dali", name: "大理", destinationId: "dali",
    color: "#fef9c3", hover: "#fef08a", stroke: "#fde047",
    labelX: 191, labelY: 218,
    path: "M 169,138 L 208,173 L 228,179 L 247,199 L 254,231 L 250,269 L 234,294 L 195,288 L 143,278 L 123,264 L 104,238 L 91,211 L 97,180 L 119,153 L 119,130 Z",
  },
  {
    id: "tengchong", name: "腾冲", destinationId: "tengchong",
    color: "#fed7aa", hover: "#fdba74", stroke: "#fb923c",
    labelX: 80, labelY: 348,
    path: "M 58,268 L 33,281 L 36,326 L 42,370 L 42,400 L 50,420 L 65,390 L 90,355 L 110,330 L 123,308 L 130,280 L 117,256 L 105,242 L 97,225 L 78,248 Z",
  },
  {
    id: "kunming", name: "昆明", destinationId: "kunming",
    color: "#fce7f3", hover: "#fbcfe8", stroke: "#f9a8d4",
    labelX: 396, labelY: 155,
    path: "M 312,57 L 345,45 L 384,62 L 422,83 L 455,109 L 478,141 L 494,179 L 481,230 L 442,243 L 403,256 L 364,269 L 325,279 L 299,274 L 280,273 L 254,231 L 254,199 L 254,155 L 280,128 L 299,96 Z",
  },
  {
    id: "honghe", name: "红河", destinationId: "honghe",
    color: "#fef3c7", hover: "#fde68a", stroke: "#fcd34d",
    labelX: 352, labelY: 362,
    path: "M 254,231 L 280,273 L 299,274 L 325,279 L 364,269 L 403,256 L 442,243 L 468,275 L 486,295 L 486,333 L 478,365 L 465,398 L 449,430 L 427,459 L 402,486 L 368,495 L 338,490 L 310,480 L 273,468 L 237,462 L 247,435 L 238,405 L 221,360 L 220,320 L 228,280 L 234,294 L 250,269 Z",
  },
  {
    id: "puer", name: "普洱", destinationId: "puer",
    color: "#d1fae5", hover: "#a7f3d0", stroke: "#6ee7b7",
    labelX: 182, labelY: 438,
    path: "M 220,320 L 221,360 L 238,405 L 247,435 L 247,462 L 221,470 L 195,472 L 175,465 L 143,465 L 130,458 L 117,445 L 110,428 L 115,395 L 130,378 L 150,358 L 175,350 L 195,352 Z",
  },
  {
    id: "xishuangbanna", name: "西双版纳", destinationId: "xishuangbanna",
    color: "#ccfbf1", hover: "#99f6e4", stroke: "#5eead4",
    labelX: 195, labelY: 528,
    path: "M 175,350 L 195,352 L 220,320 L 220,360 L 238,405 L 247,435 L 237,462 L 273,468 L 310,480 L 338,490 L 368,495 L 345,510 L 310,530 L 284,560 L 258,574 L 236,586 L 212,593 L 186,597 L 160,593 L 134,580 L 130,530 L 143,500 L 160,475 L 175,465 L 175,430 L 165,395 L 160,365 Z",
  },
];

// Internal borders
const internalBorders = [
  "M 106,41 L 105,108 L 119,130",
  "M 58,268 L 78,248 L 97,225 L 119,153",
  "M 119,153 L 97,180 L 91,211",
  "M 228,51 L 228,108 L 208,128",
  "M 169,138 L 208,173 L 228,179",
  "M 97,180 L 119,130 L 143,150 L 169,138",
  "M 254,155 L 254,199 L 254,231",
  "M 280,128 L 299,96 L 312,57",
  "M 254,231 L 280,273 L 299,274 L 364,269 L 403,256 L 442,243",
  "M 250,269 L 228,280 L 220,320",
  "M 220,320 L 195,352 L 175,350",
  "M 220,320 L 221,360 L 238,405 L 247,435",
  "M 110,428 L 130,378 L 150,358 L 175,350",
  "M 91,211 L 104,238 L 123,264 L 143,278",
  "M 97,225 L 117,256 L 130,280 L 123,308 L 110,330 L 90,355 L 65,390 L 110,395 L 115,395",
];

// Build region-attraction index
function getRegionAttractionCount(regionId: string) {
  const destId = regionDefs.find(r => r.id === regionId)?.destinationId;
  const dest = destinations.find(d => d.id === destId);
  return dest ? dest.attractions.length : 0;
}

function getRegionAttractions(regionId: string) {
  const destId = regionDefs.find(r => r.id === regionId)?.destinationId;
  const dest = destinations.find(d => d.id === destId);
  return dest ? dest.attractions : [];
}

export default function YunnanSVGMap() {
  const navigate = useNavigate();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const activeRegion = hoveredRegion ? regionDefs.find(r => r.id === hoveredRegion) : null;
  const activeAttractions = hoveredRegion ? getRegionAttractions(hoveredRegion) : [];
  const activeDest = hoveredRegion
    ? destinations.find(d => d.id === regionDefs.find(r => r.id === hoveredRegion)?.destinationId)
    : null;

  return (
    <div className="relative w-full select-none">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ---- SVG 地图 ---- */}
        <div className="flex-1 w-full min-w-0">
          <svg viewBox="0 0 520 630" className="w-full h-auto max-h-[70vh]">

            {/* 邻省/邻国 */}
            {[
              ["西藏", 32, 26], ["四川", 286, 18], ["贵州", 491, 128],
              ["广西", 491, 321], ["越南", 429, 558], ["老挝", 221, 605], ["缅甸", 28, 494],
            ].map(([t, x, y]) => (
              <text key={t as string} x={x as number} y={y as number}
                className="fill-slate-300 text-[9px] tracking-wide">
                {t as string}
              </text>
            ))}

            {/* 底图 */}
            <path d={YUNNAN_OUTLINE} fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" strokeLinejoin="round" />

            {/* 区域色块 */}
            {regionDefs.map((r) => {
              const active = hoveredRegion === r.id;
              return (
                <path
                  key={r.id}
                  d={r.path}
                  fill={active ? r.hover : r.color}
                  stroke={active ? r.stroke : "#e2e8f0"}
                  strokeWidth={active ? 2.2 : 1}
                  strokeLinejoin="round"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredRegion(r.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => navigate(`/destination/${r.destinationId}`)}
                />
              );
            })}

            {/* 内部边界 */}
            {internalBorders.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="#cbd5e1" strokeWidth="0.7" strokeDasharray="4 3" />
            ))}

            {/* 外轮廓 */}
            <path d={YUNNAN_OUTLINE} fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinejoin="round" />

            {/* 三条河流 */}
            {[
              ["M 106,49 Q 182,71 260,64 Q 338,58 410,52 Q 455,96 449,154", "金沙江"],
              ["M 96,62 Q 117,179 130,307 Q 140,423 182,518", "澜沧江"],
              ["M 73,67 Q 68,179 62,307 Q 60,423 78,481", "怒江"],
            ].map(([d, label]) => (
              <path key={label as string} d={d as string} fill="none" stroke="#bae6fd" strokeWidth="1.1" strokeDasharray="6 4" />
            ))}

            {/* 滇池、洱海 */}
            <ellipse cx="341" cy="253" rx="8" ry="5" fill="#bae6fd" opacity="0.5" />
            <text x="341" y="256" className="fill-slate-300 text-[8px]" textAnchor="middle">滇池</text>
            <ellipse cx="218" cy="232" rx="5" ry="3" fill="#bae6fd" opacity="0.5" />
            <text x="218" y="235" className="fill-slate-300 text-[8px]" textAnchor="middle">洱海</text>

            {/* 区域名称 + 景点数 */}
            {regionDefs.map((r) => {
              const active = hoveredRegion === r.id;
              const count = getRegionAttractionCount(r.id);
              return (
                <g key={`label-${r.id}`}>
                  <text x={r.labelX} y={r.labelY} textAnchor="middle"
                    className={`pointer-events-none ${active ? "fill-slate-800 text-[15px]" : "fill-slate-600 text-[13px]"} font-bold transition-colors`}>
                    {r.name}
                  </text>
                  <text x={r.labelX} y={r.labelY + 14} textAnchor="middle"
                    className={`pointer-events-none ${active ? "fill-slate-500 text-[11px]" : "fill-slate-400 text-[10px]"} transition-colors`}>
                    {count} 个景点
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* ---- 侧边栏: 悬停区域详情 ---- */}
        <div className="w-full lg:w-64 shrink-0">
          {activeRegion && activeDest ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 animate-in">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeRegion.stroke }} />
                <h3 className="font-bold text-slate-800 text-base">{activeDest.name}</h3>
                <span className="text-xs text-slate-400 ml-auto">{activeRegion.name}</span>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed line-clamp-2">{activeDest.description}</p>
              <button
                onClick={() => navigate(`/destination/${activeDest.id}`)}
                className="w-full py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors mb-3"
              >
                进入 {activeDest.name}
              </button>
              <div className="space-y-1 max-h-52 overflow-y-auto">
                {activeAttractions.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => navigate(`/attraction/${a.id}?from=${activeDest.id}`)}
                    className="w-full text-left px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors text-sm text-slate-600 hover:text-emerald-700 truncate block"
                  >
                    {a.name}
                    <span className="text-xs text-slate-400 ml-1.5">{a.type}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
              <p className="text-sm text-slate-400 leading-relaxed">
                鼠标悬停地图区域<br />查看目的地详情与景点列表
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 图例 */}
      <div className="flex justify-center gap-6 mt-4 text-[11px] text-slate-400">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-purple-100 border border-slate-200 inline-block" /> 区域</span>
        <span className="flex items-center gap-1"><span className="w-3.5 h-0.5 bg-sky-200 inline-block" /> 河流</span>
        <span className="flex items-center gap-1">点击区域 → 进入目的地</span>
      </div>
    </div>
  );
}
