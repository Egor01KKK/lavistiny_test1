import type { Item } from './types';

export const MOCK_ITEMS: Item[] = [
  {
    name: 'Серьги Daphne',
    sku: 'LVST-E-012',
    description: 'Лёгкие лаконичные серьги.',
    price: 4900,
    images: ['/placeholder.jpg'],
    ozon_url: undefined,
    wb_url: 'https://www.wildberries.ru/',
    category: 'серьги',
    collection: 'Eclipse',
    color: 'серебро',
    material: 'серебро 925',
    bestseller: true,
    slug: 'sergi-daphne'
  },
  {
    name: 'Кольцо Bloom',
    sku: 'LVST-R-101',
    description: 'Тонкое кольцо для слоения.',
    price: 4200,
    images: ['/placeholder.jpg'],
    ozon_url: 'https://www.ozon.ru/',
    wb_url: undefined,
    category: 'кольца',
    collection: 'Eclipse',
    color: 'серебро',
    material: 'серебро 925',
    bestseller: false,
    slug: 'kolco-bloom'
  },
  {
    name: 'Колье Orbit',
    sku: 'LVST-N-055',
    description: 'Акуратная цепь с микро-шайбами.',
    price: 5200,
    images: ['/placeholder.jpg'],
    ozon_url: 'https://www.ozon.ru/',
    wb_url: undefined,
    category: 'колье',
    collection: 'Orbit',
    color: 'серебро',
    material: 'серебро 925',
    bestseller: false,
    slug: 'kolye-orbit'
  },
  {
    name: 'Браслет Mini Chain',
    sku: 'LVST-B-003',
    description: 'Мини-цепь на каждый день.',
    price: 3100,
    images: ['/placeholder.jpg'],
    ozon_url: undefined,
    wb_url: 'https://www.wildberries.ru/',
    category: 'браслеты',
    collection: 'Orbit',
    color: 'серебро',
    material: 'серебро 925',
    bestseller: true,
    slug: 'braslet-mini-chain'
  }
];
