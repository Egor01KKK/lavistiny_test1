'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function HeroImage() {
  const [src, setSrc] = useState('/hero.jpg'); // потом просто перезальёшь свой hero.jpg
  return (
    <Image
      src={src}
      alt="Lavistini hero"
      width={1600}
      height={1200}
      className="w-full h-auto object-cover"
      priority
      onError={() => setSrc('/placeholder.jpg')} // если hero.jpg нет — показываем плейсхолдер
    />
  );
}
