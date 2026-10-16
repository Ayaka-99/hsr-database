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
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-2.5 pointer-events-none">
      {/* 快捷錨點目錄條 (VisionOS Liquid Capsule Dock) */}
      <div className="pointer-events-auto flex items-center p-1.5 rounded-full liquid-glass-dock shadow-2xl text-xs border border-white/20">
        <button
          onClick={() => scrollTo('section-stats')}
          className={`px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
            activeSection === 'stats'
              ? 'bg-gradient-to-r from-[#d4af37]/30 to-[#ffd700]/20 border border-[#ffd700]/70 text-[#ffd700] font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
              : 'text-gray-300 hover:text-white hover:bg-white/[0.08]'
          }`}
        >
          屬性
        </button>

        <button
          onClick={() => scrollTo('section-skills')}
          className={`px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
            activeSection === 'skills'
              ? 'bg-gradient-to-r from-cyan-500/30 to-sky-500/20 border border-cyan-400/70 text-cyan-100 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
              : 'text-gray-300 hover:text-white hover:bg-white/[0.08]'
          }`}
        >
          技能
        </button>

        {hasEidolons && (
          <button
            onClick={() => scrollTo('section-eidolons')}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              activeSection === 'eidolons'
                ? 'bg-gradient-to-r from-purple-600/30 to-violet-500/20 border border-purple-400/70 text-purple-100 font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'text-gray-300 hover:text-white hover:bg-white/[0.08]'
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
          className="pointer-events-auto w-11 h-11 rounded-full liquid-glass-dock border border-white/25 hover:border-[#ffd700]/80 text-white hover:text-[#ffd700] shadow-2xl flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer group"
          aria-label="回到頂端"
          title="回到頂端"
        >
          <span className="transition-transform group-hover:-translate-y-0.5 font-black text-sm">▲</span>
        </button>
      )}
    </div>
  );
}
