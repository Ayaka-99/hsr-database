// 異相仲裁頁面

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

      {/* 獎勵說明 */}
      <h2 className="text-lg font-bold text-white mb-4">週常獎勵</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { name: '星瓊', color: 'text-sky-400 border-sky-400/30 bg-sky-400/5' },
          { name: '遺器強化素材', color: 'text-amber-400 border-amber-400/30 bg-amber-400/5' },
          { name: '信用點', color: 'text-yellow-300 border-yellow-300/30 bg-yellow-300/5' },
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
          仲裁陣容週更資訊及最優祝福路線分析功能開發中，敬請期待。
        </p>
      </div>
    </div>
  );
}
