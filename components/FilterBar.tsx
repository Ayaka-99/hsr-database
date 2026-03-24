'use client';

import type { Path, Element } from '@/lib/types';

const PATHS: Path[] = ['存護', '巡獵', '毀滅', '智識', '同諧', '虛無', '豐饒', '記憶'];
const ELEMENTS: Element[] = ['火', '冰', '雷', '風', '量子', '虛數', '物理'];

interface Props {
  path: Path | '';
  element: Element | '';
  rarity: 4 | 5 | 0;
  onPath: (p: Path | '') => void;
  onElement: (e: Element | '') => void;
  onRarity: (r: 4 | 5 | 0) => void;
}

// 篩選按鈕基本樣式
function FilterBtn({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
        active ? `${color} font-semibold` : 'border-white/20 text-gray-400 hover:border-white/40 hover:text-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

export default function FilterBar({ path, element, rarity, onPath, onElement, onRarity }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 items-center">
      {/* 稀有度篩選 */}
      <FilterBtn active={rarity === 0} color="bg-white/15 border-white/40 text-white" onClick={() => onRarity(0)}>
        全部
      </FilterBtn>
      <FilterBtn active={rarity === 5} color="bg-[#c9a227]/20 border-[#c9a227]/60 text-[#c9a227]" onClick={() => onRarity(rarity === 5 ? 0 : 5)}>
        5★
      </FilterBtn>
      <FilterBtn active={rarity === 4} color="bg-violet-500/20 border-violet-400/60 text-violet-400" onClick={() => onRarity(rarity === 4 ? 0 : 4)}>
        4★
      </FilterBtn>

      <span className="w-px h-5 bg-white/15 mx-1" />

      {/* 屬性篩選 */}
      {ELEMENTS.map(e => (
        <FilterBtn
          key={e}
          active={element === e}
          color="bg-[#6b4ff5]/20 border-[#6b4ff5]/60 text-violet-300"
          onClick={() => onElement(element === e ? '' : e)}
        >
          {e}
        </FilterBtn>
      ))}

      <span className="w-px h-5 bg-white/15 mx-1" />

      {/* 命途篩選 */}
      {PATHS.map(p => (
        <FilterBtn
          key={p}
          active={path === p}
          color="bg-white/15 border-white/40 text-white"
          onClick={() => onPath(path === p ? '' : p)}
        >
          {p}
        </FilterBtn>
      ))}
    </div>
  );
}
