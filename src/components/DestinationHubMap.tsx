import { useMemo } from "react";
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

function pickTransport(howToGo: string): { mode: string; time: string } {
  const t = howToGo;
  if (t.includes("徒步")) return { mode: "徒步", time: extractTime(t) };
  if (t.includes("索道") || t.includes("缆车")) return { mode: "索道", time: extractTime(t) };
  if (t.includes("高铁") || t.includes("火车")) return { mode: "高铁", time: extractTime(t) };
  if (t.includes("班车") || t.includes("客运") || t.includes("大巴")) return { mode: "班车", time: extractTime(t) };
  if (t.includes("公交")) return { mode: "公交", time: extractTime(t) };
  if (t.includes("包车")) return { mode: "包车", time: extractTime(t) };
  if (t.includes("打车") || t.includes("出租")) return { mode: "打车", time: extractTime(t) };
  if (t.includes("自驾")) return { mode: "自驾", time: extractTime(t) };
  if (t.includes("骑行") || t.includes("骑车")) return { mode: "骑行", time: extractTime(t) };
  if (t.includes("步行")) return { mode: "步行", time: extractTime(t) };
  return { mode: "乘车", time: extractTime(t) };
}

function extractTime(s: string): string {
  const m = s.match(/(约\s*)?(\d+\.?\d*)\s*(小时|分钟|h|min)/i);
  if (m) return m[2] + (m[3] === "分钟" || m[3] === "min" ? "分钟" : "小时");
  return "";
}

