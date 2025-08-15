// lib/seo.ts
import type { Product } from '@/lib/sheets';

export function productLdJson(p: Product) {
  const base = process.env.SITE_URL || 'http://localhost:3000';

  const json: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    url: `${base}/product/${p.slug}`,
    image: p.images && p.images.length ? p.images : undefined,
    sku: p.sku || undefined,
    description: p.description || undefined,
  };

  // Включаем оффер только если есть числовая цена
  if (typeof p.price === 'number') {
    json.offers = {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      price: p.price,
      availability: 'http://schema.org/InStock',
    };
  }

  return json;
}
