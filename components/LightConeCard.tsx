import Image from 'next/image';
import Link from 'next/link';
import type { LightCone } from '@/lib/types';

// 稀有度顏色
const RARITY_COLOR: Record<number, string> = {
  5: 'text-[#c9a227] border-[#c9a227]/30 hover:border-[#c9a227]/70 hover:shadow-[0_0_20px_#c9a22730]',
  4: 'text-violet-400 border-violet-500/30 hover:border-violet-500/70 hover:shadow-[0_0_20px_#6b4ff530]',
  3: 'text-blue-400 border-blue-500/30 hover:border-blue-500/60',
};

export default function LightConeCard({ lc }: { lc: LightCone }) {
  const isGold = lc.rarity === 5;
  const isPurple = lc.rarity === 4;

  return (
    <Link href={`/lightcones/${lc.id}`} className="group block focus:outline-none">
      <div className={`
        relative rounded-2xl overflow-hidden cursor-pointer
        bg-gradient-to-b from-white/[0.07] to-white/[0.02] border backdrop-blur-md
        transition-all duration-300 ease-out group-hover:-translate-y-1.5
        ${isGold
          ? 'border-[#d4af37]/30 group-hover:border-[#d4af37]/80 card-gold-glow'
          : isPurple
            ? 'border-[#7e57c2]/30 group-hover:border-[#7e57c2]/80 card-purple-glow'
            : 'border-blue-500/25 group-hover:border-blue-400/60 hover:shadow-[0_4px_20px_-2px_rgba(59,130,246,0.3)]'}
      `}>
        {/* 光暈掃掠 (Shimmer sheen) */}
        <div className="animate-shimmer" />

        {/* 稀有度 */}
        <div className={`
          absolute top-2.5 right-2.5 text-xs font-black tracking-widest z-10 px-2 py-0.5 rounded-full
          backdrop-blur-md border shadow-sm
          ${isGold
            ? 'bg-amber-950/60 border-amber-400/40 text-[#ffd700]'
            : isPurple
              ? 'bg-purple-950/60 border-purple-400/40 text-purple-300'
              : 'bg-blue-950/60 border-blue-400/40 text-blue-300'}
        `}>
          {'★'.repeat(lc.rarity)}
        </div>

        {/* 光錐圖片 */}
        <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-[#18192e] to-[#0c0d18] overflow-hidden">
          <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
            <Image
              src={lc.image}
              alt={lc.name}
              fill
              className="object-contain p-3 drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)]"
              unoptimized
            />
          </div>
        </div>

        {/* 光錐資訊 */}
        <div className="p-3 bg-[#0f101d]/90 border-t border-white/[0.06]">
          <p className="font-bold text-sm text-gray-100 group-hover:text-white transition-colors truncate">{lc.name}</p>
          <p className="text-xs mt-0.5 text-gray-400">{lc.path}</p>
        </div>
      </div>
    </Link>
  );
}
