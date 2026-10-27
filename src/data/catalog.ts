import type { Product } from '../types/catalog';

export const products: Product[] = [
  {
    id: 'arkad-wave', slug: 'graphic-wave', name: 'Graphic Wave', collection: 'Graphic essentials',
    category: 'graphic', color: 'Negro', swatch: '#252523', artworkIndex: 0,
    description: 'Una silueta amplia que deja hablar al gráfico. Negro, lettering de trazo libre y un acento de color al reverso. Una pieza para llevar a tu manera.',
    graphic: 'Lettering amarillo y violeta', price: null, currency: null, sizes: null, stock: null,
    imageKind: 'editorial-derived',
  },
  {
    id: 'arkad-studios', slug: 'studios-tee', name: 'Studios Tee', collection: 'Graphic essentials',
    category: 'graphic', color: 'Gris claro', swatch: '#c2c0bb', artworkIndex: 1,
    description: 'Gráfica de inspiración vintage, tipografía con carácter y una silueta relajada. El detalle está en la espalda; la actitud la pones tú.',
    graphic: 'Gráfica Studios con rueda alada', price: null, currency: null, sizes: null, stock: null,
    imageKind: 'editorial-derived',
  },
  {
    id: 'arkad-star', slug: 'star-tee', name: 'Star Tee', collection: 'Graphic essentials',
    category: 'graphic', color: 'Borgoña', swatch: '#751e25', artworkIndex: 2,
    description: 'Un gráfico que ocupa su espacio. Una estrella angular en contraste sobre borgoña y una caída amplia para construir el resto del look.',
    graphic: 'Estrella angular en tono crema', price: null, currency: null, sizes: null, stock: null,
    imageKind: 'editorial-derived',
  },
  {
    id: 'arkad-different', slug: 'get-different', name: 'Get Different', collection: 'Washed graphics',
    category: 'washed', color: 'Carbón', swatch: '#505151', artworkIndex: 3,
    description: 'Carbón, azul y un gráfico encendido. Una composición expresiva sobre una silueta amplia, pensada para ser el punto de partida de tu outfit.',
    graphic: 'Rueda azul y llamas rojas', price: null, currency: null, sizes: null, stock: null,
    imageKind: 'editorial-derived',
  },
];

export const categoryLabels = { all: 'Todas las piezas', graphic: 'Graphic tees', washed: 'Washed graphics' };
export const sizePreferences = ['S', 'M', 'L', 'XL'];
export const instagramUrl = 'https://www.instagram.com/roots.conceptstore/';
