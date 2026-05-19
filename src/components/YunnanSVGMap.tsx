import { useState } from "react";
import { useNavigate } from "react-router-dom";
import destinations from "../data/index";
import prefectures, { VIEWBOX_W, VIEWBOX_H } from "../data/yunnanGeo";

const destById = Object.fromEntries(destinations.map((d) => [d.id, d]));
const countByAdcode = Object.fromEntries(
  prefectures.map((p) => {
    const dest = p.destinationId ? destById[p.destinationId] : null;
    return [p.adcode, dest ? dest.attractions.length : 0] as const;
  })
);

const nameById: Record<string, string> = {
  kunming: "昆明", lijiang: "丽江", dali: "大理", shangrila: "香格里拉",
  nujiang: "怒江", tengchong: "腾冲", puer: "普洱", xishuangbanna: "西双版纳", honghe: "红河",
};

export default function YunnanSVGMap() {
  const [active, setActive] = useState<string | null>(null);
  const navigate = useNavigate();

  const activeFeat = prefectures.find((p) => p.adcode === active);
  const activeDest = activeFeat?.destinationId ? destById[activeFeat.destinationId] : null;
  const activeCount = active ? (countByAdcode[active] ?? 0) : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* ======== SVG Map Panel ======== */}
      <div className="flex-1 min-w-0">
        <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} className="w-full h-auto max-h-[70vh]">
          <defs>
            {prefectures.filter((p) => p.palette).map((p) => (
              <linearGradient key={`g-${p.adcode}`} id={`grad-${p.adcode}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={p.palette!.c1} />
                <stop offset="100%" stopColor={p.palette!.c2} />
              </linearGradient>
            ))}
            {prefectures.filter((p) => p.palette).map((p) => (
              <linearGradient key={`hg-${p.adcode}`} id={`hgrad-${p.adcode}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={p.palette!.c2} />
                <stop offset="100%" stopColor={p.palette!.accent} stopOpacity={0.5} />
              </linearGradient>
            ))}
            <filter id="outlineShadow" x="-2%" y="-2%" width="104%" height="104%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#475569" floodOpacity="0.25" />
            </filter>
            <filter id="glow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.35" />
            </filter>
            <filter id="pillShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#1e293b" floodOpacity="0.25" />
            </filter>
            <linearGradient id="paperGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#FFF7ED" />
            </linearGradient>
            <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="50%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <radialGradient id="lakeGrad" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </radialGradient>
            <filter id="riverGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#3b82f6" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Paper background */}
          <rect x={0} y={0} width={VIEWBOX_W} height={VIEWBOX_H} fill="url(#paperGrad)" rx={8} />

          {/* All prefectures */}
          {prefectures.map((p) => {
            const isActive = p.adcode === active;
            const hasDest = Boolean(p.destinationId);
            return (
              <g key={p.adcode} className="cursor-pointer group">
                {/* Invisible larger hit area */}
                <path
                  d={p.path}
                  fill="transparent"
                  stroke="transparent"
                  strokeWidth={10}
                  className="pointer-events-auto"
                  onMouseEnter={() => hasDest && setActive(p.adcode)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => {
                    if (hasDest && p.destinationId) {
                      navigate(`/destination/${p.destinationId}`);
                    }
                  }}
                />
                {/* Visible fill */}
                <path
                  d={p.path}
                  fill={isActive && hasDest ? `url(#hgrad-${p.adcode})` : hasDest ? `url(#grad-${p.adcode})` : "#f1f5f9"}
                  stroke={isActive && hasDest ? p.palette!.accent : hasDest ? "#cbd5e1" : "#e2e8f0"}
                  strokeWidth={isActive && hasDest ? 2 : 0.8}
                  strokeLinejoin="round"
                  filter={isActive && hasDest ? "url(#glow)" : "none"}
                  className="transition-all duration-200"
                  style={{ pointerEvents: "none" }}
                />
              </g>
            );
          })}

          {/* Province outline over everything */}
          <path d={prefectures.map((p) => p.path).join(" ")} fill="none" stroke="#475569" strokeWidth={1.4} strokeLinejoin="round" opacity={0.35} filter="url(#outlineShadow)" style={{ pointerEvents: "none" }} />

          {/* Simplified three rivers */}
          <g style={{ pointerEvents: "none" }} opacity={0.65}>
            <path d="M 180,90 Q 260,80 330,95 Q 400,105 460,130" fill="none" stroke="url(#riverGrad)" strokeWidth={2.2} strokeLinecap="round" filter="url(#riverGlow)" />
            <text x={315} y={85} fill="#1e40af" fontSize={9} fontStyle="italic" fontWeight={600} textAnchor="middle">金沙江</text>
            <path d="M 135,85 Q 155,150 165,220 Q 175,300 190,380 Q 200,430 195,490" fill="none" stroke="url(#riverGrad)" strokeWidth={2.2} strokeLinecap="round" filter="url(#riverGlow)" />
            <text x={190} y={260} fill="#1e40af" fontSize={9} fontStyle="italic" fontWeight={600} textAnchor="middle" transform="rotate(-10, 190, 260)">澜沧江</text>
            <path d="M 75,85 Q 90,150 95,220 Q 100,300 105,380 Q 108,440 115,510" fill="none" stroke="url(#riverGrad)" strokeWidth={2.2} strokeLinecap="round" filter="url(#riverGlow)" />
            <text x={78} y={280} fill="#1e40af" fontSize={9} fontStyle="italic" fontWeight={600} textAnchor="middle" transform="rotate(-5, 78, 280)">怒江</text>
            <ellipse cx={435} cy={182} rx={18} ry={11} fill="url(#lakeGrad)" stroke="#0ea5e9" strokeWidth={0.8} />
            <text x={435} y={185} fill="#0369a1" fontSize={6.5} fontWeight={600} textAnchor="middle" dominantBaseline="middle">滇池</text>
            <ellipse cx={180} cy={218} rx={9} ry={14} fill="url(#lakeGrad)" stroke="#0ea5e9" strokeWidth={0.8} transform="rotate(-10, 180, 218)" />
            <text x={180} y={221} fill="#0369a1" fontSize={6.5} fontWeight={600} textAnchor="middle" dominantBaseline="middle">洱海</text>
          </g>

          {/* Region labels */}
          {prefectures.filter((p) => p.destinationId).map((p) => (
            <g key={`label-${p.adcode}`} style={{ pointerEvents: "none" }}>
              <rect x={p.labelX - 24} y={p.labelY - 10} width={48} height={20} rx={10} ry={10} fill="white" fillOpacity={0.85} stroke={p.palette!.accent} strokeWidth={0.8} filter="url(#pillShadow)" />
              <text x={p.labelX} y={p.labelY + 4.5} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1e293b">
                {p.icon} {nameById[p.destinationId!] || p.name}
              </text>
            </g>
          ))}

          {/* Count badges */}
          {prefectures.filter((p) => p.destinationId).map((p) => {
            const count = countByAdcode[p.adcode] ?? 0;
            return (
              <g key={`badge-${p.adcode}`} style={{ pointerEvents: "none" }}>
                <circle cx={p.labelX + 28} cy={p.labelY - 11} r={8} fill={p.palette!.accent} opacity={0.9} />
                <text x={p.labelX + 28} y={p.labelY - 8} textAnchor="middle" fontSize={7.5} fontWeight={700} fill="white">{count}</text>
              </g>
            );
          })}

          {/* Compass Rose */}
          <g transform="translate(710, 45)" style={{ pointerEvents: "none" }}>
            <circle cx={0} cy={0} r={30} fill="white" fillOpacity={0.7} stroke="#cbd5e1" strokeWidth={0.8} />
            <polygon points="0,-24 4,-6 0,-8 -4,-6" fill="#ef4444" />
            <polygon points="0,24 4,6 0,8 -4,6" fill="#94a3b8" />
            <polygon points="-24,0 -6,4 -8,0 -6,-4" fill="#94a3b8" />
            <polygon points="24,0 6,4 8,0 6,-4" fill="#94a3b8" />
            <circle cx={0} cy={0} r={4} fill="white" stroke="#64748b" strokeWidth={0.6} />
            <text x={0} y={-28} textAnchor="middle" fontSize={6} fontWeight={700} fill="#ef4444">N</text>
            <text x={0} y={32} textAnchor="middle" fontSize={5.5} fill="#64748b">S</text>
            <text x={30} y={3.5} textAnchor="middle" fontSize={5.5} fill="#64748b">E</text>
            <text x={-30} y={3.5} textAnchor="middle" fontSize={5.5} fill="#64748b">W</text>
          </g>

          {/* Title cartouche */}
          <g transform="translate(15, 568)" style={{ pointerEvents: "none" }}>
            <rect x={0} y={0} width={200} height={26} rx={6} ry={6} fill="white" fillOpacity={0.8} stroke="#cbd5e1" strokeWidth={0.6} />
            <text x={12} y={17} fontSize={12} fontWeight={800} fill="#1e293b">
              云南 YUNNAN
              <tspan fill="#64748b" fontWeight={500} fontSize={9}> · 16 地州 · 9 区域 · 86 景点</tspan>
            </text>
          </g>

          {/* Neighbor labels */}
          <g style={{ pointerEvents: "none" }} opacity={0.4}>
            <text x={100} y={22} fontSize={10} fontWeight={600} fill="#1e293b" letterSpacing={2}>西藏</text>
            <text x={50} y={590} fontSize={10} fontWeight={600} fill="#1e293b" letterSpacing={2}>缅甸</text>
            <text x={680} y={390} fontSize={10} fontWeight={600} fill="#1e293b" letterSpacing={2}>越南</text>
            <text x={720} y={270} fontSize={10} fontWeight={600} fill="#1e293b" letterSpacing={2}>贵州</text>
            <text x={300} y={22} fontSize={10} fontWeight={600} fill="#1e293b" letterSpacing={2}>四川</text>
            <text x={720} y={580} fontSize={10} fontWeight={600} fill="#1e293b" letterSpacing={2}>老挝</text>
          </g>

          {/* Legend */}
          <g transform="translate(590, 555)" style={{ pointerEvents: "none" }}>
            <rect x={0} y={0} width={195} height={38} rx={5} ry={5} fill="white" fillOpacity={0.8} stroke="#e2e8f0" strokeWidth={0.5} />
            <path d="M 8,12 L 20,12" fill="none" stroke="#475569" strokeWidth={1.2} strokeLinecap="round" />
            <text x={25} y={15} fontSize={7} fill="#64748b">省界</text>
            <path d="M 65,12 L 77,12" fill="none" stroke="url(#riverGrad)" strokeWidth={1.5} strokeLinecap="round" />
            <text x={82} y={15} fontSize={7} fill="#64748b">河流</text>
            <ellipse cx={138} cy={12} rx={6} ry={3.5} fill="url(#lakeGrad)" stroke="#0ea5e9" strokeWidth={0.4} />
            <text x={148} y={15} fontSize={7} fill="#64748b">湖泊</text>
            <circle cx={8} cy={30} r={5} fill="url(#grad-530700)" stroke="#3b82f6" strokeWidth={0.6} />
            <text x={18} y={33} fontSize={7} fill="#64748b">悬停点击</text>
            <rect x={90} y={25.5} width={28} height={9} rx={4.5} ry={4.5} fill="white" fillOpacity={0.85} stroke="#3b82f6" strokeWidth={0.5} />
            <text x={104} y={32.5} textAnchor="middle" fontSize={6} fontWeight={700} fill="#1e293b">▲ 丽江</text>
          </g>
        </svg>
      </div>

      {/* ======== Sidebar ======== */}
      <div className="w-full lg:w-72 shrink-0">
        {activeDest ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
            <div className="h-2 w-full" style={{ backgroundColor: activeFeat?.palette?.accent || "#64748b" }} />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-lg shadow-sm">
                  {activeFeat?.icon || "•"}
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800">{activeDest.name}</h3>
                  <p className="text-[11px] text-slate-400">
                    {activeFeat?.name} · {activeCount} 个景点
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {activeDest.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {activeDest.attractions.slice(0, 6).map((a) => (
                  <span key={a.id} className="text-[11px] bg-slate-50 border border-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {a.name}
                  </span>
                ))}
                {activeDest.attractions.length > 6 && (
                  <span className="text-[11px] text-slate-400 px-2 py-1">
                    +{activeDest.attractions.length - 6} 更多
                  </span>
                )}
              </div>

              <button
                onClick={() => navigate(`/destination/${activeDest.id}`)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors hover:opacity-90 shadow-sm"
                style={{ backgroundColor: activeFeat?.palette?.accent || "#64748b" }}
              >
                探索 {activeDest.name}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400" />
            <div className="p-5 text-center">
              <div className="text-3xl mb-2">🗺️</div>
              <h3 className="text-sm font-semibold text-slate-700 mb-1">云南互动地图</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                悬停地州查看目的地信息，点击进入详情
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-emerald-50 rounded-lg p-2">
                  <div className="text-lg font-extrabold text-emerald-700">16</div>
                  <div className="text-[10px] text-emerald-600">地州</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-2">
                  <div className="text-lg font-extrabold text-amber-700">9</div>
                  <div className="text-[10px] text-amber-600">目的地</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                  <div className="text-lg font-extrabold text-blue-700">86</div>
                  <div className="text-[10px] text-blue-600">景点</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
