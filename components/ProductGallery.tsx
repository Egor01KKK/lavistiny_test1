'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Props = { images?: string[]; name: string };

const THUMBS_PER_PAGE = 4;
const DRAG_ENABLED = true;                 // ← выключить свайп: false
const DRAG_THRESHOLD = 60;                 // px до переключения
const DRAG_ELASTIC = 0.12;

export default function ProductGallery({ images, name }: Props) {
  const imgs = images && images.length ? images : ['/placeholder.jpg'];

  // главный кадр
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  // страницы превью по 4
  const pages = useMemo(() => chunk(imgs, THUMBS_PER_PAGE), [imgs]);
  const [thumbPage, setThumbPage] = useState(0);
  const [thumbDir, setThumbDir] = useState<1 | -1>(1);

  useEffect(() => {
    const p = Math.floor(idx / THUMBS_PER_PAGE);
    if (p !== thumbPage) {
      setThumbDir(p > thumbPage ? 1 : -1);
      setThumbPage(p);
    }
  }, [idx, thumbPage]);

  // чтобы первый рендер не анимировался
  const firstMount = useRef(true);
  useEffect(() => void (firstMount.current = false), []);

  // анимация большого кадра — «преследование»
  const mainVariants = {
    enter: (d: 1 | -1) => ({ x: d === 1 ? '100%' : '-100%' }),
    center: { x: 0 },
    exit: (d: 1 | -1) => ({ x: d === 1 ? '-20%' : '20%' }),
  } as const;
  const mainSpring = { type: 'spring', stiffness: 320, damping: 34, mass: 0.8 };

  // анимация полосы превью
  const stripVariants = {
    enter: (d: 1 | -1) => ({ x: d === 1 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: 1 | -1) => ({ x: d === 1 ? '-100%' : '100%', opacity: 0 }),
  };

  const goThumbPage = (to: number) => {
    if (!pages.length) return;
    const norm = mod(to, pages.length);
    if (norm === thumbPage) return;
    setThumbDir(norm > thumbPage ? 1 : -1);
    setThumbPage(norm);
  };

  const goto = (next: number) => {
    const n = mod(next, imgs.length);
    setDir(n > idx ? 1 : -1);
    setIdx(n);
  };

  return (
    <div className="w-full select-none">
      {/* большой кадр c drag */}
      <div className="relative overflow-hidden rounded-2xl border border-base-line">
        <div className="relative aspect-square w-full">
          <AnimatePresence initial={false} mode="popLayout" custom={dir}>
            <motion.div
              key={imgs[idx]}
              custom={dir}
              className="absolute inset-0 cursor-grab"
              initial={firstMount.current ? false : 'enter'}
              animate="center"
              exit="exit"
              variants={mainVariants}
              transition={mainSpring}
              drag={DRAG_ENABLED ? 'x' : false}
              dragElastic={DRAG_ELASTIC}
              dragMomentum={false}
              onDragStart={(e) => e.preventDefault()}
              onDragEnd={(_, info) => {
                if (!DRAG_ENABLED) return;
                if (info.offset.x > DRAG_THRESHOLD) goto(idx - 1);
                else if (info.offset.x < -DRAG_THRESHOLD) goto(idx + 1);
              }}
              whileTap={{ cursor: 'grabbing' }}
            >
              <Image
                src={imgs[idx]}
                alt={name}
                fill
                sizes="(min-width:1024px) 600px, 100vw"
                className="object-cover"
                priority={idx === 0}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* превью — 4 в ряд, растянуты, с безопасным внутренним отступом под inset-рамку */}
      <div className="relative mt-3">
        {pages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goThumbPage(thumbPage - 1)}
              aria-label="Предыдущие превью"
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-lg border border-base-line bg-white/70 px-2.5 py-1.5 backdrop-blur hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goThumbPage(thumbPage + 1)}
              aria-label="Следующие превью"
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-lg border border-base-line bg-white/70 px-2.5 py-1.5 backdrop-blur hover:bg-white"
            >
              ›
            </button>
          </>
        )}

        {/* p-1.5 — «подушка», чтобы inset-рамка не упиралась в маску */}
        <div className="overflow-hidden rounded-xl p-1.5">
          <div className="relative">
            <AnimatePresence initial={false} mode="popLayout" custom={thumbDir}>
              <motion.div
                key={thumbPage}
                custom={thumbDir}
                className="grid gap-3"
                style={{
                  gridTemplateColumns: `repeat(${THUMBS_PER_PAGE}, minmax(80px, 1fr))`,
                }}
                initial="enter"
                animate="center"
                exit="exit"
                variants={stripVariants}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {withGhosts(pages[thumbPage], THUMBS_PER_PAGE).map((srcOrNull, i) => {
                  if (!srcOrNull) return <div key={`ghost-${i}`} className="aspect-square w-full opacity-0" />;

                  const iGlobal = thumbPage * THUMBS_PER_PAGE + i;
                  const active = iGlobal === idx;

                  return (
                    <button
                      type="button"
                      key={`${srcOrNull}-${iGlobal}`}
                      onClick={() => goto(iGlobal)}
                      className={`rounded-xl transition ${
                        active
                          ? 'shadow-[inset_0_0_0_2px_rgba(0,0,0,0.72)]'
                          : 'border border-base-line hover:border-zinc-300'
                      }`}
                      aria-label={`Показать изображение ${iGlobal + 1}`}
                    >
                      <span className="block overflow-hidden rounded-[inherit]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={srcOrNull}
                          alt={`${name} — превью ${iGlobal + 1}`}
                          className="block aspect-square w-full object-cover"
                          draggable={false}
                          onDragStart={(e) => e.preventDefault()}
                        />
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* helpers */
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out.length ? out : [[]];
}
function withGhosts<T>(arr: T[], size: number): (T | null)[] {
  const res = [...arr];
  while (res.length < size) res.push(null);
  return res;
}
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
