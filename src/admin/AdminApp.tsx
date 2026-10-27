import { useEffect, useMemo, useState } from 'react';
import {
  Activity, Archive, ArrowRight, ArrowUpRight, BadgePercent, BarChart3, Bell, Boxes,
  CalendarDays, Check, ChevronDown, ChevronRight, Clock3, Copy, CreditCard, Download,
  Ellipsis, ExternalLink, Filter, Gift, LayoutDashboard, Mail, Menu, Minus, Package,
  Pencil, Plus, Search, Settings2, Shirt, ShoppingBag, SlidersHorizontal, Sparkles,
  Tag, Truck, Users, X,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import {
  carriers, collectionNames, demoLogo, initialCollections, initialCustomers, initialEmailLogs,
  initialEmailTemplates, initialOrders, initialProducts, initialPromotions, initialShipments,
  orderStatuses, productCategories, productStatuses, salesByDay, seedInventoryMovements,
  shippingStatuses,
} from './demoData';
import type {
  AdminProduct, Carrier, DemoCollection, DemoCustomer, DemoEmailLog, DemoEmailTemplate,
  DemoOrder, DemoPromotion, DemoShipment, OrderStatus, ProductCategory, ProductStatus,
  ProductVariant, ShippingStatus,
} from './demoData';
import './admin.css';

type AdminSection =
  | 'dashboard' | 'products' | 'collections' | 'inventory' | 'orders'
  | 'shipping' | 'customers' | 'promotions' | 'notifications' | 'reports' | 'settings';

const navigation: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Productos', icon: Shirt },
  { id: 'collections', label: 'Colecciones', icon: Boxes },
  { id: 'inventory', label: 'Inventario', icon: Package },
  { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
  { id: 'shipping', label: 'Envíos', icon: Truck },
  { id: 'customers', label: 'Clientes', icon: Users },
  { id: 'promotions', label: 'Promociones', icon: BadgePercent },
  { id: 'notifications', label: 'Notificaciones', icon: Mail },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
  { id: 'settings', label: 'Configuración', icon: Settings2 },
];

const sectionTitles = Object.fromEntries(navigation.map(item => [item.id, item.label])) as Record<AdminSection, string>;
const money = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 });
const formatMoney = (value: number) => money.format(value);
const formatDate = (value: string, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) =>
  new Intl.DateTimeFormat('es-PE', options).format(new Date(`${value.slice(0, 10)}T12:00:00`));
const customerFor = (id: string, customers: DemoCustomer[]) => customers.find(customer => customer.id === id)!;

function ProductThumbnail({ product, large = false }: { product: AdminProduct; large?: boolean }) {
  const Icon = product.category === 'Hoodies' ? Shirt : product.category === 'Pantalones' ? Activity : product.category === 'Accesorios' ? Tag : Shirt;
  return <div className={`admin-product-thumb ${large ? 'thumb-large' : ''}`} style={{ backgroundColor: product.swatch }}>
    {product.artworkIndex !== null
      ? <img src="/assets/arkad-editorial-rail-v2.png" alt="" style={{ left: `${product.artworkIndex * -100}%` }} />
      : <Icon aria-hidden="true" size={large ? 30 : 20} strokeWidth={1.35} />}
  </div>;
}

function Sidebar({ active, onNavigate, open, onClose }: {
  active: AdminSection;
  onNavigate: (section: AdminSection) => void;
  open: boolean;
  onClose: () => void;
}) {
  return <>
    {open && <button className="admin-sidebar-scrim" onClick={onClose} aria-label="Cerrar navegación" />}
    <aside className={`admin-sidebar ${open ? 'is-open' : ''}`}>
      <a className="admin-brand" href="/admin" aria-label="ROOTS Concept Store, panel" onClick={event => {
        event.preventDefault();
        onNavigate('dashboard');
        onClose();
      }}>
        <img src={demoLogo} alt="ROOTS Concept Store" />
      </a>
      <div className="admin-store-switcher">
        <span className="admin-store-mark">r.</span>
        <span className="admin-store-copy"><strong>ROOTS Concept Store</strong><small>Panel de administración</small></span>
        <ChevronDown size={14} />
      </div>
      <nav className="admin-side-nav" aria-label="Navegación administrativa">
        <span className="admin-nav-caption">TIENDA</span>
        {navigation.map(({ id, label, icon: Icon }) => <button
          type="button"
          className={`admin-nav-link ${active === id ? 'is-active' : ''}`}
          aria-current={active === id ? 'page' : undefined}
          key={id}
          onClick={() => { onNavigate(id); onClose(); }}
        >
          <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
          {id === 'orders' && <span className="admin-nav-count">3</span>}
        </button>)}
      </nav>
      <div className="admin-sidebar-bottom">
        <div className="admin-side-demo"><span className="admin-demo-pulse" />Datos de demostración</div>
        <button className="admin-user" type="button" aria-label="Perfil de administración">
          <span className="admin-avatar">R</span>
          <span><strong>ROOTS Admin</strong><small>Administrador</small></span>
          <Ellipsis size={17} />
        </button>
      </div>
    </aside>
  </>;
}

function Topbar({ active, query, onQuery, onMenu, onToast }: {
  active: AdminSection;
  query: string;
  onQuery: (value: string) => void;
  onMenu: () => void;
  onToast: (message: string) => void;
}) {
  return <header className="admin-topbar">
    <button className="admin-mobile-menu" type="button" onClick={onMenu} aria-label="Abrir navegación"><Menu size={20} /></button>
    <div className="admin-breadcrumb"><span>ROOTS CONCEPT STORE</span><span className="admin-breadcrumb-divider">/</span><strong>{sectionTitles[active]}</strong></div>
    <label className="admin-global-search">
      <Search size={16} aria-hidden="true" />
      <input aria-label="Buscar en el panel" placeholder="Buscar productos, pedidos, clientes..." value={query} onChange={event => onQuery(event.target.value)} />
      <kbd>⌘ K</kbd>
    </label>
    <span className="admin-demo-badge"><span /> DEMO</span>
    <button className="admin-icon-button" type="button" aria-label="Notificaciones" onClick={() => onToast('Tienes 3 avisos de actividad en esta simulación.')}>
      <Bell size={18} /><i aria-hidden="true" />
    </button>
    <span className="admin-topbar-avatar">R</span>
  </header>;
}

function PageHeader({ section, action, onAction, detail }: {
  section: AdminSection;
  action?: string;
  onAction?: () => void;
  detail?: string;
}) {
  return <div className="admin-page-heading">
    <div><p className="admin-page-breadcrumb">ROOTS STUDIO <span>/</span> {sectionTitles[section].toUpperCase()}</p>
      <h1>{sectionTitles[section]}</h1>
      <p className="admin-page-description">{detail ?? pageDescriptions[section]}</p>
    </div>
    {action && onAction && <button type="button" className="admin-button admin-button-primary" onClick={onAction}><Plus size={16} />{action}</button>}
  </div>;
}

const pageDescriptions: Record<AdminSection, string> = {
  dashboard: 'Tu tienda, en una mirada.',
  products: 'Catálogo, variantes y detalles de cada prenda.',
  collections: 'Colecciones permanentes, cápsulas y nuevos lanzamientos.',
  inventory: 'Stock y movimientos por variante.',
  orders: 'Pedidos recibidos y su estado de preparación.',
  shipping: 'Transportistas, tracking y entregas.',
  customers: 'Relaciones, compras y preferencias de tu comunidad.',
  promotions: 'Cupones y descuentos para cada ocasión.',
  notifications: 'Plantillas y actividad de correo de la tienda.',
  reports: 'El pulso de las ventas, los pedidos y el catálogo.',
  settings: 'Preferencias de tu tienda ROOTS.',
};

function DemoLabel() {
  return <span className="admin-simulation-label"><Sparkles size={13} /> Simulación ROOTS · los datos visibles son de demostración</span>;
}

function StatusPill({ children, small = false }: { children: ReactNode; small?: boolean }) {
  const value = String(children);
  const tone = /entregado|enviado|activo|pagado|en tránsito/i.test(value) ? 'green'
    : /preparación|pendiente|borrador|próxima|listo/i.test(value) ? 'amber'
      : /cancelado|devuelto|fallido|incidencia|agotado|archivado/i.test(value) ? 'red' : 'neutral';
  return <span className={`admin-status status-${tone} ${small ? 'status-small' : ''}`}><i />{children}</span>;
}

function MetricCard({ title, value, change, icon: Icon, tone = 'sage' }: {
  title: string; value: string; change: string; icon: typeof ShoppingBag; tone?: string;
}) {
  return <article className="admin-metric-card">
    <div className="admin-metric-top"><span>{title}</span><span className={`admin-metric-icon tone-${tone}`}><Icon size={17} /></span></div>
    <strong className="admin-metric-value">{value}</strong>
    <div className="admin-metric-foot"><span className="admin-metric-change"><ArrowUpRight size={12} />{change}</span><span>vs. semana anterior</span></div>
  </article>;
}

function SalesChart() {
  const [period, setPeriod] = useState('7 días');
  const max = Math.max(...salesByDay.map(day => day.total));
  return <section className="admin-card admin-sales-card">
    <div className="admin-card-heading"><div><h2>Ventas en el tiempo</h2><p>Ingresos y pedidos por día</p></div>
      <select aria-label="Periodo de ventas" value={period} onChange={event => setPeriod(event.target.value)}><option>7 días</option><option>30 días</option><option>90 días</option></select>
    </div>
    <div className="admin-sales-summary"><strong>{formatMoney(19_460)}</strong><span className="admin-metric-change"><ArrowUpRight size={12} />12.8%</span><small>ventas en los últimos {period}</small></div>
    <div className="admin-bar-chart" role="img" aria-label="Gráfico de ventas semanales">
      {salesByDay.map(day => <div className="admin-bar-group" key={day.day} title={`${day.day}: ${formatMoney(day.total)}, ${day.orders} pedidos`}>
        <div className="admin-bar-track"><span style={{ height: `${Math.max(14, day.total / max * 100)}%` }} /></div><small>{day.day}</small>
      </div>)}
    </div>
  </section>;
}

