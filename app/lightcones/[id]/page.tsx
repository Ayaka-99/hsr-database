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

  const color = RARITY_COLOR[lc.rarity] ?? RARITY_COLOR[3];
  const passiveStyle = PASSIVE_COLOR[lc.rarity] ?? PASSIVE_COLOR[3];

  // 合併精煉描述（用 / 表示差異數值）
  const mergedDesc = mergeRefinements(lc.passive.description);

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

        {/* 基本資訊 + 屬性 */}
        <div className="flex flex-col justify-center gap-2">
          <div className={`text-sm font-semibold ${color.split(' ')[0]}`}>
            {'★'.repeat(lc.rarity)}
          </div>
          <h1 className="text-3xl font-bold text-white">{lc.name}</h1>
          <div className="text-sm">
            <span className="text-gray-500">命途  </span>
            <span className="text-white font-medium">{lc.path}</span>
          </div>

          {/* 滿級屬性（Lv.80） */}
          {lc.stats && (
            <div className="mt-2 flex flex-wrap gap-3">
              <div className="flex flex-col items-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 min-w-[72px]">
                <span className="text-[10px] text-gray-500 mb-0.5">生命值</span>
                <span className="text-sm font-bold text-white">{lc.stats.hp.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 min-w-[72px]">
                <span className="text-[10px] text-gray-500 mb-0.5">攻擊力</span>
                <span className="text-sm font-bold text-white">{lc.stats.atk.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 min-w-[72px]">
                <span className="text-[10px] text-gray-500 mb-0.5">防禦力</span>
                <span className="text-sm font-bold text-white">{lc.stats.def.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 被動技能 */}
      <div>
        <h2 className="text-lg font-bold text-white mb-3">被動技能</h2>
        <div className={`rounded-xl border ${passiveStyle.border} ${passiveStyle.bg} p-4`}>
          <p className={`${passiveStyle.name} font-semibold mb-4`}>{lc.passive.name}</p>

          {/* 精煉等級標籤列 */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {REFINEMENT_LABELS.map((label, i) => (
              <span key={i} className="text-xs font-bold text-[#c9a227] bg-[#c9a227]/10 border border-[#c9a227]/30 rounded-full px-2 py-0.5">
                精{label}
              </span>
            ))}
          </div>

          {/* 合併描述 */}
          <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{mergedDesc}</p>
        </div>
      </div>
    </div>
  );
}
