'use client';

import { useState } from 'react';
import { getEndgameData } from '@/lib/api';
import type { EndgameSeason, EndgameFloor, EndgameMonster } from '@/lib/types';

const DATA = getEndgameData();

// 三種模式定義
const MODES = [
  { key: 'maze' as const, name: '忘卻之庭', icon: '⚔', desc: '騙課' },
  { key: 'story' as const, name: '虛構敘事', icon: '📖', desc: '騙課' },
  { key: 'boss' as const, name: '末日幻影', icon: '💀', desc: '騙課' },
] as const;

// 模式主題色
const MODE_THEME: Record<string, { accent: string; accentBg: string; accentBorder: string; glow: string }> = {
  maze:  { accent: 'text-violet-400', accentBg: 'bg-violet-500/10', accentBorder: 'border-violet-500/30', glow: 'shadow-violet-500/10' },
  story: { accent: 'text-sky-400',    accentBg: 'bg-sky-500/10',    accentBorder: 'border-sky-500/30',    glow: 'shadow-sky-500/10' },
  boss:  { accent: 'text-orange-400', accentBg: 'bg-orange-500/10', accentBorder: 'border-orange-500/30', glow: 'shadow-orange-500/10' },
};

// 弱點屬性配色
const ELEMENT_COLOR: Record<string, string> = {
  火:   'bg-orange-500/20 text-orange-300 border-orange-500/40',
  冰:   'bg-sky-500/20    text-sky-300    border-sky-500/40',
  雷:   'bg-violet-500/20 text-violet-300 border-violet-500/40',
  風:   'bg-teal-500/20   text-teal-300   border-teal-500/40',
  量子: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  虛數: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/40',
  物理: 'bg-gray-500/20   text-gray-300   border-gray-500/40',
};

// ── 日期格式化 ──────────────────────────────────────
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function getSeasonStatus(season: EndgameSeason): 'current' | 'ended' | 'upcoming' {
  if (!season.beginTime && !season.endTime) return 'upcoming';
  const now = Date.now();
  const end = season.endTime ? new Date(season.endTime).getTime() : Infinity;
  const begin = season.beginTime ? new Date(season.beginTime).getTime() : 0;
  if (now < begin) return 'upcoming';
  if (now > end) return 'ended';
  return 'current';
}

// ── 弱點標籤 ─────────────────────────────────────────
function WeaknessBadge({ element }: { element: string }) {
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${ELEMENT_COLOR[element] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/40'}`}>
      {element}
    </span>
  );
}

// ── 怪物圖示 ─────────────────────────────────────────
function MonsterIcon({ monster }: { monster: EndgameMonster }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex flex-col items-center gap-1 w-20 shrink-0">
      <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-[#111125]">
        {!failed && monster.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={monster.icon}
            alt={monster.name}
            className="w-full h-full object-contain"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700 text-xl">?</div>
        )}
      </div>
      <p className="text-center text-[10px] text-gray-400 leading-tight line-clamp-2 w-full">{monster.name}</p>
    </div>
  );
}

