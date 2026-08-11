# Corniche introduction specification

## Targets

- `src/components/IntroOverlay.tsx`
- `src/components/IntroOverlay.module.css`
- `src/components/HeaderBrand.tsx`
- `src/components/icons.tsx`

## Interaction model

Preserve the existing time-driven character/word/logo reveal and click-driven
one-shot parallax exit exactly. Preserve header positioning and pointer
behavior.

## Content

- H1: `Corniche`
- Subtitle lines:
  - `Casablanca — Bord de mer`
  - `Sortons à nouveau !`
  - `Dress code élégant · Réservation recommandée`
- CTA: `Découvrir les expériences`
- CTA still completes the intro locally; do not navigate during the exit.
- Static background: `/images/corniche/hero.jpg`
- Remove the optional video branch and all video environment handling.
- H1 accessible label: `Corniche`
- Header home label: `Accueil — Corniche`
- Header wordmark: `/images/corniche/logo-footer.png`

## Six existing brand-mark slots

Use only these local Corniche assets and labels:

1. `/images/corniche/logo-footer.png` — `Corniche`
2. `/images/corniche/marion-logo.png` — `Marion`
3. `/images/corniche/amoramor-logo.png` — `Amor & Amor`
4. `/images/corniche/mesanueva-logo.png` — `Mesanueva`
5. `/images/corniche/louna-logo.png` — `Louna`
6. `/images/corniche/motif.png` — `Motif Corniche`

All anchors target `#experiences` in the same document. Remove external
partner URLs, target-blank behavior, and donor partner names.

## Styling

Keep every existing geometry, breakpoint, transition, duration, easing, and
z-index. Rename the donor display font family to `Corniche Display`. Remove
obsolete `.video` selectors. Content-specific logo widths may be tuned inside
the existing six slots without moving the row container.
