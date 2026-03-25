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
      <div className="ct-rainbow-frame">
        <div className="ct-inner-frame ct-corner-bottom">
          {/* 角落裝飾菱形 */}
          <span className="absolute top-[3px] left-1/2 -translate-x-1/2 text-[#c9a227]/80 text-xs z-10 pointer-events-none select-none">◆</span>
          <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 text-[#c9a227]/80 text-xs z-10 pointer-events-none select-none">◆</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hsr-database/ct-easter-egg.png"
            alt="CT"
            className="block max-h-[60vh] w-auto"
          />
          <div className="bg-black/90 p-4 text-center border-t border-[#c9a227]/30">
            <p className="text-[#c9a227] font-bold text-xl tracking-widest">❧ C T ❧</p>
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
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">角色列表</h1>

      {/* 搜尋欄 */}
      <input
        type="text"
        placeholder="搜尋角色名稱…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full md:w-80 mb-4 px-4 py-2 rounded-lg bg-white/5 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/40"
      />

      <FilterBar
        path={path}
        element={element}
        rarity={rarity}
        onPath={setPath}
        onElement={setElement}
        onRarity={setRarity}
      />

      <p className="text-sm text-gray-500 mb-4">共 {filtered.length} 個角色</p>

      {/* 角色卡片網格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2 sm:gap-3">
        {filtered.map(c => (
          <CharacterCard key={c.id} character={c} />
        ))}
      </div>
    </>
  );
}
