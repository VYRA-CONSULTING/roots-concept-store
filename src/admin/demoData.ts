import { products as storefrontProducts } from '../data/catalog';

export const orderStatuses = [
  'Pendiente de pago',
  'Pago confirmado',
  'En preparación',
  'Enviado',
  'En tránsito',
  'Entregado',
  'Cancelado',
  'Devuelto',
] as const;

export const productStatuses = ['Borrador', 'Activo', 'Agotado', 'Archivado'] as const;

export const shippingStatuses = [
  'Pendiente de preparación',
  'Listo para enviar',
  'Enviado',
  'En tránsito',
  'Entregado',
  'Incidencia',
] as const;

export const productCategories = ['Polos', 'Hoodies', 'Pantalones', 'Accesorios', 'Gráficos'] as const;

export const collectionNames = ['Essentials', 'Drop 01', 'Graphic Series', 'Washed Collection', 'Nuevos ingresos'] as const;

export const carriers = ['Olva Courier', 'Shalom', 'Urbano', 'Recojo en tienda', 'Envío local ROOTS'] as const;

export type OrderStatus = typeof orderStatuses[number];
export type ProductStatus = typeof productStatuses[number];
export type ShippingStatus = typeof shippingStatuses[number];
export type ProductCategory = typeof productCategories[number];
export type Carrier = typeof carriers[number];
export type DemoEmailStatus = 'Pendiente' | 'Enviado' | 'Fallido';

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  collection: string;
  price: number;
  previousPrice: number | null;
  status: ProductStatus;
  variants: ProductVariant[];
  artworkIndex: number | null;
  swatch: string;
  featured: boolean;
}

export interface DemoCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  joinedAt: string;
  lastOrderAt: string;
  orderCount: number;
  totalSpent: number;
  segment: string;
  tier: 'Estándar' | 'Preferente' | 'VIP';
  preferredSize: string;
}

export interface DemoOrderLine {
  productId: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
}

export interface DemoOrder {
  id: string;
  customerId: string;
  date: string;
  lines: DemoOrderLine[];
  total: number;
  paymentMethod: string;
  paymentStatus: 'Pendiente' | 'Pagado' | 'Reembolsado';
  status: OrderStatus;
  carrier: Carrier;
  tracking: string;
  estimatedDelivery: string;
  shippingAddress: string;
  internalNote: string;
}

export interface DemoShipment {
  id: string;
  orderId: string;
  customerId: string;
  carrier: Carrier;
  method: string;
  tracking: string;
  status: ShippingStatus;
  createdAt: string;
  estimatedDelivery: string;
  destination: string;
}

export interface DemoCollection {
  id: string;
  name: string;
  description: string;
  kind: string;
  releaseDate: string;
  status: 'Activa' | 'Próxima' | 'Agotada';
  artworkIndex: number;
  tags: string[];
}

export interface DemoPromotion {
  id: string;
  name: string;
  code: string;
  kind: 'Porcentaje' | 'Monto fijo' | 'Envío gratis' | 'Pack';
  value: string;
  audience: string;
  uses: number;
  limit: number;
  startsAt: string;
  endsAt: string;
  active: boolean;
}

export interface DemoEmailTemplate {
  id: string;
  event: string;
  subject: string;
  preview: string;
  active: boolean;
}

export interface DemoEmailLog {
  id: string;
  templateId: string;
  recipient: string;
  orderId: string;
  sentAt: string;
  status: DemoEmailStatus;
}

const apparelVariants = (id: string, colors: string[], sizes = ['S', 'M', 'L', 'XL']): ProductVariant[] =>
  colors.flatMap((color, colorIndex) => sizes.map((size, sizeIndex) => ({
    id: `${id}-${colorIndex}-${sizeIndex}`,
    size,
    color,
    sku: `RCS-${id.toUpperCase()}-${colorIndex + 1}${size}`,
    stock: 3 + ((colorIndex * 3 + sizeIndex * 2) % 12),
  })));

const mappedStorefrontProducts: AdminProduct[] = storefrontProducts.map((product, index) => {
  const collections = ['Essentials', 'Graphic Series', 'Drop 01', 'Washed Collection'];
  return {
    id: product.id,
    name: product.name,
    sku: `RCS-TEE-${String(index + 1).padStart(3, '0')}`,
    category: 'Gráficos',
    collection: collections[index],
    price: [129, 139, 149, 135][index],
    previousPrice: index === 2 ? 169 : null,
    status: index === 3 ? 'Agotado' : 'Activo',
    variants: apparelVariants(`TEE${index + 1}`, [product.color]).map((variant, variantIndex) => ({
      ...variant,
      stock: index === 3 ? 0 : [6, 8, 11, 5][(variantIndex + index) % 4],
    })),
    artworkIndex: product.artworkIndex,
    swatch: product.swatch,
    featured: index === 0 || index === 2,
  };
});

