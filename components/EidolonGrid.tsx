import Image from 'next/image';
import type { Eidolon } from '@/lib/types';

export default function EidolonGrid({ eidolons }: { eidolons: Eidolon[] }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-3">命座</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {eidolons.map(e => (
          <div
            key={e.rank}
            className="flex gap-3 rounded-lg border border-[#c9a227]/20 bg-[#c9a227]/5 p-3"
          >
            {/* 命座圖示 */}
            <div className="relative w-12 h-12 shrink-0">
              <Image
                src={e.image}
                alt={`命座 ${e.rank}`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            {/* 命座資訊 */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[#c9a227] text-xs font-bold">E{e.rank}</span>
                <span className="text-white text-sm font-semibold truncate">{e.name}</span>
              </div>
              <p className="text-xs text-gray-400 whitespace-pre-line leading-relaxed">
                {e.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
