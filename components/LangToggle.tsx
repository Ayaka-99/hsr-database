'use client';
import { useLang } from '@/lib/lang';

// 語言切換按鈕（EN/ZH）
export default function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      className={`px-3 py-1 rounded-full text-xs border transition-colors font-semibold
        ${lang === 'en'
          ? 'bg-[#c9a227]/20 border-[#c9a227]/60 text-[#c9a227]'
          : 'border-white/20 text-gray-400 hover:border-white/40 hover:text-gray-200'}`}
    >
      {lang === 'zh' ? 'EN' : '中'}
    </button>
  );
}
