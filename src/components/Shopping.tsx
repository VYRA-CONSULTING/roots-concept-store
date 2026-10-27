import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Copy, Minus, Plus, Search, ShoppingBag, Trash2 } from 'lucide-react';
import { products, instagramUrl } from '../data/catalog';
import { filterCatalog, formatPrice } from '../services/catalog';
import { getSubtotal, MAX_QUANTITY } from '../services/cart';
import { useCart } from '../hooks/useCart';
import { Garment } from './Garment';
import { Modal } from './Modal';
import type { InfoTopic } from './Footer';

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => filterCatalog(products, 'all', query), [query]);
  return <Modal open={open} onClose={onClose} title="Encuentra tu pieza." id="search" className="search-modal"><div className="search-field"><Search size={22} /><input aria-label="Buscar por nombre, gráfico o color" placeholder="Prenda, gráfico o color…" value={query} onChange={event => setQuery(event.target.value)} type="search" autoComplete="off" enterKeyHint="search" /></div><div className="search-summary" role="status">{query ? `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}` : 'LA SELECCIÓN ROOTS'}</div><div className="search-results">{results.length ? results.map(product => <a key={product.id} href={`#producto/${product.slug}`} onClick={onClose}><Garment index={product.artworkIndex} name={product.name} /><div><h3>{product.name}</h3><p>{product.color}</p><span>{formatPrice(product)}</span></div><ArrowUpRight size={22} /></a>) : <div className="empty-state"><Search size={30} /><h3>No encontramos esa pieza.</h3><p>Prueba con «gris», «Star» o «Studios».</p><button className="text-link" onClick={() => setQuery('')}>VER TODA LA SELECCIÓN <ArrowRight size={16} /></button></div>}</div></Modal>;
}

export function Quantity({ value, onChange, label = 'Cantidad' }: { value: number; onChange: (value: number) => void; label?: string }) {
  return <div className="quantity" role="group" aria-label={label}><button aria-label={`Reducir ${label.toLowerCase()}`} disabled={value <= 1} onClick={() => onChange(value - 1)}><Minus size={14} /></button><output aria-label={label}>{value}</output><button aria-label={`Aumentar ${label.toLowerCase()}`} disabled={value >= MAX_QUANTITY} onClick={() => onChange(value + 1)}><Plus size={14} /></button></div>;
}

export function CartDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, count, update, remove, storageError } = useCart();
  const [copyState, setCopyState] = useState<'idle' | 'success' | 'error'>('idle');
  const subtotal = getSubtotal(lines, products);
  const copy = async () => {
    const text = ['Mi selección ROOTS', ...lines.map(line => {
      const product = products.find(item => item.id === line.productId);
      return `${line.quantity} × ${product?.name} — ${product?.color} — talla de interés: ${line.requestedSize}`;
    }), 'Precio, tallas y disponibilidad por confirmar.'].join('\n');
    try { await navigator.clipboard.writeText(text); setCopyState('success'); }
    catch { setCopyState('error'); }
  };
  return <Modal open={open} onClose={onClose} title={`Tu bolsa (${String(count).padStart(2, '0')})`} id="cart" className="cart-modal">
    {!lines.length ? <div className="empty-state cart-empty"><ShoppingBag size={42} strokeWidth={1} /><h3>Un espacio para<br />tu próxima pieza.</h3><p>Explora la selección y guarda tus favoritas aquí.</p><a className="button button-dark" href="#shop" onClick={onClose}>EXPLORAR LA SELECCIÓN <ArrowUpRight size={17} /></a></div> : <><div className="cart-lines">{lines.map(line => {
      const product = products.find(item => item.id === line.productId)!;
      return <article className="cart-line" key={`${line.productId}:${line.requestedSize}`}><a href={`#producto/${product.slug}`} onClick={onClose} className="cart-image"><Garment index={product.artworkIndex} name={product.name} /></a><div className="cart-line-content"><a href={`#producto/${product.slug}`} onClick={onClose}><h3>{product.name}</h3></a><p>{product.color} / Talla de interés: {line.requestedSize}</p><span className="product-price">{formatPrice(product)}</span><div className="cart-line-controls"><Quantity value={line.quantity} label={`Cantidad de ${product.name}`} onChange={value => { update(line.productId, line.requestedSize, value); setCopyState('idle'); }} /><button className="icon-button" aria-label={`Eliminar ${product.name}`} onClick={() => { remove(line.productId, line.requestedSize); setCopyState('idle'); }}><Trash2 size={17} /></button></div></div></article>;
    })}</div><div className="cart-summary"><div className="subtotal"><span>Subtotal</span><strong>{subtotal === null ? 'Por confirmar' : subtotal.toFixed(2)}</strong></div><p>Tu selección se guarda en este navegador. Precio, tallas, stock y envío se confirman con la tienda. Todavía no se realizan pagos en esta web.</p><button className="button button-dark" onClick={copy}>{copyState === 'success' ? 'SELECCIÓN COPIADA' : 'COPIAR MI SELECCIÓN'}{copyState === 'success' ? <Check size={17} /> : <Copy size={17} />}</button><a className="button button-outline" href={instagramUrl} target="_blank" rel="noreferrer">CONSULTAR EN INSTAGRAM <ArrowUpRight size={17} /></a><div className="copy-status" role="status">{copyState === 'success' ? 'Ya puedes pegar tu selección en la conversación con ROOTS.' : copyState === 'error' ? 'No pudimos copiar. Puedes consultar las piezas directamente en Instagram.' : ''}</div></div></>}
    {storageError && <p className="storage-warning" role="alert">Este navegador no permite guardar la bolsa. Se conservará mientras esta página esté abierta.</p>}
  </Modal>;
}

const info = {
  shipping: { title: 'Envíos', text: 'La información de envíos está pendiente de configuración. Consulta con ROOTS los destinos, costos y plazos antes de realizar una compra.' },
  returns: { title: 'Cambios y devoluciones', text: 'La política comercial está pendiente de configuración. Consulta directamente con ROOTS las condiciones aplicables antes de comprar.' },
  privacy: { title: 'Privacidad', text: 'Esta versión guarda tu selección únicamente en el almacenamiento local de tu navegador. No solicita datos personales ni incorpora analítica. Al abrir Instagram, se aplican las condiciones de ese servicio. La política de privacidad de la tienda está pendiente de configuración.' },
  terms: { title: 'Términos de la tienda', text: 'Esta versión permite explorar una selección editorial y guardar prendas en una bolsa local. No procesa pagos ni confirma pedidos. Precios, tallas, existencias y condiciones comerciales deben ser confirmados por ROOTS. Los términos comerciales completos están pendientes de configuración.' },
};

export function InfoDialog({ topic, onClose }: { topic: InfoTopic | null; onClose: () => void }) {
  const content = topic ? info[topic] : info.terms;
  return <Modal open={topic !== null} onClose={onClose} title={content.title} id="info" className="info-modal"><p>{content.text}</p><a className="button button-dark" href={instagramUrl} target="_blank" rel="noreferrer">CONSULTAR CON ROOTS <ArrowUpRight size={17} /></a></Modal>;
}
