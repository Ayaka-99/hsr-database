'use client';

import type { Path, Element } from '@/lib/types';

const PATHS: Path[] = ['存護', '巡獵', '毀滅', '智識', '同諧', '虛無', '豐饒', '記憶', '歡愉'];
const ELEMENTS: Element[] = ['火', '冰', '雷', '風', '量子', '虛數', '物理'];

// 各屬性激活時的獨立配色
const ELEMENT_ACTIVE: Record<string, string> = {
  '火':   'bg-orange-500/20 border-orange-500/50 text-orange-400',
  '冰':   'bg-sky-500/20    border-sky-500/50    text-sky-300',
  '雷':   'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
  '風':   'bg-teal-500/20   border-teal-500/50   text-teal-300',
  '量子': 'bg-purple-500/20 border-purple-500/50 text-purple-300',
  '虛數': 'bg-amber-500/20  border-amber-500/50  text-amber-300',
  '物理': 'bg-gray-500/20   border-gray-400/50   text-gray-300',
};

interface Props {
  path: Path | '';
  element: Element | '';
  rarity: 4 | 5 | 0;
  onPath: (p: Path | '') => void;
  onElement: (e: Element | '') => void;
  onRarity: (r: 4 | 5 | 0) => void;
}

function FilterBtn({
  active,
  activeClass,
  onClick,
  children,
}: {
  active: boolean;
  activeClass: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-1 rounded-full text-sm border transition-colors ${
        active
          ? `${activeClass} font-semibold`
          : 'border-white/20 text-gray-500 hover:border-white/35 hover:text-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

export default function FilterBar({ path, element, rarity, onPath, onElement, onRarity }: Props) {
  return (
    <div className="flex gap-2 mb-4 sm:mb-6 items-center overflow-x-auto pb-2 scrollbar-none">
      {/* 稀有度篩選 */}
      <FilterBtn active={rarity === 0} activeClass="bg-white/15 border-white/40 text-white" onClick={() => onRarity(0)}>
        全部
      </FilterBtn>
      <FilterBtn active={rarity === 5} activeClass="bg-[#c9a227]/20 border-[#c9a227]/60 text-[#c9a227]" onClick={() => onRarity(rarity === 5 ? 0 : 5)}>
        5★
      </FilterBtn>
      <FilterBtn active={rarity === 4} activeClass="bg-violet-500/20 border-violet-400/60 text-violet-400" onClick={() => onRarity(rarity === 4 ? 0 : 4)}>
        4★
      </FilterBtn>

      <span className="shrink-0 w-px h-5 bg-white/15 mx-1" />

      {/* 屬性篩選（各屬性獨立配色） */}
      {ELEMENTS.map(e => (
        <FilterBtn
          key={e}
          active={element === e}
          activeClass={ELEMENT_ACTIVE[e] ?? 'bg-white/15 border-white/40 text-white'}
          onClick={() => onElement(element === e ? '' : e)}
        >
          {e}
        </FilterBtn>
      ))}

      <span className="shrink-0 w-px h-5 bg-white/15 mx-1" />

      {/* 命途篩選 */}
      {PATHS.map(p => (
        <FilterBtn
          key={p}
          active={path === p}
          activeClass="bg-white/15 border-white/40 text-white"
          onClick={() => onPath(path === p ? '' : p)}
        >
          {p}
        </FilterBtn>
      ))}
    </div>
  );
}
