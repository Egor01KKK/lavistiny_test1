import Link from 'next/link';
import type { Product } from '@/lib/sheets';

export default function ProductCard({
  product,
  className = '',
}: {
  product: Product;
  className?: string;
}) {
  const img = product.images?.[0] || '/placeholder.jpg';

  return (
    <Link href={`/product/${product.slug}`} className={`group block ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-base-line">
        {/* квадратная картинка = одинаковая высота на любой ширине колонки */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={product.name}
          className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      {/* Заголовок покрупнее и жирный */}
      <h3 className="mt-3 text-lg font-semibold leading-tight">
        {product.name}
      </h3>

      {/* Цена обычным (не жирным) шрифтом */}
      {product.price != null && (
        <div className="mt-1 text-base text-zinc-700">
          {product.price.toLocaleString('ru-RU')} ₽
        </div>
      )}
    </Link>
  );
}
