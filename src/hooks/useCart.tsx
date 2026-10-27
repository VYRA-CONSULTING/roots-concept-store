import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { products } from '../data/catalog';
import { CART_KEY, MAX_QUANTITY, parseCart } from '../services/cart';
import type { CartLine } from '../types/catalog';

interface CartContextValue {
  lines: CartLine[];
  count: number;
  storageError: boolean;
  add: (productId: string, requestedSize: string, quantity: number) => void;
  update: (productId: string, requestedSize: string, quantity: number) => void;
  remove: (productId: string, requestedSize: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [storageError, setStorageError] = useState(false);
  const [lines, setLines] = useState<CartLine[]>(() => {
    try { return parseCart(localStorage.getItem(CART_KEY), products); } catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(lines)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [lines]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === CART_KEY) setLines(parseCart(event.newValue, products));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const add = (productId: string, requestedSize: string, quantity: number) => {
    if (!products.some(product => product.id === productId)) return;
    setLines(previous => {
      const existing = previous.find(line => line.productId === productId && line.requestedSize === requestedSize);
      return existing ? previous.map(line => line === existing ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + quantity) } : line)
        : [...previous, { productId, requestedSize, quantity: Math.max(1, Math.min(MAX_QUANTITY, quantity)) }];
    });
  };
  const update = (productId: string, requestedSize: string, quantity: number) => setLines(previous => previous.map(line =>
    line.productId === productId && line.requestedSize === requestedSize ? { ...line, quantity: Math.max(1, Math.min(MAX_QUANTITY, quantity)) } : line));
  const remove = (productId: string, requestedSize: string) => setLines(previous => previous.filter(line =>
    line.productId !== productId || line.requestedSize !== requestedSize));
  return <CartContext.Provider value={{ lines, count: lines.reduce((sum, line) => sum + line.quantity, 0), storageError, add, update, remove }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart requires CartProvider');
  return value;
}
