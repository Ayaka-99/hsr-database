'use client';

export interface ChartPoint {
  label: string;
  hp: number;
  note?: string;
  icon?: string; // CDN URL for monster icon
}

function formatHP(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(Math.round(n));
}

export default function LineChart({
  data,
  color = '#c9a227',
  title,
}: {
  data: ChartPoint[];
  color?: string;
  title?: string;
}) {
  if (!data.length) return null;
  const maxHp = Math.max(...data.map(d => d.hp));
  const W = 560, H = 180;
  const pad = { t: 20, r: 20, b: 44, l: 52 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;

  const pts = data.map((d, i) => ({
    ...d,
    x: pad.l + (data.length === 1 ? cw / 2 : (i / (data.length - 1)) * cw),
    y: pad.t + (1 - d.hp / maxHp) * ch,
  }));

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${pts[pts.length - 1].x.toFixed(1)},${(pad.t + ch).toFixed(1)} L${pts[0].x.toFixed(1)},${(pad.t + ch).toFixed(1)}Z`;

  const gridPcts = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="rounded-xl border border-white/10 bg-white/3 p-4">
      {title && <p className="text-xs font-semibold text-gray-400 mb-2">{title}</p>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
        {/* Grid */}
        {gridPcts.map(pct => {
          const y = pad.t + (1 - pct) * ch;
          return (
            <g key={pct}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y}
                stroke="white" strokeOpacity={0.06} strokeDasharray="3,3" />
              <text x={pad.l - 5} y={y + 3.5} textAnchor="end"
                fontSize={9} fill="#6b7280" fontFamily="monospace">
                {formatHP(maxHp * pct)}
              </text>
            </g>
          );
        })}

        {/* Area */}
        <path d={areaD} fill={color} fillOpacity={0.08} />

        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />

        {/* Dots + tooltips */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill={color} />
            {/* HP label above dot */}
            <text x={p.x} y={p.y - 7} textAnchor="middle"
              fontSize={8} fill={color} fontWeight="bold">
              {formatHP(p.hp)}
            </text>
            {/* X axis label */}
            <text x={p.x} y={H - 6} textAnchor="middle"
              fontSize={8} fill="#9ca3af">
              {p.label}
            </text>
          </g>
        ))}

        {/* Monster icons below X axis (if any) */}
        {pts.some(p => p.icon) && pts.map((p, i) =>
          p.icon ? (
            <image
              key={`icon-${i}`}
              href={p.icon}
              x={p.x - 10} y={H - 4}
              width={20} height={20}
            />
          ) : null
        )}
      </svg>

      {/* Legend: note labels */}
      {data.some(d => d.note) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {data.filter(d => d.note).map((d, i) => (
            <span key={i} className="text-xs text-gray-500">
              <span style={{ color }} className="font-bold">{d.label}</span>
              {' '}{d.note}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
