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

  return (
    <div ref={ref} className="flex items-center ml-auto">
      {/* 桌面端直覺導覽標籤 */}
      <div className="hidden md:flex items-center gap-1.5 mr-3">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive =
            href === '/'
              ? pathname === '/hsr-database' || pathname === '/hsr-database/' || pathname === '/'
              : pathname.includes(href);
          return (
            <Link
              key={href}
              href={href}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#d4af37]/20 border border-[#d4af37]/60 text-[#ffd700] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
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
          className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 hover:border-[#d4af37]/80 hover:shadow-[0_0_12px_rgba(212,175,55,0.4)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40 cursor-pointer"
          aria-label="開啟選單"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hsr-database/favicon.jpg.png"
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

        {/* 下拉選單 */}
        {open && (
          <div className="absolute right-0 top-12 w-48 rounded-2xl border border-white/10 bg-[#0e101d]/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-white/[0.06] mb-1">
              星軌導航
            </div>
            {NAV_ITEMS.map(({ href, label }) => {
              const isActive =
                href === '/'
                  ? pathname === '/hsr-database' || pathname === '/hsr-database/' || pathname === '/'
                  : pathname.includes(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center justify-between px-3.5 py-2 text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-[#d4af37]/15 text-[#ffd700] font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.06]'
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
