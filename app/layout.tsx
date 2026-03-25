import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import NavMenu from '@/components/NavMenu';

export const metadata: Metadata = {
  title: 'CT杯 數據庫',
  description: '崩壞：星穹鐵道角色與光錐數據庫',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="icon" href="/hsr-database/favicon.jpg.png" type="image/png" />
        <link rel="shortcut icon" href="/hsr-database/favicon.jpg.png" type="image/png" />
        <link rel="apple-touch-icon" href="/hsr-database/favicon.jpg.png" />
        {/* 繁體中文字體 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <>
          {/* 頂部導覽列 */}
          <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md bg-[#0d0d1a]/80">
            <div className="max-w-7xl mx-auto px-4 h-12 sm:h-14 flex items-center">
              <Link href="/" className="flex items-center gap-2 text-[#c9a227] font-bold text-lg tracking-wide">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hsr-database/favicon.jpg.png"
                  alt="icon"
                  width={28}
                  height={28}
                  className="rounded-full object-cover border border-white/20"
                />
                CT杯 數據庫
              </Link>
              {/* 右側頭像選單 */}
              <NavMenu />
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 py-6">
            {children}
          </main>
        </>
      </body>
    </html>
  );
}
