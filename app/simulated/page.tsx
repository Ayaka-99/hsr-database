// 異相仲裁頁面（server component，無需互動狀態）

// 本週三關陣容（每週更換）
const stages = [
  {
    round: 1,
    type: '騎士',
    typeStyle: 'border-blue-500/40 bg-blue-500/5 text-blue-400',
    boss: '黃金騎士·RD',
    hp: 3_600_000,
    weakness: ['物理', '量子'],
    note: '週期性充能，充滿後發動範圍攻擊；優先破盾以打斷充能',
  },
  {
    round: 2,
    type: '騎士',
    typeStyle: 'border-blue-500/40 bg-blue-500/5 text-blue-400',
    boss: '銀狼·虛擬體',
    hp: 5_200_000,
    weakness: ['火', '雷', '風'],
    note: '召喚複製體協同攻擊；優先消滅複製體降低輸出壓力',
  },
  {
    round: 3,
    type: '王騎',
    typeStyle: 'border-[#c9a227]/40 bg-[#c9a227]/5 text-[#c9a227]',
    boss: '歷戰的強敵·王騎',
    hp: 12_000_000,
    weakness: ['冰', '虛數', '量子'],
    note: '多階段 BOSS，每 30% 血量觸發相位強化；終局前注意爆發時機儲能',
  },
];

const ELEMENT_BADGE: Record<string, string> = {
  '火':   'bg-orange-500/20 text-orange-300 border-orange-500/40',
  '冰':   'bg-sky-500/20    text-sky-300    border-sky-500/40',
  '雷':   'bg-violet-500/20 text-violet-300 border-violet-500/40',
  '風':   'bg-teal-500/20   text-teal-300   border-teal-500/40',
  '量子': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  '虛數': 'bg-yellow-500/20 text-yellow-200 border-yellow-500/40',
  '物理': 'bg-gray-500/20   text-gray-300   border-gray-500/40',
};

function formatHP(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

export default function SimulatedPage() {
  const rules = [
    { title: '固定陣容', desc: '使用系統提供的預設角色陣容，不可自由選擇角色。' },
    { title: '命途祝福', desc: '根據陣容特性，優先選擇對應命途的祝福加成。' },
    { title: '奇物選擇', desc: '奇物與陣容契合度至關重要，影響整體輸出效能。' },
    { title: '每週刷新', desc: '仲裁關卡每週更換，陣容與目標難度隨機生成。' },
  ];

  const tips = [
    '仲裁模式不需要自建隊伍，以熟悉陣容機制為主要挑戰。',
    '每次仲裁提供多組陣容選擇，依據個人熟悉度挑選。',
    '祝福選擇應優先考量陣容主要輸出技能的加成路線。',
    '難度可依個人程度調整，完成基礎仲裁即可取得週常獎勵。',
  ];

  return (
    <div>
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">異相仲裁</h1>
        <p className="text-sm text-gray-400 mt-1">差分宇宙 — Divergent Universe: Arbitration</p>
      </div>

      {/* 簡介 */}
      <div className="rounded-2xl border border-[#6b4ff5]/30 bg-gradient-to-br from-[#12092a] to-[#0d0d1a] p-6 mb-8">
        <p className="text-gray-200 leading-relaxed text-sm">
          異相仲裁是差分宇宙中的特殊週常挑戰模式。每週系統會提供數組預設陣容，
          玩家在指定角色的限制下完成一局差分宇宙探索。挑戰重點在於針對固定陣容
          制定最優祝福路線與奇物組合，並非自建隊伍，考驗的是對遊戲機制的理解深度。
        </p>
      </div>

      {/* 本週三關 BOSS */}
      <h2 className="text-lg font-bold text-white mb-4">本週仲裁陣容</h2>
      <div className="space-y-3 mb-8">
        {stages.map(s => (
          <div
            key={s.round}
            className={`rounded-xl border p-4 ${
              s.round === 3
                ? 'border-[#c9a227]/30 bg-gradient-to-br from-[#1a1200]/60 to-[#0d0d1a]'
                : 'border-white/10 bg-white/3'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* 關卡編號 */}
              <div className={`shrink-0 w-10 h-10 rounded-full border flex items-center justify-center text-sm font-bold ${
                s.round === 3
                  ? 'border-[#c9a227]/40 text-[#c9a227] bg-[#c9a227]/10'
                  : 'border-white/15 text-gray-300 bg-white/5'
              }`}>
                {s.round}
              </div>

              {/* BOSS 資訊 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${s.typeStyle}`}>
                    {s.type}
                  </span>
                  <span className="text-white font-semibold text-sm">{s.boss}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{s.note}</p>
              </div>

              {/* 弱點 + HP */}
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                <div className="flex gap-1 flex-wrap justify-end">
                  {s.weakness.map(w => (
                    <span key={w} className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${ELEMENT_BADGE[w] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/40'}`}>
                      {w}
                    </span>
                  ))}
                </div>
                <span className={`text-sm font-bold tabular-nums ${s.round === 3 ? 'text-[#c9a227]' : 'text-white'}`}>
                  HP {formatHP(s.hp)}
                </span>
              </div>
            </div>

            {/* HP 比例條 */}
            <div className="mt-3 h-1 rounded-full bg-white/8 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  s.round === 3
                    ? 'bg-gradient-to-r from-[#c9a227]/70 to-[#c9a227]'
                    : 'bg-gradient-to-r from-rose-700 to-rose-500'
                }`}
                style={{ width: `${Math.round((s.hp / 12_000_000) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 規則說明 */}
      <h2 className="text-lg font-bold text-white mb-4">仲裁規則</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {rules.map(r => (
          <div key={r.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-[#c9a227] font-semibold text-sm mb-1">{r.title}</h3>
            <p className="text-xs text-gray-300 leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* 攻略要點 */}
      <h2 className="text-lg font-bold text-white mb-4">攻略要點</h2>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-8">
        <ul className="space-y-2">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="text-[#6b4ff5] font-bold shrink-0 mt-0.5">·</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* 週常獎勵 */}
      <h2 className="text-lg font-bold text-white mb-4">週常獎勵</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { name: '星瓊',       color: 'text-sky-400 border-sky-400/30 bg-sky-400/5' },
          { name: '遺器強化素材', color: 'text-amber-400 border-amber-400/30 bg-amber-400/5' },
          { name: '信用點',     color: 'text-yellow-300 border-yellow-300/30 bg-yellow-300/5' },
          { name: '角色養成素材', color: 'text-violet-400 border-violet-400/30 bg-violet-400/5' },
        ].map(item => (
          <div
            key={item.name}
            className={`rounded-xl border p-3 text-center text-sm font-semibold ${item.color}`}
          >
            {item.name}
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl border border-white/10 bg-white/3">
        <p className="text-xs text-gray-500 text-center">
          本週 BOSS 資訊為參考資料，實際陣容每週更換，請以遊戲內顯示為準。
        </p>
      </div>
    </div>
  );
}