export const initialProducts: AdminProduct[] = [
  ...mappedStorefrontProducts,
  {
    id: 'roots-essentials-hoodie',
    name: 'Hoodie Essential',
    sku: 'RCS-HOD-005',
    category: 'Hoodies',
    collection: 'Essentials',
    price: 229,
    previousPrice: null,
    status: 'Activo',
    variants: apparelVariants('HOD005', ['Negro', 'Piedra']),
    artworkIndex: null,
    swatch: '#73766f',
    featured: true,
  },
  {
    id: 'roots-relaxed-pant',
    name: 'Pantalón Relaxed',
    sku: 'RCS-PNT-006',
    category: 'Pantalones',
    collection: 'Nuevos ingresos',
    price: 189,
    previousPrice: null,
    status: 'Activo',
    variants: apparelVariants('PNT006', ['Oliva', 'Negro'], ['28', '30', '32', '34']),
    artworkIndex: null,
    swatch: '#667260',
    featured: false,
  },
  {
    id: 'roots-symbol-cap',
    name: 'Symbol Cap',
    sku: 'RCS-ACC-007',
    category: 'Accesorios',
    collection: 'Drop 01',
    price: 89,
    previousPrice: null,
    status: 'Activo',
    variants: apparelVariants('ACC007', ['Verde salvia'], ['Única']),
    artworkIndex: null,
    swatch: '#85917f',
    featured: false,
  },
  {
    id: 'roots-logo-tee',
    name: 'Logo Tee',
    sku: 'RCS-TEE-008',
    category: 'Polos',
    collection: 'Nuevos ingresos',
    price: 119,
    previousPrice: null,
    status: 'Borrador',
    variants: apparelVariants('TEE008', ['Blanco', 'Negro']),
    artworkIndex: null,
    swatch: '#e8e7df',
    featured: false,
  },
];

export const initialCustomers: DemoCustomer[] = [
  { id: 'cus-001', name: 'Valeria Rojas', email: 'valeria.rojas@correo.demo', phone: '+51 987 321 640', city: 'Lima', joinedAt: '2026-07-14', lastOrderAt: '2026-10-27', orderCount: 6, totalSpent: 924, segment: 'Cliente VIP', tier: 'VIP', preferredSize: 'M' },
  { id: 'cus-002', name: 'Mateo Salazar', email: 'mateo.salazar@correo.demo', phone: '+51 956 210 784', city: 'Arequipa', joinedAt: '2026-09-02', lastOrderAt: '2026-10-26', orderCount: 3, totalSpent: 487, segment: 'Recurrente', tier: 'Preferente', preferredSize: 'L' },
  { id: 'cus-003', name: 'Camila Torres', email: 'camila.torres@correo.demo', phone: '+51 943 785 129', city: 'Lima', joinedAt: '2026-10-20', lastOrderAt: '2026-10-25', orderCount: 1, totalSpent: 278, segment: 'Cliente nuevo', tier: 'Estándar', preferredSize: 'S' },
  { id: 'cus-004', name: 'Diego Paredes', email: 'diego.paredes@correo.demo', phone: '+51 972 410 558', city: 'Cusco', joinedAt: '2026-06-11', lastOrderAt: '2026-10-24', orderCount: 4, totalSpent: 716, segment: 'Recurrente', tier: 'Preferente', preferredSize: 'XL' },
  { id: 'cus-005', name: 'Lucía Mendoza', email: 'lucia.mendoza@correo.demo', phone: '+51 991 603 248', city: 'Trujillo', joinedAt: '2026-04-29', lastOrderAt: '2026-10-22', orderCount: 8, totalSpent: 1_342, segment: 'Cliente VIP', tier: 'VIP', preferredSize: 'M' },
  { id: 'cus-006', name: 'Nicolás Vargas', email: 'nicolas.vargas@correo.demo', phone: '+51 965 208 173', city: 'Lima', joinedAt: '2026-10-18', lastOrderAt: '2026-10-21', orderCount: 1, totalSpent: 149, segment: 'Cliente nuevo', tier: 'Estándar', preferredSize: 'L' },
  { id: 'cus-007', name: 'Sofía Castillo', email: 'sofia.castillo@correo.demo', phone: '+51 948 562 307', city: 'Piura', joinedAt: '2026-03-16', lastOrderAt: '2026-09-12', orderCount: 5, totalSpent: 1_089, segment: 'Cliente inactivo', tier: 'VIP', preferredSize: 'S' },
  { id: 'cus-008', name: 'Andrés Navarro', email: 'andres.navarro@correo.demo', phone: '+51 934 775 691', city: 'Lima', joinedAt: '2026-08-03', lastOrderAt: '2026-10-19', orderCount: 2, totalSpent: 358, segment: 'Recurrente', tier: 'Estándar', preferredSize: 'XL' },
];

