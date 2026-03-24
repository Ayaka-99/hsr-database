import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import LangToggle from '@/components/LangToggle';
import { LangProvider } from '@/lib/lang';

export const metadata: Metadata = {
  title: 'CT杯 數據庫',
  description: '崩壞：星穹鐵道角色與光錐數據庫',
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
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
        <LangProvider>
          {/* 頂部導覽列 */}
          <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md bg-[#0d0d1a]/80">
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 text-[#c9a227] font-bold text-lg tracking-wide">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/favicon.jpg" alt="icon" className="w-7 h-7 rounded-full object-cover border border-white/20" />
                CT杯 數據庫
              </Link>
              <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                角色
              </Link>
              <Link href="/lightcones" className="text-sm text-gray-400 hover:text-white transition-colors">
                光錐
              </Link>
              <Link href="/abyss" className="text-sm text-gray-400 hover:text-white transition-colors">
                三深淵
              </Link>
              <Link href="/simulated" className="text-sm text-gray-400 hover:text-white transition-colors">
                異相
              </Link>
              <Link href="/relics" className="text-sm text-gray-400 hover:text-white transition-colors">
                仪器
              </Link>
              {/* 推到右側 */}
              <div className="ml-auto">
                <LangToggle />
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 py-6">
            {children}
          </main>
        </LangProvider>
      </body>
    </html>
  );
}
