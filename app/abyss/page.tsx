'use client';

import { useState } from 'react';

// ── 類型定義 ──────────────────────────────────────────────
interface Monster {
  name: string;
  img: string;       // 圖片 URL，留空則顯示佔位圖
  weakness: string[]; // 弱點屬性
}

interface AbyssHalf {
  label: string;     // '上半' | '下半' | 'BOSS' | 'W1' ...
  monsters: Monster[];
}

interface AbyssFloor {
  floor: string;     // 'F10', 'W3', 'BOSS1' ...
  halves: AbyssHalf[];
}

interface AbyssPeriod {
  label: string;       // 'v3.3 第一期'
  isCurrent: boolean;
  buff?: string;       // 本期增益說明（忘卻之庭）
  moc: AbyssFloor[];
  as: AbyssFloor[];
  pf: AbyssFloor[];
}

// ── 弱點顏色 ───────────────────────────────────────────────
const ELEMENT_COLOR: Record<string, string> = {
  火:   'bg-orange-500/20 text-orange-300 border-orange-500/40',
  冰:   'bg-sky-500/20    text-sky-300    border-sky-500/40',
  雷:   'bg-violet-500/20 text-violet-300 border-violet-500/40',
  風:   'bg-teal-500/20   text-teal-300   border-teal-500/40',
  量子: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  虛數: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/40',
  物理: 'bg-gray-500/20   text-gray-300   border-gray-500/40',
};

// ── 怪物佔位圖 SVG ─────────────────────────────────────────
function MonsterFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white/3">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
        className="w-10 h-10 text-gray-700">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
      </svg>
    </div>
  );
}

