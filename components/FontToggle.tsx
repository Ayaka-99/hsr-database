'use client';

import { useState, useEffect } from 'react';

const TC_FONT = "'Noto Sans TC', sans-serif";
const DEFAULT_FONT = "Arial, Helvetica, sans-serif";

export default function FontToggle() {
  const [tcMode, setTcMode] = useState(false);

  // 切換 body 字體
  useEffect(() => {
    document.body.style.fontFamily = tcMode ? TC_FONT : DEFAULT_FONT;
  }, [tcMode]);

  return (
    <button
      onClick={() => setTcMode(prev => !prev)}
      title={tcMode ? '切換回預設字體' : '切換為繁體中文字體'}
      className={`
        px-3 py-1 rounded-full text-xs border transition-colors
        ${tcMode
          ? 'bg-[#c9a227]/20 border-[#c9a227]/60 text-[#c9a227] font-semibold'
          : 'border-white/20 text-gray-400 hover:border-white/40 hover:text-gray-200'}
      `}
    >
      繁體字體
    </button>
  );
}
