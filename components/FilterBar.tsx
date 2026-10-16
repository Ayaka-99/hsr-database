'use client';

import type { Path, Element } from '@/lib/types';

const PATHS: Path[] = ['存護', '巡獵', '毀滅', '智識', '同諧', '虛無', '豐饒', '記憶', '歡愉'];
const ELEMENTS: Element[] = ['火', '冰', '雷', '風', '量子', '虛數', '物理'];

// 各屬性激活時的獨立配色與微光 (液態高光微調)
const ELEMENT_ACTIVE: Record<string, string> = {
  '火':   'bg-gradient-to-r from-orange-500/30 to-red-500/20 border-orange-400/80 text-orange-200 shadow-[0_0_16px_rgba(249,115,22,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]',
  '冰':   'bg-gradient-to-r from-sky-500/30 to-cyan-500/20 border-sky-400/80 text-sky-100 shadow-[0_0_16px_rgba(56,189,248,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]',
  '雷':   'bg-gradient-to-r from-violet-500/30 to-indigo-500/20 border-violet-400/80 text-violet-100 shadow-[0_0_16px_rgba(167,139,250,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]',
  '風':   'bg-gradient-to-r from-teal-500/30 to-emerald-500/20 border-teal-400/80 text-teal-100 shadow-[0_0_16px_rgba(45,212,191,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]',
  '量子': 'bg-gradient-to-r from-purple-500/30 to-fuchsia-500/20 border-purple-400/80 text-purple-100 shadow-[0_0_16px_rgba(192,132,252,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]',
  '虛數': 'bg-gradient-to-r from-amber-500/30 to-yellow-500/20 border-amber-400/80 text-amber-100 shadow-[0_0_16px_rgba(251,191,36,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]',
  '物理': 'bg-gradient-to-r from-slate-400/30 to-gray-500/20 border-slate-300/80 text-slate-100 shadow-[0_0_16px_rgba(203,213,225,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)]',
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
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-200 cursor-pointer active:scale-95 relative ${
        active
          ? `${activeClass} scale-105 z-10`
          : 'border-white/10 bg-white/[0.04] text-gray-300 hover:border-white/30 hover:text-white hover:bg-white/[0.1] hover:shadow-[0_0_12px_rgba(255,255,255,0.15)]'
      }`}
    >
      {children}
    </button>
  );
}

export default function FilterBar({ path, element, rarity, onPath, onElement, onRarity }: Props) {
  return (
    <div className="p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl liquid-glass shadow-xl mb-6 sm:mb-8 border border-white/15">
      <div className="flex gap-2 items-center overflow-x-auto pb-1 scrollbar-none">
        {/* 稀有度篩選 */}
        <FilterBtn
          active={rarity === 0}
          activeClass="bg-gradient-to-r from-white/25 to-white/10 border-white/60 text-white shadow-[0_0_16px_rgba(255,255,255,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)]"
          onClick={() => onRarity(0)}
        >
          全部
        </FilterBtn>
        <FilterBtn
          active={rarity === 5}
          activeClass="bg-gradient-to-r from-[#d4af37]/35 to-[#f59e0b]/20 border-[#ffd700]/80 text-[#ffd700] shadow-[0_0_18px_rgba(212,175,55,0.5),inset_0_1px_1px_rgba(255,255,255,0.5)]"
          onClick={() => onRarity(rarity === 5 ? 0 : 5)}
        >
          5★ 典藏
        </FilterBtn>
        <FilterBtn
          active={rarity === 4}
          activeClass="bg-gradient-to-r from-purple-600/35 to-violet-500/20 border-purple-400/80 text-purple-200 shadow-[0_0_18px_rgba(168,85,247,0.5),inset_0_1px_1px_rgba(255,255,255,0.5)]"
          onClick={() => onRarity(rarity === 4 ? 0 : 4)}
        >
          4★ 卓越
        </FilterBtn>

        <span className="shrink-0 w-px h-5 bg-white/15 mx-1" />

        {/* 屬性篩選 */}
        {ELEMENTS.map(e => (
          <FilterBtn
            key={e}
            active={element === e}
            activeClass={ELEMENT_ACTIVE[e] ?? 'bg-white/20 border-white/50 text-white'}
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
            activeClass="bg-gradient-to-r from-cyan-500/30 to-sky-500/20 border-cyan-400/80 text-cyan-100 shadow-[0_0_16px_rgba(6,182,212,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]"
            onClick={() => onPath(path === p ? '' : p)}
          >
            {p}
          </FilterBtn>
        ))}
      </div>
    </div>
  );
}
