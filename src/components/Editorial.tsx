import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Garment } from './Garment';
import type { Category } from '../types/catalog';

export function Collections({ onCategory }: { onCategory: (category: Category) => void }) {
  return <section className="collections section-padding" id="collections"><div className="collections-intro"><h2>FIND<br />YOUR FIT.</h2><p>Empieza por el gráfico.<br />Hazlo tuyo.</p></div><div className="collection-list">
    <a href="#shop" className="collection-row" onClick={() => onCategory('graphic')}><span className="micro">01 /</span><span>GRAPHIC TEES</span><span className="collection-count">03 PIEZAS</span><ArrowUpRight /></a>
    <a href="#shop" className="collection-row" onClick={() => onCategory('washed')}><span className="micro">02 /</span><span>WASHED GRAPHICS</span><span className="collection-count">01 PIEZA</span><ArrowUpRight /></a>
    <a href="#shop" className="collection-row" onClick={() => onCategory('all')}><span className="micro">03 /</span><span>LA SELECCIÓN</span><span className="collection-count">04 PIEZAS</span><ArrowUpRight /></a>
  </div></section>;
}

export function Lookbook() {
  return <section className="lookbook section-padding" id="lookbook"><div className="lookbook-heading"><h2>THE REVERSE<br />SIDE OF THINGS.</h2><p>Otra perspectiva.<br />La misma actitud.</p></div><div className="lookbook-layout">
    <a href="#producto/studios-tee" className="lookbook-main"><span className="micro">STUDIOS TEE / VISTA POSTERIOR</span><div className="lookbook-type" aria-hidden="true">BORN<br />& FREE.</div><Garment index={1} name="Studios Tee" /><span className="lookbook-view">EXPLORAR LA PIEZA <ArrowUpRight size={19} /></span></a>
    <div className="lookbook-aside"><a href="#producto/get-different" className="lookbook-detail" aria-label="Explorar el gráfico de Get Different"><Garment index={3} name="Get Different, detalle ampliado del gráfico" /><span className="micro">GRAPHIC STUDY / CARBÓN</span><ArrowUpRight size={24} /></a><div className="lookbook-note"><span className="micro">UNA MIRADA MÁS CERCA.</span><p>El estilo está en los detalles.<br />Y en cómo los llevas.</p><a href="#shop" className="text-link">DESCUBRIR LAS PIEZAS <ArrowRight size={17} /></a></div></div>
  </div><p className="editorial-caption">Estudio visual de las prendas · imágenes editoriales derivadas de las referencias proporcionadas.</p></section>;
}

export function BrandStatement() {
  return <section className="brand-statement section-padding" id="about"><div className="statement-top"><span>ROOTS CONCEPT STORE</span><span>INDEPENDENT MINDS.<br />EVERYDAY UNIFORMS.</span></div><h2>NO SIGAS<br />EL CAMINO.<br /><span>DEJA HUELLA.</span><ArrowUpRight aria-hidden="true" /></h2><div className="statement-bottom"><span className="statement-mark" aria-hidden="true">r.</span><p>Una forma de vestir.<br />Mil formas de ser tú.<br /><strong>Wear your roots.</strong></p><a href="#shop" className="button button-dark">ENCUENTRA TU PIEZA <ArrowUpRight size={17} /></a></div></section>;
}
