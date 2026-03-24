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
    <div ref={ref} className="relative ml-auto">
      {/* 頭像按鈕 */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 hover:border-[#c9a227]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#c9a227]/40"
        aria-label="開啟選單"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hsr-database/favicon.jpg.png"
          alt="選單"
          className="w-full h-full object-cover"
          onError={(e) => {
            // 圖片載入失敗時顯示漢堡圖示
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
        <div className="absolute right-0 top-11 w-40 rounded-xl border border-white/10 bg-[#0d0d1a]/95 backdrop-blur-md shadow-xl z-50 overflow-hidden">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive =
              href === '/'
                ? pathname === '/hsr-database' || pathname === '/hsr-database/'
                : pathname.startsWith('/hsr-database' + href);
            return (
              <Link
                key={href}
                href={href}
                className={`block px-4 py-3 text-sm transition-colors hover:bg-white/5 ${
                  isActive
                    ? 'text-[#c9a227] font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
