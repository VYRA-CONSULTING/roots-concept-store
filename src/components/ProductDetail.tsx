import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, Plus } from 'lucide-react';
import { products, sizePreferences } from '../data/catalog';
import { formatPrice } from '../services/catalog';
import { useCart } from '../hooks/useCart';
import type { Product } from '../types/catalog';
import { Garment } from './Garment';
import { ProductCard } from './Catalog';
import { Quantity } from './Shopping';

export function ProductDetail({ product, onCart }: { product: Product; onCart: () => void }) {
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [zoom, setZoom] = useState(false);
  const { add } = useCart();
  const save = () => {
    if (!size) { setSizeError(true); return; }
    add(product.id, size, quantity); setSaved(true); onCart();
  };
  return <main id="main-content" className="product-page section-padding"><a className="text-link back-link" href="#shop"><ArrowLeft size={16} /> VOLVER A LA SELECCIÓN</a><div className="product-detail-grid"><div className="detail-image-column"><button className={`detail-art ${zoom ? 'is-zoomed' : ''}`} onClick={() => setZoom(value => !value)} aria-label={zoom ? 'Ver silueta completa' : 'Ampliar gráfico'} aria-pressed={zoom}><Garment index={product.artworkIndex} name={product.name} eager /><span className="detail-image-label"><span>{zoom ? 'DETALLE DEL GRÁFICO' : 'VISTA POSTERIOR'}</span><Plus size={22} /></span></button><p className="editorial-caption">Visualización editorial derivada de la referencia. Fotografía original pendiente.</p></div><div className="detail-content"><span className="detail-brand">ARKAD / {product.collection.toUpperCase()}</span><h1>{product.name}</h1><p className="detail-price">{formatPrice(product)}</p><p className="detail-description">{product.description}</p><div className="detail-color"><span className="swatch" style={{ backgroundColor: product.swatch }} /><span>{product.color}</span></div><fieldset className="size-fieldset"><legend>{product.sizes ? 'Selecciona tu talla' : 'Talla de interés · por confirmar'}</legend><div className="size-options">{(product.sizes ?? sizePreferences).map(value => <button key={value} className={size === value ? 'selected' : ''} aria-pressed={size === value} onClick={() => { setSize(value); setSizeError(false); setSaved(false); }}>{value}</button>)}</div><p className={sizeError ? 'size-error' : 'size-help'} role={sizeError ? 'alert' : undefined}>{sizeError ? 'Selecciona una talla de interés para guardar la prenda.' : 'La talla elegida expresa tu preferencia; su disponibilidad debe confirmarse con ROOTS.'}</p></fieldset><div className="detail-add-row"><Quantity value={quantity} onChange={value => { setQuantity(value); setSaved(false); }} /><button className="button button-dark" onClick={save}>{saved ? 'GUARDADA EN TU BOLSA' : 'GUARDAR EN MI BOLSA'}{saved ? <Check size={18} /> : <ArrowUpRight size={18} />}</button></div><p className="detail-commercial-note">Guarda tu selección y consulta con la tienda.<br />No se realiza ningún cargo.</p><details open><summary>La pieza <ChevronDown size={16} /></summary><p>Silueta amplia. {product.graphic}. Vista posterior de la prenda. Materiales, medidas y detalles de confección pendientes de confirmar.</p></details><details><summary>Tallas y disponibilidad <ChevronDown size={16} /></summary><p>El catálogo todavía no tiene inventario conectado. Consulta las tallas y existencias con ROOTS antes de comprar.</p></details></div></div><section className="related-products"><div className="related-heading"><h2>OTRAS FORMAS<br />DE SER TÚ.</h2><a href="#shop" className="text-link">VER TODAS <ArrowUpRight size={16} /></a></div><div className="product-grid related-grid">{products.filter(item => item.id !== product.id).map((item, i) => <ProductCard product={item} index={i} key={item.id} />)}</div></section></main>;
}
