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
      <body>
        <>
          {/* 頂部導覽列 */}
          <nav className="sticky top-0 z-50 border-b border-white/[0.08] backdrop-blur-xl bg-[#0b0c16]/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center">
              <Link href="/" className="flex items-center gap-2.5 text-[#d4af37] hover:text-[#ffd700] font-extrabold text-lg sm:text-xl tracking-wider transition-colors group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#7e57c2]">
                  <img
                    src={`${basePath}/favicon.jpg.png`}
                    alt="icon"
                    width={30}
                    height={30}
                    className="rounded-full object-cover animate-favicon-spin"
                  />
                </div>
                <span>CT杯 數據庫</span>
              </Link>
              {/* 右側選單與導覽 */}
              <NavMenu />
            </div>
            {/* 頂欄底部星軌光條 */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
          </nav>
          <main className="max-w-7xl mx-auto px-4 py-6">
            {children}
          </main>
        </>
      </body>
    </html>
  );
}
