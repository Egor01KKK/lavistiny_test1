import { getAllProducts } from '@/lib/sheets';
export default async function sitemap(){
  const base = process.env.SITE_URL || 'http://localhost:3000';
  const items = await getAllProducts();
  return [
    { url: `${base}/`, changeFrequency: 'weekly' },
    { url: `${base}/catalog`, changeFrequency: 'daily' },
    ...items.map(p => ({ url: `${base}/product/${p.slug}`, changeFrequency: 'weekly' }))
  ];
}