// ── 半場區塊（上半 / 下半）──────────────────────────
function HalfPanel({ label, weakness, monsters, accentColor }: {
  label: string;
  weakness: string[];
  monsters: EndgameMonster[];
  accentColor: string;
}) {
  if (weakness.length === 0 && monsters.length === 0) return null;
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${accentColor}`}>{label}</span>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <div className="flex gap-1 flex-wrap mb-3">
        {weakness.map(w => <WeaknessBadge key={w} element={w} />)}
      </div>
      <div className="flex flex-wrap gap-2">
        {monsters.map((m, i) => <MonsterIcon key={i} monster={m} />)}
      </div>
    </div>
  );
}

// ── 忘卻之庭樓層卡（左右分割）──────────────────────
function MazeFloorCard({ floor, theme }: { floor: EndgameFloor; theme: typeof MODE_THEME['maze'] }) {
  const hasTwoSides = floor.weakness2.length > 0 || floor.monsters2.length > 0;
  return (
    <div className={`rounded-xl border ${theme.accentBorder} bg-white/[0.015] overflow-hidden`}>
      {/* 樓層標題列 */}
      <div className={`px-4 py-2.5 ${theme.accentBg} border-b ${theme.accentBorder}`}>
        <span className={`text-xs font-bold ${theme.accent}`}>{floor.name}</span>
      </div>

      {/* 上下半場 */}
      <div className={`p-4 ${hasTwoSides ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
        <HalfPanel
          label={hasTwoSides ? '上半' : '敵方'}
          weakness={floor.weakness1}
          monsters={floor.monsters1}
          accentColor={theme.accent}
        />
        {hasTwoSides && (
          <>
            <div className="hidden md:block w-px bg-white/5 absolute left-1/2" />
            <HalfPanel
              label="下半"
              weakness={floor.weakness2}
              monsters={floor.monsters2}
              accentColor={theme.accent}
            />
          </>
        )}
      </div>

      {/* BOSS 機制標籤 */}
      {(floor.tags1?.length || floor.tags2?.length) ? (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {[...(floor.tags1 ?? []), ...(floor.tags2 ?? [])].map((tag, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-400" title={tag.desc}>
              {tag.name}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ── 虛構敘事 / 末日幻影（僅顯示最高難度）───────────
function HighestDifficultyCard({ floor, theme }: { floor: EndgameFloor; theme: typeof MODE_THEME['maze'] }) {
  return (
    <div className={`rounded-xl border ${theme.accentBorder} bg-white/[0.015] overflow-hidden`}>
      {/* 標題列 */}
      <div className={`px-4 py-2.5 ${theme.accentBg} border-b ${theme.accentBorder} flex items-center justify-between`}>
        <span className={`text-xs font-bold ${theme.accent}`}>{floor.name}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500 border border-white/10">最高難度</span>
      </div>

      {/* 雙列佈局 */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <HalfPanel
          label="上半"
          weakness={floor.weakness1}
          monsters={floor.monsters1}
          accentColor={theme.accent}
        />
        <HalfPanel
          label="下半"
          weakness={floor.weakness2}
          monsters={floor.monsters2}
          accentColor={theme.accent}
        />
      </div>

      {/* 機制標籤 */}
      {(floor.tags1?.length || floor.tags2?.length) ? (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {[...(floor.tags1 ?? []), ...(floor.tags2 ?? [])].map((tag, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-400" title={tag.desc}>
              {tag.name}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ── 賽季區塊 ──────────────────────────────────────────
function SeasonSection({ season, modeKey, defaultOpen }: { season: EndgameSeason; modeKey: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const theme = MODE_THEME[modeKey];
  const status = getSeasonStatus(season);

  // 忘卻之庭只顯示 F9–F12
  const isMaze = modeKey === 'maze';
  const isHighestOnly = modeKey === 'story' || modeKey === 'boss';

  const displayFloors = isMaze && season.floors.length === 12
    ? season.floors.slice(8)
    : isHighestOnly
      ? season.floors.slice(-1)
      : season.floors;

  return (
    <div>
      {/* 賽季標頭 */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 group mb-2"
      >
        <span className={`text-xs transition-transform duration-200 text-gray-600 ${open ? 'rotate-90' : ''}`}>▶</span>
        <span className="text-white font-bold text-sm">{season.name}</span>

        {status === 'current' && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
            當期
          </span>
        )}
        {status === 'upcoming' && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold">
            測試
          </span>
        )}

        <div className="flex-1 h-px bg-white/5" />

        {(season.beginTime || season.endTime) && (
          <span className="text-xs text-gray-600 shrink-0">
            {formatDate(season.beginTime)} – {formatDate(season.endTime)}
          </span>
        )}
      </button>

      {/* 展開內容 */}
      {open && (
        <div className="space-y-3 pl-5">
          {/* 增益資訊 */}
          {season.buff && (
            <div className={`rounded-lg ${theme.accentBg} border ${theme.accentBorder} px-4 py-3`}>
              <p className="text-[11px] text-gray-500 mb-1 font-medium">本期增益</p>
              <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{season.buff}</p>
            </div>
          )}

          {/* 可選增益 */}
          {season.buffs && season.buffs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {season.buffs.map((b, i) => (
                <div key={i} className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2">
                  <p className="text-[11px] text-[#c9a227] font-semibold mb-0.5">{b.name}</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* 樓層內容 */}
          {isHighestOnly ? (
            displayFloors.map((floor, i) => (
              <HighestDifficultyCard key={i} floor={floor} theme={theme} />
            ))
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {displayFloors.map((floor, i) => (
                <MazeFloorCard key={i} floor={floor} theme={theme} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
export default function AbyssPage() {
  const [modeIdx, setModeIdx] = useState(0);
  const mode = MODES[modeIdx];
  const theme = MODE_THEME[mode.key];
  const seasons = DATA[mode.key];

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">終局挑戰</h1>
        <p className="text-sm text-gray-500 mt-1">忘卻之庭 · 虛構敘事 · 末日幻影</p>
      </div>

      {/* 模式選擇列 — 卡片式 */}
      <div className="grid grid-cols-3 gap-2">
        {MODES.map((m, i) => {
          const t = MODE_THEME[m.key];
          const active = modeIdx === i;
          return (
            <button
              key={m.key}
              onClick={() => setModeIdx(i)}
              className={`rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                active
                  ? `${t.accentBorder} ${t.accentBg} shadow-lg ${t.glow}`
                  : 'border-white/8 bg-white/[0.02] hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{m.icon}</span>
                <span className={`text-sm font-bold ${active ? t.accent : 'text-gray-400'}`}>{m.name}</span>
              </div>
              <p className={`text-[10px] mt-1 ${active ? 'text-gray-400' : 'text-gray-600'}`}>{m.desc}</p>
            </button>
          );
        })}
      </div>

      {/* 提示：僅顯示最高難度 */}
      {(mode.key === 'story' || mode.key === 'boss') && (
        <p className={`text-[11px] ${theme.accent} opacity-60`}>
          ＊ 僅顯示最高難度關卡
        </p>
      )}

      {/* 賽季列表 */}
      <div className="space-y-6">
        {seasons.map((season, i) => (
          <SeasonSection
            key={season.id}
            season={season}
            modeKey={mode.key}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </div>
  );
}
