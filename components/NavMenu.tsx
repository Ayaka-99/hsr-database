'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 所有頁面連結
const NAV_ITEMS = [
  { href: '/', label: '角色' },
  { href: '/lightcones', label: '光錐' },
  { href: '/abyss', label: '三深淵' },
  { href: '/simulated', label: '異相仲裁' },
  { href: '/relics', label: '遺器' },
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // 點擊外部關閉選單
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // 路由切換時關閉選單
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const checkActive = (href: string) => {
    if (href === '/') {
      return pathname === basePath || pathname === `${basePath}/` || pathname === '/' || pathname === '/hsr-database' || pathname === '/hsr-database/';
    }
    return pathname.includes(href);
  };

  return (
    <div ref={ref} className="flex items-center ml-auto">
      {/* 桌面端直覺導覽標籤 */}
      <div className="hidden md:flex items-center gap-2 mr-3">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive = checkActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 relative ${
                isActive
                  ? 'bg-gradient-to-r from-[#d4af37]/25 to-[#ffd700]/15 border border-[#ffd700]/60 text-[#ffd700] shadow-[0_0_16px_rgba(212,175,55,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                  : 'text-gray-300 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/15'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* 頭像按鈕 */}
      <div className="relative">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 hover:border-[#d4af37]/80 hover:shadow-[0_0_16px_rgba(212,175,55,0.5)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 cursor-pointer"
          aria-label="開啟選單"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/favicon.jpg.png`}
            alt="選單"
            className="w-full h-full object-cover animate-favicon-spin"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* 漢堡線條備用 */}
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-[5px] opacity-0 [img:not([style*='none'])+&]:opacity-0 [img[style*='none']+&]:opacity-100">
            <span className="w-4 h-0.5 bg-gray-300 rounded" />
            <span className="w-4 h-0.5 bg-gray-300 rounded" />
            <span className="w-4 h-0.5 bg-gray-300 rounded" />
          </span>
        </button>

        {/* 下拉選單 (Liquid Glass VisionOS 風格) */}
        {open && (
          <div className="absolute right-0 top-12 w-52 rounded-2xl liquid-glass shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-150 border border-white/20">
            <div className="px-4 py-1.5 text-[11px] font-bold text-[#d4af37] tracking-wider border-b border-white/[0.08] mb-1.5 flex items-center justify-between">
              <span>✦ 星軌導航</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" />
            </div>
            {NAV_ITEMS.map(({ href, label }) => {
              const isActive = checkActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#d4af37]/20 text-[#ffd700] font-bold border-l-2 border-[#ffd700]'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span>{label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
