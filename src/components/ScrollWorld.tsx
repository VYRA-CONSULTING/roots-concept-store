import { useLayoutEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { Garment } from './Garment';
import { products } from '../data/catalog';

export function ScrollWorld() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      const track = ref.current?.querySelector('.world-track');
      if (!track) return;
      const tween = gsap.to(track, { x: () => -(track.scrollWidth - window.innerWidth), ease: 'none', scrollTrigger: {
        trigger: ref.current, start: 'top 82px', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true,
      } });
      const container = ref.current;
      const sticky = container?.querySelector<HTMLElement>('.world-sticky');
      let focusFrame = 0;
      const followKeyboardFocus = (event: FocusEvent) => {
        const target = event.target;
        if (!(target instanceof HTMLElement) || !target.matches(':focus-visible')) return;
        const panel = target.closest('.world-panel');
        const trigger = tween.scrollTrigger;
        if (!panel || !trigger) return;
        const progress = panel.classList.contains('world-selection') ? 1 : 0;
        cancelAnimationFrame(focusFrame);
        focusFrame = requestAnimationFrame(() => {
          window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: 'instant' });
          trigger.update();
          tween.progress(progress);
          trigger.getTween()?.progress(1);
          if (sticky) sticky.scrollLeft = 0;
        });
      };
      container?.addEventListener('focusin', followKeyboardFocus);
      gsap.fromTo('.world-print .garment-visual', { scale: 1.02, rotation: -5 }, { scale: 1.12, rotation: 3, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1 } });
      return () => { cancelAnimationFrame(focusFrame); container?.removeEventListener('focusin', followKeyboardFocus); };
    }, ref);
    return () => media.revert();
  }, []);
  return <section className="scroll-world" ref={ref} id="world" aria-label="Explora el universo gráfico de la colección">
    <div className="world-sticky"><div className="world-track">
      <div className="world-panel world-opening"><div className="world-topline"><span>THE ROOTS PERSPECTIVE</span><span>DESLIZA PARA DESCUBRIR <ArrowRight size={15} /></span></div><h2>IT’S IN<br />THE <span>DETAILS.</span></h2><div className="world-bottom"><p>No necesitas decir demasiado.<br />Deja que tu ropa hable.</p><span className="world-cross" aria-hidden="true"><PlusMark /></span><a className="circle-link light-circle" href="#producto/star-tee" aria-label="Ver Star Tee"><ArrowUpRight size={29} /></a></div><div className="world-print"><Garment index={2} name="Star Tee, detalle del gráfico" /></div></div>
      <div className="world-panel world-selection"><div className="world-selection-head"><h3>ELIGE TU<br />FORMA DE SER.</h3><p>Cuatro gráficos.<br />Una mirada propia.</p></div><div className="world-mini-rail">{[products[3], products[0], products[1]].map(product => <a href={`#producto/${product.slug}`} key={product.id}><Garment index={product.artworkIndex} name={product.name} /><span>{product.name}<ArrowUpRight size={18} /></span></a>)}</div><a href="#shop" className="text-link">VOLVER A LA SELECCIÓN <ArrowUpRight size={18} /></a></div>
    </div></div>
  </section>;
}

function PlusMark() { return <svg viewBox="0 0 60 60" fill="none"><path d="M30 0v60M0 30h60M9 9l42 42M9 51 51 9" stroke="currentColor" strokeWidth="9" /></svg>; }
