import { getAllProducts, buildFilters } from '@/lib/sheets';
import { apply, paginate } from '@/lib/filters';
import ProductCard from '@/components/ProductCard';
import OneFilter from '@/components/OneFilter';

export const revalidate = 3600;

// ⬇️ helper: берём первую строку, если пришёл массив
const one = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const items = await getAllProducts();
  const unique = buildFilters(items);

  // ⬇️ страница тоже через one()
  const page = Number(one(searchParams.page) ?? 1);
  const perPage = 12;

  // ⬇️ все параметры к string | undefined
  const filtered = apply(items, {
    category:  one(searchParams.category),
    material:  one(searchParams.material),
    color:     one(searchParams.color),
    collection: one(searchParams.collection),
    sort: (one(searchParams.sort) as any) ?? 'new',
  });

  const { items: pageItems, pages } = paginate(filtered, page, perPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* заголовок + одиночный фильтр справа */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Каталог</h1>
        <OneFilter options={unique.categories} param="category" />
      </div>

      {/* сетка карточек */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {pageItems.map((p) => (
          <ProductCard key={p.sku} product={p} />
        ))}
      </div>

      {/* пагинация */}
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
