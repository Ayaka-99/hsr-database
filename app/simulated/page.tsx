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

// 關卡配色（前三關 + 王棋）
const STAGE_STYLES = [
  { border: 'border-blue-500/30', badge: 'border-blue-500/40 bg-blue-500/10 text-blue-400', numBorder: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
  { border: 'border-blue-500/30', badge: 'border-blue-500/40 bg-blue-500/10 text-blue-400', numBorder: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
  { border: 'border-blue-500/30', badge: 'border-blue-500/40 bg-blue-500/10 text-blue-400', numBorder: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
  { border: 'border-[#c9a227]/30', badge: 'border-[#c9a227]/40 bg-[#c9a227]/10 text-[#c9a227]', numBorder: 'border-[#c9a227]/40 text-[#c9a227] bg-[#c9a227]/10' },
];

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

// ── 關卡卡片 ─────────────────────────────────────────
function StageCard({ floor, index, isBoss }: { floor: EndgameFloor; index: number; isBoss: boolean }) {
  const style = STAGE_STYLES[Math.min(index, STAGE_STYLES.length - 1)];

  return (
    <div className={`rounded-xl border ${style.border} p-4 ${isBoss ? 'bg-gradient-to-br from-[#1a1200]/40 to-[#0d0d1a]' : 'bg-white/[0.02]'}`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        {/* 關卡編號 */}
        <div className={`shrink-0 w-9 h-9 rounded-full border flex items-center justify-center text-sm font-bold ${style.numBorder}`}>
          {isBoss ? '♛' : index + 1}
        </div>

        {/* 關卡資訊 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-white font-semibold text-sm">{floor.name}</span>
          </div>

          {/* 弱點 */}
          <div className="flex gap-1 flex-wrap mb-3">
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
            <div className="mt-3 flex flex-wrap gap-1.5">
              {floor.tags1.map((tag, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-400" title={tag.desc}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
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
        <h1 className="text-2xl font-bold text-white">異相仲裁</h1>
        <p className="text-sm text-gray-400 mt-1">差分宇宙 — Divergent Universe: Anomaly Arbitration</p>
      </div>

      {/* 賽季選擇 */}
      <div className="flex flex-wrap gap-1.5">
        {SEASONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSeasonIdx(i)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
              seasonIdx === i
                ? 'border-[#6b4ff5]/60 bg-[#6b4ff5]/10 text-[#6b4ff5]'
                : 'border-white/10 text-gray-500 hover:text-gray-300'
            }`}
          >
            {s.name}
            {i === 0 && (
              <span className="ml-1.5 px-1 py-0.5 rounded text-[9px] bg-[#6b4ff5]/20 text-[#6b4ff5]">最新</span>
            )}
          </button>
        ))}
      </div>

      {/* 簡介 */}
      <div className="rounded-xl border border-[#6b4ff5]/20 bg-gradient-to-br from-[#12092a]/60 to-[#0d0d1a] p-5">
        <p className="text-gray-300 leading-relaxed text-sm">
          異相仲裁是差分宇宙中的特殊挑戰模式。每期包含數個前置關卡（騎士、主教等）以及最終的王棋 BOSS 關。
          需依據各關弱點與敵方機制來規劃陣容與祝福路線。
        </p>
      </div>

      {/* 王棋增益（若有） */}
      {season.buffs && season.buffs.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-400 mb-2">王棋增益選項</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {season.buffs.map((b, i) => (
              <div key={i} className="rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2">
                <p className="text-[11px] text-[#c9a227] font-semibold mb-0.5">{b.name}</p>
                <p className="text-[10px] text-gray-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 關卡列表 */}
      <div className="space-y-3">
        {season.floors.map((floor, i) => (
          <StageCard
            key={i}
            floor={floor}
            index={i}
            isBoss={i === season.floors.length - 1}
          />
        ))}
      </div>

      {/* 註腳 */}
      <div className="p-4 rounded-xl border border-white/8 bg-white/[0.02]">
        <p className="text-xs text-gray-500 text-center">
          資料來自 nanoka.cc API，關卡內容每期更新，請以遊戲內顯示為準。
        </p>
      </div>
    </div>
  );
}
