'use client';

import LineChart from '@/components/LineChart';
import type { ChartPoint } from '@/components/LineChart';

// 忘卻之庭 (Memory of Chaos) — 4.0 期 HP 參考值
const mocData: ChartPoint[] = [
  { label: 'F1',  hp: 350_000  },
  { label: 'F2',  hp: 480_000  },
  { label: 'F3',  hp: 620_000  },
  { label: 'F4',  hp: 850_000  },
  { label: 'F5',  hp: 1_100_000 },
  { label: 'F6',  hp: 1_400_000 },
  { label: 'F7',  hp: 1_850_000 },
  { label: 'F8',  hp: 2_400_000 },
  { label: 'F9',  hp: 2_900_000 },
  { label: 'F10', hp: 3_500_000, note: 'BOSS: 陷沒之夢' },
  { label: 'F11', hp: 4_200_000 },
  { label: 'F12', hp: 5_200_000, note: 'BOSS: 失憶芽孢·湮滅' },
];

// 末日幻影 (Apocalyptic Shadow) — 4.0 期血量階段
const asData: ChartPoint[] = [
  { label: 'P1',  hp: 8_500_000, note: '開場 (夢錨)' },
  { label: 'P2',  hp: 6_000_000, note: '70% 階段' },
  { label: 'P3',  hp: 3_200_000, note: '40% 相位變換' },
  { label: 'P4',  hp: 800_000,   note: '10% 最終討伐' },
  { label: 'B2-1',hp: 10_000_000, note: 'BOSS2 (界域·霞頌)' },
  { label: 'B2-2',hp: 7_500_000, note: '75%' },
  { label: 'B2-3',hp: 3_800_000, note: '38%' },
];

// 純虛數幻境 (Pure Fiction) — 4.0 期波次累積 HP
const pfData: ChartPoint[] = [
  { label: 'W1-1', hp: 480_000  },
  { label: 'W1-2', hp: 560_000  },
  { label: 'W2-1', hp: 780_000  },
  { label: 'W2-2', hp: 950_000  },
  { label: 'W3-1', hp: 1_300_000 },
  { label: 'W3-2', hp: 1_600_000 },
  { label: 'W4-1', hp: 2_100_000 },
  { label: 'W4-2', hp: 2_600_000, note: '狂暴雜兵潮' },
];

type Mode = 'moc' | 'as' | 'pf';

const MODES: { id: Mode; label: string; en: string; color: string; border: string; data: ChartPoint[] }[] = [
  {
    id: 'moc', label: '忘卻之庭', en: 'Memory of Chaos',
    color: '#a78bfa', border: 'border-violet-500/30 hover:border-violet-500/60',
    data: mocData,
  },
  {
    id: 'as', label: '末日幻影', en: 'Apocalyptic Shadow',
    color: '#fb923c', border: 'border-orange-500/30 hover:border-orange-500/60',
    data: asData,
  },
  {
    id: 'pf', label: '純虛數幻境', en: 'Pure Fiction',
    color: '#38bdf8', border: 'border-sky-500/30 hover:border-sky-500/60',
    data: pfData,
  },
];

const MODE_BULLETS: Record<Mode, string[]> = {
  moc: ['每月重置，持續兩周', '共 12 層，每層 2 場', '追求最少行動輪數', '需準備兩套陣容'],
  as:  ['強調單體爆發傷害', '每期 BOSS 弱點不同', '特殊 BUFF 機制加成', '需針對弱點搭配屬性'],
  pf:  ['強調群體 AOE 傷害', '擊殺積分達標過關', '無限刷新敵人浪潮', '需高行動頻率輸出'],
};

export default function AbyssPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">三深淵</h1>
        <p className="text-sm text-gray-400 mt-1">星穹鐵道三大終局挑戰模式 — 血量波動參考圖 (v4.0)</p>
      </div>

      <div className="space-y-8">
        {MODES.map(mode => (
          <div
            key={mode.id}
            className={`rounded-2xl border bg-[#0d0d1a] p-6 transition-all ${mode.border}`}
          >
            {/* 標題列 */}
            <div className="flex items-center gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-500">{mode.en}</p>
                <h2 className="text-lg font-bold text-white">{mode.label}</h2>
              </div>
            </div>

            {/* 描述 + 要點 */}
            <ul className="flex flex-wrap gap-x-6 gap-y-1 mb-5">
              {MODE_BULLETS[mode.id].map(t => (
                <li key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ background: mode.color }} />
                  {t}
                </li>
              ))}
            </ul>

            {/* 折線圖 */}
            <LineChart
              data={mode.data}
              color={mode.color}
              title={`${mode.label} — 各階段敵人血量（參考值）`}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 rounded-xl border border-white/10 bg-white/3">
        <p className="text-xs text-gray-600 text-center">
          血量數值為 v4.0 週期參考估算，實際數值因週期設定與難度等級而異。
        </p>
      </div>
    </div>
  );
}
