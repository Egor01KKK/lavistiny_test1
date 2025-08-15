'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function OneFilter({
  options,
  param = 'category',
  placeholder = 'Все',
}: {
  options: string[];
  param?: string;        // ключ для query (по умолчанию category)
  placeholder?: string;  // текст для "Все"
}) {
  const sp = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  const current = sp.get(param) ?? 'all';

  const setParam = (val: string) => {
    const params = new URLSearchParams(sp.toString());
    if (!val || val === 'all') params.delete(param);
    else params.set(param, val);
    params.delete('page'); // сбрасываем пагинацию при смене фильтра
    router.push(`${path}?${params.toString()}`);
  };

  return (
    <select
      defaultValue={current}
      onChange={(e) => setParam(e.target.value)}
      className="px-3 pr-8 py-2 rounded-xl border border-base-line text-sm bg-white"
    >
      <option value="all">{placeholder}</option>
      {options.map((v) => (
        <option key={v} value={v}>{v}</option>
      ))}
    </select>
  );
}
