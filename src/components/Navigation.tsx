import { useState } from 'react';
import { ArrowUpRight, Menu, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { Modal } from './Modal';

interface NavigationProps { onSearch: () => void; onCart: () => void }
const links = [{ href: '#shop', text: 'SHOP' }, { href: '#new-drop', text: 'NEW DROP' }, { href: '#collections', text: 'COLLECTIONS' }, { href: '#about', text: 'ABOUT' }];

export function Wordmark({ footer = false }: { footer?: boolean }) {
  return <a className={`wordmark ${footer ? 'wordmark-footer' : ''}`} href="#home" aria-label="ROOTS, inicio">roots<span className="wordmark-dot">.</span><sup>®</sup></a>;
}

export function Navigation({ onSearch, onCart }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  return <>
    <div className="announcement"><span>INDEPENDENT MINDS. EVERYDAY UNIFORMS.</span><span>ROOTS CONCEPT STORE <ArrowUpRight size={11} /></span></div>
    <header className="site-header">
      <Wordmark />
      <nav className="desktop-nav" aria-label="Navegación principal">{links.map(link => <a href={link.href} key={link.href}>{link.text}{link.text === 'NEW DROP' && <i aria-hidden="true" />}</a>)}</nav>
      <div className="header-actions">
        <button className="icon-button search-trigger" onClick={onSearch} aria-label="Buscar prendas"><Search size={19} strokeWidth={1.6} /></button>
        <button className="bag-trigger" onClick={onCart} aria-label={`Abrir bolsa, ${count} prendas`}><span>BOLSA</span><span className="bag-count">{String(count).padStart(2, '0')}</span><ShoppingBag className="mobile-bag-icon" size={19} /></button>
        <button className="icon-button menu-trigger" onClick={() => setMenuOpen(true)} aria-label="Abrir menú"><Menu size={23} /></button>
      </div>
    </header>
    <Modal open={menuOpen} onClose={() => setMenuOpen(false)} title="Explora ROOTS." id="menu" className="menu-modal">
      <nav aria-label="Navegación móvil">{links.map((link, index) => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}><span className="micro">0{index + 1}</span>{link.text}<ArrowUpRight size={28} /></a>)}</nav>
      <p className="menu-statement">Tu estilo empieza<br />con tu propia mirada.</p>
    </Modal>
  </>;
}
