'use client';
import { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'zh' | 'en';
const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'zh', setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh');
  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved) setLangState(saved);
  }, []);
  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('lang', l);
  }
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export function useLang() { return useContext(LangCtx); }