const customerFor = (id: string) => initialCustomers.find(customer => customer.id === id)!;
const orderLines = (productId: string, productName: string, size: string, color: string, unitPrice: number, quantity = 1): DemoOrderLine[] =>
  [{ productId, productName, size, color, quantity, unitPrice }];

export const initialOrders: DemoOrder[] = [
  { id: '#RT-1048', customerId: 'cus-001', date: '2026-10-27 10:42', lines: orderLines('arkad-wave', 'Graphic Wave', 'M', 'Negro', 129, 2), total: 278, paymentMethod: 'Yape', paymentStatus: 'Pagado', status: 'En preparación', carrier: 'Olva Courier', tracking: 'OLV-PE-784231', estimatedDelivery: '2026-10-29', shippingAddress: 'Av. Primavera 1240, Surco, Lima', internalNote: 'Solicitó entrega después de las 17:00.' },
  { id: '#RT-1047', customerId: 'cus-002', date: '2026-10-27 09:18', lines: orderLines('roots-essentials-hoodie', 'Hoodie Essential', 'L', 'Piedra', 229), total: 249, paymentMethod: 'Tarjeta Visa', paymentStatus: 'Pagado', status: 'Listo para enviar' as OrderStatus, carrier: 'Shalom', tracking: 'SHL-50291847', estimatedDelivery: '2026-10-30', shippingAddress: 'Calle Jerusalén 318, Cercado, Arequipa', internalNote: '' },
  { id: '#RT-1046', customerId: 'cus-003', date: '2026-10-27 08:04', lines: orderLines('arkad-star', 'Star Tee', 'S', 'Borgoña', 149), total: 169, paymentMethod: 'Transferencia', paymentStatus: 'Pendiente', status: 'Pendiente de pago', carrier: 'Recojo en tienda', tracking: '', estimatedDelivery: '2026-10-29', shippingAddress: 'Recojo en tienda ROOTS, Miraflores', internalNote: '' },
  { id: '#RT-1045', customerId: 'cus-004', date: '2026-10-26 16:30', lines: orderLines('roots-relaxed-pant', 'Pantalón Relaxed', '32', 'Oliva', 189), total: 214, paymentMethod: 'Yape', paymentStatus: 'Pagado', status: 'En tránsito', carrier: 'Olva Courier', tracking: 'OLV-PE-784205', estimatedDelivery: '2026-10-28', shippingAddress: 'Calle Plateros 221, Cusco', internalNote: 'Confirmar llamada antes de entregar.' },
  { id: '#RT-1044', customerId: 'cus-005', date: '2026-10-26 13:15', lines: orderLines('arkad-studios', 'Studios Tee', 'M', 'Gris claro', 139, 2), total: 303, paymentMethod: 'Tarjeta Mastercard', paymentStatus: 'Pagado', status: 'Enviado', carrier: 'Urbano', tracking: 'URB-PE-0619258', estimatedDelivery: '2026-10-28', shippingAddress: 'Jr. Pizarro 644, Trujillo', internalNote: '' },
  { id: '#RT-1043', customerId: 'cus-006', date: '2026-10-25 11:52', lines: orderLines('roots-symbol-cap', 'Symbol Cap', 'Única', 'Verde salvia', 89), total: 89, paymentMethod: 'Yape', paymentStatus: 'Pagado', status: 'Entregado', carrier: 'Envío local ROOTS', tracking: 'ROOTS-L-1942', estimatedDelivery: '2026-10-26', shippingAddress: 'Av. Brasil 1620, Jesús María, Lima', internalNote: '' },
  { id: '#RT-1042', customerId: 'cus-007', date: '2026-10-24 18:20', lines: orderLines('get-different', 'Get Different', 'S', 'Carbón', 135), total: 135, paymentMethod: 'Tarjeta Visa', paymentStatus: 'Pagado', status: 'Cancelado', carrier: 'Olva Courier', tracking: '', estimatedDelivery: '2026-10-28', shippingAddress: 'Calle Los Pinos 410, Piura', internalNote: 'Cancelado por solicitud del cliente.' },
  { id: '#RT-1041', customerId: 'cus-008', date: '2026-10-23 14:06', lines: orderLines('roots-logo-tee', 'Logo Tee', 'XL', 'Blanco', 119), total: 119, paymentMethod: 'Transferencia', paymentStatus: 'Reembolsado', status: 'Devuelto', carrier: 'Shalom', tracking: 'SHL-50291760', estimatedDelivery: '2026-10-26', shippingAddress: 'Av. La Marina 2440, San Miguel, Lima', internalNote: 'Cambio por talla solicitado.' },
];

