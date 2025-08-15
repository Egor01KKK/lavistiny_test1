export type Item = {
  name: string;
  sku: string;
  description: string;
  price: number;
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
