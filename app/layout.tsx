import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import FontToggle from '@/components/FontToggle';

export const metadata: Metadata = {
  title: 'CT杯 數據庫',
  description: '崩壞：星穹鐵道角色與光錐數據庫',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        {/* 繁體中文字體 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* 頂部導覽列 */}
        <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md bg-[#0d0d1a]/80">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
            <Link href="/" className="text-[#c9a227] font-bold text-lg tracking-wide">
              CT杯 數據庫
            </Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              角色
            </Link>
            <Link href="/lightcones" className="text-sm text-gray-400 hover:text-white transition-colors">
              光錐
            </Link>
            {/* 推到右側 */}
            <div className="ml-auto">
              <FontToggle />
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
