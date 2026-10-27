import { Component, useEffect, useState } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { ClothingRail } from './components/ClothingRail';
import { Catalog } from './components/Catalog';
import { ScrollWorld } from './components/ScrollWorld';
import { BrandStatement, Collections, Lookbook } from './components/Editorial';
import { Footer } from './components/Footer';
import type { InfoTopic } from './components/Footer';
import { CartDialog, InfoDialog, SearchDialog } from './components/Shopping';
import { ProductDetail } from './components/ProductDetail';
import { CartProvider } from './hooks/useCart';
import { products } from './data/catalog';
import type { Category } from './types/catalog';

class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('ROOTS render error', error, info.componentStack); }
  render() {
    return this.state.failed ? <main className="fatal-state"><h1>Volvamos a las raíces.</h1><p>No pudimos mostrar esta página. Tu selección sigue guardada en este navegador.</p><button className="button button-dark" onClick={() => window.location.reload()}>RECARGAR <ArrowUpRight size={18} /></button></main> : this.props.children;
  }
}

function Storefront() {
  const [hash, setHash] = useState(window.location.hash);
  const [category, setCategory] = useState<Category>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [infoTopic, setInfoTopic] = useState<InfoTopic | null>(null);
  const isProduct = hash.startsWith('#producto/');
  const product = isProduct ? products.find(item => `#producto/${item.slug}` === hash) : undefined;
  useEffect(() => {
    const listener = () => setHash(window.location.hash);
    window.addEventListener('hashchange', listener);
    return () => window.removeEventListener('hashchange', listener);
  }, []);
  useEffect(() => {
    document.title = product ? `${product.name} — ROOTS Concept Store` : 'ROOTS® — Wear your roots.';
    if (isProduct) { window.scrollTo({ top: 0, behavior: 'instant' }); return; }
    const target = hash.slice(1);
    if (target) requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ behavior: 'instant' }));
  }, [hash, isProduct, product]);
  return <>
    <a href="#main-content" className="skip-link">Saltar al contenido</a>
    <Navigation onSearch={() => setSearchOpen(true)} onCart={() => setCartOpen(true)} />
    {isProduct ? product ? <ProductDetail key={product.id} product={product} onCart={() => setCartOpen(true)} /> : <main className="fatal-state" id="main-content"><h1>Esa pieza no está aquí.</h1><a className="button button-dark" href="#shop">VOLVER A LA SELECCIÓN <ArrowUpRight size={18} /></a></main> : <main id="main-content">
      <ClothingRail />
      <div className="brand-band" aria-label="La selección ROOTS"><span>NOT JUST CLOTHES.</span><span className="band-asterisk" aria-hidden="true">✳</span><span>A WAY TO BE.</span><span className="band-asterisk" aria-hidden="true">✳</span><span>ROOTS CONCEPT STORE</span><ArrowUpRight size={27} /></div>
      <Catalog category={category} onCategory={setCategory} />
      <ScrollWorld />
      <Collections onCategory={setCategory} />
      <Lookbook />
      <BrandStatement />
    </main>}
    <Footer onInfo={setInfoTopic} />
    <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    <CartDialog open={cartOpen} onClose={() => setCartOpen(false)} />
    <InfoDialog topic={infoTopic} onClose={() => setInfoTopic(null)} />
  </>;
}

export default function App() { return <ErrorBoundary><CartProvider><Storefront /></CartProvider></ErrorBoundary>; }
