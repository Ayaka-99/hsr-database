'use client';

import { useState } from 'react';
import { getAllCharacters, getDisplayName } from '@/lib/api';
import CharacterCard from '@/components/CharacterCard';
import FilterBar from '@/components/FilterBar';
import type { Path, Element } from '@/lib/types';

// 在 client component 裡直接使用 getAllCharacters（資料已 bundle 在 JSON）
const ALL_CHARACTERS = getAllCharacters();

// 彩蛋：搜尋 "ct"（不分大小寫）時顯示
function CtEasterEgg() {
  return (
    <div className="flex justify-center">
      <div className="ct-frame-glow">
        {/* 厚框帶 + 菱形角飾 */}
        <div className="ct-frame-band">
          <div className="ct-gem tl" /><div className="ct-gem tr" />
          <div className="ct-gem bl" /><div className="ct-gem br" />
          <div className="ct-gem-mid top" /><div className="ct-gem-mid bottom" />
          <div className="ct-gem-mid left" /><div className="ct-gem-mid right" />

          {/* 內容 */}
          <div className="ct-frame-content">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/ct-easter-egg.png`}
              alt="CT"
              className="block max-h-[60vh] w-auto"
            />
            <div className="bg-black/95 px-6 py-4 text-center border-t border-[#c9a227]/40">
              <p className="text-[#c9a227] font-bold text-xl tracking-[0.4em]">❦ C T ❦</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [path, setPath] = useState<Path | ''>('');
  const [element, setElement] = useState<Element | ''>('');
  const [rarity, setRarity] = useState<4 | 5 | 0>(0);
  const [search, setSearch] = useState('');

  // 女性開拓者 ID（同屬性男性開拓者卡已代表，詳細頁可切換）
  const TB_FEMALE_IDS = new Set(['8002', '8004', '8006', '8008']);

  // 彩蛋觸發：搜尋文字完全等於 "ct"（不分大小寫）
  const isCtEasterEgg = search.trim().toLowerCase() === 'ct';

  // 依篩選條件與搜尋關鍵字過濾角色
  const filtered = ALL_CHARACTERS.filter(c => {
    if (TB_FEMALE_IDS.has(c.id)) return false;
    if (rarity !== 0 && c.rarity !== rarity) return false;
    if (element !== '' && c.element !== element) return false;
    if (path !== '' && c.path !== path) return false;
    if (isCtEasterEgg) return false; // 彩蛋模式不顯示角色
    if (search.trim() !== '' && !getDisplayName(c).includes(search.trim())) return false;
    return true;
  });

  // 彩蛋模式：只顯示搜尋欄 + 置中圖片
  if (isCtEasterEgg) {
    return (
      <>
        <input
          type="text"
          placeholder="搜尋角色名稱…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-80 mb-4 px-4 py-2 rounded-lg bg-white/5 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/40"
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <CtEasterEgg />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              星軌角色名鑑
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full liquid-capsule text-[#ffd700] border-[#d4af37]/40 shadow-[0_0_12px_rgba(212,175,55,0.25)]">
              {filtered.length} 名角色
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">沉浸式 3D 浮空卡片 · 懸浮預覽基礎數值、技能星魂與命途行跡</p>
        </div>

        {/* 搜尋欄 (Liquid Glass Capsule) */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="搜尋角色名稱…"
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

      <FilterBar
        path={path}
        element={element}
        rarity={rarity}
        onPath={setPath}
        onElement={setElement}
        onRarity={setRarity}
      />

      {/* 角色卡片網格 (立體破框 3D 空間間距) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-11 pt-4">
        {filtered.map(c => (
          <CharacterCard key={c.id} character={c} />
        ))}
      </div>
    </>
  );
}
