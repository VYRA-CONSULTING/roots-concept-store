import { test, expect } from '@playwright/test';
import { products } from '../src/data/catalog';
import { CART_KEY, getSubtotal, parseCart } from '../src/services/cart';

test('catalog → size validation → bag quantities → persistence → removal', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#producto/star-tee');
  await expect(page.getByRole('heading', { name: 'Star Tee', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'GUARDAR EN MI BOLSA', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Selecciona una talla de interés para guardar la prenda.');
  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: 'GUARDAR EN MI BOLSA', exact: true }).click();
  const bag = page.getByRole('dialog', { name: 'Tu bolsa (01)' });
  await expect(bag).toBeVisible();
  await expect(bag.getByText('Por confirmar', { exact: true })).toBeVisible();
  await bag.getByRole('button', { name: 'Aumentar cantidad de star tee', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Tu bolsa (02)' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Abrir bolsa, 2 prendas' }).click();
  await expect(page.getByRole('dialog').getByRole('group', { name: 'Cantidad de Star Tee' }).locator('output')).toHaveText('2');
  await expect(page.getByRole('dialog').getByText('Star Tee', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Eliminar Star Tee' }).click();
  await expect(page.getByText('Un espacio para')).toBeVisible();
  expect(errors).toEqual([]);
});

test('search, category filters, keyboard close and hash navigation', async ({ page, isMobile }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Buscar prendas' }).click();
  const search = page.getByRole('dialog', { name: 'Encuentra tu pieza.' });
  await search.getByRole('searchbox').fill('borgoña');
  await expect(search.getByRole('link')).toHaveCount(1);
  await expect(search.getByRole('link')).toContainText('Star Tee');
  await search.getByRole('searchbox').fill('nonexistent');
  await expect(search.getByText('No encontramos esa pieza.')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(search).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Buscar prendas' })).toBeFocused();
  if (isMobile) {
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await page.getByRole('navigation', { name: 'Navegación móvil' }).getByRole('link', { name: 'SHOP' }).click();
  } else await page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'SHOP', exact: true }).click();
  await page.getByRole('button', { name: 'Washed graphics', exact: true }).click();
  await expect(page.locator('.product-grid .product-card')).toHaveCount(1);
  await expect(page.locator('.product-grid')).toContainText('Get Different');
  await page.getByRole('button', { name: 'Todas las piezas', exact: true }).click();
  await expect(page.locator('.product-grid .product-card')).toHaveCount(4);
  await page.getByRole('link', { name: 'Ver detalles de Studios Tee' }).click();
  await expect(page).toHaveURL(/#producto\/studios-tee/);
  await expect(page.getByRole('heading', { name: 'Studios Tee', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('group', { name: 'Filtrar catálogo' })).toBeVisible();
});

test('reduced motion keeps both stories visible and avoids overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.rail-first')).toBeVisible();
  await expect(page.locator('.world-selection')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const images = await page.locator('img').evaluateAll(images => images.filter((image): image is HTMLImageElement => image instanceof HTMLImageElement && image.loading !== 'lazy').every(image => image.complete && image.naturalWidth > 0));
  expect(images).toBe(true);
});

test('cart rejects malformed persistence and preserves unknown totals', () => {
  expect(parseCart('broken', products)).toEqual([]);
  expect(parseCart(JSON.stringify([{ productId: products[0].id, requestedSize: 'M', quantity: -1 }, { productId: 'invalid', requestedSize: 'S', quantity: 1 }]), products)).toEqual([]);
  const lines = parseCart(JSON.stringify([{ productId: products[0].id, requestedSize: 'M', quantity: 999 }]), products);
  expect(lines[0].quantity).toBe(20);
  expect(getSubtotal(lines, products)).toBe(null);
  expect(getSubtotal([], products)).toBe(0);
  expect(getSubtotal([{ productId: 'priced', quantity: 3, requestedSize: 'L' }], [{ ...products[0], id: 'priced', price: 45, currency: 'PEN' }])).toBe(135);
  expect(CART_KEY).toBe('roots.bag.v1');
});

test('desktop rail completes and keyboard follows both world panels', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Mobile uses the simpler vertical story.');
  await page.goto('/');
  await page.evaluate(() => window.scrollTo({ top: 450, behavior: 'instant' }));
  const incoming = page.locator('.rail-second');
  await expect(incoming).toHaveAttribute('aria-hidden', 'false');
  await expect.poll(() => incoming.locator('a').evaluateAll(links => links.every(link => {
    const rect = link.getBoundingClientRect(); return rect.left >= -1 && rect.right <= window.innerWidth + 1;
  }))).toBe(true);
  await page.locator('.world-opening a').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('.world-mini-rail a').first()).toBeFocused();
  await expect.poll(() => page.locator('.world-sticky').evaluate(element => element.scrollLeft)).toBe(0);
  await expect.poll(() => page.locator('.world-mini-rail a').first().evaluate(element => {
    const rect = element.getBoundingClientRect(); return rect.left >= 0 && rect.right <= window.innerWidth;
  })).toBe(true);
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('.world-opening a')).toBeFocused();
  await expect.poll(() => page.locator('.world-opening a').evaluate(element => {
    const rect = element.getBoundingClientRect(); return rect.left >= 0 && rect.right <= window.innerWidth;
  })).toBe(true);
});
