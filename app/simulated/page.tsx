// 差分宇宙（異相）頁面

export default function SimulatedPage() {
  // 差分宇宙路途說明資料
  const paths = [
    { name: '巡獵', color: 'text-sky-400 border-sky-400/30 bg-sky-400/5', desc: '提升攻擊與暴擊，適合輸出型角色。' },
    { name: '毀滅', color: 'text-red-400 border-red-400/30 bg-red-400/5', desc: '提升自身受傷後反擊與爆炸類傷害。' },
    { name: '智識', color: 'text-blue-400 border-blue-400/30 bg-blue-400/5', desc: '強化元素傷害與弱點破立效率。' },
    { name: '同諧', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5', desc: '提升行動速度與連擊機率。' },
    { name: '虛無', color: 'text-violet-400 border-violet-400/30 bg-violet-400/5', desc: '增強控制效果與持續傷害。' },
    { name: '豐饒', color: 'text-amber-400 border-amber-400/30 bg-amber-400/5', desc: '加強治療與護盾量，提升生存。' },
    { name: '存護', color: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5', desc: '大幅提升防禦與減傷效果。' },
    { name: '記憶', color: 'text-pink-400 border-pink-400/30 bg-pink-400/5', desc: '強化技能連動與召喚類效果。' },
  ];

  return (
    <div>
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">差分宇宙</h1>
        <p className="text-sm text-gray-400 mt-1">異相宇宙 — Divergent Universe</p>
      </div>

      {/* 簡介卡片 */}
      <div className="rounded-2xl border border-[#6b4ff5]/30 bg-gradient-to-br from-[#12092a] to-[#0d0d1a] p-6 mb-8">
        <p className="text-gray-200 leading-relaxed text-sm">
          差分宇宙是一種高自由度的 Roguelite 挑戰模式。玩家在每次探索中選擇「命途」方向，
          沿途收集祝福（增益效果）、奇物（被動道具），並與隨機生成的敵人戰鬥。
          每局結束後重置，追求最高分數與成就完成度。
        </p>
      </div>

      {/* 命途路途選擇 */}
      <h2 className="text-lg font-bold text-white mb-4">命途祝福方向</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {paths.map(p => (
          <div
            key={p.name}
            className={`rounded-xl border p-3 ${p.color} transition-all`}
          >
            <p className="font-bold text-sm mb-1">{p.name}</p>
            <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* 玩法要點 */}
      <h2 className="text-lg font-bold text-white mb-4">玩法要點</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { title: '路線選擇', desc: '每個節點可選擇戰鬥、精英、BOSS、商店或休息，規劃路線是關鍵。' },
          { title: '祝福疊加', desc: '同一命途的祝福會相互加乘，形成強力連鎖效果。' },
          { title: '奇物互動', desc: '特定奇物與祝福組合可觸發隱藏強力 Combo。' },
          { title: '難度系統', desc: '通關後可提升混沌指數，增加挑戰性與獎勵。' },
        ].map(item => (
          <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-[#c9a227] font-semibold text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-gray-300 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* 備註 */}
      <div className="p-4 rounded-xl border border-white/10 bg-white/3">
        <p className="text-xs text-gray-500 text-center">
          詳細祝福列表、奇物圖鑑及最優路線分析功能開發中，敬請期待。
        </p>
      </div>
    </div>
  );
}
