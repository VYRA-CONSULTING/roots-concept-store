import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

async function openSection(page: Page, isMobile: boolean, section: string) {
  if (isMobile) await page.getByRole('button', { name: 'Abrir navegación' }).click();
  await page.getByRole('navigation', { name: 'Navegación administrativa' }).getByRole('button', { name: section }).click();
}

test('admin has a populated demonstration dashboard and all requested navigation', async ({ page }) => {
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
  await expect(page.getByText('Simulación ROOTS · los datos visibles son de demostración')).toBeVisible();
  await expect(page.getByText('S/ 1,460')).toBeVisible();
  const nav = page.getByRole('navigation', { name: 'Navegación administrativa' });
  for (const section of ['Dashboard', 'Productos', 'Colecciones', 'Inventario', 'Pedidos', 'Envíos', 'Clientes', 'Promociones', 'Notificaciones', 'Reportes', 'Configuración']) {
    await expect(nav.getByRole('button', { name: new RegExp(section) })).toBeVisible();
  }
  await expect(page.getByText('Aún sin datos')).toHaveCount(0);
  await expect(page.getByText('Por configurar')).toHaveCount(0);
});

test('products can be added, duplicated, variant stock adjusted and archived with confirmation', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Product editing interactions are covered in the desktop project.');
  await page.goto('/admin');
  await openSection(page, false, 'Productos');
  await expect(page.getByRole('table').getByText('Graphic Wave')).toBeVisible();
  await expect(page.getByRole('table').getByText('S/ 129')).toBeVisible();
  const productRow = page.getByRole('row').filter({ has: page.getByText('Graphic Wave', { exact: true }) });
  await productRow.getByRole('button', { name: /variantes/ }).click();
  const variants = page.getByRole('dialog', { name: 'Variantes · Graphic Wave' });
  await variants.getByRole('button', { name: 'Sumar stock S' }).click();
  await expect(page.getByRole('status')).toContainText('Inventario de variantes actualizado.');
  await variants.getByRole('button', { name: 'Cerrar' }).click();

  await page.getByRole('button', { name: 'Agregar' }).click();
  const createDialog = page.getByRole('dialog', { name: 'Agregar producto' });
  await createDialog.getByLabel('Nombre del producto').fill('Crewneck Demostración');
  await createDialog.getByRole('button', { name: 'Guardar producto' }).click();
  await expect(page.getByRole('table').getByText('Crewneck Demostración')).toBeVisible();

  await productRow.getByRole('button', { name: 'Duplicar Graphic Wave' }).click();
  await expect(page.getByRole('table').getByText('Graphic Wave (copia)')).toBeVisible();

  await productRow.getByRole('button', { name: 'Archivar Graphic Wave' }).click();
  const archiveDialog = page.getByRole('dialog', { name: 'Archivar producto' });
  await expect(archiveDialog.getByText('Dejará de aparecer como activo')).toBeVisible();
  await archiveDialog.getByRole('button', { name: 'Archivar producto' }).click();
  await expect(productRow.getByText('Archivado')).toBeVisible();
});

test('orders can be filtered, opened and updated with shipment tracking', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Order detail editing is covered in the desktop project.');
  await page.goto('/admin');
  await openSection(page, isMobile, 'Pedidos');
  const row = page.getByRole('row').filter({ hasText: '#RT-1046' });
  await row.click();
  const dialog = page.getByRole('dialog', { name: 'Pedido #RT-1046' });
  await expect(dialog.getByText('Star Tee')).toBeVisible();
  await dialog.getByLabel('Número de tracking').fill('OLV-PE-DEMO-1046');
  await dialog.getByLabel('Estado del pedido').selectOption({ label: 'Pago confirmado' });
  await dialog.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(page.getByRole('row').filter({ hasText: '#RT-1046' }).getByText('Pago confirmado')).toBeVisible();
  await expect(dialog.getByText('Cambios guardados en esta demostración.')).toBeVisible();
});

test('shipment and customer pages show usable demo records', async ({ page, isMobile }) => {
  await page.goto('/admin');
  await openSection(page, isMobile, 'Envíos');
  await expect(page.getByRole('table').getByText('OLV-PE-784231')).toBeVisible();
  await expect(page.getByRole('table').getByText('Olva Courier').first()).toBeVisible();
  await openSection(page, isMobile, 'Clientes');
  await expect(page.getByRole('table').getByText('Valeria Rojas')).toBeVisible();
  await expect(page.getByRole('table').getByText('VIP').first()).toBeVisible();
});

test('notifications simulate mail delivery without contacting recipients', async ({ page, isMobile }) => {
  await page.goto('/admin');
  await openSection(page, isMobile, 'Notificaciones');
  await expect(page.getByRole('img', { name: 'ROOTS Concept Store' }).first()).toBeVisible();
  await expect(page.getByText('No se envían correos reales ni se contacta con clientes.')).toBeVisible();
  const pendingLog = page.getByRole('row').filter({ hasText: '#RT-1046' });
  await pendingLog.getByRole('button', { name: 'Simular envío' }).click();
  await expect(pendingLog.getByText('Enviado')).toBeVisible();
});

test('admin mobile navigation works without horizontal page overflow', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Responsive navigation is covered in the mobile project.');
  await page.goto('/admin');
  await openSection(page, isMobile, 'Configuración');
  await expect(page.getByRole('heading', { name: 'Configuración', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
