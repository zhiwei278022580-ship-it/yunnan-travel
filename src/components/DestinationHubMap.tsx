import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Destination } from "../data/index";

const TYPE: Record<string, { color: string; icon: string }> = {
  "国家级景区": { color: "#2563eb", icon: "★" },
  "徒步路线":   { color: "#ea580c", icon: "↗" },
  "野生秘境":   { color: "#059669", icon: "❀" },
  "古镇村落":   { color: "#d97706", icon: "▦" },
  "湖泊雪山":   { color: "#0891b2", icon: "▲" },
  "温泉湿地":   { color: "#0d9488", icon: "♨" },
  "文化遗迹":   { color: "#7c3aed", icon: "❖" },
  "峡谷江河":   { color: "#4f46e5", icon: "～" },
  "观景台":     { color: "#db2777", icon: "◎" },
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371, dLat = ((lat2 - lat1) * Math.PI) / 180, dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function DestinationHubMap({ destination }: { destination: Destination }) {
  const navigate = useNavigate();

  const { points, center, viewBox, scaleKm } = useMemo(() => {
    const all = [destination.coords, ...destination.attractions.map((a) => a.coords)];
    const minLon = Math.min(...all.map((p) => p[1])) - 0.02;
    const maxLon = Math.max(...all.map((p) => p[1])) + 0.02;
    const minLat = Math.min(...all.map((p) => p[0])) - 0.02;
    const maxLat = Math.max(...all.map((p) => p[0])) + 0.02;

    const W = 900, H = 640, pad = 60;
    const midLat = (minLat + maxLat) / 2, cos = Math.cos((midLat * Math.PI) / 180);
    const s = Math.min((W - pad * 2) / ((maxLon - minLon) * cos), (H - pad * 2) / (maxLat - minLat));
    const ow = (W - (maxLon - minLon) * cos * s) / 2;
    const oh = (H - (maxLat - minLat) * s) / 2;
    const proj = (lon: number, lat: number) => ({ x: ow + (lon - minLon) * cos * s, y: oh + (maxLat - lat) * s });

    const c = proj(destination.coords[1], destination.coords[0]);
    const pts = destination.attractions.map((a) => {
      const p = proj(a.coords[1], a.coords[0]);
      const km = Math.round(haversineKm(destination.coords[0], destination.coords[1], a.coords[0], a.coords[1]));
      return { ...a, x: p.x, y: p.y, km, labelX: 0, labelY: 0, textAnchor: "start" as "start" | "end" | "middle" };
    });

    // Smart label placement: avoid overlaps using a greedy approach
    const placed: typeof pts = [];
    const occupied: { x: number; y: number; w: number; h: number }[] = [];
    for (const item of pts) {
      const nameW = item.name.length * 7.5 + 20;
      // Try 4 positions: right, left, top, bottom
      const positions = [
        { dx: 10, dy: -5, ta: "start" as const, sx: 0, sy: -6, lx: 0, ly: 0 },
        { dx: -10, dy: -5, ta: "end" as const, sx: -nameW, sy: -6, lx: -nameW, ly: 0 },
        { dx: 0, dy: -16, ta: "middle" as const, sx: -nameW / 2, sy: -19, lx: -nameW / 2, ly: -9 },
        { dx: 0, dy: 16, ta: "middle" as const, sx: -nameW / 2, sy: 9, lx: -nameW / 2, ly: 20 },
      ];
      let best = positions[0];
      let bestOverlap = Infinity;
      for (const pos of positions) {
        const rx = item.x + pos.sx;
        const ry = item.y + pos.sy;
        let overlap = 0;
        for (const o of occupied) {
          const ox = Math.max(rx, o.x) - Math.min(rx + nameW, o.x + o.w);
          const oy = Math.max(ry, o.y) - Math.min(ry + 14, o.y + o.h);
          if (ox < 0 && oy < 0) overlap += Math.abs(ox * oy);
        }
        if (overlap < bestOverlap) { bestOverlap = overlap; best = pos; }
      }
      const labelBox = {
        x: item.x + best.sx, y: item.y + best.sy, w: nameW, h: 16,
      };
      occupied.push(labelBox);
      placed.push({ ...item, labelX: item.x + best.sx, labelY: item.y + best.sy, textAnchor: best.ta });
    }

    // km scale
    const kmPerDeg = 111.32 * Math.cos((midLat * Math.PI) / 180);
    const kmPerPx = (maxLon - minLon) * kmPerDeg / ((maxLon - minLon) * cos * s);

    return { points: placed, center: c, viewBox: `0 0 ${W} ${H}`, scaleKm: kmPerPx };
  }, [destination]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-[#fefcf6] overflow-hidden shadow-lg">
      <svg viewBox={viewBox} className="w-full h-auto max-h-[600px]">
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fefdf9" />
            <stop offset="100%" stopColor="#f3f0e3" />
          </linearGradient>
          <filter id="softShadow">
            <feDropShadow dx="0" dy="0.8" stdDeviation="1.5" floodColor="#1e293b" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width={900} height={640} fill="url(#bgGrad)" />

        {/* Terrain contour ovals — centered on the points centroid */}
        {[0.12, 0.28, 0.48, 0.72].map((f, i) => (
          <ellipse key={i} cx={450} cy={320} rx={180 + f * 280} ry={120 + f * 200}
            fill="none" stroke="#d6d3c8" strokeWidth={0.5} strokeDasharray="5 7" opacity={0.45} />
        ))}

        {/* Decorative mountain silhouette at bottom */}
        <g opacity={0.08}>
          <path d="M0,520 L40,460 L80,500 L130,430 L180,490 L230,440 L280,510 L320,450 L370,500 L420,430 L470,490 L520,450 L570,510 L620,440 L670,490 L720,450 L770,500 L820,430 L870,490 L900,460 L900,640 L0,640Z" fill="#065f46" />
        </g>

        {/* Decorative small trees/hills scatter */}
        <g opacity={0.1} fill="#166534">
          {Array.from({ length: 14 }, (_, i) => {
            const tx = 70 + i * 62, ty = 540 + Math.sin(i * 1.8) * 30;
            return <polygon key={i} points={`${tx-4},${ty} ${tx},${ty-10} ${tx+4},${ty}`} />;
          })}
        </g>

        {/* Route lines: subtle dashed paths from center to each point */}
        {points.map((p) => (
          <path key={`line-${p.id}`}
            d={`M${center.x},${center.y} L${p.x},${p.y}`}
            fill="none" stroke="#cbd5e1" strokeWidth={0.6} strokeDasharray="3 5" opacity={0.55} />
        ))}

        {/* km rings around center: near, mid, far */}
        {[0.35, 0.7].map((f) => (
          <circle key={f} cx={center.x} cy={center.y} r={
            f * Math.max(...points.map((p) => Math.sqrt((p.x - center.x) ** 2 + (p.y - center.y) ** 2)))
          } fill="none" stroke="#d6d3c8" strokeWidth={0.5} strokeDasharray="3 4" opacity={0.4} />
        ))}

        {/* Center hub */}
        <circle cx={center.x} cy={center.y} r={26} fill="white" stroke="#78716c" strokeWidth={2} filter="url(#softShadow)" />
        <circle cx={center.x} cy={center.y} r={5} fill="#78716c" />
        <text x={center.x} y={center.y - 32} textAnchor="middle" fontSize={14} fontWeight={800} fill="#1e293b" letterSpacing={1.5}>
          {destination.name}
        </text>

        {/* Attraction points with labels */}
        {points.map((p) => {
          const t = TYPE[p.type] || { color: "#94a3b8", icon: "•" };
          return (
            <g key={p.id} style={{ cursor: "pointer" }}
              onClick={() => navigate(`/attraction/${p.id}?from=${destination.id}`)}
              className="group"
            >
              {/* Dot */}
              <circle cx={p.x} cy={p.y} r={5.5} fill="white" stroke={t.color} strokeWidth={2.2} filter="url(#softShadow)" />
              <circle cx={p.x} cy={p.y} r={2.5} fill={t.color} />

              {/* Label background pill */}
              <rect
                x={p.labelX + (p.textAnchor === "end" ? 0 : p.textAnchor === "middle" ? 0 : -2)}
                y={p.labelY - 7}
                width={p.name.length * 7.5 + 24}
                height={18}
                rx={9} ry={9}
                fill="white" fillOpacity={0.92}
                stroke={t.color} strokeWidth={0.7}
                filter="url(#softShadow)"
                className="group-hover:fill-opacity-100 transition-all"
              />

              {/* Label text: icon + name + km */}
              <text x={p.labelX + (p.textAnchor === "end" ? 6 : p.textAnchor === "middle" ? (p.name.length * 7.5 + 24) / 2 : 10)}
                y={p.labelY + 5}
                textAnchor={p.textAnchor === "end" ? "end" : p.textAnchor === "middle" ? "middle" : "start"}
                fontSize={10.5} fontWeight={600} fill="#1e293b"
                className="group-hover:fill-slate-900"
              >
                {t.icon} {p.name}
                <tspan fill="#94a3b8" fontWeight={400} fontSize={9}> · {p.km}km</tspan>
              </text>
            </g>
          );
        })}

        {/* Scale bar */}
        <g transform="translate(30, 612)">
          {(() => {
            const barKm = Math.round(scaleKm * 120);
            return (
              <>
                <line x1={0} y1={0} x2={120} y2={0} stroke="#94a3b8" strokeWidth={1.2} />
                <line x1={0} y1={-4} x2={0} y2={4} stroke="#94a3b8" strokeWidth={0.8} />
                <line x1={120} y1={-4} x2={120} y2={4} stroke="#94a3b8" strokeWidth={0.8} />
                <text x={0} y={14} textAnchor="middle" fontSize={8} fill="#94a3b8">0</text>
                <text x={120} y={14} textAnchor="middle" fontSize={8} fill="#94a3b8">{barKm} km</text>
              </>
            );
          })()}
        </g>

        {/* Compass */}
        <g transform="translate(860, 40)">
          <circle cx={0} cy={0} r={20} fill="white" fillOpacity={0.7} stroke="#cbd5e1" strokeWidth={0.6} />
          <polygon points="0,-14 2.5,-4 0,-5 -2.5,-4" fill="#ef4444" />
          <polygon points="0,14 2.5,4 0,5 -2.5,4" fill="#94a3b8" />
          <polygon points="-14,0 -4,2.5 -5,0 -4,-2.5" fill="#94a3b8" />
          <polygon points="14,0 4,2.5 5,0 4,-2.5" fill="#94a3b8" />
          <circle cx={0} cy={0} r={2.5} fill="white" stroke="#64748b" strokeWidth={0.4} />
          <text x={0} y={-17} textAnchor="middle" fontSize={5.5} fontWeight={700} fill="#ef4444">N</text>
        </g>

        {/* Type legend */}
        <g transform="translate(30, 28)">
          {Object.entries(TYPE).map(([type, { color, icon }], i) => (
            <g key={type} transform={`translate(0, ${i * 17})`}>
              <circle cx={4} cy={4} r={3.8} fill="white" stroke={color} strokeWidth={1.2} />
              <circle cx={4} cy={4} r={1.8} fill={color} />
              <text x={12} y={8} fontSize={8.5} fill="#64748b">{icon} {type}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
