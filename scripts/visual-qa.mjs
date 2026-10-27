import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const out = '.impeccable/review';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH });
const findings = [];
for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const label = viewport.width === 1440 ? 'desktop' : 'mobile';
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${out}/${label}-hero.png` });
  // Warm lazy images without changing the captured document position.
  await page.locator('img').evaluateAll(images => images.forEach(image => image.loading = 'eager'));
  await page.waitForFunction(() => Array.from(document.images).every(image => image.complete));
  await page.screenshot({ path: `${out}/${label}.png`, fullPage: true });
  if (label === 'desktop') {
    await page.evaluate(() => window.scrollTo({ top: 290, behavior: 'instant' }));
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `${out}/desktop-rail-mid.png` });
    await page.evaluate(() => window.scrollTo({ top: 450, behavior: 'instant' }));
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `${out}/desktop-rail-end.png` });
    await page.evaluate(() => { const world = document.getElementById('world'); window.scrollTo({ top: (world?.offsetTop ?? 0) + 420, behavior: 'instant' }); });
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `${out}/desktop-world-mid.png` });
  }
  await page.goto('http://127.0.0.1:5173/#producto/star-tee', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${out}/${label}-product.png`, fullPage: true });
  findings.push({ viewport, errors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), imageCount: await page.locator('img').count() });
  await page.close();
}
await browser.close();
await writeFile(`${out}/browser-findings.json`, JSON.stringify(findings, null, 2));
console.log(JSON.stringify(findings, null, 2));