const typeStroke: Record<string, string> = {
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

const CX = 450;
const CY = 390;
const MAX_R = 330;
const MIN_R = 85;

export default function DestinationHubMap({ destination }: { destination: Destination }) {
  const navigate = useNavigate();

  const positioned = useMemo(() => {
    const items = destination.attractions.map((a) => {
      const d = haversineKm(destination.coords[0], destination.coords[1], a.coords[0], a.coords[1]);
      const b = bearing(destination.coords[0], destination.coords[1], a.coords[0], a.coords[1]);
      const { mode, time } = pickTransport(a.practical.howToGo);
      return { ...a, distanceKm: Math.round(d), bearing: b, mode, time };
    });

    const sorted = [...items].sort((a, b) => a.bearing - b.bearing);
    const maxD = Math.max(...sorted.map((a) => a.distanceKm), 1);

    const withPos = sorted.map((a) => {
      const frac = Math.sqrt(a.distanceKm / maxD);
      const r = MIN_R + frac * (MAX_R - MIN_R);
      const x = CX + r * Math.sin(a.bearing);
      const y = CY - r * Math.cos(a.bearing);
      return { ...a, x, y, r };
    });

    const result = withPos.map((a, i) => {
      let labelSide = 1;
      for (let j = 0; j < withPos.length; j++) {
        if (i === j) continue;
        const other = withPos[j];
        const dist = Math.sqrt((a.x - other.x) ** 2 + (a.y - other.y) ** 2);
        if (dist < 55 && Math.abs(a.bearing - other.bearing) < 0.3) {
          labelSide = i > j ? 1 : -1;
        }
      }
      return { ...a, labelSide };
    });

    return result;
  }, [destination]);

  return (
    <div className="w-full select-none">
      <svg viewBox="0 0 900 780" className="w-full h-auto">

        {/* Background */}
        <rect x="0" y="0" width="900" height="780" rx="24" fill="#fefdf7" />

        {/* Subtle texture lines */}
        {[0, 1, 2, 3].map(i => (
          <line key={`h-${i}`} x1="0" y1={200 + i * 150} x2="900" y2={200 + i * 150}
            stroke="#f5f3ed" strokeWidth="0.5" />
        ))}

        {/* Concentric rings */}
        {[140, 230, 340].map((rr) => (
          <circle key={rr} cx={CX} cy={CY} r={rr} fill="none"
            stroke="#e8e4dc" strokeWidth="0.9" strokeDasharray="5 6" />
        ))}

        {/* Cardinal direction labels */}
        {[
          ["北", CX, CY - 360],
          ["南", CX, CY + 360],
          ["东", CX + 360, CY],
          ["西", CX - 360, CY],
        ].map(([t, x, y]) => (
          <text key={t as string} x={x as number} y={y as number} textAnchor="middle"
            className="fill-slate-300 text-[10px] tracking-widest">
            {t as string}
          </text>
        ))}

        {/* Connection lines */}
        {positioned.map((a) => {
          const midX = (CX + a.x) / 2;
          const midY = (CY + a.y) / 2;
          const dx = a.x - CX;
          const dy = a.y - CY;
          const len = Math.sqrt(dx * dx + dy * dy);
          const bend = 28;
          const perpX = (-dy / len) * bend;
          const perpY = (dx / len) * bend;
          const cpx = midX + perpX;
          const cpy = midY + perpY;

          return (
            <g key={`line-${a.id}`}>
              {/* Shadow line */}
              <path
                d={`M ${CX} ${CY} Q ${cpx} ${cpy} ${a.x} ${a.y}`}
                fill="none" stroke="#fca5a5" strokeWidth="3"
                strokeLinecap="round" opacity="0.3"
              />
              {/* Main line */}
              <path
                d={`M ${CX} ${CY} Q ${cpx} ${cpy} ${a.x} ${a.y}`}
                fill="none" stroke="#e04b3d" strokeWidth="1.8"
                strokeLinecap="round" strokeDasharray={a.mode === "徒步" ? "7 5" : "none"}
                opacity="0.7"
              />
              {/* Distance pill */}
              <g>
                <rect x={cpx - 34} y={cpy - 15} width="68" height="28" rx="14" ry="14"
                  fill="white" stroke="#e04b3d" strokeWidth="1.1"
                  filter="url(#pillShadow)" />
                <text x={cpx} y={cpy + 4} textAnchor="middle"
                  className="fill-red-600 text-[11px] font-bold">
                  {a.distanceKm} km
                </text>
              </g>
            </g>
          );
        })}

        {/* Attraction nodes */}
        {positioned.map((a) => {
          const labelY = a.y + (26 * a.labelSide);
          const subY = a.y + (41 * a.labelSide);
          const anchor = a.labelSide > 0 ? "hanging" : "baseline";
          return (
            <g key={`node-${a.id}`}
              className="cursor-pointer group"
              onClick={() => navigate(`/attraction/${a.id}?from=${destination.id}`)}>

              {/* Hover glow */}
              <circle cx={a.x} cy={a.y} r="16" fill="transparent"
                className="group-hover:fill-red-50/60 transition-all duration-200" />

              {/* Outer ring */}
              <circle cx={a.x} cy={a.y} r="12" fill="white"
                stroke={typeStroke[a.type] || "#94a3b8"}
                strokeWidth="2.2"
                className="transition-all duration-200 group-hover:stroke-[3]" />

              {/* Inner dot */}
              <circle cx={a.x} cy={a.y} r="6"
                fill={typeStroke[a.type] || "#94a3b8"}
                className="transition-all duration-200" />

              {/* Name */}
              <text x={a.x} y={labelY} textAnchor="middle"
                dominantBaseline={anchor as any}
                className="fill-slate-700 text-[12px] font-semibold pointer-events-none
                  group-hover:fill-emerald-700 transition-colors"
                style={{ textShadow: "0 0 6px white, 0 0 6px white" }}>
                {a.name}
              </text>

              {/* Transport info */}
              <text x={a.x} y={subY} textAnchor="middle"
                dominantBaseline={anchor as any}
                className="fill-slate-400 text-[9px] pointer-events-none"
                style={{ textShadow: "0 0 4px white" }}>
                {a.mode}{a.time ? ` · ${a.time}` : ""}
              </text>
            </g>
          );
        })}

        {/* Center hub */}
        <circle cx={CX} cy={CY} r="52" fill="#fef2f2" opacity="0.8" />
        <circle cx={CX} cy={CY} r="36" fill="white" stroke="#e04b3d" strokeWidth="3" />
        <circle cx={CX} cy={CY} r="8" fill="#e04b3d" />
        <circle cx={CX} cy={CY} r="3" fill="white" />

        <text x={CX} y={CY - 56} textAnchor="middle"
          className="fill-slate-800 text-[22px] font-extrabold pointer-events-none tracking-wide">
          {destination.name}
        </text>
        <text x={CX} y={CY - 35} textAnchor="middle"
          className="fill-slate-400 text-[11px] pointer-events-none">
          {destination.region} · {destination.attractions.length} 个探索点
        </text>

        {/* Description below center */}
        <text x={CX} y={CY + 66} textAnchor="middle"
          className="fill-slate-300 text-[9px] pointer-events-none max-w-[200px]">
          点击节点探索详情
        </text>

        {/* Legend */}
        <g transform="translate(680, 720)">
          <line x1="0" y1="0" x2="28" y2="0" stroke="#e04b3d" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
          <circle cx="28" cy="0" r="4.5" fill="white" stroke="#e04b3d" strokeWidth="1.6" />
          <text x="40" y="4.5" className="fill-slate-400 text-[10px]">路线距离</text>
        </g>

        {/* Drop shadow filter */}
        <defs>
          <filter id="pillShadow" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#00000015" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
