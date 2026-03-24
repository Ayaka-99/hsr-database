'use client';

import { useState } from 'react';
import type { Character } from '@/lib/types';

// 技能槽顯示名稱
const SKILL_LABELS: Record<keyof Character['skills'], string> = {
  basic: '普通攻擊',
  skill: '戰技',
  ult: '終結技',
  talent: '天賦',
  technique: '秘技',
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

export default function SkillSection({ skills }: { skills: Character['skills'] }) {
  const [levels, setLevels] = useState<Record<string, number>>({});
  const keys = Object.keys(SKILL_LABELS) as Array<keyof Character['skills']>;

  return (
    <div>
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
              {/* 技能類型標籤 + 名稱 + 等級 */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
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
    </div>
  );
}
