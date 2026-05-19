import { useState } from "react";
import { useNavigate } from "react-router-dom";
import destinations from "../data/index";

const YUNNAN_OUTLINE =
  "M 106,41 L 137,26 L 176,21 L 215,23 L 254,28 L 299,31 L 345,45 L 384,62 L 422,83 L 455,109 L 478,141 L 494,179 L 502,218 L 501,256 L 494,295 L 486,333 L 478,365 L 465,398 L 449,430 L 427,459 L 402,486 L 368,508 L 335,526 L 310,544 L 284,560 L 258,574 L 236,586 L 212,593 L 186,597 L 160,593 L 134,580 L 108,555 L 84,528 L 64,491 L 50,455 L 38,416 L 32,371 L 30,326 L 33,281 L 41,236 L 45,192 L 59,149 L 68,102 L 78,71 L 88,51 Z";

interface RegionDef {
  id: string;
  name: string;
  destinationId: string;
  /** Solid base color (used in gradient stop 1) */
  c1: string;
  /** Slightly deeper color (used in gradient stop 2) */
  c2: string;
  /** Hover/active accent color */
  accent: string;
  /** Decorative emoji/icon */
  icon: string;
  path: string;
  labelX: number;
  labelY: number;
}

// 9 regions, each with its own warm gradient palette inspired by Yunnan's terrain
const regionDefs: RegionDef[] = [
  {
    id: "nujiang", name: "怒江", destinationId: "nujiang",
    c1: "#fef3c7", c2: "#fde68a", accent: "#f59e0b", icon: "⛰",
    labelX: 75, labelY: 183,
    path: "M 106,41 L 88,51 L 78,71 L 68,102 L 59,149 L 45,192 L 41,236 L 33,281 L 58,268 L 78,248 L 95,225 L 112,188 L 119,153 L 119,130 L 105,108 Z",
  },
  {
    id: "diqing", name: "迪庆", destinationId: "shangrila",
    c1: "#ede9fe", c2: "#ddd6fe", accent: "#8b5cf6", icon: "❄",
    labelX: 144, labelY: 82,
    path: "M 106,41 L 137,26 L 176,21 L 215,23 L 228,51 L 228,108 L 208,128 L 169,138 L 130,138 L 119,130 L 105,108 Z",
  },
  {
    id: "lijiang", name: "丽江", destinationId: "lijiang",
    c1: "#dbeafe", c2: "#bfdbfe", accent: "#3b82f6", icon: "▲",
    labelX: 244, labelY: 104,
    path: "M 215,23 L 254,28 L 299,31 L 312,57 L 299,96 L 280,128 L 254,155 L 228,179 L 208,173 L 169,138 L 208,128 L 228,108 L 228,51 Z",
  },
  {
    id: "dali", name: "大理", destinationId: "dali",
    c1: "#fef9c3", c2: "#fef08a", accent: "#eab308", icon: "❀",
    labelX: 191, labelY: 218,
    path: "M 169,138 L 208,173 L 228,179 L 247,199 L 254,231 L 250,269 L 234,294 L 195,288 L 143,278 L 123,264 L 104,238 L 91,211 L 97,180 L 119,153 L 119,130 Z",
  },
  {
    id: "tengchong", name: "腾冲", destinationId: "tengchong",
    c1: "#fed7aa", c2: "#fdba74", accent: "#f97316", icon: "♨",
    labelX: 80, labelY: 348,
    path: "M 58,268 L 33,281 L 36,326 L 42,370 L 42,400 L 50,420 L 65,390 L 90,355 L 110,330 L 123,308 L 130,280 L 117,256 L 105,242 L 97,225 L 78,248 Z",
  },
  {
    id: "kunming", name: "昆明", destinationId: "kunming",
    c1: "#fce7f3", c2: "#fbcfe8", accent: "#ec4899", icon: "✦",
    labelX: 396, labelY: 155,
    path: "M 312,57 L 345,45 L 384,62 L 422,83 L 455,109 L 478,141 L 494,179 L 481,230 L 442,243 L 403,256 L 364,269 L 325,279 L 299,274 L 280,273 L 254,231 L 254,199 L 254,155 L 280,128 L 299,96 Z",
  },
  {
    id: "honghe", name: "红河", destinationId: "honghe",
    c1: "#fee2e2", c2: "#fecaca", accent: "#ef4444", icon: "⛰",
    labelX: 352, labelY: 362,
    path: "M 254,231 L 280,273 L 299,274 L 325,279 L 364,269 L 403,256 L 442,243 L 468,275 L 486,295 L 486,333 L 478,365 L 465,398 L 449,430 L 427,459 L 402,486 L 368,495 L 338,490 L 310,480 L 273,468 L 237,462 L 247,435 L 238,405 L 221,360 L 220,320 L 228,280 L 234,294 L 250,269 Z",
  },
  {
    id: "puer", name: "普洱", destinationId: "puer",
    c1: "#d1fae5", c2: "#a7f3d0", accent: "#10b981", icon: "🍃",
    labelX: 182, labelY: 438,
    path: "M 220,320 L 221,360 L 238,405 L 247,435 L 247,462 L 221,470 L 195,472 L 175,465 L 143,465 L 130,458 L 117,445 L 110,428 L 115,395 L 130,378 L 150,358 L 175,350 L 195,352 Z",
  },
  {
    id: "xishuangbanna", name: "西双版纳", destinationId: "xishuangbanna",
    c1: "#ccfbf1", c2: "#99f6e4", accent: "#14b8a6", icon: "🌴",
    labelX: 195, labelY: 528,
    path: "M 175,350 L 195,352 L 220,320 L 220,360 L 238,405 L 247,435 L 237,462 L 273,468 L 310,480 L 338,490 L 368,495 L 345,510 L 310,530 L 284,560 L 258,574 L 236,586 L 212,593 L 186,597 L 160,593 L 134,580 L 130,530 L 143,500 L 160,475 L 175,465 L 175,430 L 165,395 L 160,365 Z",
  },
];

