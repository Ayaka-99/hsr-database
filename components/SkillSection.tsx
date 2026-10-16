'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Character, CharacterTrace, Memosprite } from '@/lib/types';

// 技能槽顯示名稱
const SKILL_LABELS: Record<keyof Character['skills'], string> = {
  basic: '普通攻擊',
  skill: '戰技',
  ult: '終結技',
  talent: '天賦',
  technique: '秘技',
};

// 技能圖示 URL 後綴
const SKILL_ICON_SUFFIX: Record<keyof Character['skills'], string> = {
  basic: 'basic_atk',
  skill: 'skill',
  ult: 'ultimate',
  talent: 'talent',
  technique: 'technique',
};

// 技能槽顏色
const SKILL_COLORS: Record<keyof Character['skills'], string> = {
  basic: 'border-gray-500/40 bg-gray-500/5',
  skill: 'border-blue-500/40 bg-blue-500/5',
  ult: 'border-[#c9a227]/40 bg-[#c9a227]/5',
  talent: 'border-emerald-500/40 bg-emerald-500/5',
  technique: 'border-violet-500/40 bg-violet-500/5',
};

const SKILL_LABEL_COLORS: Record<keyof Character['skills'], string> = {
  basic: 'text-gray-400',
  skill: 'text-blue-400',
  ult: 'text-[#c9a227]',
  talent: 'text-emerald-400',
  technique: 'text-violet-400',
};

// 秘技只有 1 級，不顯示滑動條
const NO_LEVELS = new Set<keyof Character['skills']>(['technique']);

// 各技能類型的最大等級上限
const MAX_LEVEL_CAP: Record<keyof Character['skills'], number> = {
  basic: 7,
  skill: 12,
  ult: 12,
  talent: 12,
  technique: 1,
};

// 依稀有度與技能類型計算預設等級
function defaultLevel(key: keyof Character['skills'], rarity: 4 | 5, maxLv: number): number {
  const base = key === 'basic' ? (rarity === 4 ? 7 : 6) : (rarity === 4 ? 12 : 10);
  return Math.min(base, maxLv);
}

// 屬性名稱對照（statType → 繁體中文）
const STAT_NAMES: Record<string, string> = {
  HPAddedRatio:                '生命值',
  AttackAddedRatio:            '攻擊力',
  DefenceAddedRatio:           '防禦力',
  SpeedDelta:                  '速度',
  CriticalChanceBase:          '暴擊率',
  CriticalDamageBase:          '暴擊傷害',
  StatusProbabilityBase:       '效果命中',
  StatusResistanceBase:        '效果抵抗',
  BreakDamageAddedRatioBase:   '擊破特攻',
  FireAddedRatio:              '火屬性傷害提高',
  IceAddedRatio:               '冰屬性傷害提高',
  ThunderAddedRatio:           '雷屬性傷害提高',
  WindAddedRatio:              '風屬性傷害提高',
  QuantumAddedRatio:           '量子屬性傷害提高',
  ImaginaryAddedRatio:         '虛數屬性傷害提高',
  PhysicalAddedRatio:          '物理屬性傷害提高',
  ElationDamageAddedRatioBase: '歡愉屬性傷害提高',
};

// 格式化加總後的行迹屬性數值
function formatStatValue(statType: string, total: number): string {
  if (statType === 'SpeedDelta') return `+${total % 1 === 0 ? total : total.toFixed(1)}`;
  const pct = total * 100;
  return `+${pct % 1 === 0 ? pct : parseFloat(pct.toFixed(1))}%`;
}