// ── 怪物卡片 ──────────────────────────────────────────────
function MonsterCard({ monster }: { monster: Monster }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="flex flex-col items-center gap-1.5 w-24 shrink-0">
      {/* 怪物圖片 */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-[#111125]">
        {!imgFailed && monster.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={monster.img}
            alt={monster.name}
            className="w-full h-full object-contain"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <MonsterFallback />
        )}
      </div>
      {/* 怪物名稱 */}
      <p className="text-center text-xs text-gray-300 leading-tight line-clamp-2 w-full">{monster.name}</p>
      {/* 弱點 */}
      <div className="flex flex-wrap justify-center gap-0.5">
        {monster.weakness.map(w => (
          <span key={w} className={`text-[10px] px-1 py-0.5 rounded border ${ELEMENT_COLOR[w] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/40'}`}>
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── 樓層/波次區塊 ─────────────────────────────────────────
function FloorBlock({ floor }: { floor: AbyssFloor }) {
  return (
    <div className="border border-white/8 rounded-xl bg-white/2 p-4">
      <p className="text-xs font-bold text-gray-400 mb-3">{floor.floor}</p>
      <div className="flex flex-col gap-4">
        {floor.halves.map(half => (
          <div key={half.label}>
            {/* 上半/下半 標籤（只有兩個 half 時才顯示） */}
            {floor.halves.length > 1 && (
              <p className="text-[11px] text-gray-600 mb-2">{half.label}</p>
            )}
            <div className="flex flex-wrap gap-3">
              {half.monsters.map((m, i) => (
                <MonsterCard key={i} monster={m} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// ── 怪物資料（依版本期數編輯此區）─────────────────────────
// 圖片來源範例：
//   StarRailRes: https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/{id}.png
//   Hoyoverse  : https://act-webstatic.hoyoverse.com/game_record/hsr/icon/...
// ══════════════════════════════════════════════════════════
const PERIODS: AbyssPeriod[] = [
  // ────────────── v3.3 第一期（當期）──────────────
  {
    label: 'v3.3 第一期',
    isCurrent: true,
    buff: '本期增益：每次行動後，使友方目標的傷害提升 8%，最多疊加 5 層。',

    moc: [
      {
        floor: 'F10',
        halves: [
          {
            label: '上半',
            monsters: [
              { name: '末日野獸·掠食', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80102.png', weakness: ['量子', '虛數'] },
              { name: '震天遁地龍', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80105.png', weakness: ['冰', '雷'] },
            ],
          },
          {
            label: '下半',
            monsters: [
              { name: '幽冥蟲族長', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80201.png', weakness: ['火', '雷'] },
              { name: '回廊幽靈', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80301.png', weakness: ['物理', '冰'] },
            ],
          },
        ],
      },
      {
        floor: 'F12',
        halves: [
          {
            label: '上半',
            monsters: [
              { name: '陷沒之夢', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80206.png', weakness: ['雷', '風'] },
            ],
          },
          {
            label: '下半',
            monsters: [
              { name: '失憶芽孢·湮滅', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80108.png', weakness: ['火', '量子'] },
            ],
          },
        ],
      },
    ],

    as: [
      {
        floor: 'BOSS 1',
        halves: [
          {
            label: '',
            monsters: [
              { name: '界域·霞頌', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80116.png', weakness: ['物理', '冰', '量子'] },
            ],
          },
        ],
      },
      {
        floor: 'BOSS 2',
        halves: [
          {
            label: '',
            monsters: [
              { name: '夢錨·困縛', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80115.png', weakness: ['雷', '風', '虛數'] },
            ],
          },
        ],
      },
    ],

    pf: [
      {
        floor: 'W1–W2',
        halves: [
          {
            label: '',
            monsters: [
              { name: '警備機器人', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80401.png', weakness: ['火', '雷'] },
              { name: '銀狼殘像', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80402.png', weakness: ['量子'] },
            ],
          },
        ],
      },
      {
        floor: 'W3–W4',
        halves: [
          {
            label: '',
            monsters: [
              { name: '反熵先驅', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80403.png', weakness: ['冰', '風'] },
              { name: '霜星機甲', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80404.png', weakness: ['火'] },
              { name: '反熵守衛者', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80405.png', weakness: ['雷', '量子'] },
            ],
          },
        ],
      },
    ],
  },

  // ────────────── v3.2 第二期（往期）──────────────
  {
    label: 'v3.2 第二期',
    isCurrent: false,
    buff: '本期增益：對已受到持續傷害的目標造成傷害時，傷害提升 25%。',

    moc: [
      {
        floor: 'F10',
        halves: [
          {
            label: '上半',
            monsters: [
              { name: '蟲群族長·鏖滅者', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80302.png', weakness: ['火', '冰'] },
            ],
          },
          {
            label: '下半',
            monsters: [
              { name: '蟲群族長·鏖滅者', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80302.png', weakness: ['量子'] },
            ],
          },
        ],
      },
      {
        floor: 'F12',
        halves: [
          {
            label: '上半',
            monsters: [
              { name: '歷戰的侍衛長', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80203.png', weakness: ['火', '物理'] },
            ],
          },
          {
            label: '下半',
            monsters: [
              { name: '猛鬼幽魂', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80307.png', weakness: ['冰', '風'] },
            ],
          },
        ],
      },
    ],

    as: [
      {
        floor: 'BOSS 1',
        halves: [
          {
            label: '',
            monsters: [
              { name: '迦具土', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80111.png', weakness: ['冰', '量子'] },
            ],
          },
        ],
      },
      {
        floor: 'BOSS 2',
        halves: [
          {
            label: '',
            monsters: [
              { name: '可可利亞', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80112.png', weakness: ['物理', '雷'] },
            ],
          },
        ],
      },
    ],

    pf: [
      {
        floor: 'W1–W2',
        halves: [
          {
            label: '',
            monsters: [
              { name: '冥界蝴蝶', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80501.png', weakness: ['火', '虛數'] },
              { name: '夢蝶幼蟲', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80502.png', weakness: ['物理'] },
            ],
          },
        ],
      },
      {
        floor: 'W3–W4',
        halves: [
          {
            label: '',
            monsters: [
              { name: '古老夢境蝴蝶', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80503.png', weakness: ['冰', '雷', '量子'] },
            ],
          },
        ],
      },
    ],
  },

  // ────────────── v3.2 第一期（往期）──────────────
  {
    label: 'v3.2 第一期',
    isCurrent: false,
    buff: '本期增益：施放終結技後，使自身暴擊率提升 15%，持續 2 回合。',

    moc: [
      {
        floor: 'F12',
        halves: [
          {
            label: '上半',
            monsters: [
              { name: '禁忌伊特', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80117.png', weakness: ['物理', '風'] },
            ],
          },
          {
            label: '下半',
            monsters: [
              { name: '殘影·長夜', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80118.png', weakness: ['火', '量子'] },
            ],
          },
        ],
      },
    ],

    as: [
      {
        floor: 'BOSS',
        halves: [
          {
            label: '',
            monsters: [
              { name: '虛構幻靈·蝶', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80113.png', weakness: ['量子', '虛數'] },
            ],
          },
        ],
      },
    ],

    pf: [
      {
        floor: 'W3–W4',
        halves: [
          {
            label: '',
            monsters: [
              { name: '模擬宇宙精靈', img: 'https://raw.githubusercontent.com/Mar-7th/StarRailRes/main/icon/monster/80601.png', weakness: ['雷', '風'] },
            ],
          },
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════

export default function AbyssPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const period = PERIODS[selectedIdx];

  return (
    <div className="space-y-6">

      {/* 標題 + 期數選擇器 */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">三深淵</h1>
          <p className="text-sm text-gray-400 mt-1">忘卻之庭 · 末日幻影 · 純虛數幻境</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PERIODS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => setSelectedIdx(i)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                selectedIdx === i
                  ? 'border-[#c9a227]/60 bg-[#c9a227]/10 text-[#c9a227]'
                  : 'border-white/10 text-gray-500 hover:text-gray-300'
              }`}
            >
              {p.label}
              {p.isCurrent && (
                <span className="ml-1.5 px-1 py-0.5 rounded text-[9px] bg-[#c9a227]/20 text-[#c9a227]">當期</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── 忘卻之庭 ── */}
      <section className="rounded-2xl border border-violet-500/30 bg-[#0d0d1a] p-5">
        <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
          <div>
            <p className="text-xs text-gray-500">Memory of Chaos</p>
            <h2 className="text-lg font-bold text-white">忘卻之庭</h2>
            {period.buff && (
              <p className="text-xs text-violet-300/70 mt-1 max-w-xl">{period.buff}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {['月度重置', '共 12 層', '最少輪數通關', '需兩套陣容'].map(t => (
              <span key={t} className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-violet-400 inline-block" />{t}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {period.moc.map(floor => (
            <FloorBlock key={floor.floor} floor={floor} />
          ))}
        </div>
      </section>

      {/* ── 末日幻影 ── */}
      <section className="rounded-2xl border border-orange-500/30 bg-[#0d0d1a] p-5">
        <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
          <div>
            <p className="text-xs text-gray-500">Apocalyptic Shadow</p>
            <h2 className="text-lg font-bold text-white">末日幻影</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {['強調單體爆發', '弱點針對屬性', '特殊 BUFF 機制'].map(t => (
              <span key={t} className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-orange-400 inline-block" />{t}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {period.as.map(floor => (
            <FloorBlock key={floor.floor} floor={floor} />
          ))}
        </div>
      </section>

      {/* ── 純虛數幻境 ── */}
      <section className="rounded-2xl border border-sky-500/30 bg-[#0d0d1a] p-5">
        <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
          <div>
            <p className="text-xs text-gray-500">Pure Fiction</p>
            <h2 className="text-lg font-bold text-white">純虛數幻境</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {['強調群體 AOE', '擊殺積分過關', '無限敵人浪潮'].map(t => (
              <span key={t} className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-sky-400 inline-block" />{t}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {period.pf.map(floor => (
            <FloorBlock key={floor.floor} floor={floor} />
          ))}
        </div>
      </section>

    </div>
  );
}
