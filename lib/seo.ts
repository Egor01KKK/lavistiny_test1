import type { Item } from './types';
export function productLdJson(item: Item){
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: item.name,
    sku: item.sku,
    description: item.description,
    image: item.images,
    offers: {
      '@type': 'Offer',
      price: item.price,
      priceCurrency: 'RUB',
      url: `${process.env.SITE_URL}/product/${item.slug}`
    }
  };
}
