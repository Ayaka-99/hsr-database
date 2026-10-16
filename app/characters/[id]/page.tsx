import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCharacterById, getAllCharacters, getDisplayName } from '@/lib/api';
import SkillSection from '@/components/SkillSection';
import EidolonGrid from '@/components/EidolonGrid';
import AvatarImage from '@/components/AvatarImage';
import CharacterAnchorNav from '@/components/CharacterAnchorNav';

// 屬性漸層背景
const ELEMENT_GRADIENT: Record<string, string> = {
  '火':   'from-orange-950/40 via-orange-900/20 to-[#0e0e1e]',
  '冰':   'from-sky-950/40 via-sky-900/20 to-[#0e0e1e]',
  '雷':   'from-violet-950/40 via-violet-900/20 to-[#0e0e1e]',
  '風':   'from-teal-950/40 via-teal-900/20 to-[#0e0e1e]',
  '量子': 'from-purple-950/40 via-purple-900/20 to-[#0e0e1e]',
  '虛數': 'from-amber-950/40 via-amber-900/20 to-[#0e0e1e]',
  '物理': 'from-slate-900/50 via-slate-800/30 to-[#0e0e1e]',
};

// 屬性邊框顏色
const ELEMENT_BORDER: Record<string, string> = {
  '火':   'border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.2)]',
  '冰':   'border-sky-500/50 shadow-[0_0_20px_rgba(56,189,248,0.2)]',
  '雷':   'border-yellow-500/50 shadow-[0_0_20px_rgba(250,204,21,0.2)]',
  '風':   'border-teal-500/50 shadow-[0_0_20px_rgba(45,212,191,0.2)]',
  '量子': 'border-purple-500/50 shadow-[0_0_20px_rgba(192,132,252,0.2)]',
  '虛數': 'border-amber-500/50 shadow-[0_0_20px_rgba(251,191,36,0.2)]',
  '物理': 'border-slate-400/50 shadow-[0_0_20px_rgba(203,213,225,0.15)]',
};

// 屬性文字顏色
const ELEMENT_COLOR: Record<string, string> = {
  '火': 'text-orange-400',
  '冰': 'text-cyan-400',
  '雷': 'text-yellow-300',
  '風': 'text-emerald-400',
  '量子': 'text-violet-400',
  '虛數': 'text-amber-300',
  '物理': 'text-gray-300',
};

// 開拓者性別配對 (男 ↔ 女)
const TB_PAIR: Record<string, string> = {
  '8001': '8002', '8002': '8001',
  '8003': '8004', '8004': '8003',
  '8005': '8006', '8006': '8005',
  '8007': '8008', '8008': '8007',
};
const TB_MALE = new Set(['8001', '8003', '8005', '8007']);

// 靜態生成所有角色頁面
export function generateStaticParams() {
  return getAllCharacters().map(c => ({ id: c.id }));
}

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const character = getCharacterById(id);
  if (!character) notFound();

  const isGold = character.rarity === 5;
  const displayName = getDisplayName(character);

  // 開拓者性別切換
  const partnerId = TB_PAIR[character.id];
  const partnerChar = partnerId ? getCharacterById(partnerId) : null;
  const isMale = TB_MALE.has(character.id);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* 浮動快捷錨點導覽與置頂按鈕 */}
      <CharacterAnchorNav hasEidolons={character.eidolons.length > 0} />

      {/* 返回按鈕 */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-gray-300 hover:text-white hover:border-[#d4af37]/60 hover:bg-[#d4af37]/10 transition-all duration-200 mb-6 group cursor-pointer"
      >
        <span className="transition-transform group-hover:-translate-x-0.5">←</span>
        <span>返回角色列表</span>
      </Link>

      {/* 角色頭部與基本資訊 */}
      <section id="section-stats" className="scroll-mt-24 mb-10">
        <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-black/40">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* 角色立繪頭像框 */}
            <div className={`
              relative w-44 sm:w-52 aspect-square rounded-2xl overflow-hidden shrink-0
              border bg-gradient-to-b ${ELEMENT_GRADIENT[character.element] ?? 'from-[#1a1a2e] to-[#0d0d1a]'}
              ${ELEMENT_BORDER[character.element] ?? (isGold ? 'border-[#d4af37]/50' : 'border-violet-500/50')}
            `}>
              <AvatarImage
                src={character.image}
                alt={displayName}
                className="object-contain p-3 drop-shadow-[0_12px_18px_rgba(0,0,0,0.6)]"
              />
            </div>

            {/* 角色基本資訊與數值 */}
            <div className="flex-1 flex flex-col justify-center gap-3 w-full">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className={`
                  text-xs font-black tracking-widest px-2.5 py-0.5 rounded-full backdrop-blur-md border shadow-sm
                  ${isGold
                    ? 'bg-amber-950/60 border-amber-400/50 text-[#ffd700]'
                    : 'bg-purple-950/60 border-purple-400/50 text-purple-300'}
                `}>
                  {'★'.repeat(character.rarity)}
                </div>

                {/* 開拓者性別切換 */}
                {partnerChar && (
                  <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-full border border-white/10">
                    <Link
                      href={`/characters/${character.id}`}
                      className={`text-xs px-2.5 py-1 rounded-full transition-all duration-200 ${
                        isMale
                          ? 'bg-[#d4af37]/30 text-[#ffd700] font-bold shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      ♂ 男性
                    </Link>
                    <Link
                      href={`/characters/${partnerChar.id}`}
                      className={`text-xs px-2.5 py-1 rounded-full transition-all duration-200 ${
                        !isMale
                          ? 'bg-[#d4af37]/30 text-[#ffd700] font-bold shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      ♀ 女性
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{displayName}</h1>
                <div className="flex items-center gap-3 mt-1.5 text-sm">
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-gray-300">
                    <span className="text-gray-500 text-xs">命途</span>
                    <span className="font-semibold text-white">{character.path}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/[0.05] border border-white/10">
                    <span className="text-gray-500 text-xs">屬性</span>
                    <span className={`font-semibold ${ELEMENT_COLOR[character.element] ?? 'text-white'}`}>
                      {character.element}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lv.80 基礎屬性卡片 */}
              {character.stats && (
                <div className="mt-2 pt-3 border-t border-white/[0.08]">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>Lv.80 基礎數值面板</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { label: '生命值', value: character.stats.hp.toLocaleString() },
                      { label: '攻擊力', value: character.stats.atk.toLocaleString() },
                      { label: '防禦力', value: character.stats.def.toLocaleString() },
                      { label: '速度',   value: character.stats.spd },
                      { label: '暴擊率', value: `${character.stats.critRate}%` },
                      { label: '暴擊傷害', value: `${character.stats.critDmg}%` },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition-colors"
                      >
                        <div className="text-gray-400 text-xs">{label}</div>
                        <div className="text-white font-bold text-base mt-0.5">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 技能與行跡 */}
      <section id="section-skills" className="scroll-mt-24 mb-10">
        <SkillSection
          skills={character.skills}
          characterId={character.id}
          traces={character.traces}
          memosprite={character.memosprite}
          rarity={character.rarity}
        />
      </section>

      {/* 命座 */}
      {character.eidolons.length > 0 && (
        <section id="section-eidolons" className="scroll-mt-24">
          <EidolonGrid eidolons={character.eidolons} />
        </section>
      )}
    </div>
  );
}
