'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { LightCone } from '@/lib/types';

export default function LightConeCard({ lc }: { lc: LightCone }) {
  const isGold = lc.rarity === 5;
  const isPurple = lc.rarity === 4;
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const rotateY = ((x - 50) / 50) * 5;
    const rotateX = ((y - 50) / 50) * -5;

    cardRef.current.style.setProperty('--mouse-x', `${x}%`);
    cardRef.current.style.setProperty('--mouse-y', `${y}%`);
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <Link href={`/lightcones/${lc.id}`} className="group block focus:outline-none select-none">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
        }}
        className={`
          relative rounded-3xl overflow-hidden cursor-pointer
          liquid-glass backdrop-blur-2xl
          transition-all duration-300
          ${isGold
            ? 'border-[#ffd700]/30 group-hover:border-[#ffd700]/80 card-gold-glow'
            : isPurple
              ? 'border-purple-500/30 group-hover:border-purple-400/80 card-purple-glow'
              : 'border-blue-500/25 group-hover:border-blue-400/60 hover:shadow-[0_4px_20px_-2px_rgba(59,130,246,0.3)]'}
        `}
      >
        {/* 動態液體跟隨高光 */}
        <div className={isGold ? 'liquid-specular-gold' : isPurple ? 'liquid-specular-purple' : 'liquid-specular-shine'} />

        {/* 光暈掃掠 */}
        <div className="animate-shimmer" />

        {/* 稀有度浮空標記 */}
        <div className={`
          absolute top-3 right-3 text-[11px] font-black tracking-widest z-30 px-2.5 py-0.5 rounded-full
          backdrop-blur-xl border shadow-lg
          ${isGold
            ? 'bg-amber-950/70 border-amber-400/60 text-[#ffd700] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
            : isPurple
              ? 'bg-purple-950/70 border-purple-400/60 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
              : 'bg-blue-950/70 border-blue-400/60 text-blue-200'}
        `}>
          {'★'.repeat(lc.rarity)}
        </div>

        {/* 光錐圖片區 */}
        <div className="relative w-full aspect-[3/3.8] bg-gradient-to-b from-white/[0.04] to-black/40 overflow-hidden flex items-center justify-center p-3">
          <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-108 relative">
            <Image
              src={lc.image}
              alt={lc.name}
              fill
              className="object-contain p-2 drop-shadow-[0_12px_20px_rgba(0,0,0,0.6)]"
              unoptimized
            />
          </div>
        </div>

        {/* 光錐資訊基座 */}
        <div className="p-3.5 pt-2.5 bg-gradient-to-b from-black/40 to-black/70 border-t border-white/[0.08] flex flex-col gap-1.5 relative z-20">
          <p className="font-extrabold text-sm text-gray-100 group-hover:text-white transition-colors truncate drop-shadow-sm">
            {lc.name}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="liquid-capsule px-2.5 py-0.5 rounded-full text-[11px] font-medium text-gray-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
              {lc.path}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
