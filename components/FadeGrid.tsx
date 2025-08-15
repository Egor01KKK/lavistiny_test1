'use client';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import type { Item } from '@/lib/types';

export default function FadeGrid({ items }: { items: Item[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="grid grid-cols-3 gap-4"
    >
      {items.map(p => <ProductCard key={p.sku} product={p} />)}
    </motion.div>
  );
}
