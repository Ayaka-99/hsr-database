'use client';

import { useState, useEffect } from 'react';
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

// 一組篩選：左側固定標籤 + 右側可換行按鈕
function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-12 shrink-0 pt-2 text-xs font-bold text-gray-400">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default function FilterBar({ path, element, rarity, onPath, onElement, onRarity }: Props) {
  const hasActiveFilter = rarity !== 0 || element !== '' || path !== '';
  const activeCount = (rarity !== 0 ? 1 : 0) + (element !== '' ? 1 : 0) + (path !== '' ? 1 : 0);

  // 收合狀態：手機預設收合、桌面預設展開（掛載後依視窗寬度決定，避免 SSR 水合不一致）
  const [expanded, setExpanded] = useState(true);
  useEffect(() => {
    if (window.innerWidth < 640) setExpanded(false);
  }, []);

  const clearAll = () => {
    onRarity(0);
    onElement('');
    onPath('');
  };

  return (
    <div className="sticky top-[76px] sm:top-[88px] z-40 rounded-2xl border border-white/15 p-3 shadow-xl liquid-glass mb-6 sm:rounded-3xl sm:p-4 sm:mb-8">
      {/* 標題列：點按收合／展開；清除全部只在展開且有篩選時顯示 */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? '收合篩選面板' : '展開篩選面板'}
          className="flex cursor-pointer items-center gap-2 py-0.5 text-xs font-bold tracking-[0.2em] text-gray-300 transition-colors hover:text-white"
        >
          篩選
          <span className="text-[10px] text-gray-400">{expanded ? '▲' : '▼'}</span>
          {!expanded && hasActiveFilter && (
            <span className="rounded-full border border-[#ffd700]/40 bg-[#d4af37]/20 px-2 py-0.5 text-[10px] font-bold tracking-normal text-[#ffd700]">
              已選 {activeCount} 項
            </span>
          )}
        </button>
        {expanded && hasActiveFilter && (
          <button
            type="button"
            onClick={clearAll}
            className="cursor-pointer rounded-full border border-[#ffd700]/40 bg-[#d4af37]/10 px-2.5 py-1 text-[11px] font-bold text-[#ffd700] transition-colors hover:bg-[#d4af37]/20"
          >
            ✕ 清除全部
          </button>
        )}
      </div>

      {expanded && (
      <div className="mt-2.5 flex flex-col gap-2.5">
        {/* 稀有度篩選 */}
        <FilterGroup label="稀有度">
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
        </FilterGroup>

        {/* 屬性篩選 */}
        <FilterGroup label="屬性">
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
        </FilterGroup>

        {/* 命途篩選 */}
        <FilterGroup label="命途">
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
        </FilterGroup>
      </div>
      )}
    </div>
  );
}
