'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getAllRelicSets } from '@/lib/api';
import { useLang } from '@/lib/lang';
import type { RelicSet } from '@/lib/types';

type Tab = 'relic' | 'ornament';

// 遺器組合卡片元件
function RelicCard({ set, lang }: { set: RelicSet; lang: 'zh' | 'en' }) {
  const [imgError, setImgError] = useState(false);
  const displayName = lang === 'en' && set.nameEn ? set.nameEn : set.name;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 hover:border-[#c9a227]/40 transition-colors">
      <div className="flex items-start gap-3">
        {/* 圖示 */}
        <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-[#1a1a2e] border border-white/10 flex items-center justify-center">
          {!imgError ? (
            <Image
              src={set.icon}
              alt={displayName}
              fill
              className="object-contain p-1"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-gray-600 text-xs text-center leading-tight px-1">圖示</span>
          )}
        </div>

        {/* 內容 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm mb-2 leading-snug">{displayName}</h3>

          {/* 2 件效果 */}
          <div className="mb-2">
            <span className="inline-block text-xs font-bold text-[#c9a227] bg-[#c9a227]/10 border border-[#c9a227]/30 rounded px-1.5 py-0.5 mr-2">
              2件
            </span>
            <span className="text-xs text-gray-300 leading-relaxed">{set.effects[2] || '—'}</span>
          </div>

          {/* 4 件效果（遺器限定） */}
          {set.effects[4] && (
            <div>
              <span className="inline-block text-xs font-bold text-violet-400 bg-violet-400/10 border border-violet-400/30 rounded px-1.5 py-0.5 mr-2">
                4件
              </span>
              <span className="text-xs text-gray-300 leading-relaxed">{set.effects[4]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RelicsPage() {
  const { lang } = useLang();
  const [tab, setTab] = useState<Tab>('relic');
  const allSets = getAllRelicSets();
  const filtered = allSets.filter(s => s.type === tab);

  return (
    <div>
      {/* 頁面標題 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">遺器</h1>
        <p className="text-sm text-gray-400 mt-1">遺器與位面飾品套裝效果</p>
      </div>

      {/* 分頁標籤 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('relic')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${
            tab === 'relic'
              ? 'bg-[#c9a227]/20 border-[#c9a227]/60 text-[#c9a227]'
              : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-gray-200'
          }`}
        >
          遺器（2+4件）
        </button>
        <button
          onClick={() => setTab('ornament')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors border ${
            tab === 'ornament'
              ? 'bg-[#6b4ff5]/20 border-[#6b4ff5]/60 text-[#6b4ff5]'
              : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-gray-200'
          }`}
        >
          位面飾品（2件）
        </button>
      </div>

      {/* 套裝列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(set => (
          <RelicCard key={set.id} set={set} lang={lang} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-16">無資料</p>
      )}
    </div>
  );
}
