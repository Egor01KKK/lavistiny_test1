'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MobileMenu from './MobileMenu';

const NAV = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/where-to-buy', label: 'Где купить' },
  { href: '/about', label: 'О бренде' },
  { href: '/contacts', label: 'Контакты' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // закрываем при смене страницы
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-base-line">
      <div className="max-w-6xl mx-auto px-4 h-24 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center">
          <img src="/logo.svg" alt="Lavistini" className="h-10 md:h-12 lg:h-14 w-auto" />
        </Link>

        {/* десктоп */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map(i => {
            const active = pathname === i.href;
            return (
              <Link
                key={i.href}
                href={i.href}
                aria-current={active ? 'page' : undefined}
                className={`relative px-1 py-3 text-lg md:text-xl transition-all duration-200 rounded-lg
                  ${active ? 'text-black font-semibold after:scale-x-100'
                           : 'text-zinc-700 hover:text-black hover:-translate-y-[1px] after:scale-x-0'}
                  after:absolute after:left-0 after:bottom-2 after:h-[2px] after:w-full after:bg-current
                  after:origin-left after:transition-transform after:duration-200`}
              >
                {i.label}
              </Link>
            );
          })}
        </nav>

        {/* мобильная кнопка (бургер ⇄ стрелка) */}
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setOpen(v => !v)}
          className="md:hidden inline-flex items-center justify-center h-11 w-11 rounded-xl
                     border border-base-line bg-white shadow-sm active:scale-[0.98]"
        >
          {open ? (
            // стрелка влево
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            // бургер
            <span className="relative block w-6 h-6">
              <span className="absolute left-0 top-[4px] h-[2px] w-full bg-zinc-900" />
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full bg-zinc-900" />
              <span className="absolute left-0 bottom-[4px] h-[2px] w-full bg-zinc-900" />
            </span>
          )}
        </button>
      </div>

      {/* мобильное меню под шапкой, выезжает справа */}
      <MobileMenu open={open} onClose={() => setOpen(false)} items={NAV} />
    </header>
  );
}
