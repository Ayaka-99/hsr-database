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
    <Link href={`/characters/${character.id}`}>
      <div className={`
        relative rounded-xl overflow-hidden cursor-pointer
        bg-white/5 border backdrop-blur-sm
        transition-all duration-200 hover:scale-105
        ${isGold
          ? 'border-[#c9a227]/30 hover:border-[#c9a227]/70 hover:shadow-[0_0_20px_#c9a22730]'
          : 'border-[#6b4ff5]/30 hover:border-[#6b4ff5]/70 hover:shadow-[0_0_20px_#6b4ff530]'}
      `}>
        {/* 稀有度標記 */}
        <div className={`absolute top-2 right-2 text-xs font-bold z-10 ${isGold ? 'text-[#c9a227]' : 'text-violet-400'}`}>
          {'★'.repeat(character.rarity)}
        </div>

        {/* 角色圖片 */}
        <div className={`relative w-full aspect-square bg-gradient-to-b ${ELEMENT_GRADIENT[character.element] ?? 'from-[#1a1a2e] to-[#0d0d1a]'}`}>
          <AvatarImage
            src={character.image}
            alt={displayName}
            className="object-contain p-3"
          />
        </div>

        {/* 角色資訊 */}
        <div className="p-3 border-t border-white/5">
          <p className="font-semibold text-sm text-white truncate">{displayName}</p>
          <p className="text-xs mt-0.5 text-gray-400">
            {character.path} ·{' '}
            <span className={ELEMENT_COLOR[character.element] ?? 'text-gray-400'}>
              {character.element}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
