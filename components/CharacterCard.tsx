'use client';

import Link from 'next/link';
import type { Character } from '@/lib/types';
import { getDisplayName } from '@/lib/api';
import { useLang } from '@/lib/lang';
import AvatarImage from './AvatarImage';

// 屬性漸層背景（用於卡片圖片區）
const ELEMENT_GRADIENT: Record<string, string> = {
  '火':   'from-orange-900/50 to-[#0e0e1e]',
  '冰':   'from-sky-900/50    to-[#0e0e1e]',
  '雷':   'from-violet-900/50 to-[#0e0e1e]',
  '風':   'from-teal-900/50   to-[#0e0e1e]',
  '量子': 'from-purple-900/50 to-[#0e0e1e]',
  '虛數': 'from-amber-900/50  to-[#0e0e1e]',
  '物理': 'from-slate-800/50  to-[#0e0e1e]',
};

// 屬性顏色對照
const ELEMENT_COLOR: Record<string, string> = {
  '火': 'text-orange-400',
  '冰': 'text-cyan-400',
  '雷': 'text-yellow-300',
  '風': 'text-emerald-400',
  '量子': 'text-violet-400',
  '虛數': 'text-amber-300',
  '物理': 'text-gray-300',
};

export default function CharacterCard({ character }: { character: Character }) {
  const { lang } = useLang();
  const isGold = character.rarity === 5;
  const displayName = getDisplayName(character, lang);

  return (
    <Link href={`/characters/${character.id}`} className="group block focus:outline-none">
      <div className={`
        relative rounded-2xl overflow-hidden cursor-pointer
        bg-gradient-to-b from-white/[0.07] to-white/[0.02] border backdrop-blur-md
        transition-all duration-300 ease-out group-hover:-translate-y-1.5
        ${isGold
          ? 'border-[#d4af37]/30 group-hover:border-[#d4af37]/80 card-gold-glow'
          : 'border-[#7e57c2]/30 group-hover:border-[#7e57c2]/80 card-purple-glow'}
      `}>
        {/* 光暈掃掠 (Shimmer sheen) */}
        <div className="animate-shimmer" />

        {/* 稀有度標記 */}
        <div className={`
          absolute top-2.5 right-2.5 text-xs font-black tracking-widest z-10 px-2 py-0.5 rounded-full
          backdrop-blur-md border shadow-sm
          ${isGold
            ? 'bg-amber-950/60 border-amber-400/40 text-[#ffd700]'
            : 'bg-purple-950/60 border-purple-400/40 text-purple-300'}
        `}>
          {'★'.repeat(character.rarity)}
        </div>

        {/* 角色圖片區 */}
        <div className={`relative w-full aspect-square bg-gradient-to-b ${ELEMENT_GRADIENT[character.element] ?? 'from-[#1a1a2e] to-[#0d0d1a]'} overflow-hidden`}>
          <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
            <AvatarImage
              src={character.image}
              alt={displayName}
              className="object-contain p-2.5 drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>

        {/* 角色資訊 */}
        <div className="p-3 bg-[#0f101d]/90 border-t border-white/[0.06] flex flex-col gap-0.5">
          <p className="font-bold text-sm text-gray-100 group-hover:text-white transition-colors truncate">
            {displayName}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="text-gray-400/80">{character.path}</span>
            <span className="inline-block w-1 h-1 rounded-full bg-white/20" />
            <span className={`font-medium ${ELEMENT_COLOR[character.element] ?? 'text-gray-400'}`}>
              {character.element}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
