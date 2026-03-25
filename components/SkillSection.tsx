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
      <h2 className="text-lg font-bold text-white mb-3">技能</h2>
      <div className="space-y-3">
        {keys.map(key => {
          const skill = skills[key];
          if (!skill.name) return null;

          const descs = skill.descriptions ?? [];
          const maxLv = descs.length;
          const showSlider = !NO_LEVELS.has(key) && maxLv > 1;
          const lv = levels[key] ?? defaultLevel(key, rarity, maxLv);
          const description = showSlider && descs[lv - 1]
            ? descs[lv - 1]
            : skill.description;

          return (
            <div key={key} className={`rounded-lg border p-4 ${SKILL_COLORS[key]}`}>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <div className="relative w-10 h-10 shrink-0 rounded-md overflow-hidden bg-white/5 border border-white/10">
                  <Image
                    src={getSkillIconUrl(key)}
                    alt={skill.name}
                    fill
                    className="object-contain p-0.5"
                    unoptimized
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${SKILL_LABEL_COLORS[key]} border-current/30`}>
                  {SKILL_LABELS[key]}
                </span>
                <span className="text-white font-semibold">{skill.name}</span>
                {showSlider && (
                  <span className={`ml-auto text-xs font-bold ${SKILL_LABEL_COLORS[key]}`}>
                    Lv.{lv}
                  </span>
                )}
              </div>

              {showSlider && (
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-xs text-gray-500 shrink-0">1</span>
                  <input
                    type="range"
                    min={1}
                    max={maxLv}
                    value={lv}
                    onChange={e => setLevels(prev => ({ ...prev, [key]: +e.target.value }))}
                    className="flex-1 h-1.5 accent-current cursor-pointer"
                    style={{ accentColor: 'currentColor' }}
                  />
                  <span className="text-xs text-gray-500 shrink-0">{maxLv}</span>
                </div>
              )}

              <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                {description || '—'}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── 憶靈技區塊 ── */}
      {memosprite && memosprite.skills.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-white mb-1">憶靈技</h2>
          <p className="text-xs text-gray-500 mb-3">憶靈：{memosprite.name}</p>
          <div className="space-y-3">
            {memosprite.skills.map(skill => {
              const descs = skill.descriptions ?? [];
              const maxLv = descs.length;
              const lv = memoLevels[skill.id] ?? 1;
              const showSlider = maxLv > 1;

              return (
                <div key={skill.id} className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="text-sky-300 font-semibold text-sm">{skill.name}</span>
                    {showSlider && (
                      <span className="text-xs font-bold text-sky-400">Lv.{lv}</span>
                    )}
                  </div>
                  {showSlider && (
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-xs text-gray-500 shrink-0">1</span>
                      <input
                        type="range"
                        min={1}
                        max={maxLv}
                        value={lv}
                        onChange={e => setMemoLevels(prev => ({ ...prev, [skill.id]: +e.target.value }))}
                        className="flex-1 h-1.5 cursor-pointer"
                        style={{ accentColor: '#38bdf8' }}
                      />
                      <span className="text-xs text-gray-500 shrink-0">{maxLv}</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                    {descs[lv - 1] || skill.description || '—'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 行迹區塊 ── */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-white mb-3">行迹</h2>

        {hasTraces ? (
          <div className="space-y-4">
            {/* 能力型行迹 */}
            {abilityTraces.length > 0 && (
              <div className="space-y-2">
                {abilityTraces.map(trace => (
                  <div
                    key={trace.anchor}
                    className="rounded-lg border border-[#c9a227]/30 bg-[#c9a227]/5 p-4"
                  >
                    <p className="text-[#c9a227] font-semibold text-sm mb-1">{trace.name}</p>
                    {trace.description && (
                      <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                        {trace.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 屬性強化行迹（加總顯示） */}
            {Object.keys(statSummary).length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">屬性強化</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statSummary).map(([key, { name, total }]) => (
                    <span
                      key={key}
                      className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300"
                    >
                      {name} <span className="text-emerald-400 font-semibold">{formatStatValue(key, total)}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/3 p-6 text-center">
            <p className="text-xs text-gray-600 italic">資料擴充中</p>
          </div>
        )}
      </div>
    </div>
  );
}
