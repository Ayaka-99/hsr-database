import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import NavMenu from '@/components/NavMenu';

export const metadata: Metadata = {
  title: 'CT杯 數據庫',
  description: '崩壞：星穹鐵道角色與光錐數據庫',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <html lang="zh-TW">
      <head>
        <link rel="icon" href={`${basePath}/favicon.jpg.png`} type="image/png" />
        <link rel="shortcut icon" href={`${basePath}/favicon.jpg.png`} type="image/png" />
        <link rel="apple-touch-icon" href={`${basePath}/favicon.jpg.png`} />
        {/* 繁體中文字體 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative min-h-screen overflow-x-hidden selection:bg-[#d4af37]/30 selection:text-white">
        {/* 背景有機流體光球 (Liquid Ambient Blobs) */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
          <div className="liquid-blob-1 absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-[#d4af37]/15 to-[#f59e0b]/10 blur-3xl" />
          <div className="liquid-blob-2 absolute top-1/3 -right-28 w-[28rem] h-[28rem] rounded-full bg-gradient-to-bl from-[#7e57c2]/20 to-[#a855f7]/10 blur-3xl" />
          <div className="liquid-blob-3 absolute -bottom-32 left-1/4 w-[32rem] h-[32rem] rounded-full bg-gradient-to-tr from-[#0284c7]/15 to-[#6366f1]/10 blur-3xl" />
        </div>

        {/* 懸浮 VisionOS 液態島導覽列 (Floating Liquid Dock) */}
        <header className="sticky top-3 sm:top-4 z-50 px-3 sm:px-6 max-w-7xl mx-auto">
          <nav className="liquid-glass-dock rounded-2xl sm:rounded-full px-4 sm:px-6 h-14 sm:h-16 flex items-center transition-all duration-300">
            <Link href="/" className="flex items-center gap-2.5 text-[#d4af37] hover:text-[#ffd700] font-extrabold text-base sm:text-lg tracking-wider transition-colors group shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#7e57c2] shadow-[0_0_12px_rgba(212,175,55,0.4)]">
                <img
                  src={`${basePath}/favicon.jpg.png`}
                  alt="icon"
                  width={28}
                  height={28}
                  className="rounded-full object-cover animate-favicon-spin"
                />
              </div>
              <span className="bg-gradient-to-r from-[#ffd700] via-[#ffe270] to-[#f3e5ab] bg-clip-text text-transparent drop-shadow-sm font-black">
                CT杯 數據庫
              </span>
            </Link>

            {/* 右側選單與導覽 */}
            <NavMenu />
          </nav>
        </header>

        {/* 主內容區 */}
        <main className="max-w-7xl mx-auto px-4 pt-4 sm:pt-6 pb-16">
          {children}
        </main>
      </body>
    </html>
  );
}
