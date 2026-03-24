'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Character } from '@/lib/types';

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

// 行迹節點佔位資料
const TRACE_NODES = [
  { id: 1, label: '行迹 1', col: 2, row: 1 },
  { id: 2, label: '行迹 2', col: 1, row: 2 },
  { id: 3, label: '行迹 3', col: 3, row: 2 },
  { id: 4, label: '行迹 4', col: 2, row: 3 },
  { id: 5, label: '行迹 5', col: 1, row: 4 },
  { id: 6, label: '行迹 6', col: 3, row: 4 },
];

export default function SkillSection({
  skills,
  characterId,
}: {
  skills: Character['skills'];
  characterId: string;
}) {
  const [levels, setLevels] = useState<Record<string, number>>({});
  const keys = Object.keys(SKILL_LABELS) as Array<keyof Character['skills']>;

  // 組合技能圖示 URL
  function getSkillIconUrl(key: keyof Character['skills']): string {
    return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/skill/${characterId}_${SKILL_ICON_SUFFIX[key]}.png`;
  }

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
          const lv = levels[key] ?? 1;
          const description = showSlider && descs[lv - 1]
            ? descs[lv - 1]
            : skill.description;

          return (
            <div key={key} className={`rounded-lg border p-4 ${SKILL_COLORS[key]}`}>
              {/* 技能類型標籤 + 圖示 + 名稱 + 等級 */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {/* 技能小圖示 */}
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

              {/* 等級滑動條 */}
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

              {/* 技能描述 */}
              <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                {description || '—'}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── 行迹區塊 ── */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-white mb-3">行迹</h2>
        <div className="rounded-xl border border-white/10 bg-white/3 p-6">
          {/* 樹狀佔位節點（3 欄 × 4 行網格） */}
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(4, auto)' }}
          >
            {TRACE_NODES.map(node => (
              <div
                key={node.id}
                className="flex flex-col items-center gap-1"
                style={{ gridColumn: node.col, gridRow: node.row }}
              >
                {/* 圓形節點 */}
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-600/50 bg-gray-800/30 flex items-center justify-center">
                  <span className="text-gray-600 text-xs font-bold">{node.id}</span>
                </div>
                <span className="text-xs text-gray-600">{node.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-600 mt-4 italic">資料擴充中</p>
        </div>
      </div>
    </div>
  );
}
