'use client';

import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type Item = { href: string; label: string };

export default function MobileMenu({
  open, onClose, items,
}: { open: boolean; onClose: () => void; items: Item[] }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // блокируем скролл, когда меню открыто
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? 'hidden' : prev || '';
    return () => { document.body.style.overflow = prev || ''; };
  }, [open]);

  // закрытие по Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // переход по ссылке — закрываем
  useEffect(() => { onClose(); /* eslint-disable-next-line */ }, [pathname]);

  if (!mounted) return null;

  return createPortal(
    // ВАЖНО: контейнер БЕЗ pointer-events, чтобы стрелка в хедере была кликабельной
    <div className="fixed inset-0 z-[60] md:hidden pointer-events-none" aria-hidden={!open}>
      {/* затемнение (только когда открыто) */}
      <div
        onClick={onClose}
        className={`absolute top-24 inset-x-0 bottom-0 bg-black/30 transition-opacity
                    ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* панель (под шапкой), выезжает справа */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Мобильное меню"
        className={`absolute top-24 right-0 bottom-0 w-[88%] max-w-[480px] bg-white shadow-xl
                    transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${open ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}
      >
        <nav className="h-full overflow-y-auto px-5 py-6">
          <ul className="space-y-6">
            {items.map(it => (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className="block rounded-lg px-2 py-2 text-4xl leading-tight text-zinc-900 active:bg-zinc-100"
                >
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>,
    document.body
  );
}
