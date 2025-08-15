import type { Product } from '@/lib/sheets';

export type SortKey = 'new' | 'price_asc' | 'price_desc';

export type FilterParams = {
  category?: string;
  collection?: string;
  color?: string;
  material?: string;
  sort?: SortKey;
};

const norm = (v?: string) => (v ?? '').trim().toLowerCase();
const actv = (v?: string) => {
  const x = norm(v);
  return x && x !== 'all' ? x : '';
};

export function apply(items: Product[], params: FilterParams): Product[] {
  const cat = actv(params.category);
  const col = actv(params.collection);
  const clr = actv(params.color);
  const mat = actv(params.material);

  let out = items.filter((p) => {
    if (cat && norm(p.category) !== cat) return false;
    if (col && norm(p.collection) !== col) return false;
    if (clr && norm(p.color) !== clr) return false;
    if (mat && norm(p.material) !== mat) return false;
    return true;
  });

  switch (params.sort) {
    case 'price_asc':
      out = out.slice().sort(
        (a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY)
      );
      break;
    case 'price_desc':
      out = out.slice().sort(
        (a, b) => (b.price ?? Number.NEGATIVE_INFINITY) - (a.price ?? Number.NEGATIVE_INFINITY)
      );
      break;
    default:
      // 'new' — оставляем исходный порядок из таблицы
      break;
  }

  return out;
}

export function paginate<T>(arr: T[], page: number, perPage: number) {
  const total = arr.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const p = Math.min(Math.max(page, 1), pages);
  const start = (p - 1) * perPage;
  return { items: arr.slice(start, start + perPage), total, page: p, pages };
}
