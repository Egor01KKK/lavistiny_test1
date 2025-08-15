import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '@/lib/sheets';
import ProductCard from '@/components/ProductCard';

export const revalidate = 3600;

export default async function HomePage() {
  const items = await getAllProducts();
  const best = items.filter(p => p.bestseller).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">
      {/* ХИРО-БАННЕР */}
      <section className="relative h-[62vh] min-h-[420px] w-full overflow-hidden rounded-2xl border border-base-line">
        <Image
          src="/hero.jpg"
          alt="Lavistini hero"
          fill
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
        <div className="relative z-10 h-full flex items-center">
          <div className="px-6 md:px-10 lg:px-14 max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.95]">
              СЕРЕБРО
            </h1>
            <p className="mt-2 text-2xl md:text-3xl text-zinc-600">
              в лаконичном прочтении
            </p>
            <Link
              href="/catalog"
              className="mt-8 inline-flex items-center rounded-xl px-6 py-3 border border-base-line hover:bg-black hover:text-white transition will-change-transform hover:scale-[1.02]"
            >
              В каталог
            </Link>
          </div>
        </div>
      </section>

      {/* Бестселлеры */}
      {best.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold tracking-tight text-2xl sm:text-3xl md:text-4xl">Бестселлеры</h2>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-20">
            {best.map(p => <ProductCard key={p.sku} product={p} />)}
          </div>

          {/* CTA к каталогу */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 border border-base-line hover:bg-black hover:text-white transition"
              aria-label="Больше украшений"
            >
              Больше украшений
              <svg width="18" height="18" viewBox="0 0 24 24" className="-mr-1">
                <path
                  d="M13 5l7 7-7 7M5 12h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
