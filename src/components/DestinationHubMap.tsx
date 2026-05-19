import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Destination } from "../data/index";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function bearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const lat1r = (lat1 * Math.PI) / 180;
  const lat2r = (lat2 * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2r);
  const x = Math.cos(lat1r) * Math.sin(lat2r) - Math.sin(lat1r) * Math.cos(lat2r) * Math.cos(dLng);
  return Math.atan2(y, x);
}

const typeColors: Record<string, string> = {
  "国家级景区": "#3b82f6",
  "徒步路线": "#f97316",
  "野生秘境": "#10b981",
  "古镇村落": "#f59e0b",
  "湖泊雪山": "#06b6d4",
  "温泉湿地": "#14b8a6",
  "文化遗迹": "#8b5cf6",
  "峡谷江河": "#6366f1",
  "观景台": "#ec4899",
};

const typeIcons: Record<string, string> = {
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

function pickTransport(howToGo: string): string {
  const t = howToGo;
  if (t.includes("徒步")) return "徒步";
  if (t.includes("索道") || t.includes("缆车")) return "索道";
  if (t.includes("高铁") || t.includes("火车")) return "高铁";
  if (t.includes("班车") || t.includes("客运") || t.includes("大巴")) return "班车";
  if (t.includes("公交")) return "公交";
  if (t.includes("包车")) return "包车";
  if (t.includes("打车") || t.includes("出租")) return "打车";
  if (t.includes("自驾")) return "自驾";
  if (t.includes("骑行")) return "骑行";
  if (t.includes("步行")) return "步行";
  return "乘车";
}

function extractTime(s: string): string {
  const m = s.match(/(约\s*)?(\d+\.?\d*)\s*(小时|分钟|h|min)/i);
  if (m) return m[2] + (m[3] === "分钟" || m[3] === "min" ? "分钟" : "小时");
  return "";
}

export default function DestinationHubMap({ destination }: { destination: Destination }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const navigate = useNavigate();

  const positioned = useMemo(() => {
    const items = destination.attractions.map((a) => {
      const d = haversineKm(destination.coords[0], destination.coords[1], a.coords[0], a.coords[1]);
      const b = bearing(destination.coords[0], destination.coords[1], a.coords[0], a.coords[1]);
      return { ...a, distanceKm: Math.round(d), bearing: b, transport: pickTransport(a.practical.howToGo), travelTime: extractTime(a.practical.howToGo) };
    });

    const sorted = [...items].sort((a, b) => a.bearing - b.bearing);
    const maxD = Math.max(...sorted.map((a) => a.distanceKm), 1);

    return sorted.map((a) => {
      const frac = Math.sqrt(a.distanceKm / maxD);
      const MIN_R = 118;
      const MAX_R = 270;
      const r = MIN_R + frac * (MAX_R - MIN_R);
      const CX = 460;
      const CY = 340;
      const x = CX + r * Math.sin(a.bearing);
      const y = CY - r * Math.cos(a.bearing);
      return { ...a, x, y };
    });
  }, [destination]);

  return (
    <div className="flex flex-col gap-6">
      {/* ====== Compact Position Map (no lines, no labels, just dots) ====== */}
      <div className="bg-gradient-to-b from-[#fefdf7] to-[#faf8f0] rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 pt-4 pb-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-xs font-semibold text-slate-600">景点方位图</span>
            <span className="text-[10px] text-slate-400">· 距{ destination.name }中心的方位与距离</span>
          </div>
          {hoveredId && (
            <span className="text-xs font-medium text-slate-700 bg-white/80 border border-slate-200 rounded-full px-3 py-1">
              {destination.attractions.find((a) => a.id === hoveredId)?.name}
            </span>
          )}
        </div>
        <svg viewBox="0 0 920 680" className="w-full h-auto max-h-[360px]">
          <defs>
            <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#00000030" />
            </filter>
          </defs>

          {/* Concentric distance rings */}
          {[80, 160, 250, 340].map((r) => (
            <circle key={r} cx={460} cy={340} r={r} fill="none" stroke="#e8e4dc" strokeWidth={0.8} strokeDasharray="4 5" />
          ))}

          {/* Ring distance labels */}
          <text x={460} y={340 - 250 - 6} textAnchor="middle" className="fill-slate-300 text-[9px]">远</text>
          <text x={460} y={340 - 80 - 8} textAnchor="middle" className="fill-slate-300 text-[9px]">近</text>

          {/* Cardinal markers */}
          {[
            ["北", 460, 340 - 355],
            ["南", 460, 340 + 355],
            ["东", 460 + 355, 340],
            ["西", 460 - 355, 340],
          ].map(([t, x, y]) => (
            <text key={t as string} x={x as number} y={y as number} textAnchor="middle" className="fill-slate-300 text-[9px] tracking-widest">
              {t as string}
            </text>
          ))}

          {/* Attraction dots */}
          {positioned.map((a) => {
            const isHovered = a.id === hoveredId;
            const color = typeColors[a.type] || "#94a3b8";
            return (
              <g key={a.id} style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredId(a.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate(`/attraction/${a.id}?from=${destination.id}`)}
              >
                {/* Hover glow ring */}
                {isHovered && (
                  <circle cx={a.x} cy={a.y} r={18} fill="none" stroke={color} strokeWidth={1.5} opacity={0.3}>
                    <animate attributeName="r" from={18} to={24} dur="0.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from={0.3} to={0} dur="0.8s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Dot */}
                <circle cx={a.x} cy={a.y} r={isHovered ? 8 : 5.5} fill={color} filter="url(#dotGlow)" opacity={isHovered ? 1 : 0.75} />
              </g>
            );
          })}

          {/* Center hub */}
          <circle cx={460} cy={340} r={48} fill="#fef2f2" opacity={0.7} />
          <circle cx={460} cy={340} r={32} fill="white" stroke="#e04b3d" strokeWidth={2.5} />
          <circle cx={460} cy={340} r={7} fill="#e04b3d" />
          <circle cx={460} cy={340} r={2.5} fill="white" />
          <text x={460} y={340 - 44} textAnchor="middle" className="fill-slate-800 text-[18px] font-extrabold tracking-wide">
            {destination.name}
          </text>
          <text x={460} y={340 + 55} textAnchor="middle" className="fill-slate-400 text-[10px]">
            {destination.attractions.length} 个景点
          </text>
        </svg>
      </div>

      {/* ====== Attraction Cards Grid ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {positioned.map((a) => {
          const color = typeColors[a.type] || "#94a3b8";
          const isHovered = a.id === hoveredId;
          return (
            <button
              key={a.id}
              onClick={() => navigate(`/attraction/${a.id}?from=${destination.id}`)}
              onMouseEnter={() => setHoveredId(a.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group text-left flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
                isHovered
                  ? "border-slate-300 bg-white shadow-md -translate-y-0.5"
                  : "border-slate-100 bg-white/80 hover:border-slate-200 hover:bg-white hover:shadow-sm"
              }`}
            >
              {/* Type dot + distance on the left */}
              <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: color + "15", color }}>
                  {typeIcons[a.type] || "•"}
                </div>
                <span className="text-[10px] font-semibold text-slate-500">{a.distanceKm}km</span>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-slate-800 truncate group-hover:text-emerald-700 transition-colors">
                    {a.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0 border"
                    style={{ backgroundColor: color + "12", color, borderColor: color + "30" }}>
                    {a.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-1.5">{a.oneLiner}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span>🚗</span> {a.transport}
                  </span>
                  {a.travelTime && (
                    <>
                      <span>·</span>
                      <span>⏱ {a.travelTime}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <span className="shrink-0 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all mt-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend strip */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 px-1">
        <span className="text-slate-500 font-medium">景点类型：</span>
        {Object.entries(typeColors).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
