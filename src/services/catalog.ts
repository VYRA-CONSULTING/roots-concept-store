import { products } from '../data/catalog';
import type { Category, Product } from '../types/catalog';

// Replace this boundary with an API adapter; never infer commercial facts in the UI.
export async function getCatalog(): Promise<Product[]> {
  return products;
}

export function filterCatalog(catalog: Product[], category: Category, query = '') {
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const needle = normalize(query.trim());
  return catalog.filter(product =>
    (category === 'all' || product.category === category) &&
    normalize(`${product.name} ${product.color} ${product.collection} ${product.graphic} camiseta polo arkad`).includes(needle),
  );
}

export function formatPrice(product: Product): string {
  if (product.price === null || !product.currency) return 'Precio por confirmar';
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: product.currency }).format(product.price);
}