export default function SkillSection({
  skills,
  characterId,
  traces,
  memosprite,
  rarity = 5,
}: {
  skills: Character['skills'];
  characterId: string;
  traces?: CharacterTrace[];
  memosprite?: Memosprite;
  rarity?: 4 | 5;
}) {
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [memoLevels, setMemoLevels] = useState<Record<string, number>>({});
  const keys = Object.keys(SKILL_LABELS) as Array<keyof Character['skills']>;

  function getSkillIconUrl(key: keyof Character['skills']): string {
    return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/skill/${characterId}_${SKILL_ICON_SUFFIX[key]}.png`;
  }

  // 只顯示非詩行跡的 ability traces（詩行跡已移至憶靈技區塊）
  const abilityTraces = traces?.filter(
    t => t.type === 'ability' && !t.anchor.startsWith('poem_')
  ) ?? [];
  const hasTraces = traces && traces.length > 0;

  const statSummary = (traces ?? [])
    .filter(t => t.type === 'stat' && t.statType)
    .reduce<Record<string, { name: string; total: number }>>((acc, t) => {
      const key = t.statType!;
      if (!acc[key]) acc[key] = { name: STAT_NAMES[key] ?? t.name, total: 0 };
      acc[key].total += t.value ?? 0;
      return acc;
    }, {});

  return (
    <div>
      {/* ── 技能區塊 ── */}
      <div className="flex items-center gap-2.5 mb-5">
        <h2 className="text-xl font-extrabold text-white tracking-wide">戰鬥技能體系</h2>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/60 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
          Combat Skills
        </span>
      </div>
      <div className="space-y-4">
        {keys.map(key => {
          const skill = skills[key];
          if (!skill.name) return null;

          const descs = skill.descriptions ?? [];
          const maxLv = Math.min(descs.length, MAX_LEVEL_CAP[key]);
          const showSlider = !NO_LEVELS.has(key) && maxLv > 1;
          const lv = levels[key] ?? defaultLevel(key, rarity, maxLv);
          const description = showSlider && descs[lv - 1]
            ? descs[lv - 1]
            : skill.description;

          return (
            <div
              key={key}
              className="rounded-3xl liquid-glass border border-white/15 p-5 sm:p-6 transition-all duration-300 hover:border-white/30 hover:shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center gap-3.5 mb-3 flex-wrap">
                <div className="relative w-12 h-12 shrink-0 rounded-2xl liquid-capsule p-1.5 border border-white/20 flex items-center justify-center">
                  <Image
                    src={getSkillIconUrl(key)}
                    alt={skill.name}
                    fill
                    className="object-contain p-1 drop-shadow-md"
                    unoptimized
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex items-center gap-2.5">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${SKILL_LABEL_COLORS[key]} border-current/40 bg-white/[0.04] backdrop-blur-md shadow-sm`}>
                    {SKILL_LABELS[key]}
                  </span>
                  <span className="text-white font-black text-base sm:text-lg tracking-tight">{skill.name}</span>
                </div>
                {showSlider && (
                  <span className={`ml-auto text-xs font-black px-3 py-1 rounded-full liquid-capsule ${SKILL_LABEL_COLORS[key]} border-current/40`}>
                    Lv.{lv} / {maxLv}
                  </span>
                )}
              </div>

              {showSlider && (
                <div className="mb-4 px-4 py-2.5 rounded-2xl liquid-capsule flex items-center gap-3 border border-white/10">
                  <span className="text-[11px] font-bold text-gray-400 shrink-0">Lv.1</span>
                  <input
                    type="range"
                    min={1}
                    max={maxLv}
                    value={lv}
                    onChange={e => setLevels(prev => ({ ...prev, [key]: +e.target.value }))}
                    className="flex-1 h-2 rounded-lg accent-[#ffd700] bg-white/10 cursor-pointer"
                  />
                  <span className="text-[11px] font-bold text-gray-400 shrink-0">Lv.{maxLv}</span>
                </div>
              )}

              <p className="text-sm sm:text-[15px] text-gray-200 whitespace-pre-line leading-relaxed font-normal">
                {description || '—'}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── 憶靈技區塊 ── */}
      {memosprite && memosprite.skills.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-1.5">
            <h2 className="text-lg sm:text-xl font-extrabold text-white">憶靈技</h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/50 text-sky-200">
              {memosprite.name}
            </span>
          </div>
          <div className="space-y-3.5 mt-3">
            {memosprite.skills.map(skill => {
              const descs = skill.descriptions ?? [];
              const maxLv = descs.length;
              const lv = memoLevels[skill.id] ?? 1;
              const allSame = descs.length > 1 && descs.every(d => d === descs[0]);
              const showSlider = maxLv > 1 && !allSame;

              return (
                <div key={skill.id} className="rounded-3xl liquid-glass border border-sky-500/30 p-5 sm:p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                    <span className="text-sky-300 font-black text-base">{skill.name}</span>
                    {showSlider && (
                      <span className="text-xs font-bold text-sky-300 liquid-capsule px-2.5 py-0.5 rounded-full border-sky-400/40">
                        Lv.{lv}
                      </span>
                    )}
                  </div>
                  {showSlider && (
                    <div className="mb-3.5 px-4 py-2 rounded-2xl liquid-capsule flex items-center gap-3">
                      <span className="text-xs text-gray-400 shrink-0">1</span>
                      <input
                        type="range"
                        min={1}
                        max={maxLv}
                        value={lv}
                        onChange={e => setMemoLevels(prev => ({ ...prev, [skill.id]: +e.target.value }))}
                        className="flex-1 h-2 cursor-pointer accent-sky-400"
                      />
                      <span className="text-xs text-gray-400 shrink-0">{maxLv}</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-200 whitespace-pre-line leading-relaxed font-normal">
                    {descs[lv - 1] || skill.description || '—'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 行迹區塊 ── */}
      <div className="mt-10">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-extrabold text-white tracking-wide">額外行迹與屬性提升</h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#d4af37]/30 to-[#ffd700]/20 border border-[#ffd700]/60 text-[#ffd700]">
            Traces
          </span>
        </div>

        {hasTraces ? (
          <div className="space-y-4">
            {/* 能力型行迹 */}
            {abilityTraces.length > 0 && (
              <div className="space-y-3">
                {abilityTraces.map(trace => (
                  <div
                    key={trace.anchor}
                    className="rounded-3xl liquid-glass border border-[#ffd700]/30 p-5 sm:p-6 shadow-lg"
                  >
                    <p className="text-[#ffd700] font-black text-base mb-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />
                      {trace.name}
                    </p>
                    {trace.description && (
                      <p className="text-sm text-gray-200 whitespace-pre-line leading-relaxed font-normal">
                        {trace.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 屬性強化行迹（加總顯示） */}
            {Object.keys(statSummary).length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  行迹屬性點累計總和
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statSummary).map(([key, { name, total }]) => (
                    <span
                      key={key}
                      className="text-xs font-bold px-3.5 py-1.5 rounded-full liquid-capsule text-gray-200 flex items-center gap-1.5 border-white/15"
                    >
                      <span>{name}</span>
                      <span className="text-emerald-400 font-extrabold">{formatStatValue(key, total)}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-3xl liquid-glass p-6 text-center border border-white/10">
            <p className="text-xs text-gray-400 italic">資料擴充中</p>
          </div>
        )}
      </div>
    </div>
  );
}
