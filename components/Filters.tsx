'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Filters({ unique }: { unique: Record<string, string[]> }){
  const sp = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  const setParam = (key: string, val: string | undefined) => {
    const params = new URLSearchParams(sp.toString());
    if (!val || val==='all') params.delete(key); else params.set(key, val);
    params.delete('page'); // reset pagination
    router.push(`${path}?${params.toString()}`);
  };

  const select = (k: string) => (
    <select
  defaultValue={sp.get(k) || 'all'}
  onChange={(e)=>setParam(k, e.target.value)}
  className="px-3 pr-8 py-2 rounded-xl border border-base-line text-sm bg-white"
>
      <option value="all">Все</option>
      {unique[k]?.map(v => <option key={v} value={v}>{v}</option>)}
    </select>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {select('category')}
      {select('collection')}
      {select('material')}
      {select('color')}
    </div>
  );
}
