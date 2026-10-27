import { ArrowUpRight, Instagram } from 'lucide-react';
import { instagramUrl } from '../data/catalog';
import { Wordmark } from './Navigation';

export type InfoTopic = 'shipping' | 'returns' | 'privacy' | 'terms';

export function Footer({ onInfo }: { onInfo: (topic: InfoTopic) => void }) {
  return <footer className="footer section-padding"><div className="footer-top"><div><Wordmark footer /><p>STREETWEAR, A TU MANERA.</p></div><div className="footer-column"><span className="micro">EXPLORA</span><a href="#shop">Shop <ArrowUpRight size={13} /></a><a href="#collections">Colecciones</a><a href="#lookbook">Editorial</a><a href="#about">About ROOTS</a></div><div className="footer-column"><span className="micro">HABLEMOS</span><a href={instagramUrl} target="_blank" rel="noreferrer">Instagram <Instagram size={15} /></a><a href={instagramUrl} target="_blank" rel="noreferrer">Contacta con ROOTS <ArrowUpRight size={13} /></a><span className="footer-handle">@roots.conceptstore</span></div><div className="footer-column footer-info"><span className="micro">INFORMACIÓN</span><button onClick={() => onInfo('shipping')}>Envíos <span>Por configurar</span></button><button onClick={() => onInfo('returns')}>Cambios y devoluciones <span>Por configurar</span></button></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ROOTS CONCEPT STORE</span><div><button onClick={() => onInfo('privacy')}>Privacidad</button><button onClick={() => onInfo('terms')}>Términos</button></div><a href="#home">BACK TO ROOTS <ArrowUpRight size={13} /></a></div></footer>;
}
