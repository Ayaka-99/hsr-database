import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getLightConeById, getAllLightCones } from '@/lib/api';

// 精煉等級標籤
const REFINEMENT_LABELS = ['一', '二', '三', '四', '五'];

// 被動技能區塊顏色（依稀有度）
const PASSIVE_COLOR: Record<number, { border: string; bg: string; name: string }> = {
  5: { border: 'border-[#c9a227]/20', bg: 'bg-[#c9a227]/5',    name: 'text-[#c9a227]' },
  4: { border: 'border-violet-500/20', bg: 'bg-violet-500/5',  name: 'text-violet-400' },
  3: { border: 'border-blue-500/20',   bg: 'bg-blue-500/5',    name: 'text-blue-400' },
};

// 稀有度顏色
const RARITY_COLOR: Record<number, string> = {
  5: 'text-[#c9a227] border-[#c9a227]/40',
  4: 'text-violet-400 border-violet-500/40',
  3: 'text-blue-400 border-blue-500/40',
};

export function generateStaticParams() {
  return getAllLightCones().map(lc => ({ id: lc.id }));
}

export default async function LightConePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lc = getLightConeById(id);
  if (!lc) notFound();

  const color = RARITY_COLOR[lc.rarity] ?? RARITY_COLOR[3];
  const passiveStyle = PASSIVE_COLOR[lc.rarity] ?? PASSIVE_COLOR[3];

  return (
    <div className="max-w-3xl mx-auto">
      {/* 返回按鈕 */}
      <Link href="/lightcones" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-200 transition-colors mb-6">
        ← 光錐列表
      </Link>

      {/* 頭部 */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        {/* 光錐圖片 */}
        <div className={`
          relative w-40 aspect-[3/4] h-auto rounded-xl overflow-hidden shrink-0
          border bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] ${color}
        `}>
          <Image
            src={lc.image}
            alt={lc.name}
            fill
            className="object-contain p-3"
            unoptimized
            priority
          />
        </div>

        {/* 基本資訊 */}
        <div className="flex flex-col justify-center gap-2">
          <div className={`text-sm font-semibold ${color.split(' ')[0]}`}>
            {'★'.repeat(lc.rarity)}
          </div>
          <h1 className="text-3xl font-bold text-white">{lc.name}</h1>
          <div className="text-sm">
            <span className="text-gray-500">命途  </span>
            <span className="text-white font-medium">{lc.path}</span>
          </div>
        </div>
      </div>

      {/* 被動技能 */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">被動技能</h2>
        <div className={`rounded-xl border ${passiveStyle.border} ${passiveStyle.bg} p-4`}>
          <p className={`${passiveStyle.name} font-semibold mb-4`}>{lc.passive.name}</p>

          {/* 各精煉等級描述 */}
          <div className="space-y-3">
            {lc.passive.description.map((desc, i) => (
              <div key={i} className="flex gap-3">
                <span className="shrink-0 text-xs font-bold text-[#c9a227] bg-[#c9a227]/10 border border-[#c9a227]/30 rounded-full px-2 py-0.5 h-fit">
                  精{REFINEMENT_LABELS[i] ?? i + 1}
                </span>
                <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
