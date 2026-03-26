'use client';

import { useState } from 'react';
import { getEndgameData } from '@/lib/api';
import type { EndgameSeason, EndgameFloor, EndgameMonster } from '@/lib/types';

const DATA = getEndgameData();
const SEASONS = DATA.peak;

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
    <div className="flex flex-col items-center gap-1 w-16 shrink-0">
      <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 bg-[#111125]">
        {!failed && monster.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={monster.icon}
            alt={monster.name}
            className="w-full h-full object-contain"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700 text-lg">?</div>
        )}
      </div>
      <p className="text-center text-[9px] text-gray-400 leading-tight line-clamp-2 w-full">{monster.name}</p>
    </div>
  );
}

// ── 機制標籤（點擊桎梏展開說明） ─────────────────────
function TagList({ tags }: { tags: { name: string; desc: string }[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => {
          const isDebuff = tag.name.startsWith('桎梏');
          const isOpen = expanded === `${i}`;
          return (
            <button
              key={i}
              onClick={() => isDebuff && setExpanded(isOpen ? null : `${i}`)}
              className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                isDebuff
                  ? isOpen
                    ? 'border-red-500/40 bg-red-500/10 text-red-400 cursor-pointer'
                    : 'border-red-500/20 bg-white/5 text-gray-400 hover:border-red-500/40 hover:text-red-400 cursor-pointer'
                  : 'border-white/10 bg-white/5 text-gray-400 cursor-default'
              }`}
              title={tag.desc}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
      {expanded !== null && (() => {
        const tag = tags[parseInt(expanded)];
        return tag ? (
          <p className="text-[10px] text-red-400/80 leading-relaxed pl-0.5">
            ⚠ {tag.desc}
          </p>
        ) : null;
      })()}
    </div>
  );
}

// ── 時間線節點 ───────────────────────────────────────
function TimelineNode({ floor, index, total }: { floor: EndgameFloor; index: number; total: number }) {
  const isBoss = index === total - 1;

  return (
    <div className="flex gap-4">
      {/* 左側時間線 */}
      <div className="flex flex-col items-center shrink-0">
        {/* 節點圓圈 */}
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
          isBoss
            ? 'border-[#c9a227] bg-[#c9a227]/15 text-[#c9a227]'
            : 'border-[#6b4ff5]/50 bg-[#6b4ff5]/10 text-[#6b4ff5]'
        }`}>
          {isBoss ? '♛' : index + 1}
        </div>
        {/* 連接線 */}
        {index < total - 1 && (
          <div className="w-px flex-1 min-h-[24px] bg-gradient-to-b from-[#6b4ff5]/30 to-transparent" />
        )}
      </div>

      {/* 右側內容卡片 */}
      <div className={`flex-1 min-w-0 mb-4 rounded-xl border overflow-hidden ${
        isBoss
          ? 'border-[#c9a227]/30 bg-gradient-to-br from-[#1a1200]/30 to-transparent'
          : 'border-white/8 bg-white/[0.015]'
      }`}>
        {/* 關卡名稱列 */}
        <div className={`px-4 py-2.5 border-b flex items-center gap-2 ${
          isBoss ? 'border-[#c9a227]/20 bg-[#c9a227]/5' : 'border-white/5 bg-white/[0.02]'
        }`}>
          <span className={`text-xs font-bold ${isBoss ? 'text-[#c9a227]' : 'text-white'}`}>
            {floor.name}
          </span>
          {isBoss && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#c9a227]/15 text-[#c9a227] border border-[#c9a227]/30">
              王棋
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">
          {/* 弱點 */}
          <div className="flex gap-1 flex-wrap">
            {floor.weakness1.map(w => <WeaknessBadge key={w} element={w} />)}
          </div>

          {/* 怪物 */}
          {floor.monsters1.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {floor.monsters1.map((m, i) => <MonsterIcon key={i} monster={m} />)}
            </div>
          )}

          {/* 機制標籤 */}
          {floor.tags1 && floor.tags1.length > 0 && (
            <TagList tags={floor.tags1} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── 賽季展示區塊 ─────────────────────────────────────
function SeasonDetail({ season }: { season: EndgameSeason }) {
  return (
    <div className="space-y-5">
      {/* 增益區 */}
      {season.buffs && season.buffs.length > 0 && (
        <div>
          <p className="text-[11px] text-gray-500 font-medium mb-2 uppercase tracking-wider">王棋增益</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {season.buffs.map((b, i) => (
              <div key={i} className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5">
                <p className="text-[11px] text-[#c9a227] font-semibold mb-1">{b.name}</p>
                <p className="text-[10px] text-gray-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 時間線關卡列表 */}
      <div>
        {season.floors.map((floor, i) => (
          <TimelineNode
            key={i}
            floor={floor}
            index={i}
            total={season.floors.length}
          />
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
export default function SimulatedPage() {
  const [seasonIdx, setSeasonIdx] = useState(0);
  const season = SEASONS[seasonIdx];

  if (!season) {
    return (
      <div className="text-center text-gray-500 py-20">
        <p>暫無異相仲裁資料</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">異相仲裁</h1>
        <p className="text-sm text-gray-500 mt-1">0課別想滿星騎士啦 溝槽策劃</p>
      </div>

      {/* 賽季橫向捲動選擇器 */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {SEASONS.map((s, i) => {
          const active = seasonIdx === i;
          return (
            <button
              key={s.id}
              onClick={() => setSeasonIdx(i)}
              className={`shrink-0 px-4 py-2 rounded-lg text-xs border transition-all duration-200 ${
                active
                  ? 'border-[#6b4ff5]/50 bg-[#6b4ff5]/10 text-[#6b4ff5] shadow-lg shadow-[#6b4ff5]/5'
                  : 'border-white/8 text-gray-500 hover:text-gray-300 hover:border-white/15'
              }`}
            >
              <span className="font-medium">{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* 賽季詳情 */}
      <SeasonDetail season={season} />

      {/* 註腳 */}
      <p className="text-[10px] text-gray-600 text-center pt-2">
        資料來源 nanoka.cc API · 關卡內容每期更新，請以遊戲內顯示為準
      </p>
    </div>
  );
}
