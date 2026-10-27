import { useLayoutEffect, useRef } from 'react';
import { ArrowDown, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '../data/catalog';
import { Garment } from './Garment';

gsap.registerPlugin(ScrollTrigger);

export function ClothingRail() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      const first = ref.current?.querySelector<HTMLElement>('.rail-first');
      const second = ref.current?.querySelector<HTMLElement>('.rail-second');
      gsap.set(second ?? '.rail-second', { autoAlpha: 1 });
      const timeline = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 82px', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: self => {
          const changed = self.progress > 0.55;
          if (first) { first.inert = changed; first.setAttribute('aria-hidden', String(changed)); }
          if (second) { second.inert = !changed; second.setAttribute('aria-hidden', String(!changed)); second.style.pointerEvents = changed ? 'auto' : 'none'; }
        },
      } });
      timeline.to('.rail-first .rail-piece', { xPercent: -440, y: (i: number) => [-24, 18, -10, 30][i], rotation: (i: number) => [-8, 5, -5, 7][i], stagger: 0.055, duration: 1, ease: 'none' }, 0)
        .fromTo('.rail-second .rail-piece', { x: 0, xPercent: 440, rotation: (i: number) => [6, -5, 5, -4][i] }, { x: 0, xPercent: 0, rotation: 0, stagger: 0.055, duration: 1, ease: 'none' }, 0.08)
        .to('.rail-progress-fill', { scaleX: 1, duration: 1.36, ease: 'none' }, 0)
        .to('.rail-first', { autoAlpha: 0, duration: 0.01 }, 1)
        .to('.rail-counter-first', { opacity: 0, duration: 0.1 }, 0.5)
        .fromTo('.rail-counter-second', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.6);
      if (second) second.inert = true;
      return () => { timeline.kill(); if (first) { first.inert = false; first.removeAttribute('aria-hidden'); } };
    }, ref);
    return () => media.revert();
  }, []);
  return <section className="hero-scroll" id="home" ref={ref} aria-label="La selección ROOTS en el riel">
    <div className="hero-stage">
      <div className="hero-top">
        <h1>WEAR YOUR<br /><span>ROOTS.</span><span className="title-star" aria-hidden="true">✳</span></h1>
        <div className="hero-side"><p>La ropa es el punto de partida.<br />Lo que haces con ella,<br />es lo que te define.</p><a className="circle-link" href="#shop" aria-label="Explorar la colección"><ArrowDownRight size={29} strokeWidth={1.4} /></a><span className="micro">STREETWEAR, A TU MANERA.</span></div>
      </div>
      <div className="rail-scene">
        <div className="rail-wire" aria-hidden="true"><span /><span /></div>
        <div className="rail-bank rail-first">{products.map((product, i) => <a className={`rail-piece piece-${i}`} href={`#producto/${product.slug}`} key={product.id} aria-label={`Ver ${product.name}`}>
          <div className="hanging-garment"><Garment index={product.artworkIndex} name={product.name} eager /></div>
          <span className="rail-product-label"><span>{product.name.toUpperCase()}</span><ArrowUpRight size={14} /></span>
        </a>)}</div>
        <div className="rail-bank rail-second" aria-hidden="true">{[products[3], products[2], products[0], products[1]].map((product, i) => <a className={`rail-piece piece-${i}`} href={`#producto/${product.slug}`} key={product.id} aria-label={`Ver ${product.name}`}>
          <div className="hanging-garment"><Garment index={product.artworkIndex} name={product.name} eager /></div>
          <span className="rail-product-label"><span>{product.name.toUpperCase()}</span><ArrowUpRight size={14} /></span>
        </a>)}</div>
      </div>
      <div className="hero-bottom">
        <a href="#shop" className="button button-dark">EXPLORAR LA COLECCIÓN <ArrowUpRight size={17} /></a>
        <div className="rail-caption"><span className="micro">UNA SELECCIÓN. DISTINTAS FORMAS DE SER.</span><span className="rail-progress"><span className="rail-progress-fill" /></span></div>
        <a href="#new-drop" className="scroll-link"><span>SCROLL TO EXPLORE</span><ArrowDown size={17} /><span className="rail-counter"><span className="rail-counter-first">01 — 02</span><span className="rail-counter-second">02 — 02</span></span></a>
      </div>
    </div>
  </section>;
}
