'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import type { Character } from '@/lib/types';
import { getDisplayName } from '@/lib/api';
import { useLang } from '@/lib/lang';
import AvatarImage from './AvatarImage';

// 屬性微光漸變（用於卡片背部有機液態光環）
const ELEMENT_GLOW: Record<string, string> = {
  '火':   'from-orange-500/25 via-red-500/10 to-transparent',
  '冰':   'from-sky-400/25 via-cyan-500/10 to-transparent',
  '雷':   'from-violet-400/25 via-indigo-500/10 to-transparent',
  '風':   'from-emerald-400/25 via-teal-500/10 to-transparent',
  '量子': 'from-purple-500/25 via-fuchsia-500/10 to-transparent',
  '虛數': 'from-amber-400/25 via-yellow-500/10 to-transparent',
  '物理': 'from-slate-400/25 via-gray-500/10 to-transparent',
};

// 屬性文字與膠囊邊框對照
const ELEMENT_BADGE: Record<string, { text: string; bg: string; border: string }> = {
  '火':   { text: 'text-orange-300', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
  '冰':   { text: 'text-cyan-200',   bg: 'bg-sky-500/15',    border: 'border-sky-400/30' },
  '雷':   { text: 'text-purple-200', bg: 'bg-violet-500/15', border: 'border-violet-400/30' },
  '風':   { text: 'text-emerald-200',bg: 'bg-teal-500/15',   border: 'border-teal-400/30' },
  '量子': { text: 'text-fuchsia-200',bg: 'bg-purple-500/15', border: 'border-purple-400/30' },
  '虛數': { text: 'text-amber-200',  bg: 'bg-amber-500/15',  border: 'border-amber-400/30' },
  '物理': { text: 'text-slate-200',  bg: 'bg-slate-500/15',  border: 'border-slate-400/30' },
};

export default function CharacterCard({ character }: { character: Character }) {
  const { lang } = useLang();
  const isGold = character.rarity === 5;
  const displayName = getDisplayName(character, lang);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  // 實時 3D 陀螺儀微視差與滑鼠光斑追蹤
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // 計算微幅 3D 傾斜角度（±5deg）
    const rotateY = ((x - 50) / 50) * 5;
    const rotateX = ((y - 50) / 50) * -5;

    cardRef.current.style.setProperty('--mouse-x', `${x}%`);
    cardRef.current.style.setProperty('--mouse-y', `${y}%`);
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const badgeStyle = ELEMENT_BADGE[character.element] ?? {
    text: 'text-gray-300',
    bg: 'bg-white/10',
    border: 'border-white/20',
  };

  return (
    <Link href={`/characters/${character.id}`} className="group block focus:outline-none pt-6 select-none">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
        }}
        className={`
          relative rounded-3xl cursor-pointer
          liquid-glass backdrop-blur-2xl
          ${isGold
            ? 'border-[#ffd700]/30 group-hover:border-[#ffd700]/80 card-gold-glow'
            : 'border-purple-500/30 group-hover:border-purple-400/80 card-purple-glow'}
        `}
      >
        {/* 動態液體跟隨高光 (Liquid Specular Shine) */}
        <div className={isGold ? 'liquid-specular-gold' : 'liquid-specular-purple'} />

        {/* 頂部光暈掃掠 */}
        <div className="animate-shimmer" />

        {/* 頂部星級浮空膠囊 */}
        <div className={`
          absolute top-3 right-3 text-[11px] font-black tracking-widest z-30 px-2.5 py-0.5 rounded-full
          backdrop-blur-xl border shadow-lg
          ${isGold
            ? 'bg-amber-950/70 border-amber-400/60 text-[#ffd700] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
            : 'bg-purple-950/70 border-purple-400/60 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]'}
        `}>
          {'★'.repeat(character.rarity)}
        </div>

        {/* 角色立繪區：立體破框突破感 (-mt-8 使立繪突破上邊界) */}
        <div className="relative w-full aspect-[4/4.2] overflow-visible flex items-center justify-center -mt-8 pt-2">
          {/* 背後屬性有機流態圓光 */}
          <div className={`
            absolute inset-3 rounded-full bg-gradient-to-tr ${ELEMENT_GLOW[character.element] ?? 'from-white/10 to-transparent'}
            blur-2xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 pointer-events-none
          `} />

          {/* 破框立繪本體 */}
          <div className="relative w-full h-full z-10 popout-character flex items-center justify-center p-1">
            <AvatarImage
              src={character.image}
              alt={displayName}
              className="object-contain w-full h-full drop-shadow-[0_16px_22px_rgba(0,0,0,0.7)]"
            />
          </div>
        </div>

        {/* 下方液態玻璃資訊基座 */}
        <div className="p-3.5 pt-2 flex flex-col gap-2 relative z-20">
          {/* 角色名稱 */}
          <div className="flex items-center justify-between gap-1.5">
            <h3 className="font-extrabold text-sm sm:text-base text-gray-100 group-hover:text-white transition-colors truncate drop-shadow-sm">
              {displayName}
            </h3>
          </div>

          {/* 懸浮液態膠囊資訊列 (VisionOS Capsule Pills) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* 命途膠囊 */}
            <span className="liquid-capsule px-2.5 py-0.5 rounded-full text-[11px] font-medium text-gray-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
              {character.path}
            </span>

            {/* 屬性膠囊 */}
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md ${badgeStyle.bg} ${badgeStyle.border} ${badgeStyle.text} shadow-sm`}>
              {character.element}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
