// app/layout.tsx
import './globals.css';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

// Поменяй имена импортов на твои (если у тебя SiteHeader/SiteFooter — исправь ниже)
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const manrope = localFont({
  src: [{ path: './fonts/Manrope/Manrope-VariableFont_wght.ttf', weight: '100 900', style: 'normal' }],
  variable: '--font-manrope',
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body className="font-sans antialiased bg-[#f5f5f5] text-[#111]">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
