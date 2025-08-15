import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as sheets from '@/lib/sheets';

describe('fallback data', () => {
  beforeEach(() => { vi.resetModules(); });

  it('uses fallback when fetch throws', async () => {
    // @ts-ignore
    global.fetch = vi.fn().mockRejectedValue(new Error('network'));
    const items = await sheets.getAllProducts();
    expect(items.length).toBeGreaterThanOrEqual(4);
  });

  it('uses fallback when HTML returned', async () => {
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({ text: async () => '<html>edit</html>' });
    const items = await sheets.getAllProducts();
    expect(items.length).toBeGreaterThanOrEqual(4);
  });
});
