# Corniche content map

## Non-negotiable shell

The existing full-screen interaction shell remains unchanged:

1. fixed animated introduction overlay;
2. one-shot parallax exit;
3. infinite wheel, touch, and keyboard carousel;
4. fixed three-control business rail;
5. animated reservation and information drawers;
6. fixed lower-right brand mark and custom cursor.

Only copy, imagery, logo assets, links, metadata, accessibility labels, and
content-driven colors change.

## Introduction overlay

- Title: `Corniche`
- Subtitle lines:
  - `Casablanca — Bord de mer`
  - `Sortons à nouveau !`
  - `Dress code élégant · Réservation recommandée`
- CTA: `Découvrir les expériences`
- Media: `/images/corniche/hero.jpg`; no video element or runtime video URL
- Existing six-mark row: canonical Corniche mark, four supplied concept marks,
  and the supplied Corniche motif; all links remain within the Corniche
  experience.

The hero intro paragraph and primary reservation CTA move into the existing
information and reservation surfaces because the accepted clone has one hero
button and no body-copy slot.

## Destination carousel

The eight authoritative `experiences` entries from
`src/content/corniche.ts` replace the six donor destinations, in the supplied
order. Each destination keeps the same carousel item/image structure and
motion. Its existing link contains:

- visible exact concept name;
- accessible exact tagline, verbatim description, and exact opening hours;
- local Corniche image with a French alt;
- Corniche page URL from the supplied original HTML;
- content-driven dark palette and title scale for long exact names.

La Scène remains within Events, matching the authoritative deck.

## Business rail

- `Réserver` opens the existing reservation drawer.
- `Membership` opens the existing information drawer on Membership.
- `Infos` opens the existing information drawer index.

## Reservation drawer

The three existing actions become:

1. `Réserver une table` — supplied Corniche phone link;
2. `Appeler Corniche` — supplied Corniche phone link;
3. `Dress code élégant` — opens the existing local detail panel.

The detail panel uses the supplied reservation notice, contact text, address,
and telephone number.

## Information drawer

The six existing entries map one-to-one to the supplied navigation:

1. `Le complexe`
2. `Expériences`
3. `Events`
4. `Membership`
5. `Contact`
6. `Recrutement`

Each opens the existing detail panel with word-for-word supplied copy.
Events includes La Scène. Membership includes all six exact privileges.
Contact includes address, telephone, reservation notice, and Corniche social
links. Recruitment preserves the original supplied spelling.

## Brand and metadata

- Fixed header: `/images/corniche/logo-footer.png`
- Canonical light-background logo: `/images/corniche/logo.svg`
- Favicon: `/images/corniche/favicon-192.jpg`
- Page title: `Corniche | Casablanca — Bord de mer`
- Description and Open Graph description: exact `hero.intro`
- Open Graph image: `/images/corniche/hero.jpg`
- Document language: `fr`

## Asset policy

All runtime files live under `/public/images/corniche/`. No runtime source
points to a local machine path. Donor media, marks, favicons, and branded font
aliases are removed after all references are replaced. The existing display
font is retained under a neutral Corniche alias solely to preserve the
accepted clone geometry.
