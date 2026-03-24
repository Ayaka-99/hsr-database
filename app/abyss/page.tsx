'use client';

import { useState } from 'react';
import LineChart from '@/components/LineChart';
import type { ChartPoint } from '@/components/LineChart';

const CURRENT_VERSION = 'v3.3 第一期';

// ── 忘卻之庭：僅顯示高難度層（F7–F12）──
const mocHigh: ChartPoint[] = [
  { label: 'F7',  hp: 1_850_000 },
  { label: 'F8',  hp: 2_400_000 },
  { label: 'F9',  hp: 2_900_000 },
  { label: 'F10', hp: 3_500_000, note: 'BOSS: 陷沒之夢' },
  { label: 'F11', hp: 4_200_000 },
  { label: 'F12', hp: 5_200_000, note: 'BOSS: 失憶芽孢·湮滅' },
];
const mocFull: ChartPoint[] = [
  { label: 'F1',  hp: 350_000  },
  { label: 'F2',  hp: 480_000  },
  { label: 'F3',  hp: 620_000  },
  { label: 'F4',  hp: 850_000  },
  { label: 'F5',  hp: 1_100_000 },
  { label: 'F6',  hp: 1_400_000 },
  ...mocHigh,
];

// ── 末日幻影：最高難度 BOSS 血量階段 ──
const asData: ChartPoint[] = [
  { label: 'P1',  hp: 8_500_000,  note: '開場 (夢錨)' },
  { label: 'P2',  hp: 6_000_000,  note: '70% 階段' },
  { label: 'P3',  hp: 3_200_000,  note: '40% 相位變換' },
  { label: 'P4',  hp: 800_000,    note: '10% 最終討伐' },
  { label: 'B2-1',hp: 10_000_000, note: 'BOSS2 (界域·霞頌)' },
  { label: 'B2-2',hp: 7_500_000,  note: '75%' },
  { label: 'B2-3',hp: 3_800_000,  note: '38%' },
];

// ── 純虛數幻境：高難波次（W3–W4）vs 完整（W1–W4）──
const pfHigh: ChartPoint[] = [
  { label: 'W3-1', hp: 1_300_000 },
  { label: 'W3-2', hp: 1_600_000 },
  { label: 'W4-1', hp: 2_100_000 },
  { label: 'W4-2', hp: 2_600_000, note: '狂暴雜兵潮' },
];
const pfFull: ChartPoint[] = [
  { label: 'W1-1', hp: 480_000  },
  { label: 'W1-2', hp: 560_000  },
  { label: 'W2-1', hp: 780_000  },
  { label: 'W2-2', hp: 950_000  },
  ...pfHigh,
];

type MocView = 'high' | 'full';
type PfView  = 'high' | 'full';

export default function AbyssPage() {
  const [mocView, setMocView] = useState<MocView>('high');
  const [pfView,  setPfView]  = useState<PfView>('high');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">三深淵</h1>
        <p className="text-sm text-gray-400 mt-1">
          星穹鐵道三大終局挑戰 — 最高難度血量參考
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs border border-[#c9a227]/40 text-[#c9a227] bg-[#c9a227]/5">
            {CURRENT_VERSION}
          </span>
        </p>
      </div>

      <div className="space-y-8">

        {/* ── 忘卻之庭 ── */}
        <div className="rounded-2xl border border-violet-500/30 hover:border-violet-500/60 bg-[#0d0d1a] p-6 transition-all">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <p className="text-xs text-gray-500">Memory of Chaos</p>
              <h2 className="text-lg font-bold text-white">忘卻之庭</h2>
            </div>
            {/* 難度切換 */}
            <div className="flex gap-1 text-xs">
              {(['high', 'full'] as MocView[]).map(v => (
                <button
                  key={v}
                  onClick={() => setMocView(v)}
                  className={`px-3 py-1 rounded-full border transition-colors ${
                    mocView === v
                      ? 'border-violet-400/60 bg-violet-400/10 text-violet-300'
                      : 'border-white/10 text-gray-500 hover:text-white'
                  }`}
                >
                  {v === 'high' ? '高難 F7–F12' : '完整 F1–F12'}
                </button>
              ))}
            </div>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 mb-5">
            {['每月重置，持續兩周', '共 12 層，每層 2 場', '追求最少行動輪數', '需準備兩套陣容'].map(t => (
              <li key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-1 h-1 rounded-full shrink-0 bg-violet-400" />
                {t}
              </li>
            ))}
          </ul>
          <LineChart
            data={mocView === 'high' ? mocHigh : mocFull}
            color="#a78bfa"
            title={`忘卻之庭 — ${mocView === 'high' ? 'F7–F12 ' : 'F1–F12 '}各層血量（${CURRENT_VERSION}）`}
          />
        </div>

        {/* ── 末日幻影 ── */}
        <div className="rounded-2xl border border-orange-500/30 hover:border-orange-500/60 bg-[#0d0d1a] p-6 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <p className="text-xs text-gray-500">Apocalyptic Shadow</p>
              <h2 className="text-lg font-bold text-white">末日幻影</h2>
            </div>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 mb-5">
            {['強調單體爆發傷害', '每期 BOSS 弱點不同', '特殊 BUFF 機制加成', '需針對弱點搭配屬性'].map(t => (
              <li key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-1 h-1 rounded-full shrink-0 bg-orange-400" />
                {t}
              </li>
            ))}
          </ul>
          <LineChart
            data={asData}
            color="#fb923c"
            title={`末日幻影 — 最高難度 BOSS 血量階段（${CURRENT_VERSION}）`}
          />
        </div>

        {/* ── 純虛數幻境 ── */}
        <div className="rounded-2xl border border-sky-500/30 hover:border-sky-500/60 bg-[#0d0d1a] p-6 transition-all">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <p className="text-xs text-gray-500">Pure Fiction</p>
              <h2 className="text-lg font-bold text-white">純虛數幻境</h2>
            </div>
            {/* 難度切換 */}
            <div className="flex gap-1 text-xs">
              {(['high', 'full'] as PfView[]).map(v => (
                <button
                  key={v}
                  onClick={() => setPfView(v)}
                  className={`px-3 py-1 rounded-full border transition-colors ${
                    pfView === v
                      ? 'border-sky-400/60 bg-sky-400/10 text-sky-300'
                      : 'border-white/10 text-gray-500 hover:text-white'
                  }`}
                >
                  {v === 'high' ? '高難 W3–W4' : '完整 W1–W4'}
                </button>
              ))}
            </div>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 mb-5">
            {['強調群體 AOE 傷害', '擊殺積分達標過關', '無限刷新敵人浪潮', '需高行動頻率輸出'].map(t => (
              <li key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-1 h-1 rounded-full shrink-0 bg-sky-400" />
                {t}
              </li>
            ))}
          </ul>
          <LineChart
            data={pfView === 'high' ? pfHigh : pfFull}
            color="#38bdf8"
            title={`純虛數幻境 — ${pfView === 'high' ? 'W3–W4 ' : 'W1–W4 '}波次血量（${CURRENT_VERSION}）`}
          />
        </div>

      </div>

      <div className="mt-6 p-3 rounded-xl border border-white/10 bg-white/3">
        <p className="text-xs text-gray-600 text-center">
          血量為 {CURRENT_VERSION} 最高難度參考估算，每期版本更新後數值可能異動。
        </p>
      </div>
    </div>
  );
}
