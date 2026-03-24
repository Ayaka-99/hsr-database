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
  const color = RARITY_COLOR[lc.rarity] ?? RARITY_COLOR[3];

  return (
    <Link href={`/lightcones/${lc.id}`}>
      <div className={`
        relative rounded-xl overflow-hidden cursor-pointer
        bg-white/5 border backdrop-blur-sm
        transition-all duration-200 hover:scale-105 ${color}
      `}>
        {/* 稀有度 */}
        <div className={`absolute top-2 right-2 text-xs font-bold z-10 ${color.split(' ')[0]}`}>
          {'★'.repeat(lc.rarity)}
        </div>

        {/* 光錐圖片 */}
        <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a]">
          <Image
            src={lc.image}
            alt={lc.name}
            fill
            className="object-contain p-2"
            unoptimized
          />
        </div>

        {/* 光錐資訊 */}
        <div className="p-3 border-t border-white/5">
          <p className="font-semibold text-sm text-white truncate">{lc.name}</p>
          <p className="text-xs mt-0.5 text-gray-400">{lc.path}</p>
        </div>
      </div>
    </Link>
  );
}
