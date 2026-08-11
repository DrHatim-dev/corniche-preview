# Corniche media enrichment specification

## Overview

- **Targets:** `src/content/corniche.ts`, `src/types/home.ts`,
  `src/components/DestinationCarousel.tsx`,
  `src/components/DestinationCarousel.module.css`,
  `src/components/IntroOverlay.tsx`,
  `src/components/IntroOverlay.module.css`, and `src/app/layout.tsx`.
- **Reference:** the existing full-screen editorial clone shell already
  implemented in this project.
- **Interaction model:** the page-level carousel remains wheel-, touch-, and
  keyboard-driven. Media inside the existing hero and destination image stages
  may rotate with a time-driven crossfade.
- **Scope:** enrich image content only. Do not change page topology, carousel
  geometry, right rail, drawers, header, typography, cursor, transition
  timings, or component order.

## Existing geometry to preserve exactly

### Intro

- Fixed full-screen `100svh` overlay.
- Existing character/word/logo reveal and one-shot parallax exit.
- Existing copy frame, CTA, partner row, z-indexes, and responsive breakpoints.

### Destination carousel

- Full-screen `100svh` root with infinite vertical label movement.
- Image stage:
  - below 768px: `80vw × 100svh`
  - 768–1279px: `69vw × 100svh`
  - 1280px and above: `31.25vw × 100svh`
- Existing destination-stage crossfade: opacity, `1s`,
  `cubic-bezier(0.22, 1.1, 0.48, 1)`.
- Existing wheel factor, touch factor, damping, wrap, label scale, focus, and
  reduced-motion behavior.

## Data contract

Add a shared media-frame type:

```ts
type MediaFrame = {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  position?: string;
};
```

Each experience keeps its current primary `image` and `imageAlt` fields for
compatibility and adds a non-empty `gallery: readonly MediaFrame[]`.
`Destination` carries the gallery unchanged.

Use the already-curated official Corniche gallery mapping from the sibling
workspace app. It includes:

- Marion: 11 frames
- Aï-Ku: 3 frames
- Sunset: 4 frames
- Amor & Amor: 4 frames
- Mesa Nueva: 2 frames
- Louna: 2 frames
- Kiki: 4 frames
- Tagine Beverly Hills: 3 frames
- La Scène: 4 frames

Add La Scène as the ninth destination because it is a required Corniche
concept. Keep every existing French description and URL policy.

## Destination media behavior

- Crossfade only inside the existing `.imageItem`; never add another visible
  page region or carousel control.
- Reset the internal gallery index to zero whenever the active destination
  changes.
- Rotate only while that destination is active, the document is visible, and
  reduced motion is not requested.
- Interval: approximately 5.8 seconds.
- Inner frame crossfade: approximately 1 second using the existing easing
  family.
- Keep at most the current and outgoing frames mounted for the active
  destination. Do not eagerly mount every gallery frame.
- Inactive destinations may retain only their first lazy-loaded frame so the
  existing outer destination transition stays ready.
- Only the current visible frame exposes its French alt text. Outgoing and
  inactive frames use empty alt text and `aria-hidden`.
- `cover` remains the default. `contain` artwork uses the same image stage with
  a dark, concept-colored backing and restrained internal padding.
- Apply each curated `object-position` value directly.

## Intro media behavior

- Replace the single static hero image with the curated six-frame official
  Corniche hero set.
- Use responsive `<picture>` sources so the desktop and mobile crops are
  independently selected.
- Keep the existing `.mediaLayer` container, full-screen crop, reveal timing,
  CTA, and parallax exit unchanged.
- Crossfade every approximately 6.4 seconds only when the document is visible
  and reduced motion is not requested.
- The intro media is decorative because the visible copy names Corniche, so
  every hero frame remains `alt=""` and `aria-hidden`.

## Brand marks and metadata

- Replace the existing curated brand marks with the official local library
  versions where available, without moving the six slots.
- Keep the curated Mesa Nueva mark because no newer source mark is available.
- Favicon: official Corniche favicon.
- OG/Twitter image:
  `/assets/corniche/production/corniche-og-1200x630.webp`.
- No remote image URL may be used at runtime.

## Responsive behavior

- Preserve the existing 1024px and 1280px carousel rules and every intro
  breakpoint.
- At 390×844 and 320×700, no horizontal page overflow is permitted.
- Portrait-safe focal positions must keep people, tables, and key interiors in
  frame in the narrow stage.
- Contained posters/logos must remain fully visible.

## Verification

- `npm run typecheck`
- `npm run build`
- Browser QA at desktop and 390px mobile.
- Intro CTA removes the overlay and reveals the carousel.
- Wheel or ArrowDown advances through all nine concepts.
- A gallery frame changes while the active concept label remains unchanged.
- Reservation/information drawers still open and close unchanged.
- All rendered image URLs return 2xx/304; no console errors or framework
  overlay.
