import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Plus, RotateCcw } from 'lucide-react';
import { categoryLabels } from '../data/catalog';
import { filterCatalog, formatPrice, getCatalog } from '../services/catalog';
import type { Category, Product } from '../types/catalog';
import { Garment } from './Garment';

export function ProductCard({ product, index }: { product: Product; index: number }) {
  return <article className={`product-card product-card-${index}`}>
    <a href={`#producto/${product.slug}`} className="product-image-link" aria-label={`Ver detalles de ${product.name}`}>
      <div className="product-image"><span className="micro product-number">[ {String(index + 1).padStart(2, '0')} ]</span><span className="product-tag">ARKAD</span><Garment index={product.artworkIndex} name={product.name} /><span className="product-open"><Plus size={21} strokeWidth={1.3} /></span></div>
    </a>
    <div className="product-info"><div><a href={`#producto/${product.slug}`}><h3>{product.name}</h3></a><p>{product.color} <span> / </span> Silueta amplia</p></div><span className="swatch" style={{ backgroundColor: product.swatch }} aria-label={`Color ${product.color}`} /></div>
    <span className="product-price">{formatPrice(product)}</span>
  </article>;
}

export function Catalog({ category, onCategory }: { category: Category; onCategory: (category: Category) => void }) {
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    getCatalog().then(result => { if (active) { setCatalog(result); setFailed(false); } })
      .catch(() => { if (active) setFailed(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  const filtered = useMemo(() => filterCatalog(catalog, category), [catalog, category]);
  return <section className="catalog section-padding" id="new-drop">
    <div className="section-heading"><h2>FRESH OFF<br /><span>THE RAIL.</span></h2><div className="section-intro"><p>Gráficos que hablan por ti.<br />Siluetas que se mueven contigo.<br />Encuentra tu próxima pieza.</p><a className="text-link" href="#shop">VER LA SELECCIÓN <ArrowUpRight size={16} /></a></div></div>
    <div className="catalog-toolbar" id="shop"><div className="filter-tabs" role="group" aria-label="Filtrar catálogo">{(Object.keys(categoryLabels) as Category[]).map(key => <button key={key} aria-pressed={category === key} className={category === key ? 'active' : ''} onClick={() => onCategory(key)}>{categoryLabels[key]}</button>)}</div><span className="micro" aria-live="polite">{loading ? 'CARGANDO…' : `${String(filtered.length).padStart(2, '0')} PIEZAS`}</span></div>
    {loading ? <div className="catalog-state" role="status">Preparando la selección…</div> : failed ? <div className="catalog-state" role="alert"><p>No pudimos cargar las prendas.</p><button className="text-link" onClick={() => setAttempt(value => value + 1)}>VOLVER A INTENTAR <RotateCcw size={16} /></button></div> : filtered.length ? <div className="product-grid">{filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}</div> : <div className="catalog-state"><p>No hay prendas en esta selección.</p><button className="text-link" onClick={() => onCategory('all')}>VER TODAS LAS PIEZAS <ArrowUpRight size={16} /></button></div>}
    <div className="catalog-footnote"><span>Las prendas, de cerca.</span><p>Visualizaciones editoriales basadas en las referencias. Precio, tallas y disponibilidad por confirmar.</p></div>
  </section>;
}
