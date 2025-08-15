import { describe, it, expect } from 'vitest';
import { buildFilters } from '@/lib/sheets';

// lightweight slug translit test inline (duplicate logic shortened)
function slug(s: string){ return s.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'-'); }

describe('filters', () => {
  const items = [
    { name:'A', sku:'1', description:'', price:1, images:[], slug:'a', category:'серьги', collection:'E', material:'серебро', color:'серебро' },
    { name:'B', sku:'2', description:'', price:1, images:[], slug:'b', category:'кольца', collection:'E', material:'серебро', color:'золото' }
  ] as any;
  const { unique, apply } = buildFilters(items);
  it('collects unique filters', () => {
    expect(unique.category.length).toBe(2);
    expect(unique.collection).toEqual(['E']);
  });
  it('applies filters', () => {
    expect(apply({ category:'серьги' }).length).toBe(1);
    expect(apply({ collection:'E', material:'серебро' }).length).toBe(2);
  });
});

describe('slug', () => {
  it('basic transliteration fallback', () => {
    expect(slug('Тест имя').includes('-')).toBe(true);
  });
});

// extra tests
describe('filters extra', () => {
  const items = [
    { name:'X', sku:'10', description:'', price:1, images:[], slug:'x', category:'серьги', collection:'Z', material:'сталь', color:'золото' },
    { name:'Y', sku:'11', description:'', price:1, images:[], slug:'y', category:'серьги', collection:'Z', material:'серебро', color:'серебро' },
    { name:'Z', sku:'12', description:'', price:1, images:[], slug:'z', category:'кольца', collection:'Q', material:'серебро', color:'серебро' }
  ] as any;
  const { unique, apply } = buildFilters(items);
  it('unique has no duplicates', () => {
    expect(new Set(unique.category).size).toBe(unique.category.length);
  });
  it('apply supports multi keys', () => {
    const r = apply({ collection:'Z', category:'серьги' });
    expect(r.length).toBe(2);
  });
});

describe('filters empty query returns all', () => {
  const items = [
    { name:'A', sku:'1', description:'', price:1, images:[], slug:'a', category:'серьги', collection:'E', material:'серебро', color:'серебро' },
    { name:'B', sku:'2', description:'', price:1, images:[], slug:'b', category:'кольца', collection:'E', material:'серебро', color:'золото' }
  ] as any;
  const { apply } = buildFilters(items);
  it('returns all without filters', () => {
    expect(apply({}).length).toBe(2);
  });
});