function Dashboard({ products, orders, customers, onNavigate, onOpenOrder }: {
  products: AdminProduct[];
  orders: DemoOrder[];
  customers: DemoCustomer[];
  onNavigate: (section: AdminSection) => void;
  onOpenOrder: (order: DemoOrder) => void;
}) {
  const lowStock = products.flatMap(product => product.variants.map(variant => ({ product, variant }))).filter(item => item.variant.stock <= 4).length;
  const recentOrders = orders.slice(0, 5);
  const bestSeller = products.find(product => product.featured) ?? products[0];
  return <div className="admin-dashboard">
    <div className="admin-dashboard-intro"><span className="admin-current-date">Martes, 27 de octubre de 2026</span><DemoLabel /></div>
    <section className="admin-hero-card">
      <div><span className="admin-hero-eyebrow">ROOTS CONCEPT STORE · RESUMEN DE HOY</span><h2>Buen día, equipo ROOTS<span>.</span></h2><p>Tu tienda está en movimiento. Aquí tienes lo más importante de hoy.</p></div>
      <div className="admin-hero-decoration"><span>r.</span><span>WEAR YOUR ROOTS</span></div>
      <div className="admin-hero-stats"><span><strong>24</strong> pedidos hoy</span><i /><span><strong>18</strong> por preparar</span><i /><span><strong>8</strong> clientes nuevos</span></div>
    </section>
    <div className="admin-metrics">
      <MetricCard title="Ventas de hoy" value="S/ 1,460" change="+12.8%" icon={CreditCard} />
      <MetricCard title="Pedidos pendientes" value="18" change="+4 desde ayer" icon={ShoppingBag} tone="peach" />
      <MetricCard title="Productos con stock bajo" value={String(lowStock)} change="Revisar variantes" icon={Boxes} tone="amber" />
      <MetricCard title="Clientes nuevos" value={String(customers.filter(customer => customer.segment === 'Cliente nuevo').length)} change="+2 esta semana" icon={Users} tone="blue" />
    </div>
    <QuickActions onNavigate={onNavigate} />
    <div className="admin-dashboard-grid">
      <SalesChart />
      <section className="admin-card admin-best-seller">
        <div className="admin-card-heading"><div><h2>Más vendido</h2><p>Esta semana</p></div><button type="button" onClick={() => onNavigate('products')} aria-label="Ver catálogo"><ArrowUpRight size={16} /></button></div>
        <div className="admin-best-art"><ProductThumbnail product={bestSeller} large /><span className="admin-best-rank">#1 ESTA SEMANA</span></div>
        <div className="admin-best-info"><div><strong>{bestSeller.name}</strong><span>{bestSeller.collection} · {bestSeller.category}</span></div><b>38 uds.</b></div>
        <div className="admin-best-progress"><span /></div>
        <div className="admin-best-foot"><span>Unidades vendidas</span><strong>+18.4%</strong></div>
      </section>
    </div>
    <div className="admin-bottom-grid">
      <section className="admin-card admin-recent-card">
        <div className="admin-card-heading"><div><h2>Pedidos recientes</h2><p>Última actividad en tu tienda</p></div><button type="button" className="admin-text-link" onClick={() => onNavigate('orders')}>Ver todos <ArrowRight size={14} /></button></div>
        <div className="admin-mini-table">{recentOrders.map(order => <button type="button" className="admin-mini-order" key={order.id} onClick={() => onOpenOrder(order)}>
          <span className="admin-order-code">{order.id}</span><span className="admin-mini-customer">{customerFor(order.customerId, customers).name}</span><StatusPill small>{order.status}</StatusPill><strong>{formatMoney(order.total)}</strong>
        </button>)}</div>
      </section>
      <section className="admin-card admin-attention-card">
        <div className="admin-card-heading"><div><h2>Atención de hoy</h2><p>Acciones sugeridas</p></div><span className="admin-attention-count">3</span></div>
        <button type="button" className="admin-attention-row" onClick={() => onNavigate('inventory')}><span className="admin-attention-icon tone-amber"><Boxes size={16} /></span><span><strong>{lowStock} variantes con stock bajo</strong><small>Revisa tallas próximas a agotarse</small></span><ChevronRight size={16} /></button>
        <button type="button" className="admin-attention-row" onClick={() => onNavigate('notifications')}><span className="admin-attention-icon tone-peach"><Mail size={16} /></span><span><strong>2 correos requieren revisión</strong><small>Un envío fallido y una notificación pendiente</small></span><ChevronRight size={16} /></button>
        <button type="button" className="admin-attention-row" onClick={() => onNavigate('shipping')}><span className="admin-attention-icon tone-blue"><Truck size={16} /></span><span><strong>1 envío con incidencia</strong><small>Revisa el tracking SHL-50291760</small></span><ChevronRight size={16} /></button>
      </section>
    </div>
  </div>;
}

function QuickActions({ onNavigate }: { onNavigate: (section: AdminSection) => void }) {
  const actions: { label: string; section: AdminSection; icon: typeof Shirt; tone: string }[] = [
    { label: 'Agregar producto', section: 'products', icon: Plus, tone: 'sage' },
    { label: 'Revisar pedidos', section: 'orders', icon: ShoppingBag, tone: 'peach' },
    { label: 'Registrar envío', section: 'shipping', icon: Truck, tone: 'blue' },
    { label: 'Crear descuento', section: 'promotions', icon: Gift, tone: 'amber' },
    { label: 'Ver clientes', section: 'customers', icon: Users, tone: 'blue' },
    { label: 'Crear colección', section: 'collections', icon: Boxes, tone: 'sage' },
  ];
  return <section className="admin-quick-actions" aria-label="Accesos rápidos">{actions.map(({ label, section, icon: Icon, tone }) => <button type="button" key={label} onClick={() => onNavigate(section)}><span className={`admin-quick-icon tone-${tone}`}><Icon size={16} /></span><span>{label}</span><ArrowUpRight size={13} /></button>)}</section>;
}

function TableSearch({ value, onChange, label = 'Buscar' }: { value: string; onChange: (value: string) => void; label?: string }) {
  return <label className="admin-table-search"><Search size={15} /><input aria-label={label} placeholder={label} value={value} onChange={event => onChange(event.target.value)} /></label>;
}