export const initialShipments: DemoShipment[] = [
  { id: 'SHP-1048', orderId: '#RT-1048', customerId: 'cus-001', carrier: 'Olva Courier', method: 'Entrega a domicilio', tracking: 'OLV-PE-784231', status: 'Pendiente de preparación', createdAt: '2026-10-27', estimatedDelivery: '2026-10-29', destination: 'Surco, Lima' },
  { id: 'SHP-1047', orderId: '#RT-1047', customerId: 'cus-002', carrier: 'Shalom', method: 'Agencia', tracking: 'SHL-50291847', status: 'Listo para enviar', createdAt: '2026-10-27', estimatedDelivery: '2026-10-30', destination: 'Cercado, Arequipa' },
  { id: 'SHP-1045', orderId: '#RT-1045', customerId: 'cus-004', carrier: 'Olva Courier', method: 'Entrega a domicilio', tracking: 'OLV-PE-784205', status: 'En tránsito', createdAt: '2026-10-26', estimatedDelivery: '2026-10-28', destination: 'Centro, Cusco' },
  { id: 'SHP-1044', orderId: '#RT-1044', customerId: 'cus-005', carrier: 'Urbano', method: 'Entrega a domicilio', tracking: 'URB-PE-0619258', status: 'Enviado', createdAt: '2026-10-26', estimatedDelivery: '2026-10-28', destination: 'Centro, Trujillo' },
  { id: 'SHP-1043', orderId: '#RT-1043', customerId: 'cus-006', carrier: 'Envío local ROOTS', method: 'Entrega local', tracking: 'ROOTS-L-1942', status: 'Entregado', createdAt: '2026-10-25', estimatedDelivery: '2026-10-26', destination: 'Jesús María, Lima' },
  { id: 'SHP-1041', orderId: '#RT-1041', customerId: 'cus-008', carrier: 'Shalom', method: 'Agencia', tracking: 'SHL-50291760', status: 'Incidencia', createdAt: '2026-10-23', estimatedDelivery: '2026-10-26', destination: 'San Miguel, Lima' },
];

export const initialCollections: DemoCollection[] = [
  { id: 'col-001', name: 'Essentials', description: 'Piezas esenciales para vestir todos los días.', kind: 'Permanente', releaseDate: '2026-08-01', status: 'Activa', artworkIndex: 0, tags: ['Básicos', 'Siempre disponible'] },
  { id: 'col-002', name: 'Drop 01', description: 'Una edición limitada de siluetas y gráficos.', kind: 'Drop limitado', releaseDate: '2026-10-20', status: 'Activa', artworkIndex: 2, tags: ['Edición limitada', '2026'] },
  { id: 'col-003', name: 'Graphic Series', description: 'Gráficos que hablan por ti.', kind: 'Cápsula', releaseDate: '2026-09-15', status: 'Activa', artworkIndex: 1, tags: ['Gráficos', 'ARKAD'] },
  { id: 'col-004', name: 'Washed Collection', description: 'Texturas vividas y colores con carácter.', kind: 'Colección permanente', releaseDate: '2026-07-10', status: 'Activa', artworkIndex: 3, tags: ['Washed', 'Essential'] },
  { id: 'col-005', name: 'Nuevos ingresos', description: 'Lo último que llegó al estudio ROOTS.', kind: 'Novedades', releaseDate: '2026-10-27', status: 'Próxima', artworkIndex: 0, tags: ['Nuevos ingresos'] },
];

