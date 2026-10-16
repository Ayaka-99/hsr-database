'use client';

import { useState } from 'react';
import { getAllLightCones } from '@/lib/api';
import LightConeCard from '@/components/LightConeCard';
import type { Path } from '@/lib/types';

const ALL_LIGHTCONES = getAllLightCones();
const PATHS: Path[] = ['存護', '巡獵', '毀滅', '智識', '同諧', '虛無', '豐饒', '記憶'];

// 篩選按鈕
function Btn({ active, activeClass, onClick, children }: { active: boolean; activeClass?: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer active:scale-95 ${
        active
          ? `${activeClass ?? 'bg-white/15 border-white/40 text-white shadow-[0_0_12px_rgba(255,255,255,0.2)]'} font-semibold scale-105`
          : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/30 hover:text-gray-100 hover:bg-white/[0.06]'
      }`}
    >
      {children}
    </button>
  );
}

export default function LightConesPage() {
  const [path, setPath] = useState<Path | ''>('');
  const [rarity, setRarity] = useState<3 | 4 | 5 | 0>(0);
  const [search, setSearch] = useState('');

  const filtered = ALL_LIGHTCONES.filter(lc => {
    if (rarity !== 0 && lc.rarity !== rarity) return false;
    if (path !== '' && lc.path !== path) return false;
    if (search.trim() !== '' && !lc.name.includes(search.trim())) return false;
    return true;
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            光錐列表
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10">
              {filtered.length}
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">檢視各命途光錐數值與滿精疊影被動效果</p>
        </div>

        {/* 搜尋欄 */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="搜尋光錐名稱…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm backdrop-blur-md transition-all duration-200 focus:outline-none focus:border-[#d4af37]/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-[#d4af37]/20"
          />
          {/* 放大鏡圖示 */}
          <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none text-xs">
            🔍
          </span>
          {/* 清除按鈕 */}
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white text-xs w-4 h-4 rounded-full bg-white/10 flex items-center justify-center transition-colors"
              aria-label="清除搜尋"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 篩選列 */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-xl shadow-lg shadow-black/30 mb-5 sm:mb-7">
        <div className="flex gap-2 items-center overflow-x-auto pb-1 scrollbar-none">
          {/* 稀有度 */}
          <Btn active={rarity === 0} onClick={() => setRarity(0)}>全部</Btn>
          <Btn
            active={rarity === 5}
            activeClass="bg-[#d4af37]/25 border-[#d4af37]/80 text-[#ffd700] shadow-[0_0_14px_rgba(212,175,55,0.4)]"
            onClick={() => setRarity(rarity === 5 ? 0 : 5)}
          >
            5★
          </Btn>
          <Btn
            active={rarity === 4}
            activeClass="bg-violet-600/25 border-violet-400/80 text-violet-300 shadow-[0_0_14px_rgba(139,92,246,0.4)]"
            onClick={() => setRarity(rarity === 4 ? 0 : 4)}
          >
            4★
          </Btn>
          <Btn
            active={rarity === 3}
            activeClass="bg-blue-600/25 border-blue-400/80 text-blue-300 shadow-[0_0_14px_rgba(59,130,246,0.4)]"
            onClick={() => setRarity(rarity === 3 ? 0 : 3)}
          >
            3★
          </Btn>

          <span className="shrink-0 w-px h-5 bg-white/10 mx-1" />

          {/* 命途 */}
          {PATHS.map(p => (
            <Btn
              key={p}
              active={path === p}
              activeClass="bg-cyan-500/20 border-cyan-400/60 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              onClick={() => setPath(path === p ? '' : p)}
            >
              {p}
            </Btn>
          ))}
        </div>
      </div>

      {/* 光錐卡片網格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3 sm:gap-4">
        {filtered.map(lc => (
          <LightConeCard key={lc.id} lc={lc} />
        ))}
      </div>
    </>
  );
}
