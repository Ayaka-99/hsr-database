'use client';

import { useState, useEffect } from 'react';

export default function CharacterAnchorNav({ hasEidolons = true }: { hasEidolons?: boolean }) {
  const [showTop, setShowTop] = useState(false);
  const [activeSection, setActiveSection] = useState<'stats' | 'skills' | 'eidolons'>('stats');

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);

      const skillsEl = document.getElementById('section-skills');
      const eidolonsEl = document.getElementById('section-eidolons');

      if (eidolonsEl && window.scrollY >= eidolonsEl.offsetTop - 200) {
        setActiveSection('eidolons');
      } else if (skillsEl && window.scrollY >= skillsEl.offsetTop - 200) {
        setActiveSection('skills');
      } else {
        setActiveSection('stats');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-2 pointer-events-none">
      {/* 快捷錨點目錄條 (桌面與手機端皆自適應) */}
      <div className="pointer-events-auto flex items-center p-1.5 rounded-full bg-[#0d0e1b]/90 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/60 text-xs">
        <button
          onClick={() => scrollTo('section-stats')}
          className={`px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
            activeSection === 'stats'
              ? 'bg-[#d4af37]/20 border border-[#d4af37]/60 text-[#ffd700] font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          屬性
        </button>

        <button
          onClick={() => scrollTo('section-skills')}
          className={`px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
            activeSection === 'skills'
              ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-200 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          技能
        </button>

        {hasEidolons && (
          <button
            onClick={() => scrollTo('section-eidolons')}
            className={`px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              activeSection === 'eidolons'
                ? 'bg-violet-600/20 border border-violet-400/60 text-violet-200 font-bold shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            星魂
          </button>
        )}
      </div>

      {/* 回到頂端浮動按鈕 */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="pointer-events-auto w-10 h-10 rounded-full bg-white/10 hover:bg-[#d4af37]/30 border border-white/20 hover:border-[#d4af37]/60 text-white hover:text-[#ffd700] backdrop-blur-xl shadow-xl flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
          aria-label="回到頂端"
          title="回到頂端"
        >
          ▲
        </button>
      )}
    </div>
  );
}
