---
name: ROOTS Concept Store
description: A premium streetwear showroom in warm studio gray, compressed editorial type and vermilion.
colors:
  paper: "#eeede8"
  ink: "#171816"
  red: "#c33529"
  muted: "#62635d"
  line: "#c9c9c0"
  catalog: "#f6f5f0"
  garment: "#e5e5dc"
  world-dark: "#20241f"
  world-light: "#d9ddcd"
  primary-hover: "#35392e"
typography:
  display:
    fontFamily: "'Archivo Variable', sans-serif"
    fontSize: "clamp(100px, 10.8vw, 174px)"
    fontWeight: 880
    lineHeight: 0.82
    letterSpacing: "-0.04em"
    fontVariation: "'wdth' 69"
  headline:
    fontFamily: "'Archivo Variable', sans-serif"
    fontSize: "clamp(64px, 7.6vw, 112px)"
    fontWeight: 880
    lineHeight: 0.87
    letterSpacing: "-0.04em"
    fontVariation: "'wdth' 75"
  title:
    fontFamily: "'Archivo Variable', sans-serif"
    fontSize: "16px"
    fontWeight: 650
    letterSpacing: "-0.025em"
  body:
    fontFamily: "'Manrope Variable', sans-serif"
    fontSize: "12px"
    fontWeight: 450
    lineHeight: 1.8
  label:
    fontFamily: "'Manrope Variable', sans-serif"
    fontSize: "10px"
    fontWeight: 750
    letterSpacing: "0.04em"
  wordmark:
    fontFamily: "'Archivo Variable', sans-serif"
    fontSize: "44px"
    fontWeight: 950
    lineHeight: 1
    letterSpacing: "-0.065em"
    fontVariation: "'wdth' 85"
rounded:
  square: "0px"
  circle: "50%"
spacing:
  gutter: "clamp(24px, 4.2vw, 72px)"
  mobile-gutter: "24px"
  card-gap: "22px"
  mobile-card-column-gap: "14px"
  mobile-card-row-gap: "30px"
  modal-inset: "30px"
  mobile-modal-inset: "22px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "17px 23px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "17px 23px"
  circle-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    width: "67px"
    height: "67px"
  product-card:
    backgroundColor: "{colors.garment}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
  search-field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
  filter-tab:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    height: "36px"
  navigation:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    height: "82px"
  dialog:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "30px"
---

# Design System: ROOTS Concept Store

## Overview

**Creative North Star: "The Independent Streetwear Showroom"**

Premium streetwear is presented with the scale and restraint of an editorial spread: heavy compressed lettering, warm studio neutrals, a single red accent and photographic garment silhouettes. The physical clothing rail and graphic detail story are the implemented signature expressions of this world. Small, precise interface labels let the clothing carry visual complexity.

The confirmed direction comes from PRODUCT.md and the surface brief. This document captures the shipped code; it does not assert an original brand identity or verified commercial catalog. The header wordmark is a typographic treatment, not an authenticated original logo. Actual brand photographs and commercial facts remain pending.

**Key Characteristics:**

- Heavy variable sans display typography with compact line spacing.
- Warm monochrome surfaces, vermilion emphasis and thin structural rules.
- Unboxed garments, staggered catalog rhythm and large editorial compositions.
- Scroll-driven desktop storytelling with a static, stacked mobile alternative.
- Square controls, circular directional cues and visible keyboard focus.

## Colors

Warm paper and near-black form the base; red supplies deliberate emphasis while the clothing supplies other colors. Frontmatter values are normative and mirror the source stylesheet.

### Primary

- **Vermilion:** the red token marks headline emphasis, brand bands, the wordmark dot, selection color, progress and focus. It is a strong field color in the statement section as well as a small interface accent.

### Neutral

- **Studio Paper:** page, navigation and dialog base.
- **Printing Ink:** primary text, dark buttons, announcement and footer base.
- **Quiet Gray:** supporting catalog labels and pending commercial information.
- **Pencil Rule:** dividers between navigation, lists, dialogs and product details.
- **Catalog Paper / Garment Gray:** lighter catalog ground and the first product image field. Other image fields use observed warm gray and sage variations rather than separate colorful cards.
- **Graphic Dark / Graphic Light:** the deep green-black and pale sage editorial panels; these are supporting neutrals, not additional brand accents.

**The Product Color Rule.** Keep interface colors within the established warm neutral and red world; let garment graphics provide the broader palette.

## Typography

**Display Font:** self-hosted Archivo Variable, sans-serif fallback. **Body Font:** self-hosted Manrope Variable, sans-serif fallback. Both are loaded through Fontsource with font-display swap. There is no mono family.

