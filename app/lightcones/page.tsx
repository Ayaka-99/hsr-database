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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              星海光錐典藏
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full liquid-capsule text-[#ffd700] border-[#d4af37]/40 shadow-[0_0_12px_rgba(212,175,55,0.25)]">
              {filtered.length} 枚光錐
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">沉浸式光錐智庫 · 檢視各命途光錐基礎數值與滿階疊影被動效果</p>
        </div>

        {/* 搜尋欄 (Liquid Glass Capsule) */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="搜尋光錐名稱…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-full liquid-glass text-white placeholder-gray-400 text-sm backdrop-blur-xl transition-all duration-300 focus:outline-none focus:border-[#ffd700]/70 focus:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          />
          {/* 放大鏡圖示 */}
          <span className="absolute left-3.5 top-3 text-gray-400 pointer-events-none text-xs">
            🔍
          </span>
          {/* 清除按鈕 */}
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white text-xs w-5 h-5 rounded-full bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="清除搜尋"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 篩選列 (VisionOS Liquid Capsule Bar) */}
      <div className="p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl liquid-glass shadow-xl mb-6 sm:mb-8 border border-white/15">
        <div className="flex gap-2 items-center overflow-x-auto pb-1 scrollbar-none">
          {/* 稀有度 */}
          <Btn
            active={rarity === 0}
            activeClass="bg-gradient-to-r from-white/25 to-white/10 border-white/60 text-white shadow-[0_0_16px_rgba(255,255,255,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)]"
            onClick={() => setRarity(0)}
          >
            全部
          </Btn>
          <Btn
            active={rarity === 5}
            activeClass="bg-gradient-to-r from-[#d4af37]/35 to-[#f59e0b]/20 border-[#ffd700]/80 text-[#ffd700] shadow-[0_0_18px_rgba(212,175,55,0.5),inset_0_1px_1px_rgba(255,255,255,0.5)]"
            onClick={() => setRarity(rarity === 5 ? 0 : 5)}
          >
            5★ 典藏
          </Btn>
          <Btn
            active={rarity === 4}
            activeClass="bg-gradient-to-r from-purple-600/35 to-violet-500/20 border-purple-400/80 text-purple-200 shadow-[0_0_18px_rgba(168,85,247,0.5),inset_0_1px_1px_rgba(255,255,255,0.5)]"
            onClick={() => setRarity(rarity === 4 ? 0 : 4)}
          >
            4★ 卓越
          </Btn>
          <Btn
            active={rarity === 3}
            activeClass="bg-gradient-to-r from-blue-600/35 to-cyan-500/20 border-blue-400/80 text-blue-200 shadow-[0_0_18px_rgba(59,130,246,0.5),inset_0_1px_1px_rgba(255,255,255,0.5)]"
            onClick={() => setRarity(rarity === 3 ? 0 : 3)}
          >
            3★ 稀有
          </Btn>

          <span className="shrink-0 w-px h-5 bg-white/15 mx-1" />

          {/* 命途 */}
          {PATHS.map(p => (
            <Btn
              key={p}
              active={path === p}
              activeClass="bg-gradient-to-r from-cyan-500/30 to-sky-500/20 border-cyan-400/80 text-cyan-100 shadow-[0_0_16px_rgba(6,182,212,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]"
              onClick={() => setPath(path === p ? '' : p)}
            >
              {p}
            </Btn>
          ))}
        </div>
      </div>

      {/* 光錐卡片網格 (立體 3D 空間間距) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-7 sm:gap-x-5 sm:gap-y-9 pt-2">
        {filtered.map(lc => (
          <LightConeCard key={lc.id} lc={lc} />
        ))}
      </div>
    </>
  );
}
