# Corniche destination carousel specification

## Targets

- `src/components/DestinationCarousel.tsx`
- `src/components/DestinationCarousel.module.css`
- `src/types/home.ts`

## Interaction model

Preserve the exact infinite wheel, touch, keyboard, damping, wrap,
active-index, image crossfade, and reduced-motion behavior.

## Data

Import the authoritative `experiences` array from
`src/content/corniche.ts`. Map each entry to the existing destination
structure:

- id = slug
- label = name
- href = supplied Corniche URL
- colors = primary/secondary
- image and French alt = supplied local fields
- include exact tagline, descriptions, and opening hours in the link’s
  accessible content
- apply `labelScale` through a CSS custom property so long exact names fit
  without changing the carousel’s geometry

Do not render or reference the old restaurant/hotel marks.

## Accessibility and identifiers

- Main id: `experiences`
- Main label: `Expériences Corniche`
- Keep current item/page semantics and keyboard support.
- Add a reusable visually-hidden class for the exact tagline, descriptions,
  and hours.

## Styling

Keep all existing dimensions, responsive breakpoints, positioning, opacity,
and transitions. Replace the old image texture with
`/images/corniche/motif.png`, used subtly at the same layer. Rename the display
font family to `Corniche Display`.