// Internal borders (smoother dashed lines)
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

// Neighbors: provinces (zhōng) vs countries
const neighbors: Array<{ name: string; x: number; y: number; type: "province" | "country" }> = [
  { name: "西藏", x: 32, y: 26, type: "province" },
  { name: "四川", x: 286, y: 18, type: "province" },
  { name: "贵州", x: 491, y: 128, type: "province" },
  { name: "广西", x: 491, y: 321, type: "province" },
  { name: "越南", x: 429, y: 558, type: "country" },
  { name: "老挝", x: 221, y: 605, type: "country" },
  { name: "缅甸", x: 28, y: 494, type: "country" },
];

function getRegionAttractionCount(regionId: string) {
  const destId = regionDefs.find((r) => r.id === regionId)?.destinationId;
  const dest = destinations.find((d) => d.id === destId);
  return dest ? dest.attractions.length : 0;
}

function getRegionAttractions(regionId: string) {
  const destId = regionDefs.find((r) => r.id === regionId)?.destinationId;
  const dest = destinations.find((d) => d.id === destId);
  return dest ? dest.attractions : [];
}

export default function YunnanSVGMap() {
  const navigate = useNavigate();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const activeRegion = hoveredRegion ? regionDefs.find((r) => r.id === hoveredRegion) : null;
  const activeAttractions = hoveredRegion ? getRegionAttractions(hoveredRegion) : [];
  const activeDest = hoveredRegion
    ? destinations.find((d) => d.id === regionDefs.find((r) => r.id === hoveredRegion)?.destinationId)
    : null;

  return (
    <div className="relative w-full select-none">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ---- SVG 地图 ---- */}
        <div className="flex-1 w-full min-w-0">
          <svg viewBox="0 0 520 640" className="w-full h-auto max-h-[72vh]">
            <defs>
              {/* Per-region gradients */}
              {regionDefs.map((r) => (
                <linearGradient key={`grad-${r.id}`} id={`grad-${r.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={r.c1} />
                  <stop offset="100%" stopColor={r.c2} />
                </linearGradient>
              ))}

              {/* Hover gradients (slightly darker) */}
              {regionDefs.map((r) => (
                <linearGradient key={`hgrad-${r.id}`} id={`hgrad-${r.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={r.c2} />
                  <stop offset="100%" stopColor={r.accent} stopOpacity="0.55" />
                </linearGradient>
              ))}

              {/* River gradient */}
              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              {/* Lake gradient */}
              <radialGradient id="lakeGrad" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="55%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#0369a1" />
              </radialGradient>

              {/* Background paper texture gradient */}
              <radialGradient id="paperGrad" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="#fefdf7" />
                <stop offset="100%" stopColor="#f5f1e8" />
              </radialGradient>

              {/* Soft drop shadow for the outline */}
              <filter id="outlineShadow" x="-5%" y="-5%" width="115%" height="115%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
                <feOffset dx="0" dy="2.5" result="offset" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.18" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Hover glow */}
              <filter id="regionGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Label pill shadow */}
              <filter id="pillShadow" x="-20%" y="-20%" width="140%" height="160%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.8" floodColor="#0f172a" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* Paper background */}
            <rect x="0" y="0" width="520" height="640" rx="14" fill="url(#paperGrad)" />

            {/* Faint grid */}
            <g opacity="0.5">
              {[100, 200, 300, 400, 500].map((y) => (
                <line key={`h${y}`} x1="0" y1={y} x2="520" y2={y} stroke="#e8e3d5" strokeWidth="0.4" strokeDasharray="2 4" />
              ))}
              {[100, 200, 300, 400].map((x) => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="640" stroke="#e8e3d5" strokeWidth="0.4" strokeDasharray="2 4" />
              ))}
            </g>

            {/* Neighbor labels — provinces in muted gray, countries in faded sand */}
            {neighbors.map((n) => (
              <text
                key={n.name}
                x={n.x}
                y={n.y}
                className={
                  n.type === "country"
                    ? "fill-amber-400/60 text-[10px] tracking-[0.25em] italic"
                    : "fill-slate-400/70 text-[10px] tracking-[0.2em]"
                }
              >
                {n.name.split("").join(" ")}
              </text>
            ))}

            {/* Yunnan outline shadow base */}
            <path
              d={YUNNAN_OUTLINE}
              fill="#ffffff"
              stroke="#94a3b8"
              strokeWidth="2.4"
              strokeLinejoin="round"
              filter="url(#outlineShadow)"
            />

            {/* Region fills (gradient) */}
            {regionDefs.map((r) => {
              const active = hoveredRegion === r.id;
              return (
                <path
                  key={r.id}
                  d={r.path}
                  fill={active ? `url(#hgrad-${r.id})` : `url(#grad-${r.id})`}
                  stroke={active ? r.accent : "#ffffff"}
                  strokeWidth={active ? 2.5 : 1.2}
                  strokeLinejoin="round"
                  className="cursor-pointer transition-all duration-300"
                  style={{ filter: active ? "url(#regionGlow)" : undefined }}
                  onMouseEnter={() => setHoveredRegion(r.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => navigate(`/destination/${r.destinationId}`)}
                />
              );
            })}

            {/* Internal dashed borders */}
            {internalBorders.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="0.6"
                strokeDasharray="3 3"
                opacity="0.7"
                pointerEvents="none"
              />
            ))}

            {/* Yunnan outline (top stroke for sharpness) */}
            <path
              d={YUNNAN_OUTLINE}
              fill="none"
              stroke="#475569"
              strokeWidth="2"
              strokeLinejoin="round"
              pointerEvents="none"
            />

            {/* Three rivers — gradient + glow */}
            <g opacity="0.85" pointerEvents="none">
              {[
                ["M 106,49 Q 182,71 260,64 Q 338,58 410,52 Q 455,96 449,154", "金沙江", 110, 70],
                ["M 96,62 Q 117,179 130,307 Q 140,423 182,518", "澜沧江", 145, 320],
                ["M 73,67 Q 68,179 62,307 Q 60,423 78,481", "怒江", 50, 320],
              ].map(([d, label, lx, ly]) => (
                <g key={label as string}>
                  {/* Glow shadow */}
                  <path d={d as string} fill="none" stroke="#bae6fd" strokeWidth="3.5" strokeLinecap="round" opacity="0.4" />
                  {/* Main river */}
                  <path
                    d={d as string}
                    fill="none"
                    stroke="url(#riverGrad)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeDasharray="6 3"
                  />
                  <text
                    x={lx as number}
                    y={ly as number}
                    className="fill-sky-500/60 text-[8px] tracking-widest italic"
                    transform={label === "金沙江" ? `rotate(-3 ${lx} ${ly})` : `rotate(85 ${lx} ${ly})`}
                  >
                    {label as string}
                  </text>
                </g>
              ))}
            </g>

            {/* Major lakes — radial gradient with sparkle */}
            <g pointerEvents="none">
              {/* 滇池 (Dianchi) */}
              <ellipse cx="341" cy="253" rx="9" ry="6" fill="url(#lakeGrad)" stroke="#0284c7" strokeWidth="0.4" opacity="0.85" />
              <ellipse cx="338" cy="251" rx="2" ry="1" fill="#ffffff" opacity="0.7" />
              <text x="341" y="270" className="fill-sky-700/70 text-[8px] font-medium tracking-wider" textAnchor="middle">滇池</text>

              {/* 洱海 (Erhai) */}
              <ellipse cx="218" cy="232" rx="5.5" ry="3.5" fill="url(#lakeGrad)" stroke="#0284c7" strokeWidth="0.4" opacity="0.85" />
              <ellipse cx="216" cy="231" rx="1.4" ry="0.8" fill="#ffffff" opacity="0.7" />
              <text x="218" y="246" className="fill-sky-700/70 text-[8px] font-medium tracking-wider" textAnchor="middle">洱海</text>
            </g>

            {/* Region labels with pill background */}
            {regionDefs.map((r) => {
              const active = hoveredRegion === r.id;
              const count = getRegionAttractionCount(r.id);
              const nameWidth = r.name.length * 14 + 18;
              return (
                <g
                  key={`label-${r.id}`}
                  className="cursor-pointer pointer-events-none"
                  style={{ transition: "all 0.3s" }}
                >
                  {/* Pill background */}
                  <rect
                    x={r.labelX - nameWidth / 2}
                    y={r.labelY - 12}
                    width={nameWidth}
                    height="16"
                    rx="8"
                    fill={active ? r.accent : "#ffffff"}
                    stroke={active ? "#ffffff" : r.accent}
                    strokeWidth={active ? 0 : 0.8}
                    opacity={active ? 0.95 : 0.92}
                    filter="url(#pillShadow)"
                  />
                  <text
                    x={r.labelX - 6}
                    y={r.labelY}
                    textAnchor="middle"
                    className={`${active ? "fill-white text-[12px]" : "fill-slate-700 text-[11px]"} font-bold transition-colors`}
                  >
                    {r.name}
                  </text>
                  <text
                    x={r.labelX + (r.name.length * 6) - 4}
                    y={r.labelY - 0.5}
                    className={`${active ? "fill-white/85 text-[8px]" : "fill-slate-400 text-[8px]"} font-medium`}
                  >
                    {r.icon}
                  </text>

                  {/* Count badge */}
                  <g transform={`translate(${r.labelX}, ${r.labelY + 14})`}>
                    <rect
                      x={-22}
                      y={0}
                      width="44"
                      height="13"
                      rx="6.5"
                      fill={active ? "#ffffff" : "#f8fafc"}
                      stroke={active ? r.accent : "#e2e8f0"}
                      strokeWidth="0.8"
                      filter="url(#pillShadow)"
                    />
                    <text
                      x={0}
                      y={9}
                      textAnchor="middle"
                      className={`${active ? "fill-slate-700" : "fill-slate-500"} text-[9px] font-semibold`}
                    >
                      {count} 个景点
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Compass rose (top-right) */}
            <g transform="translate(470, 50)" pointerEvents="none">
              <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" opacity="0.85" />
              <circle cx="0" cy="0" r="13" fill="none" stroke="#e2e8f0" strokeWidth="0.4" />
              {/* North arrow (red) */}
              <path d="M 0,-13 L 4,0 L 0,3 L -4,0 Z" fill="#e04b3d" opacity="0.85" />
              {/* South arrow */}
              <path d="M 0,13 L 4,0 L 0,-3 L -4,0 Z" fill="#94a3b8" opacity="0.7" />
              {/* East/West */}
              <path d="M 13,0 L 0,4 L -3,0 L 0,-4 Z" fill="#94a3b8" opacity="0.4" />
              <path d="M -13,0 L 0,4 L 3,0 L 0,-4 Z" fill="#94a3b8" opacity="0.4" />
              <circle cx="0" cy="0" r="1.5" fill="#475569" />
              <text x="0" y="-21" textAnchor="middle" className="fill-rose-500 text-[7px] font-bold">N</text>
            </g>

            {/* Title cartouche (bottom-left) */}
            <g transform="translate(40, 600)" pointerEvents="none">
              <rect x="-6" y="-16" width="148" height="28" rx="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" opacity="0.85" filter="url(#pillShadow)" />
              <text x="0" y="2" className="fill-slate-700 text-[11px] font-bold tracking-wider">
                云 南
              </text>
              <text x="46" y="2" className="fill-slate-400 text-[9px] tracking-widest">
                YUNNAN
              </text>
              <line x1="0" y1="6" x2="135" y2="6" stroke="#e2e8f0" strokeWidth="0.5" />
              <text x="0" y="14" className="fill-slate-400 text-[7px] tracking-wider">
                9 区域 · 86 景点
              </text>
            </g>
          </svg>
        </div>

        {/* ---- 侧边栏 ---- */}
        <div className="w-full lg:w-72 shrink-0">
          {activeRegion && activeDest ? (
            <div
              className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 transition-all"
              style={{ borderTopColor: activeRegion.accent, borderTopWidth: "3px" }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-sm"
                  style={{ backgroundColor: activeRegion.c1, color: activeRegion.accent }}
                >
                  {activeRegion.icon}
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-base leading-tight">{activeDest.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{activeRegion.name} · {activeAttractions.length} 个景点</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-3">
                {activeDest.description}
              </p>

              <button
                onClick={() => navigate(`/destination/${activeDest.id}`)}
                className="w-full py-2.5 rounded-xl text-white text-sm font-semibold mb-4 shadow-sm hover:shadow-md transition-all"
                style={{ backgroundColor: activeRegion.accent }}
              >
                进入 {activeDest.name} →
              </button>

              <div className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase mb-2 px-1">
                热门景点
              </div>
              <div className="space-y-0.5 max-h-56 overflow-y-auto -mx-1 px-1">
                {activeAttractions.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => navigate(`/attraction/${a.id}?from=${activeDest.id}`)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors group block"
                  >
                    <div className="text-sm text-slate-700 group-hover:text-slate-900 truncate font-medium">
                      {a.name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{a.type}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 11a3 3 0 106 0 3 3 0 00-6 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-600 mb-1">悬停地图区域</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  查看每个目的地的<br />景点列表与详情
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-slate-700">9</div>
                  <div className="text-[10px] text-slate-400">区域</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-700">86</div>
                  <div className="text-[10px] text-slate-400">景点</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-700">9</div>
                  <div className="text-[10px] text-slate-400">类型</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-5 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-gradient-to-br from-emerald-100 to-emerald-200 border border-emerald-300/60 inline-block" />
          目的地区域
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-sky-300 inline-block rounded-full" />
          主要河流
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-200 border border-sky-400/50 inline-block" />
          高原湖泊
        </span>
        <span className="flex items-center gap-1.5 text-slate-500">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          点击区域 → 进入详情
        </span>
      </div>
    </div>
  );
}
