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

/**
 * 將五個精煉等級的描述合併為單一描述，數值以 / 分隔
 * 例如：「暴擊率提高12%」→「暴擊率提高12/14/16/18/20%」
 */
function mergeRefinements(descriptions: string[]): string {
  if (descriptions.length === 0) return '';
  if (descriptions.length === 1) return descriptions[0];

  // 將描述拆分為文字與數字交錯的 token 陣列
  type Token = { type: 'text' | 'num'; value: string };
  const tokenize = (s: string): Token[] => {
    const parts: Token[] = [];
    const regex = /(\d+\.?\d*)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(s)) !== null) {
      if (m.index > last) parts.push({ type: 'text', value: s.slice(last, m.index) });
      parts.push({ type: 'num', value: m[0] });
      last = regex.lastIndex;
    }
    if (last < s.length) parts.push({ type: 'text', value: s.slice(last) });
    return parts;
  };

  const tokenized = descriptions.map(tokenize);
  const base = tokenized[0];
  let result = '';

  for (let i = 0; i < base.length; i++) {
    const token = base[i];
    if (token.type === 'text') {
      result += token.value;
    } else {
      // 收集所有精煉等級在此位置的數值
      const values = tokenized.map(tokens => tokens[i]?.value ?? token.value);
      const allSame = values.every(v => v === values[0]);
      result += allSame ? token.value : values.join('/');
    }
  }

  return result;
}

export function generateStaticParams() {
  return getAllLightCones().map(lc => ({ id: lc.id }));
}

export default async function LightConePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lc = getLightConeById(id);
  if (!lc) notFound();

  const isGold = lc.rarity === 5;
  const isPurple = lc.rarity === 4;
  const color = RARITY_COLOR[lc.rarity] ?? RARITY_COLOR[3];
  const passiveStyle = PASSIVE_COLOR[lc.rarity] ?? PASSIVE_COLOR[3];

  // 合併精煉描述（用 / 表示差異數值）
  const mergedDesc = mergeRefinements(lc.passive.description);

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* 返回按鈕 */}
      <Link
        href="/lightcones"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-gray-300 hover:text-white hover:border-[#d4af37]/60 hover:bg-[#d4af37]/10 transition-all duration-200 mb-6 group cursor-pointer"
      >
        <span className="transition-transform group-hover:-translate-x-0.5">←</span>
        <span>返回光錐列表</span>
      </Link>

      {/* 頭部英雄區塊 */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-black/40 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* 光錐圖片 */}
          <div className={`
            relative w-44 aspect-[3/4] rounded-2xl overflow-hidden shrink-0
            border bg-gradient-to-b from-[#18192e] to-[#0c0d18]
            ${isGold ? 'border-[#d4af37]/50 card-gold-glow' : isPurple ? 'border-[#7e57c2]/50 card-purple-glow' : 'border-blue-500/40'}
          `}>
            <Image
              src={lc.image}
              alt={lc.name}
              fill
              className="object-contain p-3 drop-shadow-[0_10px_16px_rgba(0,0,0,0.6)]"
              unoptimized
              priority
            />
          </div>

          {/* 基本資訊 + 屬性 */}
          <div className="flex-1 flex flex-col justify-center gap-3 w-full">
            <div className={`
              w-fit text-xs font-black tracking-widest px-2.5 py-0.5 rounded-full backdrop-blur-md border shadow-sm
              ${isGold
                ? 'bg-amber-950/60 border-amber-400/50 text-[#ffd700]'
                : isPurple
                  ? 'bg-purple-950/60 border-purple-400/50 text-purple-300'
                  : 'bg-blue-950/60 border-blue-400/50 text-blue-300'}
            `}>
              {'★'.repeat(lc.rarity)}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{lc.name}</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-xs text-gray-300 font-medium">
                  命途：<span className="text-white font-semibold">{lc.path}</span>
                </span>
              </div>
            </div>

            {/* 滿級屬性（Lv.80） */}
            {lc.stats && (
              <div className="mt-2 pt-3 border-t border-white/[0.08]">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Lv.80 基礎屬性面板
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="flex flex-col items-center rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5 hover:border-white/20 transition-colors">
                    <span className="text-[11px] text-gray-400 mb-0.5">生命值</span>
                    <span className="text-base font-bold text-white">{lc.stats.hp.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-center rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5 hover:border-white/20 transition-colors">
                    <span className="text-[11px] text-gray-400 mb-0.5">攻擊力</span>
                    <span className="text-base font-bold text-white">{lc.stats.atk.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-center rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5 hover:border-white/20 transition-colors">
                    <span className="text-[11px] text-gray-400 mb-0.5">防禦力</span>
                    <span className="text-base font-bold text-white">{lc.stats.def.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 被動技能 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-white tracking-wide">光錐技能</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#ffd700]">
            Passive
          </span>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-black/30">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className={`text-base font-extrabold ${passiveStyle.name}`}>{lc.passive.name}</h3>
            {/* 精煉等級標籤列 */}
            <div className="flex items-center gap-1">
              {REFINEMENT_LABELS.map((label, i) => (
                <span
                  key={i}
                  className="text-[11px] font-extrabold text-[#ffd700] bg-[#d4af37]/15 border border-[#d4af37]/40 rounded-md px-1.5 py-0.5"
                >
                  精{label}
                </span>
              ))}
            </div>
          </div>

          {/* 合併描述 */}
          <p className="text-sm text-gray-200/90 whitespace-pre-line leading-relaxed">
            {mergedDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
