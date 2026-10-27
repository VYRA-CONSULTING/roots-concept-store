import type { CartLine, Product } from '../types/catalog';

export const CART_KEY = 'roots.bag.v1';
export const MAX_QUANTITY = 20;

export function parseCart(raw: string | null, catalog: Product[]): CartLine[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const seen = new Set<string>();
    return value.flatMap((item: unknown) => {
      if (!item || typeof item !== 'object') return [];
      const line = item as Record<string, unknown>;
      if (typeof line.productId !== 'string' || !catalog.some(product => product.id === line.productId) ||
        typeof line.requestedSize !== 'string' || !['S', 'M', 'L', 'XL', 'Por confirmar'].includes(line.requestedSize) ||
        typeof line.quantity !== 'number' || !Number.isInteger(line.quantity) || line.quantity < 1) return [];
      const key = `${line.productId}:${line.requestedSize}`;
      if (seen.has(key)) return [];
      seen.add(key);
      return [{ productId: line.productId, requestedSize: line.requestedSize, quantity: Math.min(MAX_QUANTITY, line.quantity) }];
    });
  } catch { return []; }
}

export function getSubtotal(lines: CartLine[], catalog: Product[]): number | null {
  if (!lines.length) return 0;
  let total = 0;
  for (const line of lines) {
    const product = catalog.find(item => item.id === line.productId);
    if (!product || product.price === null) return null;
    total += product.price * line.quantity;
  }
  return total;
}