Archivo's installed font advertises weight 100â€“900 and width 62%â€“125%. CSS requests weight 880 for primary headings, 650 for product names, 750â€“900 for supporting displays and 950 for wordmarks; the wordmark request exceeds the advertised weight range and resolves at the available maximum. Keep the requested source value visible when editing rather than claiming a separate 950 master. Manrope's base weight is 450; interface emphasis uses 600, 650, 700 and 750.

### Hierarchy

- **Display:** the frontmatter captures the desktop hero at widths above 1100px. Its width axis is 69, with final word spacing .075em. At 769â€“1100px its size becomes 13.1vw; at 1600px and above it is 174px. On phones it becomes clamp(73px, 14.8vw, 110px), line height .86 and width axis 68; 520â€“768px uses 15vw.
- **Headline:** catalog headings use the headline token; mobile sizes are clamp(51px, 10vw, 75px), line height .9 and width axis 68. Other editorial headings tune width axes from 65 to 80 for their compositions.
- **Title:** product names use the title token; mobile cards use 14px, rising to 18px in the intermediate tablet range. Dialog headings use 31px/1.05, weight 750; mobile uses 27px.
- **Body:** copy is generally 12px with line heights 1.7â€“1.9. The product description is constrained to 420px. Search input text is 16px to avoid mobile zoom.
- **Label:** calls to action use the label token. Micro labels use 10px/1.5, weight 650 and .035em tracking; compact editorial annotations vary from 6px to 9px at mobile sizes. Preserve hierarchy without promoting these annotations into essential body copy.
- **Wordmark:** lowercase Archivo with a red dot, a small Manrope superscript and width axis 85. Mobile header size is 38px; footer size is 76px, reduced to 62px on smaller layouts.

**The Editorial Hierarchy Rule.** Use Archivo for statements and product titles, Manrope for navigation, descriptions and controls. Preserve strong scale contrast and short display lines.

## Layout

The page runs full width with the fluid gutter token; there is no global centered maximum-width container. Body minimum width is 320px. The header is sticky, with an 82px desktop height and a separate 27px announcement strip; mobile values are 70px and 24px. Anchor scroll padding is 105px desktop and 85px mobile.

Desktop catalog is four equal columns with the card-gap token. Alternate cards sit 50px lower. At 768px and below it becomes two columns using the mobile gap tokens and a 28px stagger. Product detail uses 1.15fr / 1fr columns with a 9% gap, dropping to a single column on phones. The 520â€“768px range restores a compact two-column detail layout. Collections, editorial compositions and footer use purpose-built grids rather than a repeated card template.

Breakpoints in the source are 520px, 768px, 769px, 1100px and 1600px. Mobile has a full-screen navigation dialog, reduced supporting copy, larger relative garments and no sticky scroll passages. The 769â€“1100px range tightens navigation, hero copy and column gaps. Large screens add hero headroom without enlarging its type past 174px.

The desktop rail uses a sticky stage and a scroll section of calc(100svh + 320px), with a 1050px minimum. The final stage height is calc(100svh - 109px), with its existing 640px minimum and 950px maximum. The graphic story uses 185svh with a 1100px minimum and two viewport-wide panels in a sticky frame. Maintain these bounds when changing garment dimensions so controls stay visible.

## Elevation & Depth

