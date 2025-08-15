import { getAllProducts, getProductBySlug, getRelated } from '@/lib/sheets';
import ProductGallery from '@/components/ProductGallery';
import { productLdJson } from '@/lib/seo';
import RelatedCarousel from '@/components/RelatedCarousel';

export const revalidate = 3600;

export async function generateStaticParams() {
  const items = await getAllProducts();
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getProductBySlug(params.slug);
  if (!p) return {};
  const base = process.env.SITE_URL || 'http://localhost:3000';
  const title = `${p.name} — Lavistini`;
  const description = `${p.name} — из коллекции ${p.collection || ''}. Купить на маркетплейсах. Описание, фото, цена.`.trim();

  return {
    title,
    description,
    // важно: без openGraph.type
    alternates: { canonical: `${base}/product/${p.slug}` },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getProductBySlug(params.slug);
  if (!p) {
    return <div className="max-w-6xl mx-auto px-4 py-10">Товар не найден</div>;
  }

  const related = await getRelated(p, 12); // можно 8/12 — как удобнее

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* JSON-LD для Product (SEO) */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLdJson(p)) }}
      />

      <div className="grid md:grid-cols-2 gap-8">
        <ProductGallery images={p.images} name={p.name} />

        <div>
          <h1 className="text-2xl font-semibold">{p.name}</h1>
          <div className="mt-1 text-zinc-500">Артикул: {p.sku}</div>
          {typeof p.price === 'number' && (
            <div className="mt-3 text-lg font-semibold">
              {p.price.toLocaleString('ru-RU')} ₽
            </div>
          )}
          {p.description && (
            <p className="mt-4 text-zinc-700 whitespace-pre-line">{p.description}</p>
          )}

          {/* Кнопки маркетплейсов */}
          <div className="mt-6 flex flex-wrap gap-3">
            {/* Wildberries */}
            {p.wb_url && (
              <a
                href={p.wb_url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                data-sku={p.sku}
                data-market="wb"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-white font-medium
                           bg-gradient-to-r from-[#6E00FF] to-[#FF2E93] hover:opacity-95 active:opacity-90
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6E00FF]"
              >
                Купить на Wildberries
              </a>
            )}

            {/* Ozon */}
            {p.ozon_url && (
              <a
                href={p.ozon_url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                data-sku={p.sku}
                data-market="ozon"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-white font-medium
                           bg-[#005BFF] hover:bg-[#004AE6] active:bg-[#003FCC]
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005BFF]"
              >
                Купить на Ozon
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Слайдер «Похожие товары» */}
      {related.length > 0 && (
        <div className="mt-14">
          <RelatedCarousel title="Похожие товары" items={related} />
        </div>
      )}
    </div>
  );
}
