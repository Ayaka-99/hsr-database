import Image from 'next/image';
import type { Eidolon } from '@/lib/types';

export default function EidolonGrid({ eidolons }: { eidolons: Eidolon[] }) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <h2 className="text-xl font-extrabold text-white tracking-wide">星魂命座</h2>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#d4af37]/30 to-[#ffd700]/20 border border-[#ffd700]/60 text-[#ffd700] shadow-[0_0_12px_rgba(212,175,55,0.3)]">
          Eidolons (6)
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {eidolons.map(e => (
          <div
            key={e.rank}
            className="group flex gap-4 rounded-3xl liquid-glass border border-white/15 hover:border-[#ffd700]/70 p-4 sm:p-5 transition-all duration-300 hover:shadow-[0_12px_30px_-4px_rgba(212,175,55,0.25)] relative overflow-hidden"
          >
            {/* 命座圖示 (3D 浮空微光框) */}
            <div className="relative w-14 h-14 shrink-0 rounded-2xl liquid-capsule p-1.5 flex items-center justify-center overflow-hidden border border-white/20 group-hover:border-[#ffd700]/60">
              <Image
                src={e.image}
                alt={`命座 ${e.rank}`}
                fill
                className="object-contain p-1 transition-transform duration-300 group-hover:scale-115 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                unoptimized
              />
            </div>
            {/* 命座資訊 */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#d4af37]/35 to-[#ffd700]/20 border border-[#ffd700]/60 text-[#ffd700] text-xs font-black shadow-sm">
                  E{e.rank}
                </span>
                <span className="text-white text-sm sm:text-base font-extrabold truncate group-hover:text-[#ffd700] transition-colors">
                  {e.name}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-gray-300 whitespace-pre-line leading-relaxed font-normal">
                {e.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