The interface is flat. Thin borders, contrasting section grounds, overlap, crop and typographic scale establish depth; cards and buttons do not float on shadows. Image-specific drop shadows ground the large editorial garments: the dark story uses drop-shadow(-18px 25px 30px #0004), and the main lookbook uses drop-shadow(10px 20px 18px #0002). These are garment effects, not generic container elevation.

Native dialogs use a translucent dark backdrop with a 3px blur. Their position and backdrop provide the overlay hierarchy without rounded floating panels.

## Shapes

Controls, image fields and dialogs have square corners. Circular bag counts, color swatches and directional links are the deliberate exceptions. Most dividing rules are 1px. Garment silhouettes remain transparent and unframed in editorial passages; catalog imagery sits in square-corner gray fields. Avoid cropping away garment prints when adapting a composition.

## Components

### Buttons and directional links

Primary actions are ink on paper reversed to paper text, with a 53px minimum height and the primary padding token. Outline actions use a 1px ink border. Fine-pointer hover changes the dark fill to the primary-hover token or gives the outline a pale gray fill. Active buttons scale to .98. Disabled buttons use opacity .35 and a not-allowed cursor. Links underline on hover where implemented. Global focus is a 2px red outline offset by 5px.

The circle link is a thin outlined arrow target; the hero uses a 57px variant and a 43px phone variant. Fine-pointer hover rotates it 8 degrees. Icon buttons use a 42px square target. Keep Lucide icons as functional SVGs rather than a second icon system.

### Navigation and filters

Quiet uppercase desktop links leave the wordmark and clothing dominant. Desktop navigation disappears at 768px. Search, a bag count and a mobile menu trigger remain. Filters are text tabs with muted defaults, an ink selected state and a 1px selected underline; they are not filled pill chips.

### Product cards and imagery

Cards have no outer border or shadow. A gray image plane contains the garment, number, small descriptive tag and corner open action. Titles, color and the pending price label sit below. Fine-pointer hover enlarges the garment to 1.045 and rotates it -2 degrees, while the corner action reverses to ink. Product detail supports deliberate image zoom to scale 1.85 with a -4% vertical shift.

All shipped garment imagery comes from the same transparent editorial sprite, `/assets/arkad-editorial-rail-v2.png` (2172 Ã— 724 RGBA). Garment.tsx measures segment boundaries at 0, 570, 1084, 1588 and 2172, rather than assuming four equal cells; final display aspect ratio is 543/674. The source derives from the four user-supplied ARKAD references through Imagegen. It is labeled as editorial visualization, not original brand photography. Preserve the full provenance in ASSETS.md and replace with authenticated originals when supplied. Eager hero images and lazy secondary imagery share descriptive alternative text and an image-error fallback.

### Fields, quantity and product facts

Search is a 16px transparent input on a bottom rule; focus-within turns that rule red. Quantity is a square bordered group with a numeric output, decrement and increment buttons; limits are 1â€“20. Size-of-interest controls use bordered squares and an ink selected state. Size interest is a preference, not confirmed availability. Error and copy-status messages are inline; there is no toast system.

### Dialogs and local selection

Search, bag, menu and information use native dialog/showModal, retaining browser focus containment, Escape handling and focus restoration. Close controls and backdrop clicks dismiss the dialog; document scrolling is locked while open. The standard dialog is at most 640px wide with 30px inner padding; mobile uses 22px. The bag is a right-aligned, full-height 500px drawer on desktop and full-width on mobile, with bottom safe-area padding. The mobile menu fills the viewport.

Bag lines and requested size preferences persist only in browser localStorage under `roots.bag.v1`, with cross-tab synchronization and an inline storage failure message. There is no independent persisted preference service, remote order, payment or checkout. Prices, sizes, inventory, shipping and policies stay explicitly pending. Copying a selection provides status feedback and the Instagram action opens the supplied external profile.

### Clothing rail and graphic scroll story

GSAP enables the two scroll sequences only at widths of at least 769px with no reduced-motion preference. The rail exchanges two garment banks with scrub .6, individual translation/rotation and .055 stagger; the visible bank owns interaction and the hidden bank is inert and aria-hidden. Progress and the counter track the passage. The graphic track translates horizontally with scrub .7; the oversized print has a separate scrub 1 scale/rotation response. Keyboard focus brings the corresponding graphic panel into view.

CSS feedback uses 180ms color/background transitions, 120ms active transform, 200â€“250ms link feedback, 450â€“600ms garment hover transforms and the source ease-out curve. Dialog entrance uses 220ms and a 12px rise; the bag uses a 280ms horizontal entrance with its drawer curve. These are entrances, not guaranteed animated exits.

At prefers-reduced-motion: reduce, smooth scrolling becomes immediate, CSS animation is disabled and transitions become .01ms. Both scroll passages become normal document flow, the second rail bank disappears and the graphic panels stack. Mobile uses the static first rail and stacked panels even without reduced motion. Deliberate product zoom remains available.

## Do's and Don'ts

### Do:

- **Do** retain the warm neutral and red palette with garment-led color.
- **Do** preserve compressed Archivo statements and precise Manrope interface type.
- **Do** keep square controls, thin rules, transparent garment silhouettes and clear focus states.
- **Do** retain stacked mobile and reduced-motion alternatives to the desktop scroll story.
- **Do** preserve editorial-image attribution and explicit pending commercial facts.

### Don't:

- **Don't** present the typographic wordmark as an authenticated original logo.
- **Don't** describe the derived garment sprite as original brand photography.
- **Don't** invent prices, stock, material claims, launch dates or completed transactions.
- **Don't** replace flat editorial surfaces with rounded, shadowed card stacks.
- **Don't** enable the desktop scroll passages on mobile or for reduced-motion users.

