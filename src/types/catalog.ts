export interface Product {
  id: string;
  slug: string;
  name: string;
  collection: string;
  category: 'graphic' | 'washed';
  color: string;
  swatch: string;
  artworkIndex: number;
  description: string;
  graphic: string;
  price: number | null;
  currency: string | null;
  sizes: string[] | null;
  stock: number | null;
  imageKind: 'editorial-derived' | 'original';
}

export interface CartLine {
  productId: string;
  requestedSize: string;
  quantity: number;
}

export type Category = 'all' | Product['category'];
