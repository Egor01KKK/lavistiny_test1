import Papa from 'papaparse';

export type Product = {
  name: string;
  sku: string;
  description: string;
  price: number | null;
  images: string[];
  ozon_url?: string;
  wb_url?: string;
  category?: string;
  collection?: string;
  color?: string;
  material?: string;
  bestseller?: boolean;
  slug: string;
};

function toBool(v?: string) {
  return String(v ?? '').trim().toLowerCase() === 'true';
}

function slugify(input: string) {
  const map: Record<string, string> = {
    ё:'e', й:'i', ц:'c', у:'u', к:'k', е:'e', н:'n', г:'g', ш:'sh', щ:'sch', з:'z', х:'h', ъ:'',
    ф:'f', ы:'y', в:'v', а:'a', п:'p', р:'r', о:'o', л:'l', д:'d', ж:'zh', э:'e',
    я:'ya', ч:'ch', с:'s', м:'m', и:'i', т:'t', ь:'', б:'b', ю:'yu',
  };
  return input
    .trim()
    .toLowerCase()
    .split('')
    .map(ch => map[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// dev-кэш, чтобы не дёргать Google Sheets на каждый рендер
let __sheetCacheText = '';
let __sheetCacheAt = 0;
const DEV_TTL_MS = 60_000; // 60s — можешь поставить 30_000

async function fetchSheetText(): Promise<string> {
  const url = process.env.SHEET_URL;
  if (!url) throw new Error('SHEET_URL is empty');

  const now = Date.now();
  if (
    process.env.NODE_ENV === 'development' &&
    __sheetCacheText &&
    now - __sheetCacheAt < DEV_TTL_MS
  ) {
    return __sheetCacheText;
  }

  const res = await fetch(
    url,
    process.env.NODE_ENV === 'development'
      ? ({ cache: 'no-store' } as any)
      : ({ next: { revalidate: 3600 } } as any) // prod: ISR 1h
  );
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);

  const text = await res.text();

  if (process.env.NODE_ENV === 'development') {
    __sheetCacheText = text;
    __sheetCacheAt = now;
  }

  return text;
}


export async function getAllProducts(): Promise<Product[]> {
  let text = await fetchSheetText();

  // CSV/TSV авто-детект
  const delimiter = text.includes('\t') ? '\t' : ',';

  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    delimiter,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  const rows = (parsed.data || []).filter(r => (r.name ?? '').trim() && (r.sku ?? '').trim());

  // маппим строки в продукт
  const list: Product[] = rows.map((r) => {
    const price = r.price ? Number(String(r.price).replace(/[^\d]/g, '')) : null;
    const images = (r.images ?? '')
      .split('|')
      .map(s => s.trim())
      .filter(Boolean);
    const slugBase = slugify(r.name || '');
    const slug = slugBase || slugify(r.sku || '');

    return {
      name: (r.name || '').trim(),
      sku: (r.sku || '').trim(),
      description: (r.description || '').trim(),
      price,
      images,
      ozon_url: r.ozon_url?.trim(),
      wb_url: r.wb_url?.trim(),
      category: r.category?.trim(),
      collection: r.collection?.trim(),
      color: r.color?.trim(),
      material: r.material?.trim(),
      bestseller: toBool(r.bestseller),
      slug,
    };
  });

  // уникальные слаг/sku и отбрасываем пустые
  const seen = new Set<string>();
  return list.filter(p => {
    const key = `${p.slug}#${p.sku}`;
    if (!p.name || !p.sku) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getProductBySlug(slug: string) {
  const items = await getAllProducts();
  return items.find(p => p.slug === slug);
}

export async function getRelated(product: Product, limit = 4) {
  const all = await getAllProducts();

  // нормализуем строку категории (пробелы/регистр)
  const norm = (s?: string) => (s ?? '').trim().toLowerCase();

  const cat = norm(product.category);

  // всё кроме текущего товара
  const others = all.filter(p => p.sku !== product.sku);

  // строго та же категория (независимо от регистра/лишних пробелов)
  let sameCategory = others.filter(p => norm(p.category) === cat);

  // если у товара пустая категория или совпадений нет — фолбэк: любые другие
  if (sameCategory.length === 0) {
    sameCategory = others;
  }

  // ограничиваем количеством (порядок сохраняем как в источнике)
  return sameCategory.slice(0, limit);
}

// Вернёт уникальные значения для фильтров
export function buildFilters(items: Product[]): Record<string, string[]> {
  const fields = ['category', 'collection', 'color', 'material'] as const;
  const unique: Record<string, string[]> = {};
  for (const f of fields) {
    unique[f] = Array.from(
      new Set(items.map((p) => (p as any)[f]).filter(Boolean))
    ).sort((a, b) => String(a).localeCompare(String(b), 'ru'));
  }
  return unique;
}
