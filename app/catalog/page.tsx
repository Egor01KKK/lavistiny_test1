import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/sheets';

export const revalidate = 3600;

type SearchParams = Record<string, string | string[] | undefined>;
const pick = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v ?? '';

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const items = await getAllProducts();

  // Текущие параметры
  const category = pick(searchParams?.category);
  const pageParam = pick(searchParams?.page);

  // Фильтрация ТОЛЬКО по категории (как в финале)
  const filtered = category
    ? items.filter((p) => p.category === category)
    : items;

  // Уникальные категории для селекта
  const categories = Array.from(
    new Set(items.map((p) => p.category).filter(Boolean) as string[])
  ).sort((a, b) => a.localeCompare(b, 'ru'));

  // Пагинация
  const perPage = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(
    Math.max(1, Number(pageParam || '1') || 1),
    totalPages
  );
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageItems = filtered.slice(start, end);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Шапка секции */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold">Каталог</h1>

        {/* Один селект «Категория» справа */}
        <div className="min-w-[220px] relative inline-block">
          <select
            id="cat-select"
            defaultValue={category}
            className="appearance-none bg-white rounded-2xl h-12 pl-4 pr-9 border border-base-line text-lg shadow-sm"
          >
            <option value="">{'Все'}</option>
            {categories.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {/* стрелочка */}
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600"
          >
            <path
              d="M6 9l6 6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Сетка товаров */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-20">
        {pageItems.map((p) => (
          <ProductCard key={p.sku} product={p} />
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
            const params = new URLSearchParams();
            if (category) params.set('category', category);
            params.set('page', String(n));
            return (
              <a
                key={n}
                href={`/catalog?${params.toString()}`}
                className={`px-3 py-1 rounded-lg border border-base-line ${
                  n === page ? 'bg-black text-white' : 'hover:bg-zinc-100'
                }`}
              >
                {n}
              </a>
            );
          })}
        </div>
      )}

      {/* Маленький скрипт: на изменение селекта меняем query и сбрасываем page */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(){
            var s = document.getElementById('cat-select');
            if(!s) return;
            s.addEventListener('change', function () {
              var u = new URL(window.location.href);
              var v = s.value;
              if (v) u.searchParams.set('category', v);
              else u.searchParams.delete('category');
              u.searchParams.delete('page');
              window.location.href = u.toString();
            });
          })();`,
        }}
      />
    </div>
  );
}
