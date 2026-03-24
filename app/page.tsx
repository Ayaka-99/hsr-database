'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getAllCharacters, getDisplayName } from '@/lib/api';
import CharacterCard from '@/components/CharacterCard';
import FilterBar from '@/components/FilterBar';
import type { Path, Element } from '@/lib/types';

// 在 client component 裡直接使用 getAllCharacters（資料已 bundle 在 JSON）
const ALL_CHARACTERS = getAllCharacters();

// 彩蛋：搜尋 "ct"（不分大小寫）時顯示
function CtEasterEgg({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full mx-4 rounded-2xl overflow-hidden border-2 border-[#c9a227]/60 shadow-[0_0_40px_rgba(201,162,39,0.4)]"
        onClick={e => e.stopPropagation()}
      >
        <Image
          src="/ct-easter-egg.png"
          alt="CT"
          width={400}
          height={500}
          className="w-full object-cover"
        />
        {/* 底部文字 */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4 text-center">
          <p className="text-[#c9a227] font-bold text-xl tracking-widest">C T</p>
        </div>
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 border border-white/20 text-white/70 hover:text-white text-sm flex items-center justify-center"
        >
          ✕
        </button>
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

  return (
    <>
      {/* 彩蛋 overlay */}
      {isCtEasterEgg && <CtEasterEgg onClose={() => setSearch('')} />}

      <h1 className="text-2xl font-bold text-white mb-4">角色列表</h1>

      {/* 搜尋欄 */}
      <input
        type="text"
        placeholder="搜尋角色名稱…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full sm:w-64 mb-4 px-4 py-2 rounded-lg bg-white/5 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/40"
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
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3">
        {filtered.map(c => (
          <CharacterCard key={c.id} character={c} />
        ))}
      </div>
    </>
  );
}
