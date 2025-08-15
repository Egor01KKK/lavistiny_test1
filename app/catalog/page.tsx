import { getAllProducts, buildFilters } from '@/lib/sheets';
import { apply, paginate } from '@/lib/filters';
import ProductCard from '@/components/ProductCard';
import OneFilter from '@/components/OneFilter';

export const revalidate = 3600;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const items = await getAllProducts();
  const unique = buildFilters(items);

  const page = Number(searchParams.page || 1);
  const perPage = 12;

  const filtered = apply(items, {
    category: searchParams.category,
    material: searchParams.material,
    color: searchParams.color,
    collection: searchParams.collection,
    sort: (searchParams.sort as any) ?? 'new',
  });

  const { items: pageItems, pages } = paginate(filtered, page, perPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Заголовок + ОДИН фильтр справа */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-semibold text-4xl sm:text-4xl md:text-5xl">
          Каталог
        </h1>

        {unique.category?.length ? (
          <OneFilter
            options={unique.category}
            param="category"
            placeholder="Все категории"
          />
        ) : null}
      </div>

      {/* Карточки */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {pageItems.map((p) => (
          <ProductCard key={p.sku} product={p} />
        ))}
      </div>

      {/* Пагинация */}
      <nav className="mt-12 flex justify-center gap-2">
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <a
            key={n}
            href={`?page=${n}`}
            className={`px-3 py-1.5 rounded-lg border ${
              n === page ? 'bg-black text-white' : 'border-base-line'
            }`}
          >
            {n}
          </a>
        ))}
      </nav>
    </div>
  );
}
