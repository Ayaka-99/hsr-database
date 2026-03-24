'use client';

import { useState } from 'react';
import { getAllLightCones } from '@/lib/api';
import LightConeCard from '@/components/LightConeCard';
import type { Path } from '@/lib/types';

const ALL_LIGHTCONES = getAllLightCones();
const PATHS: Path[] = ['存護', '巡獵', '毀滅', '智識', '同諧', '虛無', '豐饒', '記憶'];

// 篩選按鈕
function Btn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
        active
          ? 'bg-white/15 border-white/40 text-white font-semibold'
          : 'border-white/20 text-gray-400 hover:border-white/40 hover:text-gray-200'
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
      <h1 className="text-2xl font-bold text-white mb-4">光錐列表</h1>

      {/* 搜尋欄 */}
      <input
        type="text"
        placeholder="搜尋光錐名稱…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full sm:w-64 mb-4 px-4 py-2 rounded-lg bg-white/5 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-white/40"
      />

      {/* 篩選列 */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        {/* 稀有度 */}
        <Btn active={rarity === 0} onClick={() => setRarity(0)}>全部</Btn>
        {([5, 4, 3] as const).map(r => (
          <Btn key={r} active={rarity === r} onClick={() => setRarity(rarity === r ? 0 : r)}>
            {r}★
          </Btn>
        ))}
        <span className="w-px h-5 bg-white/15 mx-1" />
        {/* 命途 */}
        {PATHS.map(p => (
          <Btn key={p} active={path === p} onClick={() => setPath(path === p ? '' : p)}>
            {p}
          </Btn>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-4">共 {filtered.length} 個光錐</p>

      {/* 光錐卡片網格 */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3">
        {filtered.map(lc => (
          <LightConeCard key={lc.id} lc={lc} />
        ))}
      </div>
    </>
  );
}
