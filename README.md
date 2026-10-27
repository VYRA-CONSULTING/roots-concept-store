# ROOTS — Concept Store

Editorial streetwear storefront built with React 19, TypeScript, Vite, Tailwind CSS 4 and GSAP ScrollTrigger.

```sh
npm install
npm run dev
npm run build
npm test
```

The development server defaults to http://localhost:5173. `npm run preview` serves the production build. For a fresh test environment, run `npx playwright install chromium` once. An existing browser can be used by setting `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable path.

## Features

- A short sticky clothing rail: four independently moving pieces exit and a reordered selection enters, driven by native document scroll.
- A two-composition horizontal graphic story on desktop; vertical sequence on mobile and with reduced motion.
- Four-product catalog, functional category filters, accent-insensitive search, hash-routed product details, graphic enlargement, size preferences and quantities.
- Persistent local bag: add, update, remove, subtotal calculation when actual prices exist, cross-tab sync, sanitized storage, empty and error states, copyable selection.
- Native accessible dialogs, keyboard focus containment, Escape dismissal, focus restoration, motion preference support and mobile navigation.
- Self-hosted fonts, one shared transparent garment asset, lazy secondary images, explicit image dimensions.

## Catalog and integration

`src/data/catalog.ts` is the editable source of product truth. The supplied references establish only the garments' visual appearance. Product names are descriptive editorial labels. Prices, currencies, real sizes, stock and materials remain `null` or explicitly pending. S–XL are **size preferences**, not inventory claims. Category labels describe the four supplied items, not a larger invented catalog.

`src/services/catalog.ts` is the replaceable asynchronous API boundary. `src/services/cart.ts` owns storage validation and subtotal behavior. Cart context is in `src/hooks/useCart.tsx`. Static hash routing keeps product links working without host rewrite configuration.

No payment provider, remote order creation, customer data submission or fabricated completed checkout exists. Instagram links open the supplied profile; no message is sent automatically. Commercial policy dialogs are explicitly pending. Privacy copy describes this build's actual browser-local storage.

## Images and remaining launch inputs

See `ASSETS.md`. The four original images were visible in chat but not provided as accessible local files. The hanging garments are **AI-assisted editorial derivatives**, clearly identified in the interface, and need replacement with approved original photographs before commercial launch. The original model photography was not recreated or misrepresented as original campaign photography.

To launch commerce, configure approved photos and product names, actual prices/currency, size charts and inventory, shipping/returns/privacy/terms, and a real backend/checkout. No live customer transaction is currently possible.

## Verification

`tests/storefront.spec.ts` exercises validation, bag updates and persistence, removal, category/search navigation, reduced motion, overflow and corrupt storage. `scripts/visual-qa.mjs` records desktop (1440×900), mobile (390×844), intermediate scroll states, product detail screenshots and browser errors under `.impeccable/review/`.

Real iOS/Android hardware was not available; mobile behavior was verified through Chromium emulation.
