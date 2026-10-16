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
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-capsule text-xs sm:text-sm text-gray-200 hover:text-white hover:border-[#ffd700]/70 hover:shadow-[0_0_16px_rgba(212,175,55,0.3)] transition-all duration-300 mb-6 group cursor-pointer"
      >
        <span className="transition-transform group-hover:-translate-x-1 font-bold">←</span>
        <span>返回光錐典藏</span>
      </Link>

      {/* 頭部英雄區塊 (VisionOS Spatial Bento) */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass shadow-2xl relative overflow-hidden border border-white/20 mb-8">
        <div className="flex flex-col sm:flex-row gap-7 items-center sm:items-start relative z-10">
          {/* 光錐圖片 (3D 浮空光學框) */}
          <div className={`
            relative w-48 sm:w-52 aspect-[3/4] rounded-3xl overflow-hidden shrink-0
            liquid-glass border-2
            ${isGold ? 'border-[#ffd700]/60 card-gold-glow' : isPurple ? 'border-purple-400/60 card-purple-glow' : 'border-blue-400/50'}
          `}>
            <Image
              src={lc.image}
              alt={lc.name}
              fill
              className="object-contain p-3 drop-shadow-[0_16px_25px_rgba(0,0,0,0.7)]"
              unoptimized
              priority
            />
          </div>

          {/* 基本資訊 + 屬性 */}
          <div className="flex-1 flex flex-col justify-center gap-3.5 w-full">
            <div className={`
              w-fit text-xs font-black tracking-widest px-3 py-1 rounded-full backdrop-blur-xl border shadow-lg
              ${isGold
                ? 'bg-amber-950/70 border-amber-400/60 text-[#ffd700] shadow-[0_0_14px_rgba(212,175,55,0.4)]'
                : isPurple
                  ? 'bg-purple-950/70 border-purple-400/60 text-purple-200 shadow-[0_0_14px_rgba(168,85,247,0.4)]'
                  : 'bg-blue-950/70 border-blue-400/60 text-blue-200'}
            `}>
              {'★'.repeat(lc.rarity)}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">{lc.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="liquid-capsule px-3 py-1 rounded-full text-xs text-gray-300 font-medium">
                  命途：<span className="text-white font-bold">{lc.path}</span>
                </span>
              </div>
            </div>

            {/* 滿級屬性（Lv.80）Bento 模組 */}
            {lc.stats && (
              <div className="mt-2 pt-3 border-t border-white/[0.1]">
                <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />
                  <span>Lv.80 基礎屬性面板</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="flex flex-col items-center rounded-2xl liquid-capsule p-3 hover:border-white/30 transition-all duration-200">
                    <span className="text-[11px] text-gray-400 mb-0.5">生命值</span>
                    <span className="text-base font-extrabold text-white tracking-tight">{lc.stats.hp.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-center rounded-2xl liquid-capsule p-3 hover:border-white/30 transition-all duration-200">
                    <span className="text-[11px] text-gray-400 mb-0.5">攻擊力</span>
                    <span className="text-base font-extrabold text-white tracking-tight">{lc.stats.atk.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-center rounded-2xl liquid-capsule p-3 hover:border-white/30 transition-all duration-200">
                    <span className="text-[11px] text-gray-400 mb-0.5">防禦力</span>
                    <span className="text-base font-extrabold text-white tracking-tight">{lc.stats.def.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 被動技能 (Liquid Glass Panel) */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <h2 className="text-xl font-extrabold text-white tracking-wide">光錐技能被動</h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#d4af37]/30 to-[#ffd700]/20 border border-[#ffd700]/60 text-[#ffd700] shadow-[0_0_12px_rgba(212,175,55,0.3)]">
            Passive
          </span>
        </div>
        <div className="rounded-3xl liquid-glass p-6 sm:p-7 shadow-2xl border border-white/15">
          <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2.5">
            <h3 className={`text-base sm:text-lg font-black ${passiveStyle.name} drop-shadow-sm`}>{lc.passive.name}</h3>
            {/* 精煉等級標籤列 */}
            <div className="flex items-center gap-1.5">
              {REFINEMENT_LABELS.map((label, i) => (
                <span
                  key={i}
                  className="text-[11px] font-black text-[#ffd700] bg-gradient-to-r from-[#d4af37]/25 to-[#ffd700]/15 border border-[#ffd700]/50 rounded-full px-2 py-0.5 shadow-sm"
                >
                  精{label}
                </span>
              ))}
            </div>
          </div>

          {/* 合併描述 */}
          <p className="text-sm text-gray-200 leading-relaxed font-normal">
            {mergedDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
