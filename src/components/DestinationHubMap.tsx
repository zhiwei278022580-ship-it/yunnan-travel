import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Destination } from "../data/index";

const TYPE: Record<string, string> = {
  "国家级景区": "#3b82f6", "徒步路线": "#f97316", "野生秘境": "#10b981",
  "古镇村落": "#f59e0b", "湖泊雪山": "#0891b2", "温泉湿地": "#14b8a6",
  "文化遗迹": "#8b5cf6", "峡谷江河": "#6366f1", "观景台": "#ec4899",
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function DestinationHubMap({ destination }: { destination: Destination }) {
  const navigate = useNavigate();

  const { points, center, W, H } = useMemo(() => {
    const all = [destination.coords, ...destination.attractions.map((a) => a.coords)];
    let minLon = Math.min(...all.map((p) => p[1]));
    let maxLon = Math.max(...all.map((p) => p[1]));
    let minLat = Math.min(...all.map((p) => p[0]));
    let maxLat = Math.max(...all.map((p) => p[0]));
    const spanLon = maxLon - minLon || 0.01;
    const spanLat = maxLat - minLat || 0.01;
    minLon -= spanLon * 0.15; maxLon += spanLon * 0.15;
    minLat -= spanLat * 0.15; maxLat += spanLat * 0.15;

    const W = 850, H = 580;
    const midLat = (minLat + maxLat) / 2;
    const cos = Math.cos((midLat * Math.PI) / 180);
    const s = Math.min(W / ((maxLon - minLon) * cos), H / (maxLat - minLat));
    const offX = (W - (maxLon - minLon) * cos * s) / 2;
    const offY = (H - (maxLat - minLat) * s) / 2;
    const proj = (lon: number, lat: number) => ({
      x: offX + (lon - minLon) * cos * s,
      y: offY + (maxLat - lat) * s,
    });

    const c = proj(destination.coords[1], destination.coords[0]);

    // Build items with distance, then sort by bearing for label sides
    const raw = destination.attractions.map((a) => {
      const p = proj(a.coords[1], a.coords[0]);
      const km = Math.round(haversineKm(destination.coords[0], destination.coords[1], a.coords[0], a.coords[1]));
      const bearing = Math.atan2(p.x - c.x, -(p.y - c.y)); // -pi..pi, 0=north
      return { ...a, x: p.x, y: p.y, km, bearing };
    });
    raw.sort((a, b) => a.bearing - b.bearing);

    // Assign label sides: alternate right/left based on sorted position
    const placed = raw.map((item, i) => {
      const side = i % 2 === 0 ? "right" : "left";
      // Edge cases: force side near borders
      let finalSide = side;
      if (item.x < 100) finalSide = "right";
      if (item.x > W - 100) finalSide = "left";
      const lx = finalSide === "right" ? item.x + 12 : item.x - 12;
      const ta = finalSide === "right" ? "start" : "end";
      return { ...item, labelX: lx, textAnchor: ta, labelSide: finalSide };
    });

    return { points: placed, center: c, W, H };
  }, [destination]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[520px]">
        <defs>
          <filter id="sd">
            <feDropShadow dx="0" dy="0.5" stdDeviation="1.2" floodColor="#0f172a" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* clean white background */}
        <rect x={0} y={0} width={W} height={H} fill="#ffffff" />

        {/* thin connection lines */}
        {points.map((p) => (
          <line key={`l-${p.id}`} x1={center.x} y1={center.y} x2={p.x} y2={p.y}
            stroke="#e2e8f0" strokeWidth={0.6} />
        ))}

        {/* center dot */}
        <circle cx={center.x} cy={center.y} r={16} fill="#f8fafc" stroke="#94a3b8" strokeWidth={1.5} />
        <circle cx={center.x} cy={center.y} r={3} fill="#64748b" />
        <text x={center.x} y={center.y - 22} textAnchor="middle" fontSize={13} fontWeight={700} fill="#334155">
          {destination.name}
        </text>

        {/* attraction markers + labels */}
        {points.map((p) => {
          const color = TYPE[p.type] || "#94a3b8";
          const isRight = p.labelSide === "right";
          const lx = isRight ? p.x + 12 : p.x - 12;
          const ta = isRight ? "start" : "end";
          const leaderX = isRight ? p.x + 6 : p.x - 6;
          const labelW = p.name.length * 7.5 + 22;

          return (
            <g key={p.id} style={{ cursor: "pointer" }}
              onClick={() => navigate(`/attraction/${p.id}?from=${destination.id}`)}
            >
              {/* thin leader line */}
              <line x1={p.x} y1={p.y} x2={leaderX} y2={p.y - 2} stroke={color} strokeWidth={0.6} opacity={0.5} />

              {/* marker dot — white ring + colored fill */}
              <circle cx={p.x} cy={p.y} r={5} fill="#fff" stroke={color} strokeWidth={1.8} filter="url(#sd)" />
              <circle cx={p.x} cy={p.y} r={2.2} fill={color} />

              {/* label pill */}
              <rect
                x={isRight ? lx - 2 : lx - labelW + 2}
                y={p.y - 8}
                width={labelW}
                height={18}
                rx={9} ry={9}
                fill="#fff" fillOpacity={0.95}
                stroke={color} strokeWidth={0.6}
                filter="url(#sd)"
              />

              {/* label text */}
              <text
                x={isRight ? lx + 8 : lx - 8}
                y={p.y + 4.5}
                textAnchor={ta}
                fontSize={10.5}
                fontWeight={600}
                fill="#1e293b"
              >
                {p.name}
                <tspan fill="#94a3b8" fontWeight={400} fontSize={9}>  {p.km}km</tspan>
              </text>
            </g>
          );
        })}

        {/* scale bar — bottom left */}
        <g transform="translate(20, 560)">
          <line x1={0} y1={0} x2={100} y2={0} stroke="#cbd5e1" strokeWidth={1} />
          <line x1={0} y1={0} x2={0} y2={4} stroke="#cbd5e1" strokeWidth={0.8} />
          <line x1={100} y1={0} x2={100} y2={4} stroke="#cbd5e1" strokeWidth={0.8} />
          <text x={0} y={14} textAnchor="middle" fontSize={8} fill="#94a3b8">0</text>
          <text x={100} y={14} textAnchor="middle" fontSize={8} fill="#94a3b8">
            {(() => {
              const kmPerDeg = 111.32 * Math.cos(((Math.min(...points.map(p => p.y)) / 580 * 0.05 + 0.38) * Math.PI) / 180);
              return Math.round(100 * kmPerDeg / 100) * 10 || 10;
            })()} km
          </text>
        </g>

        {/* compass — top right */}
        <g transform="translate(810, 25)">
          <circle cx={0} cy={0} r={16} fill="#fff" fillOpacity={0.8} stroke="#e2e8f0" strokeWidth={0.6} />
          <polygon points="0,-10 2,-3 0,-4 -2,-3" fill="#ef4444" />
          <polygon points="0,10 2,3 0,4 -2,3" fill="#cbd5e1" />
          <text x={0} y={-13} textAnchor="middle" fontSize={6} fontWeight={700} fill="#ef4444">N</text>
        </g>

        {/* legend — top left */}
        <g transform="translate(20, 20)">
          {Object.entries(TYPE).slice(0, 5).map(([type, color], i) => (
            <g key={type} transform={`translate(0, ${i * 16})`}>
              <circle cx={3} cy={3} r={3} fill="#fff" stroke={color} strokeWidth={1.2} />
              <circle cx={3} cy={3} r={1.4} fill={color} />
              <text x={10} y={7} fontSize={8} fill="#94a3b8">{type}</text>
            </g>
          ))}
        </g>
        <g transform="translate(160, 20)">
          {Object.entries(TYPE).slice(5).map(([type, color], i) => (
            <g key={type} transform={`translate(0, ${i * 16})`}>
              <circle cx={3} cy={3} r={3} fill="#fff" stroke={color} strokeWidth={1.2} />
              <circle cx={3} cy={3} r={1.4} fill={color} />
              <text x={10} y={7} fontSize={8} fill="#94a3b8">{type}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