export const initialPromotions: DemoPromotion[] = [
  { id: 'promo-001', name: 'Bienvenida ROOTS', code: 'ROOTS10', kind: 'Porcentaje', value: '10%', audience: 'Primera compra', uses: 36, limit: 100, startsAt: '2026-10-01', endsAt: '2026-11-30', active: true },
  { id: 'promo-002', name: 'Drop 01 · acceso especial', code: 'DROP15', kind: 'Porcentaje', value: '15%', audience: 'Clientes VIP', uses: 18, limit: 50, startsAt: '2026-10-20', endsAt: '2026-11-02', active: true },
  { id: 'promo-003', name: 'Envío por nuestra cuenta', code: 'ROOTSFREESHIP', kind: 'Envío gratis', value: 'Envío gratis', audience: 'Compras desde S/ 250', uses: 22, limit: 80, startsAt: '2026-10-10', endsAt: '2026-12-31', active: true },
  { id: 'promo-004', name: 'Gracias por volver', code: 'VUELVE20', kind: 'Monto fijo', value: 'S/ 20', audience: 'Clientes inactivos', uses: 9, limit: 30, startsAt: '2026-09-01', endsAt: '2026-10-31', active: false },
];

export const initialEmailTemplates: DemoEmailTemplate[] = [
  { id: 'mail-order', event: 'Pedido recibido', subject: 'Ya recibimos tu pedido {{order}}', preview: 'Te contamos lo que sigue con tu compra.', active: true },
  { id: 'mail-paid', event: 'Pago confirmado', subject: 'Tu pedido ya está confirmado', preview: 'Estamos preparando las piezas que elegiste.', active: true },
  { id: 'mail-shipped', event: 'Pedido enviado', subject: 'Tu pedido está en camino', preview: 'Consulta el estado de tu envío con tu código de tracking.', active: true },
  { id: 'mail-delivered', event: 'Pedido entregado', subject: 'Tu pedido ROOTS ya llegó', preview: 'Esperamos que disfrutes tu nueva pieza.', active: true },
  { id: 'mail-stock', event: 'Stock bajo', subject: 'Quedan pocas unidades', preview: 'Revisa la disponibilidad por talla y color.', active: false },
];

export const initialEmailLogs: DemoEmailLog[] = [
  { id: 'EM-7821', templateId: 'mail-order', recipient: customerFor('cus-001').email, orderId: '#RT-1048', sentAt: '2026-10-27 10:43', status: 'Enviado' },
  { id: 'EM-7820', templateId: 'mail-paid', recipient: customerFor('cus-002').email, orderId: '#RT-1047', sentAt: '2026-10-27 09:19', status: 'Enviado' },
  { id: 'EM-7819', templateId: 'mail-order', recipient: customerFor('cus-003').email, orderId: '#RT-1046', sentAt: '2026-10-27 08:05', status: 'Pendiente' },
  { id: 'EM-7818', templateId: 'mail-shipped', recipient: customerFor('cus-004').email, orderId: '#RT-1045', sentAt: '2026-10-26 18:14', status: 'Enviado' },
  { id: 'EM-7817', templateId: 'mail-shipped', recipient: customerFor('cus-005').email, orderId: '#RT-1044', sentAt: '2026-10-26 16:55', status: 'Enviado' },
  { id: 'EM-7816', templateId: 'mail-delivered', recipient: customerFor('cus-006').email, orderId: '#RT-1043', sentAt: '2026-10-26 14:02', status: 'Fallido' },
  { id: 'EM-7815', templateId: 'mail-order', recipient: customerFor('cus-007').email, orderId: '#RT-1042', sentAt: '2026-10-24 18:21', status: 'Enviado' },
];

export const salesByDay = [
  { day: 'Lun', total: 1980, orders: 14 },
  { day: 'Mar', total: 2460, orders: 18 },
  { day: 'Mié', total: 1890, orders: 13 },
  { day: 'Jue', total: 3280, orders: 23 },
  { day: 'Vie', total: 2740, orders: 20 },
  { day: 'Sáb', total: 3960, orders: 29 },
  { day: 'Dom', total: 3150, orders: 24 },
];

export const seedInventoryMovements = [
  { id: 'MOV-2381', date: '2026-10-27 10:18', product: 'Graphic Wave', variant: 'Negro / M', change: -1, reason: 'Pedido #RT-1048', user: 'ROOTS Admin' },
  { id: 'MOV-2380', date: '2026-10-27 09:42', product: 'Hoodie Essential', variant: 'Piedra / L', change: -1, reason: 'Pedido #RT-1047', user: 'ROOTS Admin' },
  { id: 'MOV-2379', date: '2026-10-26 17:05', product: 'Star Tee', variant: 'Borgoña / S', change: 8, reason: 'Reposición de stock', user: 'ROOTS Admin' },
  { id: 'MOV-2378', date: '2026-10-26 12:31', product: 'Pantalón Relaxed', variant: 'Oliva / 32', change: -1, reason: 'Pedido #RT-1045', user: 'ROOTS Admin' },
];

export const demoLogo = '/assets/roots-concept-store-logo.png';
