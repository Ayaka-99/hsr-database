// 三深淵頁面：忘卻之庭、末日幻影、純虛數幻境

export default function AbyssPage() {
  return (
    <div>
      {/* 頁面標題 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">三深淵</h1>
        <p className="text-sm text-gray-400 mt-1">星穹鐵道三大終局挑戰模式</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 忘卻之庭 */}
        <div className="rounded-2xl overflow-hidden border border-violet-500/30 bg-gradient-to-br from-[#1a0d3a] to-[#0d0d1a] p-6 hover:border-violet-500/60 hover:shadow-[0_0_24px_#6b4ff530] transition-all">
          <div className="mb-4">
            <div className="inline-block px-2 py-0.5 text-xs font-bold rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 mb-3">
              Memory of Chaos
            </div>
            <h2 className="text-xl font-bold text-white">忘卻之庭</h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            雙陣營輪換的限時挑戰。玩家需在每月兩個周期內，以最少行動次數清除所有敵人。
            挑戰分為 12 層，每層包含兩個半場，各使用不同角色陣容。
          </p>
          <ul className="space-y-1">
            {['每月重置，持續兩周', '共 12 層，每層 2 場', '追求最少行動輪數', '需準備兩套陣容'].map(t => (
              <li key={t} className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-1 h-1 rounded-full bg-violet-400 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* 末日幻影 */}
        <div className="rounded-2xl overflow-hidden border border-orange-500/30 bg-gradient-to-br from-[#2a0d00] to-[#0d0d1a] p-6 hover:border-orange-500/60 hover:shadow-[0_0_24px_#f9731630] transition-all">
          <div className="mb-4">
            <div className="inline-block px-2 py-0.5 text-xs font-bold rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 mb-3">
              Apocalyptic Shadow
            </div>
            <h2 className="text-xl font-bold text-white">末日幻影</h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            以擊殺 BOSS 為核心的限時挑戰。每期設有特定的增益 BUFF 與敵人弱點，
            玩家需要針對性地搭配陣容，在時限內造成最大傷害。
          </p>
          <ul className="space-y-1">
            {['強調單體爆發傷害', '每期 BOSS 弱點不同', '特殊 BUFF 機制加成', '需針對弱點搭配屬性'].map(t => (
              <li key={t} className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-1 h-1 rounded-full bg-orange-400 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* 純虛數幻境 */}
        <div className="rounded-2xl overflow-hidden border border-sky-500/30 bg-gradient-to-br from-[#001a2a] to-[#0d0d1a] p-6 hover:border-sky-500/60 hover:shadow-[0_0_24px_#0ea5e930] transition-all">
          <div className="mb-4">
            <div className="inline-block px-2 py-0.5 text-xs font-bold rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 mb-3">
              Pure Fiction
            </div>
            <h2 className="text-xl font-bold text-white">純虛數幻境</h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            以積累擊殺數量為勝利條件的群體輸出挑戰。持續刷新的雜兵浪潮，
            考驗玩家的範圍傷害能力與行動效率。
          </p>
          <ul className="space-y-1">
            {['強調群體 AOE 傷害', '擊殺積分達標過關', '無限刷新敵人浪潮', '需高行動頻率輸出'].map(t => (
              <li key={t} className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-1 h-1 rounded-full bg-sky-400 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 備註 */}
      <div className="mt-8 p-4 rounded-xl border border-white/10 bg-white/3">
        <p className="text-xs text-gray-500 text-center">
          詳細陣容推薦與評分功能開發中，敬請期待。
        </p>
      </div>
    </div>
  );
}
