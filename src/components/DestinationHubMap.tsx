import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Destination } from "../data/index";

const typeColors: Record<string, string> = {
  "国家级景区": "#3b82f6", "徒步路线": "#f97316", "野生秘境": "#10b981",
  "古镇村落": "#f59e0b", "湖泊雪山": "#06b6d4", "温泉湿地": "#14b8a6",
  "文化遗迹": "#8b5cf6", "峡谷江河": "#6366f1", "观景台": "#ec4899",
};

const typeIcons: Record<string, string> = {
  "国家级景区": "★", "徒步路线": "↗", "野生秘境": "❀", "古镇村落": "▦",
  "湖泊雪山": "▲", "温泉湿地": "♨", "文化遗迹": "❖", "峡谷江河": "～", "观景台": "◎",
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function DestinationHubMap({ destination }: { destination: Destination }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { projected, bbox } = useMemo(() => {
    const allPts = [destination.coords, ...destination.attractions.map((a) => a.coords)];
    const minLon = Math.min(...allPts.map((p) => p[1])) - 0.04;
    const maxLon = Math.max(...allPts.map((p) => p[1])) + 0.04;
    const minLat = Math.min(...allPts.map((p) => p[0])) - 0.03;
    const maxLat = Math.max(...allPts.map((p) => p[0])) + 0.03;

    const W = 900, H = 660;
    const pad = 60;
    const midLat = (minLat + maxLat) / 2;
    const cos = Math.cos((midLat * Math.PI) / 180);
    const lonSpan = (maxLon - minLon) * cos;
    const latSpan = maxLat - minLat;
    const scale = Math.min((W - pad * 2) / lonSpan, (H - pad * 2) / latSpan);
    const projW = lonSpan * scale;
    const projH = latSpan * scale;
    const offX = (W - projW) / 2;
    const offY = (H - projH) / 2;

    const project = (lon: number, lat: number) => ({
      x: offX + (lon - minLon) * cos * scale,
      y: offY + (maxLat - lat) * scale,
    });

    const center = project(destination.coords[1], destination.coords[0]);
    const attractions = destination.attractions.map((a) => {
      const pos = project(a.coords[1], a.coords[0]);
      const km = Math.round(haversineKm(destination.coords[0], destination.coords[1], a.coords[0], a.coords[1]));
      return { ...a, x: pos.x, y: pos.y, km };
    });

    // Resolve label overlaps: assign each label a side (left of dot, right of dot)
    const resolveLabel = (items: typeof attractions) => {
      const result = items.map((a, i) => {
        let side: "right" | "left" = i % 2 === 0 ? "right" : "left";
        // Check proximity to other items
        for (let j = 0; j < items.length; j++) {
          if (i === j) continue;
          const dx = a.x - items[j].x;
          const dy = a.y - items[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60 && Math.abs(dy) < 50) {
            side = a.y > items[j].y ? "right" : "left";
          }
        }
        // Keep labels away from edges
        if (a.x < 180) side = "right";
        if (a.x > W - 180) side = "left";
        return { ...a, labelSide: side };
      });
      return result;
    };

    return {
      projected: { center, attractions: resolveLabel(attractions) },
      bbox: { minLon, maxLon, minLat, maxLat },
    };
  }, [destination]);

  const { center, attractions } = projected;

  return (
    <div className="flex flex-col gap-4">
      {/* === Map SVG === */}
      <div className="rounded-2xl border border-slate-200 bg-[#fdfdf7] overflow-hidden shadow-md">
        <svg viewBox="0 0 900 660" className="w-full h-auto max-h-[580px]">
          <defs>
            {/* Terrain gradient */}
            <linearGradient id="terrainBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#f1f5e8" />
            </linearGradient>
            {/* River gradient */}
            <linearGradient id="rivGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="50%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            {/* Label glow */}
            <filter id="labelBg" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="0.5" stdDeviation="1.5" floodColor="#1e293b" floodOpacity="0.15" />
            </filter>
            {/* Dot glow */}
            <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#00000030" />
            </filter>
            {/* Mountain symbol */}
            <symbol id="mountain" viewBox="0 0 24 24">
              <path d="M2 20L10 8l5 7 4-5 3 10H2z" fill="none" stroke="#94a3b8" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
            </symbol>
          </defs>

          {/* Background */}
          <rect x={0} y={0} width={900} height={660} fill="url(#terrainBg)" rx={16} />

          {/* Decorative elevation contour lines */}
          {[0.25, 0.5, 0.75].map((frac) => (
            <ellipse key={frac} cx={450} cy={330} rx={200 + frac * 180} ry={140 + frac * 140}
              fill="none" stroke="#cbd5e1" strokeWidth={0.4} strokeDasharray="6 8" opacity={0.5} />
          ))}

          {/* Decorative mountain silhouettes in background */}
          <g opacity={0.12}>
            <path d="M 60,540 L 100,460 L 130,500 L 165,420 L 200,490 L 240,440 L 280,510 L 320,450 L 360,500 L 400,430 L 440,490 L 480,460 L 520,510 L 560,440 L 600,490 L 640,450 L 680,500 L 720,430 L 760,490 L 800,460 L 840,530 L 840,660 L 60,660 Z"
              fill="#10b981" />
          </g>

          {/* Connection lines: center → each attraction */}
          {attractions.map((a) => {
            const isActive = a.id === activeId;
            const color = typeColors[a.type] || "#94a3b8";
            return (
              <g key={`line-${a.id}`}>
                {/* Subtle route line */}
                <path
                  d={`M ${center.x} ${center.y} L ${a.x} ${a.y}`}
                  fill="none" stroke={isActive ? color : "#cbd5e1"}
                  strokeWidth={isActive ? 1.5 : 0.7}
                  strokeDasharray={isActive ? "none" : "3 4"}
                  opacity={isActive ? 0.8 : 0.5}
                  strokeLinecap="round"
                />
                {/* Distance badge on midpoint */}
                {isActive && (
                  <g>
                    <rect
                      x={(center.x + a.x) / 2 - 18}
                      y={(center.y + a.y) / 2 - 11}
                      width={36} height={22} rx={11} ry={11}
                      fill="white" stroke={color} strokeWidth={1}
                      filter="url(#labelBg)"
                    />
                    <text
                      x={(center.x + a.x) / 2} y={(center.y + a.y) / 2 + 4}
                      textAnchor="middle" fontSize={10} fontWeight={700} fill={color}
                    >
                      {a.km}km
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Attraction nodes */}
          {attractions.map((a) => {
            const isActive = a.id === activeId;
            const color = typeColors[a.type] || "#94a3b8";
            const icon = typeIcons[a.type] || "•";
            const lx = a.labelSide === "right" ? a.x + 16 : a.x - 16;
            const ly = a.y - 6;
            const textAnchor = a.labelSide === "right" ? "start" : "end";
            const leaderX = a.labelSide === "right" ? a.x + 8 : a.x - 8;

            return (
              <g key={a.id} style={{ cursor: "pointer" }}
                onMouseEnter={() => setActiveId(a.id)}
                onMouseLeave={() => setActiveId(null)}
                onClick={() => navigate(`/attraction/${a.id}?from=${destination.id}`)}
              >
                {/* Hover ring pulse */}
                {isActive && (
                  <circle cx={a.x} cy={a.y} r={16} fill="none" stroke={color} strokeWidth={1.5} opacity={0.3}>
                    <animate attributeName="r" from={16} to={22} dur="0.7s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from={0.4} to={0} dur="0.7s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Outer dot ring */}
                <circle cx={a.x} cy={a.y} r={isActive ? 9 : 7}
                  fill="white" stroke={color} strokeWidth={2} filter="url(#dotGlow)" />

                {/* Inner dot */}
                <circle cx={a.x} cy={a.y} r={isActive ? 4.5 : 3.5} fill={color} />

                {/* Leader line to label */}
                {isActive && (
                  <line x1={a.x} y1={a.y} x2={leaderX} y2={ly} stroke={color} strokeWidth={0.6} opacity={0.7} />
                )}

                {/* Label pill (only when active) */}
                {isActive && (
                  <g>
                    <rect
                      x={a.labelSide === "right" ? lx : lx - (a.name.length * 7 + 21)}
                      y={ly - 12}
                      width={a.name.length * 7 + 21}
                      height={24}
                      rx={12} ry={12}
                      fill="white" stroke={color} strokeWidth={1}
                      filter="url(#labelBg)"
                    />
                    <text x={lx + (a.labelSide === "right" ? 10 : -10)} y={ly + 4}
                      textAnchor={textAnchor} fontSize={11} fontWeight={700} fill="#1e293b">
                      {icon} {a.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Center hub — destination */}
          <g>
            <circle cx={center.x} cy={center.y} r={38} fill="#fef2f2" opacity={0.6} />
            <circle cx={center.x} cy={center.y} r={26} fill="white" stroke="#64748b" strokeWidth={2.2} />
            <circle cx={center.x} cy={center.y} r={5} fill="#64748b" />
            <text x={center.x} y={center.y - 36} textAnchor="middle" fontSize={16} fontWeight={800} fill="#1e293b" letterSpacing={1}>
              {destination.name}
            </text>
            <text x={center.x} y={center.y + 46} textAnchor="middle" fontSize={9} fill="#94a3b8">
              枢纽 · {destination.attractions.length} 景点
            </text>
          </g>

          {/* Scale bar */}
          <g transform="translate(30, 630)">
            <line x1={0} y1={0} x2={100} y2={0} stroke="#94a3b8" strokeWidth={1.5} />
            <line x1={0} y1={-4} x2={0} y2={4} stroke="#94a3b8" strokeWidth={1} />
            <line x1={50} y1={-3} x2={50} y2={3} stroke="#94a3b8" strokeWidth={0.8} />
            <line x1={100} y1={-4} x2={100} y2={4} stroke="#94a3b8" strokeWidth={1} />
            <text x={0} y={12} textAnchor="middle" fontSize={8} fill="#94a3b8">0</text>
            <text x={100} y={12} textAnchor="middle" fontSize={8} fill="#94a3b8">
              {Math.round(
                (bbox.maxLon - bbox.minLon) * 111 * Math.cos(((bbox.minLat + bbox.maxLat) / 2) * Math.PI / 180) * 100
              ) / 100 * 10} km
            </text>
          </g>

          {/* Compass */}
          <g transform="translate(850, 45)">
            <circle cx={0} cy={0} r={22} fill="white" fillOpacity={0.7} stroke="#cbd5e1" strokeWidth={0.7} />
            <polygon points="0,-16 3,-4 0,-6 -3,-4" fill="#ef4444" />
            <polygon points="0,16 3,4 0,6 -3,4" fill="#94a3b8" />
            <polygon points="-16,0 -4,3 -6,0 -4,-3" fill="#94a3b8" />
            <polygon points="16,0 4,3 6,0 4,-3" fill="#94a3b8" />
            <circle cx={0} cy={0} r={3} fill="white" stroke="#64748b" strokeWidth={0.5} />
            <text x={0} y={-19} textAnchor="middle" fontSize={6} fontWeight={700} fill="#ef4444">N</text>
          </g>

          {/* Legend */}
          <g transform="translate(30, 30)">
            {Object.entries(typeColors).slice(0, 5).map(([type, color], i) => (
              <g key={type} transform={`translate(0, ${i * 18})`}>
                <circle cx={5} cy={5} r={4} fill={color} opacity={0.8} />
                <text x={14} y={9} fontSize={8} fill="#64748b">{type}</text>
              </g>
            ))}
          </g>
          <g transform="translate(170, 30)">
            {Object.entries(typeColors).slice(5).map(([type, color], i) => (
              <g key={type} transform={`translate(0, ${i * 18})`}>
                <circle cx={5} cy={5} r={4} fill={color} opacity={0.8} />
                <text x={14} y={9} fontSize={8} fill="#64748b">{type}</text>
              </g>
            ))}
          </g>

          {/* Info tip */}
          <text x={830} y={635} textAnchor="end" fontSize={9} fill="#94a3b8">
            悬停景点查看详情
          </text>
        </svg>
      </div>

      {/* === Active Attraction Detail Card === */}
      {activeId && (() => {
        const a = attractions.find((x) => x.id === activeId)!;
        const color = typeColors[a.type] || "#94a3b8";
        return (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
            <div className="h-1.5 w-full" style={{ backgroundColor: color }} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm px-2 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: color + "15", color }}>
                      {typeIcons[a.type]} {a.type}
                    </span>
                    <span className="text-[11px] text-slate-400">距{ destination.name }{ a.km }km</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800 mb-1">{a.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{a.oneLiner}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {a.tags.map((t) => (
                      <span key={t} className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">#{t}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/attraction/${a.id}?from=${destination.id}`)}
                  className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: color }}
                >
                  查看详情 →
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