function ProductsPage({ products, query, onProductsChange, onToast }: {
  products: AdminProduct[];
  query: string;
  onProductsChange: (products: AdminProduct[]) => void;
  onToast: (message: string) => void;
}) {
  const [category, setCategory] = useState('Todas las categorías');
  const [status, setStatus] = useState('Todos los estados');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<AdminProduct | null | undefined>(undefined);
  const [variantsProduct, setVariantsProduct] = useState<AdminProduct | null>(null);
  const [archiving, setArchiving] = useState<AdminProduct | null>(null);
  const visible = useMemo(() => products.filter(product => {
    const text = `${product.name} ${product.sku} ${product.collection} ${product.category}`.toLocaleLowerCase('es');
    return text.includes(`${query} ${search}`.trim().toLocaleLowerCase('es')) &&
      (category === 'Todas las categorías' || product.category === category) &&
      (status === 'Todos los estados' || product.status === status);
  }), [category, products, query, search, status]);
  const saveProduct = (product: AdminProduct) => {
    onProductsChange(products.some(item => item.id === product.id)
      ? products.map(item => item.id === product.id ? product : item)
      : [product, ...products]);
    setEditing(undefined);
    onToast(`${product.name} guardado en la simulación.`);
  };
  const duplicate = (product: AdminProduct) => {
    const copy = { ...product, id: `${product.id}-${Date.now()}`, name: `${product.name} (copia)`, sku: `${product.sku}-C`, status: 'Borrador' as ProductStatus, featured: false, variants: product.variants.map(variant => ({ ...variant, id: `${variant.id}-copy`, stock: 0, sku: `${variant.sku}-C` })) };
    onProductsChange([copy, ...products]);
    onToast('Se creó una copia en estado borrador.');
  };
  const archive = () => {
    if (!archiving) return;
    onProductsChange(products.map(item => item.id === archiving.id ? { ...item, status: 'Archivado' } : item));
    onToast(`${archiving.name} se archivó.`);
    setArchiving(null);
  };
  return <>
    <section className="admin-card admin-table-card">
      <div className="admin-table-toolbar">
        <div className="admin-toolbar-left"><TableSearch value={search} onChange={setSearch} label="Buscar productos" /><span className="admin-result-count">{visible.length} productos</span></div>
        <div className="admin-table-controls">
          <label className="admin-select-control"><Filter size={14} /><select aria-label="Filtrar por categoría" value={category} onChange={event => setCategory(event.target.value)}><option>Todas las categorías</option>{productCategories.map(item => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></label>
          <label className="admin-select-control"><SlidersHorizontal size={14} /><select aria-label="Filtrar por estado" value={status} onChange={event => setStatus(event.target.value)}><option>Todos los estados</option>{productStatuses.map(item => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></label>
          <button type="button" className="admin-button admin-button-light" onClick={() => setEditing(null)}><Plus size={15} />Agregar</button>
        </div>
      </div>
      <div className="admin-table-scroll"><table className="admin-table admin-product-table">
        <thead><tr><th>PRODUCTO</th><th>CATEGORÍA / COLECCIÓN</th><th>ESTADO</th><th>PRECIO</th><th>INVENTARIO</th><th>SKU</th><th /></tr></thead>
        <tbody>{visible.map(product => <tr key={product.id}>
          <td><div className="admin-table-product"><ProductThumbnail product={product} /><span><strong>{product.name}</strong><small>{product.variants.length} variantes · {product.featured ? 'Destacado' : 'Catálogo'}</small></span></div></td>
          <td><span className="admin-table-primary">{product.category}</span><small className="admin-table-subline">{product.collection}</small></td>
          <td><StatusPill>{product.status}</StatusPill></td>
          <td><span className="admin-table-primary">{formatMoney(product.price)}</span>{product.previousPrice && <small className="admin-table-subline admin-price-old">{formatMoney(product.previousPrice)}</small>}</td>
          <td><button type="button" className="admin-variant-count" onClick={() => setVariantsProduct(product)}>{product.variants.reduce((total, variant) => total + variant.stock, 0)} uds. <span>·</span> {product.variants.length} variantes</button></td>
          <td><span className="admin-table-secondary">{product.sku}</span></td>
          <td><div className="admin-row-actions"><button type="button" aria-label={`Editar ${product.name}`} onClick={() => setEditing(product)}><Pencil size={14} /></button><button type="button" aria-label={`Duplicar ${product.name}`} onClick={() => duplicate(product)}><Copy size={14} /></button><button type="button" aria-label={`Archivar ${product.name}`} onClick={() => setArchiving(product)}><Archive size={14} /></button></div></td>
        </tr>)}</tbody>
      </table>
      {!visible.length && <div className="admin-filter-empty"><Search size={19} /><strong>No hay productos con estos filtros</strong><span>Cambia la búsqueda o selecciona otra categoría.</span></div>}</div>
      <div className="admin-table-footer"><span>Mostrando {visible.length} de {products.length} productos</span><button type="button" className="admin-link-button" onClick={() => onToast('La exportación CSV está lista para esta simulación.')}><Download size={14} /> Exportar CSV</button></div>
    </section>
    {editing !== undefined && <ProductEditor product={editing ?? undefined} onClose={() => setEditing(undefined)} onSave={saveProduct} />}
    {archiving && <ModalFrame title="Archivar producto" onClose={() => setArchiving(null)}><div className="admin-confirm-content"><span className="admin-confirm-icon"><Archive size={20} /></span><p>¿Archivar <strong>{archiving.name}</strong>? Dejará de aparecer como activo, pero podrás recuperarlo desde los filtros.</p><div className="admin-modal-actions"><button type="button" className="admin-button admin-button-quiet" onClick={() => setArchiving(null)}>Cancelar</button><button type="button" className="admin-button admin-button-danger" onClick={archive}>Archivar producto</button></div></div></ModalFrame>}
    {variantsProduct && <VariantsModal product={variantsProduct} onClose={() => setVariantsProduct(null)} onSave={updated => {
      onProductsChange(products.map(item => item.id === updated.id ? updated : item));
      setVariantsProduct(updated);
      onToast('Inventario de variantes actualizado.');
    }} />}
  </>;
}

function ProductEditor({ product, onClose, onSave }: {
  product?: AdminProduct;
  onClose: () => void;
  onSave: (product: AdminProduct) => void;
}) {
  const [name, setName] = useState(product?.name ?? '');
  const [category, setCategory] = useState<ProductCategory>(product?.category ?? 'Polos');
  const [collection, setCollection] = useState(product?.collection ?? 'Nuevos ingresos');
  const [price, setPrice] = useState(String(product?.price ?? 129));
  const [stock, setStock] = useState(String(product?.variants.reduce((sum, item) => sum + item.stock, 0) ?? 24));
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? 'Borrador');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const id = product?.id ?? `demo-${Date.now()}`;
    const variantCount = product?.variants.length ?? 4;
    const total = Math.max(0, Number(stock) || 0);
    const variants: ProductVariant[] = product?.variants.map((variant, index) => ({
      ...variant, stock: Math.floor(total / variantCount) + (index < total % variantCount ? 1 : 0),
    })) ?? ['S', 'M', 'L', 'XL'].map((size, index) => ({
      id: `${id}-${size}`, size, color: 'Negro', sku: `RCS-DEMO-${id.slice(-4)}-${size}`, stock: Math.floor(total / 4) + (index < total % 4 ? 1 : 0),
    }));
    onSave({
      id, name, category, collection, price: Number(price) || 0, previousPrice: product?.previousPrice ?? null,
      sku: product?.sku ?? `RCS-DEMO-${String(Date.now()).slice(-5)}`, status,
      variants, artworkIndex: product?.artworkIndex ?? null, swatch: product?.swatch ?? '#82907e', featured: product?.featured ?? false,
    });
  };
  return <ModalFrame title={product ? 'Editar producto' : 'Agregar producto'} onClose={onClose} className="product-editor-modal">
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form-grid"><label>Nombre del producto<input required value={name} onChange={event => setName(event.target.value)} placeholder="Ej. Hoodie Essential" /></label>
        <label>Categoría<select value={category} onChange={event => setCategory(event.target.value as ProductCategory)}>{productCategories.map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Colección<select value={collection} onChange={event => setCollection(event.target.value)}>{collectionNames.map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Precio de venta (S/)<input type="number" min="0" required value={price} onChange={event => setPrice(event.target.value)} /></label>
        <label>Unidades disponibles<input type="number" min="0" required value={stock} onChange={event => setStock(event.target.value)} /></label>
        <label>Estado<select value={status} onChange={event => setStatus(event.target.value as ProductStatus)}>{productStatuses.map(value => <option key={value}>{value}</option>)}</select></label>
      </div>
      <p className="admin-form-note">La simulación distribuye el stock entre tallas S, M, L y XL. Puedes ajustar cada variante desde el catálogo.</p>
      <div className="admin-modal-actions"><button type="button" className="admin-button admin-button-quiet" onClick={onClose}>Cancelar</button><button className="admin-button admin-button-primary" type="submit"><Check size={15} />Guardar producto</button></div>
    </form>
  </ModalFrame>;
}

function VariantsModal({ product, onClose, onSave }: {
  product: AdminProduct;
  onClose: () => void;
  onSave: (product: AdminProduct) => void;
}) {
  return <ModalFrame title={`Variantes · ${product.name}`} onClose={onClose} className="variants-modal">
    <p className="admin-modal-lead">Gestiona talla, color, SKU y stock de cada variante.</p>
    <div className="admin-variant-table"><div className="admin-variant-head"><span>VARIANTE</span><span>SKU</span><span>STOCK</span></div>
      {product.variants.map(variant => <div className="admin-variant-row" key={variant.id}><span>{variant.color} / {variant.size}</span><code>{variant.sku}</code><span className="admin-stock-adjust"><button type="button" aria-label={`Restar stock ${variant.size}`} disabled={variant.stock <= 0} onClick={() => onSave({ ...product, variants: product.variants.map(item => item.id === variant.id ? { ...item, stock: Math.max(0, item.stock - 1) } : item) })}><Minus size={13} /></button><strong>{variant.stock}</strong><button type="button" aria-label={`Sumar stock ${variant.size}`} onClick={() => onSave({ ...product, variants: product.variants.map(item => item.id === variant.id ? { ...item, stock: item.stock + 1 } : item) })}><Plus size={13} /></button></span></div>)}
    </div>
  </ModalFrame>;
}

function CollectionsPage({ collections, products, onChange, onToast }: {
  collections: DemoCollection[];
  products: AdminProduct[];
  onChange: (value: DemoCollection[]) => void;
  onToast: (message: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  return <>
    <div className="admin-collection-toolbar"><div className="admin-filter-pills"><button className="is-active" type="button">Todas <span>{collections.length}</span></button><button type="button" onClick={() => onToast('Colecciones permanentes y drops incluidos en la vista.')}>Activas <span>{collections.filter(item => item.status === 'Activa').length}</span></button></div><button type="button" className="admin-button admin-button-primary" onClick={() => setEditing(true)}><Plus size={15} />Nueva colección</button></div>
    <div className="admin-collection-grid">{collections.map((collection, index) => {
      const associated = products.filter(product => product.collection === collection.name);
      return <article className="admin-card admin-collection-card" key={collection.id}>
        <div className={`admin-collection-art collection-art-${index % 5}`}><span className="admin-collection-season">ROOTS · 2026</span><span className="admin-collection-monogram">R<span>.</span></span><span className="admin-collection-count">{String(associated.length).padStart(2, '0')} PIEZAS</span></div>
        <div className="admin-collection-info"><div className="admin-collection-info-top"><span className="admin-eyebrow">{collection.kind.toUpperCase()}</span><button type="button" aria-label={`Editar ${collection.name}`} onClick={() => onToast(`${collection.name}: vista de edición disponible.`)}><Ellipsis size={17} /></button></div><h2>{collection.name}</h2><p>{collection.description}</p><div className="admin-collection-meta"><StatusPill small>{collection.status}</StatusPill><span><CalendarDays size={13} />{formatDate(collection.releaseDate, { day: 'numeric', month: 'short', year: 'numeric' })}</span></div><div className="admin-collection-tags">{collection.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
      </article>;
    })}</div>
    {editing && <CollectionEditor onClose={() => setEditing(false)} onSave={collection => {
      onChange([collection, ...collections]); setEditing(false); onToast(`${collection.name} se agregó a la simulación.`);
    }} />}
  </>;
}

function CollectionEditor({ onClose, onSave }: { onClose: () => void; onSave: (collection: DemoCollection) => void }) {
  const [name, setName] = useState('');
  const [kind, setKind] = useState('Drop limitado');
  return <ModalFrame title="Nueva colección" onClose={onClose}><form className="admin-form" onSubmit={event => {
    event.preventDefault(); onSave({ id: `col-${Date.now()}`, name, description: 'Una nueva historia ROOTS.', kind, releaseDate: '2026-11-15', status: 'Próxima', artworkIndex: 0, tags: ['Nueva colección', '2026'] });
  }}><label>Nombre<input required value={name} onChange={event => setName(event.target.value)} placeholder="Ej. Essentials" /></label><label>Tipo<select value={kind} onChange={event => setKind(event.target.value)}><option>Colección permanente</option><option>Drop limitado</option><option>Cápsula</option><option>Colaboración</option><option>Liquidación</option></select></label><div className="admin-modal-actions"><button type="button" className="admin-button admin-button-quiet" onClick={onClose}>Cancelar</button><button type="submit" className="admin-button admin-button-primary">Crear colección</button></div></form></ModalFrame>;
}

function InventoryPage({ products, onProductsChange, onToast }: {
  products: AdminProduct[];
  onProductsChange: (products: AdminProduct[]) => void;
  onToast: (message: string) => void;
}) {
  const [filter, setFilter] = useState('Todos');
  const variants = products.flatMap(product => product.variants.map(variant => ({ product, variant })));
  const visible = variants.filter(({ variant }) => filter === 'Todos' || (filter === 'Stock bajo' ? variant.stock <= 4 : variant.stock === 0));
  const adjust = (product: AdminProduct, variant: ProductVariant, amount: number) => {
    onProductsChange(products.map(item => item.id === product.id ? { ...item, variants: item.variants.map(value => value.id === variant.id ? { ...value, stock: Math.max(0, value.stock + amount) } : value) } : item));
  };
  return <div className="admin-inventory-layout">
    <div className="admin-inventory-stats"><article className="admin-card"><span>Unidades en inventario</span><strong>{variants.reduce((sum, item) => sum + item.variant.stock, 0)}</strong><small>En {products.length} productos activos</small></article><article className="admin-card"><span>Variantes con stock bajo</span><strong>{variants.filter(item => item.variant.stock <= 4).length}</strong><small>4 unidades o menos</small></article><article className="admin-card"><span>Agotadas</span><strong>{variants.filter(item => item.variant.stock === 0).length}</strong><small>Listas para reposición</small></article></div>
    <section className="admin-card admin-table-card"><div className="admin-table-toolbar"><div><h2 className="admin-table-title">Stock por variante</h2><p className="admin-table-subtitle">Ajusta existencias individualmente por talla y color.</p></div><label className="admin-select-control"><Filter size={14} /><select aria-label="Filtro de inventario" value={filter} onChange={event => setFilter(event.target.value)}><option>Todos</option><option>Stock bajo</option><option>Agotado</option></select><ChevronDown size={13} /></label></div>
      <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>PRODUCTO</th><th>VARIANTE</th><th>SKU</th><th>UNIDADES</th><th>ESTADO</th><th>AJUSTE RÁPIDO</th></tr></thead><tbody>{visible.map(({ product, variant }) => <tr key={variant.id}><td><div className="admin-table-product"><ProductThumbnail product={product} /><span><strong>{product.name}</strong><small>{product.collection}</small></span></div></td><td>{variant.color} / {variant.size}</td><td><span className="admin-table-secondary">{variant.sku}</span></td><td><strong className="admin-stock-number">{variant.stock}</strong></td><td><StatusPill>{variant.stock === 0 ? 'Agotado' : variant.stock <= 4 ? 'Stock bajo' : 'Disponible'}</StatusPill></td><td><span className="admin-stock-adjust"><button type="button" aria-label={`Restar ${variant.size}`} disabled={variant.stock <= 0} onClick={() => adjust(product, variant, -1)}><Minus size={13} /></button><span>{variant.stock}</span><button type="button" aria-label={`Sumar ${variant.size}`} onClick={() => { adjust(product, variant, 1); onToast(`Stock actualizado · ${product.name} ${variant.size}.`); }}><Plus size={13} /></button></span></td></tr>)}</tbody></table></div>
    </section>
    <section className="admin-card admin-movement-card"><div className="admin-card-heading"><div><h2>Movimientos recientes</h2><p>Actividad de inventario · últimos movimientos</p></div><button type="button" className="admin-link-button" onClick={() => onToast('Historial de inventario exportado en la simulación.')}><Download size={14} /> Exportar</button></div>
      <div className="admin-movement-list">{seedInventoryMovements.map(movement => <div key={movement.id}><span className={`admin-movement-change ${movement.change > 0 ? 'is-positive' : ''}`}>{movement.change > 0 ? '+' : ''}{movement.change}</span><span><strong>{movement.product}</strong><small>{movement.variant} · {movement.reason}</small></span><time>{formatDate(movement.date, { day: 'numeric', month: 'short' })}</time></div>)}</div>
    </section>
  </div>;
}

function OrdersPage({ orders, customers, query, onOrdersChange, onToast }: {
  orders: DemoOrder[];
  customers: DemoCustomer[];
  query: string;
  onOrdersChange: (orders: DemoOrder[]) => void;
  onToast: (message: string) => void;
}) {
  const [status, setStatus] = useState('Todos los pedidos');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<DemoOrder | null>(null);
  const visible = orders.filter(order => {
    const customer = customerFor(order.customerId, customers);
    return (status === 'Todos los pedidos' || order.status === status) &&
      `${order.id} ${customer.name} ${customer.email}`.toLocaleLowerCase('es').includes(`${query} ${search}`.trim().toLocaleLowerCase('es'));
  });
  return <>
    <div className="admin-order-overview">{[
      ['Todos', orders.length, 'neutral'], ['Por preparar', orders.filter(order => ['Pago confirmado', 'En preparación'].includes(order.status)).length, 'amber'],
      ['En tránsito', orders.filter(order => order.status === 'En tránsito').length, 'blue'], ['Entregados', orders.filter(order => order.status === 'Entregado').length, 'green'],
    ].map(([label, count, tone]) => <button type="button" className={`admin-order-stat tone-border-${tone} ${status === (label === 'Todos' ? 'Todos los pedidos' : label === 'Por preparar' ? 'En preparación' : label) ? 'is-selected' : ''}`} key={label} onClick={() => setStatus(label === 'Todos' ? 'Todos los pedidos' : label === 'Por preparar' ? 'En preparación' : label === 'En tránsito' ? 'En tránsito' : 'Entregado')}><span>{label}</span><strong>{count}</strong></button>)}</div>
    <section className="admin-card admin-table-card"><div className="admin-table-toolbar"><div className="admin-toolbar-left"><TableSearch value={search} onChange={setSearch} label="Buscar pedidos o clientes" /><span className="admin-result-count">{visible.length} pedidos</span></div><div className="admin-table-controls"><label className="admin-select-control"><Filter size={14} /><select aria-label="Filtrar pedidos por estado" value={status} onChange={event => setStatus(event.target.value)}><option>Todos los pedidos</option>{orderStatuses.map(item => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></label><button type="button" className="admin-button admin-button-light" onClick={() => onToast('La lista de pedidos de demostración se exportó.') }><Download size={15} />Exportar</button></div></div>
      <div className="admin-table-scroll"><table className="admin-table admin-orders-table"><thead><tr><th>PEDIDO</th><th>CLIENTE</th><th>FECHA</th><th>PRODUCTOS</th><th>TOTAL</th><th>PAGO</th><th>ESTADO</th><th /></tr></thead><tbody>{visible.map(order => {
        const customer = customerFor(order.customerId, customers);
        return <tr key={order.id} onClick={() => setSelected(order)} className="admin-clickable-row"><td><strong className="admin-table-primary">{order.id}</strong></td><td><span className="admin-customer-cell"><span className="admin-mini-avatar">{customer.name[0]}</span><span>{customer.name}</span></span></td><td>{formatDate(order.date, { day: 'numeric', month: 'short' })}<small className="admin-table-subline">{order.date.slice(11)}</small></td><td>{order.lines.reduce((sum, line) => sum + line.quantity, 0)} {order.lines.length > 1 ? 'productos' : 'producto'}</td><td><strong>{formatMoney(order.total)}</strong></td><td><span className={`admin-payment-state ${order.paymentStatus === 'Pagado' ? 'is-paid' : order.paymentStatus === 'Pendiente' ? 'is-pending' : 'is-refunded'}`}><i />{order.paymentStatus}</span></td><td><StatusPill>{order.status}</StatusPill></td><td><button type="button" aria-label={`Ver pedido ${order.id}`} className="admin-row-open" onClick={event => { event.stopPropagation(); setSelected(order); }}><ArrowUpRight size={15} /></button></td></tr>;
      })}</tbody></table>
      {!visible.length && <div className="admin-filter-empty"><Search size={19} /><strong>No hay pedidos con estos filtros</strong><span>Prueba otro estado o término de búsqueda.</span></div>}</div>
      <div className="admin-table-footer"><span>Mostrando {visible.length} de {orders.length} pedidos</span><span>Pedidos con datos de demostración</span></div>
    </section>
    {selected && <OrderDetail order={selected} customer={customerFor(selected.customerId, customers)} onClose={() => setSelected(null)} onSave={order => {
      onOrdersChange(orders.map(item => item.id === order.id ? order : item)); setSelected(order); onToast(`${order.id} actualizado.`);
    }} />}
  </>;
}

function OrderDetail({ order, customer, onClose, onSave }: {
  order: DemoOrder;
  customer: DemoCustomer;
  onClose: () => void;
  onSave: (order: DemoOrder) => void;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [tracking, setTracking] = useState(order.tracking);
  const [note, setNote] = useState(order.internalNote);
  const [saved, setSaved] = useState(false);
  useEffect(() => { setStatus(order.status); setTracking(order.tracking); setNote(order.internalNote); }, [order]);
  return <ModalFrame title={`Pedido ${order.id}`} onClose={onClose} className="order-detail-modal">
    <div className="admin-order-detail-head"><span>Realizado el {formatDate(order.date, { day: 'numeric', month: 'long', year: 'numeric' })} · {order.date.slice(11)}</span><StatusPill>{order.status}</StatusPill></div>
    <div className="admin-order-detail-grid">
      <section className="admin-detail-panel"><div className="admin-detail-title"><ShoppingBag size={15} /><strong>Productos</strong></div>{order.lines.map((line, index) => <div className="admin-order-line" key={`${line.productId}-${index}`}><span className="admin-order-line-thumb"><Shirt size={19} /></span><span><strong>{line.productName}</strong><small>{line.color} / {line.size} · Cant. {line.quantity}</small></span><b>{formatMoney(line.unitPrice * line.quantity)}</b></div>)}<div className="admin-order-subtotal"><span>Subtotal</span><strong>{formatMoney(order.total - 20)}</strong></div><div className="admin-order-subtotal"><span>Envío</span><strong>{formatMoney(20)}</strong></div><div className="admin-order-total"><span>Total</span><strong>{formatMoney(order.total)}</strong></div></section>
      <div className="admin-detail-stack"><section className="admin-detail-panel"><div className="admin-detail-title"><Users size={15} /><strong>Cliente</strong></div><strong>{customer.name}</strong><span>{customer.email}</span><span>{customer.phone}</span><span className="admin-tier-label">{customer.tier} · {customer.segment}</span></section>
        <section className="admin-detail-panel"><div className="admin-detail-title"><Truck size={15} /><strong>Entrega</strong></div><span>{order.shippingAddress}</span><label>Transportista<select value={order.carrier} onChange={event => onSave({ ...order, carrier: event.target.value as Carrier })}>{carriers.map(carrier => <option key={carrier}>{carrier}</option>)}</select></label><label>Número de tracking<input value={tracking} onChange={event => setTracking(event.target.value)} placeholder="Ej. OLV-PE-784231" /></label><span>Entrega estimada · {formatDate(order.estimatedDelivery, { day: 'numeric', month: 'long' })}</span></section>
      </div>
    </div>
    <div className="admin-detail-controls"><label>Estado del pedido<select value={status} onChange={event => setStatus(event.target.value as OrderStatus)}>{orderStatuses.map(item => <option key={item}>{item}</option>)}</select></label><label>Nota interna<textarea value={note} onChange={event => setNote(event.target.value)} placeholder="Escribe una nota para tu equipo..." rows={2} /></label></div>
    {saved && <p className="admin-inline-success"><Check size={14} />Cambios guardados en esta demostración.</p>}
    <div className="admin-modal-actions"><button type="button" className="admin-button admin-button-quiet" onClick={onClose}>Cerrar</button><button type="button" className="admin-button admin-button-primary" onClick={() => { onSave({ ...order, status, tracking, internalNote: note }); setSaved(true); }}><Check size={15} />Guardar cambios</button></div>
  </ModalFrame>;
}

function ShippingPage({ shipments, orders, customers, onShipmentsChange, onOrdersChange, onToast }: {
  shipments: DemoShipment[];
  orders: DemoOrder[];
  customers: DemoCustomer[];
  onShipmentsChange: (shipments: DemoShipment[]) => void;
  onOrdersChange: (orders: DemoOrder[]) => void;
  onToast: (message: string) => void;
}) {
  const [filter, setFilter] = useState('Todos los envíos');
  const [adding, setAdding] = useState(false);
  const visible = shipments.filter(shipment => filter === 'Todos los envíos' || shipment.status === filter);
  const updateShipment = (shipment: DemoShipment) => {
    onShipmentsChange(shipments.map(item => item.id === shipment.id ? shipment : item));
    onOrdersChange(orders.map(order => order.id === shipment.orderId ? { ...order, carrier: shipment.carrier, tracking: shipment.tracking } : order));
  };
  return <>
    <div className="admin-shipping-stats">{([
      ['Por preparar', shipments.filter(item => item.status === 'Pendiente de preparación').length, Clock3],
      ['Listos para enviar', shipments.filter(item => item.status === 'Listo para enviar').length, Package],
      ['En tránsito', shipments.filter(item => item.status === 'En tránsito' || item.status === 'Enviado').length, Truck],
      ['Entregados', shipments.filter(item => item.status === 'Entregado').length, Check],
    ] as [string, number, typeof Truck][]).map(([label, count, Icon]) =>
      <article className="admin-card admin-shipping-stat" key={label}><span><Icon size={16} />{label}</span><strong>{count}</strong></article>)}</div>
    <section className="admin-card admin-table-card"><div className="admin-table-toolbar"><div><h2 className="admin-table-title">Envíos y tracking</h2><p className="admin-table-subtitle">5 transportistas disponibles en la simulación.</p></div><div className="admin-table-controls"><label className="admin-select-control"><Filter size={14} /><select aria-label="Filtrar envíos" value={filter} onChange={event => setFilter(event.target.value)}><option>Todos los envíos</option>{shippingStatuses.map(item => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></label><button type="button" className="admin-button admin-button-primary" onClick={() => setAdding(true)}><Plus size={15} />Registrar envío</button></div></div>
      <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>ENVÍO / PEDIDO</th><th>CLIENTE</th><th>TRANSPORTISTA</th><th>TRACKING</th><th>DESTINO</th><th>ENTREGA ESTIMADA</th><th>ESTADO</th><th /></tr></thead><tbody>{visible.map(shipment => <tr key={shipment.id}><td><strong className="admin-table-primary">{shipment.id}</strong><small className="admin-table-subline">{shipment.orderId}</small></td><td>{customerFor(shipment.customerId, customers).name}</td><td><span className="admin-carrier-cell"><Truck size={14} />{shipment.carrier}</span></td><td><code className="admin-tracking-code">{shipment.tracking}</code></td><td>{shipment.destination}</td><td>{formatDate(shipment.estimatedDelivery, { day: 'numeric', month: 'short', year: 'numeric' })}</td><td><StatusPill>{shipment.status}</StatusPill></td><td><select className="admin-inline-select" aria-label={`Estado del envío ${shipment.id}`} value={shipment.status} onChange={event => { updateShipment({ ...shipment, status: event.target.value as ShippingStatus }); onToast(`${shipment.id}: estado actualizado.`); }}>{shippingStatuses.map(item => <option key={item}>{item}</option>)}</select></td></tr>)}</tbody></table></div>
      <div className="admin-table-footer"><span>{visible.length} envíos</span><button type="button" className="admin-link-button" onClick={() => onToast('Los enlaces de seguimiento se generan con el transportista seleccionado.')}><ExternalLink size={14} /> Ver guía de tracking</button></div>
    </section>
    {adding && <ShipmentEditor orders={orders} customers={customers} onClose={() => setAdding(false)} onSave={shipment => {
      onShipmentsChange([shipment, ...shipments]);
      onOrdersChange(orders.map(order => order.id === shipment.orderId ? { ...order, carrier: shipment.carrier, tracking: shipment.tracking } : order));
      setAdding(false); onToast(`Envío ${shipment.id} registrado en la simulación.`);
    }} />}
  </>;
}

function ShipmentEditor({ orders, customers, onClose, onSave }: {
  orders: DemoOrder[];
  customers: DemoCustomer[];
  onClose: () => void;
  onSave: (shipment: DemoShipment) => void;
}) {
  const openOrders = orders.filter(order => !['Entregado', 'Cancelado', 'Devuelto'].includes(order.status));
  const [orderId, setOrderId] = useState(openOrders[0]?.id ?? orders[0].id);
  const [carrier, setCarrier] = useState<Carrier>('Olva Courier');
  const [tracking, setTracking] = useState('');
  const [eta, setEta] = useState('2026-10-30');
  const order = orders.find(item => item.id === orderId)!;
  const customer = customerFor(order.customerId, customers);
  return <ModalFrame title="Registrar envío" onClose={onClose}><form className="admin-form" onSubmit={event => {
    event.preventDefault();
    onSave({ id: `SHP-${Date.now().toString().slice(-4)}`, orderId, customerId: order.customerId, carrier, method: carrier === 'Shalom' ? 'Agencia' : 'Entrega a domicilio', tracking, status: 'Pendiente de preparación', createdAt: '2026-10-27', estimatedDelivery: eta, destination: customer.city });
  }}><label>Pedido<select value={orderId} onChange={event => setOrderId(event.target.value)}>{openOrders.map(item => <option key={item.id} value={item.id}>{item.id} · {customerFor(item.customerId, customers).name}</option>)}</select></label><label>Transportista<select value={carrier} onChange={event => setCarrier(event.target.value as Carrier)}>{carriers.map(item => <option key={item}>{item}</option>)}</select></label><div className="admin-form-grid"><label>Número de tracking<input required value={tracking} onChange={event => setTracking(event.target.value)} placeholder="Ej. OLV-PE-784250" /></label><label>Entrega estimada<input type="date" value={eta} onChange={event => setEta(event.target.value)} /></label></div><p className="admin-form-note">El correo de seguimiento se registrará en Notificaciones como evento de demostración; no se enviará ningún mensaje.</p><div className="admin-modal-actions"><button className="admin-button admin-button-quiet" type="button" onClick={onClose}>Cancelar</button><button className="admin-button admin-button-primary" type="submit">Guardar envío</button></div></form></ModalFrame>;
}

function CustomersPage({ customers, orders, query, onQuery, onToast }: {
  customers: DemoCustomer[];
  orders: DemoOrder[];
  query: string;
  onQuery: (value: string) => void;
  onToast: (message: string) => void;
}) {
  const [segment, setSegment] = useState('Todos los segmentos');
  const [selected, setSelected] = useState<DemoCustomer | null>(null);
  const segments = ['Todos los segmentos', ...new Set(customers.map(customer => customer.segment))];
  const visible = customers.filter(customer => `${customer.name} ${customer.email} ${customer.city}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')) && (segment === 'Todos los segmentos' || customer.segment === segment));
  return <>
    <div className="admin-customer-summary">{[['Clientes', customers.length], ['Clientes recurrentes', customers.filter(item => item.orderCount > 1).length], ['Nivel VIP', customers.filter(item => item.tier === 'VIP').length], ['Venta promedio', formatMoney(412)]].map(([label, value]) => <article className="admin-card" key={label as string}><span>{label}</span><strong>{value}</strong></article>)}</div>
    <section className="admin-card admin-table-card"><div className="admin-table-toolbar"><div className="admin-toolbar-left"><TableSearch value={query} onChange={onQuery} label="Buscar clientes" /><span className="admin-result-count">{visible.length} clientes</span></div><div className="admin-table-controls"><label className="admin-select-control"><Filter size={14} /><select aria-label="Filtrar clientes por segmento" value={segment} onChange={event => setSegment(event.target.value)}>{segments.map(item => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></label><button type="button" className="admin-button admin-button-light" onClick={() => onToast('Segmentación exportada en la simulación.')}><Download size={15} />Exportar</button></div></div>
      <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>CLIENTE</th><th>CIUDAD</th><th>REGISTRO</th><th>PEDIDOS</th><th>TOTAL GASTADO</th><th>SEGMENTO</th><th>NIVEL</th><th /></tr></thead><tbody>{visible.map(customer => <tr key={customer.id} className="admin-clickable-row" onClick={() => setSelected(customer)}><td><span className="admin-customer-cell"><span className="admin-mini-avatar">{customer.name[0]}</span><span><strong>{customer.name}</strong><small>{customer.email}</small></span></span></td><td>{customer.city}</td><td>{formatDate(customer.joinedAt, { day: 'numeric', month: 'short', year: 'numeric' })}</td><td>{customer.orderCount}</td><td><strong>{formatMoney(customer.totalSpent)}</strong></td><td><span className="admin-segment-tag">{customer.segment}</span></td><td><span className={`admin-tier-badge tier-${customer.tier.toLowerCase()}`}>{customer.tier}</span></td><td><button type="button" aria-label={`Ver cliente ${customer.name}`} className="admin-row-open" onClick={event => { event.stopPropagation(); setSelected(customer); }}><ArrowUpRight size={15} /></button></td></tr>)}</tbody></table></div>
    </section>
    {selected && <CustomerModal customer={selected} orders={orders.filter(order => order.customerId === selected.id)} onClose={() => setSelected(null)} />}
  </>;
}

function CustomerModal({ customer, orders, onClose }: { customer: DemoCustomer; orders: DemoOrder[]; onClose: () => void }) {
  return <ModalFrame title={customer.name} onClose={onClose} className="customer-modal">
    <div className="admin-customer-profile"><span className="admin-customer-avatar">{customer.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><div><h3>{customer.name}</h3><span>{customer.email} · {customer.phone}</span></div><span className={`admin-tier-badge tier-${customer.tier.toLowerCase()}`}>{customer.tier}</span></div>
    <div className="admin-customer-kpis"><div><span>Total gastado</span><strong>{formatMoney(customer.totalSpent)}</strong></div><div><span>Pedidos</span><strong>{customer.orderCount}</strong></div><div><span>Talla preferida</span><strong>{customer.preferredSize}</strong></div></div>
    <div className="admin-modal-section-heading"><h3>Historial de pedidos</h3><span className="admin-segment-tag">{customer.segment}</span></div>
    <div className="admin-customer-orders">{orders.map(order => <div key={order.id}><span><strong>{order.id}</strong><small>{formatDate(order.date, { day: 'numeric', month: 'short', year: 'numeric' })}</small></span><StatusPill small>{order.status}</StatusPill><b>{formatMoney(order.total)}</b></div>)}</div>
    <label className="admin-customer-note">Nota interna<textarea rows={2} placeholder="Preferencias, seguimiento o comentario para el equipo..." /></label>
    <div className="admin-modal-actions"><button type="button" className="admin-button admin-button-light" onClick={onClose}>Cerrar perfil</button><button type="button" className="admin-button admin-button-primary" onClick={onClose}>Guardar nota</button></div>
  </ModalFrame>;
}

function PromotionsPage({ promotions, onChange, onToast }: {
  promotions: DemoPromotion[];
  onChange: (promotions: DemoPromotion[]) => void;
  onToast: (message: string) => void;
}) {
  const [creating, setCreating] = useState(false);
  const active = promotions.filter(promotion => promotion.active);
  return <>
    <div className="admin-promo-summary"><div className="admin-promo-highlight"><span className="admin-promo-icon"><Gift size={18} /></span><span><strong>{active.length} promociones activas</strong><small>Cupones y beneficios en circulación</small></span><span className="admin-promo-active-dot" /></div>{[['Usos del mes', '85'], ['Ingresos asociados', 'S/ 8,940'], ['Código más usado', 'ROOTS10']].map(([label, value]) => <article className="admin-card" key={label}><span>{label}</span><strong>{value}</strong></article>)}</div>
    <section className="admin-card admin-table-card"><div className="admin-table-toolbar"><div><h2 className="admin-table-title">Cupones y promociones</h2><p className="admin-table-subtitle">Descuentos por código, colección y segmento de clientes.</p></div><div className="admin-table-controls"><button type="button" className="admin-button admin-button-light" onClick={() => onToast('Filtros de promociones actualizados.')}><Filter size={14} />Filtrar</button><button type="button" className="admin-button admin-button-primary" onClick={() => setCreating(true)}><Plus size={15} />Crear promoción</button></div></div>
      <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>PROMOCIÓN</th><th>CÓDIGO</th><th>DESCUENTO</th><th>AUDIENCIA</th><th>USOS</th><th>VIGENCIA</th><th>ESTADO</th><th /></tr></thead><tbody>{promotions.map(promotion => <tr key={promotion.id}><td><strong className="admin-table-primary">{promotion.name}</strong><small className="admin-table-subline">{promotion.kind}</small></td><td><code className="admin-promo-code">{promotion.code}</code></td><td><strong>{promotion.value}</strong></td><td>{promotion.audience}</td><td>{promotion.uses} <span className="admin-table-secondary">/ {promotion.limit}</span><div className="admin-use-progress"><span style={{ width: `${Math.min(100, promotion.uses / promotion.limit * 100)}%` }} /></div></td><td>{formatDate(promotion.startsAt)} – {formatDate(promotion.endsAt)}</td><td><button type="button" className="admin-promo-toggle" aria-label={`${promotion.active ? 'Desactivar' : 'Activar'} ${promotion.name}`} aria-pressed={promotion.active} onClick={() => onChange(promotions.map(item => item.id === promotion.id ? { ...item, active: !item.active } : item))}><span /></button></td><td><button type="button" className="admin-row-open" aria-label={`Editar ${promotion.name}`} onClick={() => onToast(`Código ${promotion.code} listo para editar.`)}><Pencil size={14} /></button></td></tr>)}</tbody></table></div>
    </section>
    {creating && <PromotionEditor onClose={() => setCreating(false)} onSave={promotion => { onChange([promotion, ...promotions]); setCreating(false); onToast(`Promoción ${promotion.code} creada.`); }} />}
  </>;
}

function PromotionEditor({ onClose, onSave }: { onClose: () => void; onSave: (promotion: DemoPromotion) => void }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [kind, setKind] = useState<DemoPromotion['kind']>('Porcentaje');
  const [value, setValue] = useState('10');
  const [audience, setAudience] = useState('Todos los clientes');
  return <ModalFrame title="Crear promoción" onClose={onClose}><form className="admin-form" onSubmit={event => {
    event.preventDefault();
    onSave({ id: `promo-${Date.now()}`, name, code: code.trim().toUpperCase(), kind, value: kind === 'Porcentaje' ? `${value}%` : kind === 'Monto fijo' ? `S/ ${value}` : value, audience, uses: 0, limit: 100, startsAt: '2026-10-27', endsAt: '2026-11-30', active: true });
  }}><label>Nombre de la promoción<input required value={name} onChange={event => setName(event.target.value)} placeholder="Ej. Drop de temporada" /></label><div className="admin-form-grid"><label>Código<input required value={code} onChange={event => setCode(event.target.value.replace(/\s+/g, ''))} placeholder="ROOTS20" /></label><label>Tipo de descuento<select value={kind} onChange={event => setKind(event.target.value as DemoPromotion['kind'])}><option>Porcentaje</option><option>Monto fijo</option><option>Envío gratis</option><option>Pack</option></select></label><label>Valor<input required value={value} onChange={event => setValue(event.target.value)} /></label><label>Asignar a<select value={audience} onChange={event => setAudience(event.target.value)}><option>Todos los clientes</option><option>Clientes VIP</option><option>Cliente nuevo</option><option>Primera compra</option><option>Essentials</option><option>Graphic Series</option></select></label></div><p className="admin-form-note">Los códigos, límites y vigencia son parte de los datos de demostración; no se publican en una tienda real.</p><div className="admin-modal-actions"><button type="button" className="admin-button admin-button-quiet" onClick={onClose}>Cancelar</button><button type="submit" className="admin-button admin-button-primary">Crear código</button></div></form></ModalFrame>;
}

function NotificationsPage({ templates, logs, customers, orders, onTemplatesChange, onLogsChange, onToast }: {
  templates: DemoEmailTemplate[];
  logs: DemoEmailLog[];
  customers: DemoCustomer[];
  orders: DemoOrder[];
  onTemplatesChange: (templates: DemoEmailTemplate[]) => void;
  onLogsChange: (logs: DemoEmailLog[]) => void;
  onToast: (message: string) => void;
}) {
  const [editing, setEditing] = useState<DemoEmailTemplate | null>(null);
  const nextStatus: Record<DemoEmailLog['status'], DemoEmailLog['status']> = { Pendiente: 'Enviado', Enviado: 'Fallido', Fallido: 'Pendiente' };
  const changeLog = (log: DemoEmailLog) => {
    const status = nextStatus[log.status];
    onLogsChange(logs.map(item => item.id === log.id ? { ...item, status, sentAt: '2026-10-27 11:08' } : item));
    onToast(status === 'Enviado' ? `Correo de demostración para ${log.recipient} marcado como enviado.` : status === 'Fallido' ? 'Se simuló un fallo de correo.' : 'Correo marcado como pendiente.');
  };
  return <div className="admin-notifications-layout">
    <div className="admin-notice-info"><span className="admin-notice-info-icon"><Mail size={18} /></span><span><strong>Correos de demostración</strong><small>La actividad se simula localmente. No se envían correos reales ni se contacta con clientes.</small></span><span className="admin-demo-badge"><span /> SIMULACIÓN</span></div>
    <section className="admin-card admin-template-card"><div className="admin-card-heading"><div><h2>Plantillas de correo</h2><p>Mensajes con identidad ROOTS para cada momento del pedido.</p></div><button type="button" className="admin-button admin-button-light" onClick={() => onToast('Nueva plantilla de correo lista para configurar.') }><Plus size={14} />Nueva plantilla</button></div>
      <div className="admin-template-list">{templates.map(template => <article className="admin-template-row" key={template.id}><div className="admin-template-preview"><img src={demoLogo} alt="ROOTS Concept Store" /><span>{template.event}</span><strong>{template.subject}</strong><small>{template.preview}</small></div><div className="admin-template-info"><span className="admin-template-trigger"><Activity size={13} />{template.event}</span><strong>{template.subject}</strong><small>{template.preview}</small></div><button type="button" className={`admin-template-toggle ${template.active ? 'is-on' : ''}`} role="switch" aria-checked={template.active} aria-label={`${template.active ? 'Desactivar' : 'Activar'} correo ${template.event}`} onClick={() => onTemplatesChange(templates.map(item => item.id === template.id ? { ...item, active: !item.active } : item))}><span /></button><button type="button" className="admin-row-open" aria-label={`Editar plantilla ${template.event}`} onClick={() => setEditing(template)}><Pencil size={14} /></button></article>)}</div>
    </section>
    <section className="admin-card admin-table-card admin-mail-log"><div className="admin-table-toolbar"><div><h2 className="admin-table-title">Actividad de correos</h2><p className="admin-table-subtitle">{logs.filter(log => log.status === 'Enviado').length} enviados · {logs.filter(log => log.status === 'Pendiente').length} pendientes · {logs.filter(log => log.status === 'Fallido').length} fallidos</p></div><button type="button" className="admin-button admin-button-light" onClick={() => onToast('Registro de correos descargado en la simulación.')}><Download size={14} />Exportar</button></div>
      <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>EVENTO / PEDIDO</th><th>DESTINATARIO</th><th>FECHA</th><th>ESTADO</th><th>ACCIÓN DE SIMULACIÓN</th></tr></thead><tbody>{logs.map(log => {
        const template = templates.find(item => item.id === log.templateId)!;
        const order = orders.find(item => item.id === log.orderId);
        const customer = customers.find(item => item.email === log.recipient);
        return <tr key={log.id}><td><strong className="admin-table-primary">{template.event}</strong><small className="admin-table-subline">{order?.id ?? log.orderId}</small></td><td><span className="admin-mail-recipient">{customer?.name ?? log.recipient}</span><small className="admin-table-subline">{log.recipient}</small></td><td>{formatDate(log.sentAt, { day: 'numeric', month: 'short' })}<small className="admin-table-subline">{log.sentAt.slice(11)}</small></td><td><StatusPill>{log.status}</StatusPill></td><td><button type="button" className="admin-button admin-button-small" onClick={() => changeLog(log)}>{log.status === 'Pendiente' ? 'Simular envío' : log.status === 'Enviado' ? 'Simular fallo' : 'Reintentar'}</button></td></tr>;
      })}</tbody></table></div>
    </section>
    {editing && <EmailTemplateEditor template={editing} onClose={() => setEditing(null)} onSave={template => {
      onTemplatesChange(templates.map(item => item.id === template.id ? template : item)); setEditing(null); onToast('Plantilla actualizada en la simulación.');
    }} />}
  </div>;
}

function EmailTemplateEditor({ template, onClose, onSave }: {
  template: DemoEmailTemplate;
  onClose: () => void;
  onSave: (template: DemoEmailTemplate) => void;
}) {
  const [subject, setSubject] = useState(template.subject);
  const [preview, setPreview] = useState(template.preview);
  return <ModalFrame title={`Correo · ${template.event}`} onClose={onClose}><form className="admin-form" onSubmit={event => { event.preventDefault(); onSave({ ...template, subject, preview }); }}>
    <div className="admin-email-editor-preview"><img src={demoLogo} alt="ROOTS Concept Store" /><span>Plantilla de demostración</span><strong>Hola, Valeria.</strong><p>Tu estilo empieza con tu propia mirada.</p></div>
    <label>Asunto<input value={subject} onChange={event => setSubject(event.target.value)} required /></label><label>Texto de vista previa<input value={preview} onChange={event => setPreview(event.target.value)} required /></label>
    <p className="admin-form-note">Este correo es una maqueta. Guardar aquí no envía mensajes ni activa un servicio externo.</p>
    <div className="admin-modal-actions"><button type="button" className="admin-button admin-button-quiet" onClick={onClose}>Cancelar</button><button type="submit" className="admin-button admin-button-primary">Guardar plantilla</button></div>
  </form></ModalFrame>;
}

function ReportsPage({ products, orders, customers, onToast }: {
  products: AdminProduct[];
  orders: DemoOrder[];
  customers: DemoCustomer[];
  onToast: (message: string) => void;
}) {
  const [period, setPeriod] = useState('Últimos 7 días');
  const exportCsv = () => {
    const rows = [['Producto', 'Categoría', 'Colección', 'Precio demo', 'Unidades vendidas'], ...products.map((product, index) => [product.name, product.category, product.collection, String(product.price), String([38, 31, 26, 22, 18, 14, 11, 8][index] ?? 6)])];
    const csv = rows.map(row => row.map(value => `"${value.replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = href; link.download = 'roots-reporte-demostracion.csv'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(href), 1000);
    onToast('Reporte CSV de demostración descargado.');
  };
  return <>
    <div className="admin-report-toolbar"><div><span className="admin-report-date"><CalendarDays size={15} /> 21 oct – 27 oct, 2026</span><span className="admin-report-sample">Datos de demostración</span></div><div className="admin-table-controls"><select aria-label="Periodo de reportes" value={period} onChange={event => setPeriod(event.target.value)}><option>Últimos 7 días</option><option>Últimos 30 días</option><option>Últimos 90 días</option></select><button type="button" className="admin-button admin-button-primary" onClick={exportCsv}><Download size={15} />Exportar CSV</button></div></div>
    <div className="admin-report-metrics"><MetricCard title="Ventas brutas" value="S/ 19,460" change="+12.8%" icon={CreditCard} /><MetricCard title="Pedidos" value="141" change="+8.3%" icon={ShoppingBag} tone="peach" /><MetricCard title="Ticket promedio" value="S/ 138" change="+3.6%" icon={Activity} tone="blue" /><MetricCard title="Descuentos" value="S/ 1,280" change="85 usos" icon={BadgePercent} tone="amber" /></div>
    <div className="admin-report-grid"><section className="admin-card admin-report-sales"><div className="admin-card-heading"><div><h2>Ventas por periodo</h2><p>Comparativa de ingresos y pedidos · {period.toLowerCase()}</p></div><span className="admin-metric-change"><ArrowUpRight size={13} />12.8%</span></div><div className="admin-report-chart">{salesByDay.map((day, index) => <div key={day.day}><span className="admin-report-bar" style={{ height: `${18 + (day.total / 3960) * 70}%` }} /><span className="admin-report-bar-faint" style={{ height: `${15 + (day.orders / 29) * 50}%` }} /><small>{day.day}</small>{index === 5 && <i />}</div>)}</div><div className="admin-report-legend"><span><i />Ventas (S/)</span><span><i />Pedidos</span></div></section>
      <section className="admin-card admin-report-status"><div className="admin-card-heading"><div><h2>Pedidos por estado</h2><p>Distribución de los pedidos de demo</p></div></div>{orderStatuses.slice(0, 6).map((status, index) => <div className="admin-report-status-row" key={status}><span className={`admin-status-dot dot-${index}`} /><span>{status}</span><strong>{[18, 12, 24, 21, 17, 43][index]}</strong><span className="admin-report-status-track"><i style={{ width: `${[13, 9, 17, 15, 12, 31][index]}%` }} /></span></div>)}</section></div>
    <section className="admin-card admin-table-card admin-report-products"><div className="admin-table-toolbar"><div><h2 className="admin-table-title">Productos más vendidos</h2><p className="admin-table-subtitle">Ventas del periodo seleccionado</p></div><button type="button" className="admin-link-button" onClick={() => onToast(`Reporte filtrado: ${orders.length} pedidos y ${customers.length} clientes de demostración.`)}><SlidersHorizontal size={14} />Más filtros</button></div>
      <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>PRODUCTO</th><th>CATEGORÍA</th><th>COLECCIÓN</th><th>UNIDADES</th><th>INGRESOS</th><th>CAMBIO</th></tr></thead><tbody>{products.slice(0, 6).map((product, index) => <tr key={product.id}><td><div className="admin-table-product"><ProductThumbnail product={product} /><strong>{product.name}</strong></div></td><td>{product.category}</td><td>{product.collection}</td><td>{[38, 31, 26, 22, 18, 14][index]}</td><td><strong>{formatMoney([4_902, 4_309, 3_874, 3_080, 2_880, 2_646][index])}</strong></td><td><span className="admin-metric-change"><ArrowUpRight size={12} />{[18, 12, 9, 7, 5, 3][index]}%</span></td></tr>)}</tbody></table></div>
    </section>
  </>;
}

function SettingsPage({ onToast }: { onToast: (message: string) => void }) {
  const [loyalty, setLoyalty] = useState(true);
  const [brandName, setBrandName] = useState('ROOTS Concept Store');
  return <div className="admin-settings-layout">
    <nav className="admin-settings-menu" aria-label="Secciones de configuración">{['Marca y tienda', 'Catálogo', 'Pedidos y pagos', 'Envíos', 'Notificaciones', 'Equipo y permisos', 'Fidelización', 'Integraciones'].map((item, index) => <a className={index === 0 ? 'is-active' : ''} href={`#settings-${index}`} key={item}>{item}<ChevronRight size={13} /></a>)}</nav>
    <div className="admin-settings-content">
      <section className="admin-card admin-settings-card" id="settings-0"><div className="admin-card-heading"><div><h2>Marca y tienda</h2><p>La identidad que acompaña cada punto de contacto.</p></div><img className="admin-settings-logo" src={demoLogo} alt="ROOTS Concept Store" /></div>
        <div className="admin-settings-fields"><label>Nombre de la tienda<input value={brandName} onChange={event => setBrandName(event.target.value)} /></label><label>Moneda<select defaultValue="PEN"><option value="PEN">Sol peruano · PEN (S/)</option><option value="USD">Dólar estadounidense · USD ($)</option></select></label><label>País y zona horaria<select defaultValue="PE"> <option value="PE">Perú · Lima (GMT−5)</option><option value="MX">México · Ciudad de México</option></select></label><label>Impuestos<select defaultValue="included"><option value="included">Precios incluyen impuestos</option><option value="added">Impuestos se agregan al pago</option></select></label></div><button type="button" className="admin-button admin-button-primary" onClick={() => onToast(`${brandName} actualizado en la configuración demo.`)}>Guardar cambios</button>
      </section>
      <section className="admin-card admin-settings-card" id="settings-1"><div className="admin-card-heading"><div><h2>Catálogo y operación</h2><p>Valores predeterminados de la tienda ROOTS.</p></div></div><div className="admin-settings-list">
        <div><span><strong>Categorías</strong><small>{productCategories.join(' · ')}</small></span><button type="button" onClick={() => onToast('Categorías de demostración actualizadas.')}>Editar <Pencil size={13} /></button></div>
        <div><span><strong>Colecciones</strong><small>{collectionNames.join(' · ')}</small></span><button type="button" onClick={() => onToast('Colecciones de demostración actualizadas.')}>Editar <Pencil size={13} /></button></div>
        <div><span><strong>Métodos de pago</strong><small>Yape · Tarjeta · Transferencia</small></span><button type="button" onClick={() => onToast('Métodos de pago simulados.')}>Editar <Pencil size={13} /></button></div>
        <div><span><strong>Transportistas</strong><small>{carriers.join(' · ')}</small></span><button type="button" onClick={() => onToast('Transportistas de demostración actualizados.')}>Editar <Pencil size={13} /></button></div>
      </div></section>
      <section className="admin-card admin-settings-card" id="settings-2"><div className="admin-card-heading"><div><h2>Estados de pedidos y envíos</h2><p>Flujo predeterminado para la simulación ROOTS.</p></div></div><div className="admin-state-settings"><div><strong>Pedidos</strong><div>{orderStatuses.map(item => <StatusPill small key={item}>{item}</StatusPill>)}</div></div><div><strong>Envíos</strong><div>{shippingStatuses.map(item => <StatusPill small key={item}>{item}</StatusPill>)}</div></div><div><strong>Productos</strong><div>{productStatuses.map(item => <StatusPill small key={item}>{item}</StatusPill>)}</div></div></div></section>
      <section className="admin-card admin-settings-card" id="settings-6"><div className="admin-card-heading"><div><h2>Fidelización ROOTS</h2><p>Puntos, membresías y beneficios por compra.</p></div><button type="button" className={`admin-template-toggle ${loyalty ? 'is-on' : ''}`} role="switch" aria-checked={loyalty} aria-label="Fidelización ROOTS" onClick={() => setLoyalty(!loyalty)}><span /></button></div><div className="admin-loyalty-levels">{[['Estándar', '1 punto por cada S/ 10'], ['Preferente', 'Acceso anticipado a drops'], ['VIP', 'Beneficios y cumpleaños']].map(([level, benefit], index) => <div key={level}><span className={`admin-loyalty-star level-${index}`}>✳</span><span><strong>{level}</strong><small>{benefit}</small></span></div>)}</div></section>
      <section className="admin-card admin-settings-card" id="settings-7"><div className="admin-card-heading"><div><h2>Equipo y permisos</h2><p>Perfiles de acceso sugeridos para tu operación.</p></div><button type="button" className="admin-button admin-button-light" onClick={() => onToast('Invitación de miembro preparada en la simulación.')}><Plus size={14} />Invitar</button></div><div className="admin-role-list">{['Administrador', 'Operador de pedidos', 'Encargado de catálogo', 'Marketing', 'Solo lectura'].map((role, index) => <div key={role}><span className={`admin-role-avatar role-${index}`}>{role[0]}</span><strong>{role}</strong><span>{index === 0 ? 'Acceso total' : 'Permisos por rol'}</span><button type="button" aria-label={`Editar rol ${role}`} onClick={() => onToast(`Permisos para ${role}.`)}><Pencil size={13} /></button></div>)}</div></section>
    </div>
  </div>;
}

function ModalFrame({ title, children, onClose, className = '' }: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);
  return <div className="admin-dialog-scrim" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={`admin-dialog ${className}`} role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title">
      <div className="admin-dialog-heading"><div><span className="admin-eyebrow">ROOTS CONCEPT STORE · DEMO</span><h2 id="admin-dialog-title">{title}</h2></div><button type="button" aria-label="Cerrar" onClick={onClose}><X size={18} /></button></div>
      <div className="admin-dialog-content">{children}</div>
    </section>
  </div>;
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onClose, 3500);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);
  if (!message) return null;
  return <div role="status" className="admin-toast"><Check size={16} />{message}<button type="button" aria-label="Cerrar mensaje" onClick={onClose}><X size={14} /></button></div>;
}

export default function AdminApp() {
  const [active, setActive] = useState<AdminSection>('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [customers] = useState(initialCustomers);
  const [shipments, setShipments] = useState(initialShipments);
  const [collections, setCollections] = useState(initialCollections);
  const [promotions, setPromotions] = useState(initialPromotions);
  const [templates, setTemplates] = useState(initialEmailTemplates);
  const [emailLogs, setEmailLogs] = useState(initialEmailLogs);
  const navigate = (section: AdminSection) => { setActive(section); setQuery(''); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const showToast = (message: string) => setToast(message);
  useEffect(() => {
    document.title = `${sectionTitles[active]} — ROOTS Concept Store`;
    return () => { document.title = 'ROOTS® — Wear your roots.'; };
  }, [active]);

  return <div className="roots-admin">
    <Sidebar active={active} onNavigate={navigate} open={menuOpen} onClose={() => setMenuOpen(false)} />
    <div className="admin-main">
      <Topbar active={active} query={query} onQuery={setQuery} onMenu={() => setMenuOpen(true)} onToast={showToast} />
      <main className="admin-content">
        <PageHeader section={active} />
        {active === 'dashboard' && <Dashboard products={products} orders={orders} customers={customers} onNavigate={navigate} onOpenOrder={_order => navigate('orders')} />}
        {active === 'products' && <ProductsPage products={products} query={query} onProductsChange={setProducts} onToast={showToast} />}
        {active === 'collections' && <CollectionsPage collections={collections} products={products} onChange={setCollections} onToast={showToast} />}
        {active === 'inventory' && <InventoryPage products={products} onProductsChange={setProducts} onToast={showToast} />}
        {active === 'orders' && <OrdersPage orders={orders} customers={customers} query={query} onOrdersChange={setOrders} onToast={showToast} />}
        {active === 'shipping' && <ShippingPage shipments={shipments} orders={orders} customers={customers} onShipmentsChange={setShipments} onOrdersChange={setOrders} onToast={showToast} />}
        {active === 'customers' && <CustomersPage customers={customers} orders={orders} query={query} onQuery={setQuery} onToast={showToast} />}
        {active === 'promotions' && <PromotionsPage promotions={promotions} onChange={setPromotions} onToast={showToast} />}
        {active === 'notifications' && <NotificationsPage templates={templates} logs={emailLogs} customers={customers} orders={orders} onTemplatesChange={setTemplates} onLogsChange={setEmailLogs} onToast={showToast} />}
        {active === 'reports' && <ReportsPage products={products} orders={orders} customers={customers} onToast={showToast} />}
        {active === 'settings' && <SettingsPage onToast={showToast} />}
        <footer className="admin-footer"><span><img src={demoLogo} alt="" /> Panel ROOTS Studio</span><span>Datos de demostración · Ninguna acción contacta clientes o transportistas reales</span><a href="/" target="_blank" rel="noreferrer">Ver tienda <ExternalLink size={13} /></a></footer>
      </main>
    </div>
    <Toast message={toast} onClose={() => setToast('')} />
  </div>;
}
