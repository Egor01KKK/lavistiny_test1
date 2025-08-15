// app/catalog/page.tsx
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Filters from '@/components/Filters';
import { getAllProducts, type Product } from '@/lib/sheets';
import { apply } from '@/lib/filters';

export const revalidate = 3600;

// — утилита: приводим `string | string[] | undefined` к `string | undefined`
function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

// — утилита: получаем уникальные значения по ключу
function uniqBy<K extends keyof Product>(items: Product[], key: K): string[] {
  return Array.from(
    new Set(
      items
        .map((p) => (p[key] as unknown as string) || '')
        .map((s) => s.trim())
        .filter(Boolean)
    )
  );
}

type CatalogSearch = {
  category?: string | string[];
  material?: string | string[];
  color?: string | string[];
  collection?: string | string[];
  page?: string | string[];
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: CatalogSearch;
}) {
  // все товары
  const all = await getAllProducts();

  // нормализуем query
  const query = {
    category: one(searchParams?.category),
    material: one(searchParams?.material),
    color: one(searchParams?.color),
    collection: one(searchParams?.collection),
  };

  // фильтрация — гарантируем, что всегда массив
  const filtered: Product[] = (apply(all, query) ?? []) as Product[];

  // постранично
  const perPage = 12;
  const page = Number(one(searchParams?.page)) || 1;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageItems = filtered.slice(start, end);

  // списки уникальных значений для фильтров (всегда массивы!)
  const safeUnique = {
    category: uniqBy(all, 'category'),
    collection: uniqBy(all, 'collection'),
    material: uniqBy(all, 'material'),
    color: uniqBy(all, 'color'),
  };

  // вспомогательно — собираем ссылку c сохранением текущих фильтров
  const buildLink = (n: number) => {
    const params = new URLSearchParams();
    if (query.category) params.set('category', query.category);
    if (query.material) params.set('material', query.material);
    if (query.color) params.set('color', query.color);
    if (query.collection) params.set('collection', query.collection);
    params.set('page', String(n));
    return `/catalog?${params.toString()}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Фильтры: всегда получат массивы, так что .map не упадёт */}
      <Filters unique={safeUnique} />

      {/* Сетка товаров */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-20">
        {pageItems.map((p) => (
          <ProductCard key={p.sku} product={p} />
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={buildLink(n)}
              className={`rounded-md px-3 py-2 border ${
                n === page
                  ? 'bg-black text-white border-black'
                  : 'border-base-line hover:bg-zinc-50'
              }`}
            >
              {n}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
