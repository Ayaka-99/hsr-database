import Image from 'next/image';
import type { Eidolon } from '@/lib/types';

export default function EidolonGrid({ eidolons }: { eidolons: Eidolon[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-white tracking-wide">星魂命座</h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#ffd700]">
          Eidolons (6)
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {eidolons.map(e => (
          <div
            key={e.rank}
            className="group flex gap-3.5 rounded-2xl border border-white/[0.08] hover:border-[#d4af37]/60 bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:bg-[#d4af37]/[0.05] p-3.5 backdrop-blur-md transition-all duration-300 hover:shadow-[0_4px_20px_-2px_rgba(212,175,55,0.2)]"
          >
            {/* 命座圖示 */}
            <div className="relative w-14 h-14 shrink-0 rounded-xl bg-black/40 border border-white/10 p-1 flex items-center justify-center overflow-hidden">
              <Image
                src={e.image}
                alt={`命座 ${e.rank}`}
                fill
                className="object-contain p-1 transition-transform duration-300 group-hover:scale-110"
                unoptimized
              />
            </div>
            {/* 命座資訊 */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-md bg-[#d4af37]/25 text-[#ffd700] text-xs font-extrabold shadow-sm">
                  E{e.rank}
                </span>
                <span className="text-white text-sm font-bold truncate group-hover:text-[#ffd700] transition-colors">
                  {e.name}
                </span>
              </div>
              <p className="text-xs text-gray-300/90 whitespace-pre-line leading-relaxed">
                {e.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
