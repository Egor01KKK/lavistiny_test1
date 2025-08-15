'use client';

import { useMemo, useRef, useState, useLayoutEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/sheets';

export default function RelatedCarousel({
  title = 'Похожие товары',
  items,
}: {
  title?: string;
  items: Product[];
}) {
  // Сколько карточек видно одновременно — адаптивно
  const [visible, setVisible] = useState(4);

  // Текущий первый индекс
  const [index, setIndex] = useState(0);

  // Ссылка на контейнер-вьюпорт и ширина шага (px) для одной карточки
  const viewportRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  // Вычисляем visible + step при первом рендере и на ресайз
  useLayoutEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      // tailwind-брейкпоинты: sm=640, lg=1024
      const v = vw < 640 ? 1 : vw < 1024 ? 2 : 4;
      setVisible(v);

      const w = viewportRef.current?.clientWidth ?? 0;
      setStep(w / v);
    };

    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Когда меняется visible или количество items, не даём index «выпасть» за пределы
  const maxIndex = useMemo(
    () => Math.max(0, items.length - visible),
    [items.length, visible]
  );
  useLayoutEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  // Кнопки (шаг всегда 1 элемент)
  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

  // Drag/Swipe
  const [dragX, setDragX] = useState(0);
  const startX = useRef(0);
  const dragging = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setDragX(e.clientX - startX.current);
  };
  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;

    const threshold = step / 4; // четверть карточки — переключаем
    if (dragX > threshold) prev();
    else if (dragX < -threshold) next();

    setDragX(0);
  };

  // Смещение ленты
  const translate = -(index * step) + dragX;

  return (
    <section className="mt-14">
      <h2 className="text-2xl font-semibold">{title}</h2>

      <div className="relative mt-6">
        {/* Вьюпорт */}
        <div
          ref={viewportRef}
          className="overflow-hidden rounded-2xl select-none touch-pan-y"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
        >
          {/* Лента */}
          <div
            className="flex transition-transform duration-500 ease-out will-change-transform"
            style={{ transform: `translate3d(${translate}px,0,0)` }}
          >
            {items.map((p) => (
              <div
                key={p.sku}
                className="shrink-0 grow-0 pr-6"
                style={{ flexBasis: `${100 / visible}%` }} // 1/2/4 элементов по брейкпоинтам
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>

        {/* Стрелки — оставил твоё позиционирование */}
        {/* LEFT */}
        <div className="pointer-events-none absolute left-0 top-[45%] -translate-y-1/2">
          <button
            onClick={prev}
            aria-label="Назад"
            disabled={index === 0}
            className="pointer-events-auto h-10 w-10 md:h-11 md:w-11 rounded-full
                       bg-white/90 border border-base-line shadow
                       hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed
                       -translate-x-1/2 ml-1"
          >
            <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5">
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* RIGHT */}
        <div className="pointer-events-none absolute right-0 top-[44%] -translate-y-1/2">
          <button
            onClick={next}
            aria-label="Вперёд"
            disabled={index === maxIndex}
            className="pointer-events-auto h-10 w-10 md:h-11 md:w-11 rounded-full
                       bg-white/90 border border-base-line shadow
                       hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed
                       translate-x-1/2 mr-6"
          >
            <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
