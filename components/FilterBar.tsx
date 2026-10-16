'use client';

import type { Path, Element } from '@/lib/types';

const PATHS: Path[] = ['存護', '巡獵', '毀滅', '智識', '同諧', '虛無', '豐饒', '記憶', '歡愉'];
const ELEMENTS: Element[] = ['火', '冰', '雷', '風', '量子', '虛數', '物理'];

// 各屬性激活時的獨立配色與微光
const ELEMENT_ACTIVE: Record<string, string> = {
  '火':   'bg-orange-500/20 border-orange-500/60 text-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.35)]',
  '冰':   'bg-sky-500/20    border-sky-400/60    text-sky-200    shadow-[0_0_12px_rgba(56,189,248,0.35)]',
  '雷':   'bg-yellow-500/20 border-yellow-400/60 text-yellow-200 shadow-[0_0_12px_rgba(250,204,21,0.35)]',
  '風':   'bg-teal-500/20   border-teal-400/60   text-teal-200   shadow-[0_0_12px_rgba(45,212,191,0.35)]',
  '量子': 'bg-purple-500/20 border-purple-400/60 text-purple-200 shadow-[0_0_12px_rgba(192,132,252,0.35)]',
  '虛數': 'bg-amber-500/20  border-amber-400/60  text-amber-200  shadow-[0_0_12px_rgba(251,191,36,0.35)]',
  '物理': 'bg-slate-500/20  border-slate-300/60  text-slate-200  shadow-[0_0_12px_rgba(203,213,225,0.25)]',
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
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 cursor-pointer active:scale-95 ${
        active
          ? `${activeClass} font-semibold scale-105`
          : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/30 hover:text-gray-100 hover:bg-white/[0.06]'
      }`}
    >
      {children}
    </button>
  );
}

export default function FilterBar({ path, element, rarity, onPath, onElement, onRarity }: Props) {
  return (
    <div className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-xl shadow-lg shadow-black/30 mb-5 sm:mb-7">
      <div className="flex gap-2 items-center overflow-x-auto pb-1 scrollbar-none">
        {/* 稀有度篩選 */}
        <FilterBtn active={rarity === 0} activeClass="bg-white/15 border-white/40 text-white shadow-[0_0_12px_rgba(255,255,255,0.2)]" onClick={() => onRarity(0)}>
          全部
        </FilterBtn>
        <FilterBtn active={rarity === 5} activeClass="bg-[#d4af37]/25 border-[#d4af37]/80 text-[#ffd700] shadow-[0_0_14px_rgba(212,175,55,0.4)]" onClick={() => onRarity(rarity === 5 ? 0 : 5)}>
          5★
        </FilterBtn>
        <FilterBtn active={rarity === 4} activeClass="bg-violet-600/25 border-violet-400/80 text-violet-300 shadow-[0_0_14px_rgba(139,92,246,0.4)]" onClick={() => onRarity(rarity === 4 ? 0 : 4)}>
          4★
        </FilterBtn>

        <span className="shrink-0 w-px h-5 bg-white/10 mx-1" />

        {/* 屬性篩選 */}
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

        <span className="shrink-0 w-px h-5 bg-white/10 mx-1" />

        {/* 命途篩選 */}
        {PATHS.map(p => (
          <FilterBtn
            key={p}
            active={path === p}
            activeClass="bg-cyan-500/20 border-cyan-400/60 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            onClick={() => onPath(path === p ? '' : p)}
          >
            {p}
          </FilterBtn>
        ))}
      </div>
    </div>
  );
}
