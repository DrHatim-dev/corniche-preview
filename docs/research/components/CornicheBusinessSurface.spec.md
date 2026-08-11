# Corniche business rail and drawer specification

## Targets

- `src/components/BusinessRail.tsx`
- `src/components/BusinessDrawer.tsx`
- `src/components/BusinessDrawer.module.css`

## Interaction model

Preserve the fixed rotated rail, hover motion, drawer entrance/exit,
backdrop close, Escape close, focus trap, focus return, detail navigation,
and responsive geometry exactly.

## Rail

The three existing controls become:

1. `Réserver` — opens reservation
2. `Membership` — opens information directly at Membership
3. `Infos` — opens the information index

The middle control must remain a button within the same visual slot. Extend
the existing callback with an optional initial information detail; do not add
a new rail item.

## Reservation index

Use the three existing rows:

1. `Réserver une table` — `tel:+212520800200`
2. `Appeler Corniche` — `tel:+212520800200`
3. `Dress code élégant` — opens a local detail

The dress-code detail uses exact `contact`, `hero.heroNotice`, and `site`
content from `src/content/corniche.ts`.

## Information index

Map the six existing rows:

1. `Le complexe`
2. `Expériences`
3. `Events`
4. `Membership`
5. `Contact`
6. `Recrutement`

Each opens a local detail page using the exact exports from
`src/content/corniche.ts`. Detail content may contain multiple paragraphs and
lists inside the existing scrollable panel. Events includes the supplied La
Scène copy. Membership includes all six privileges. Contact includes the
supplied phone/address/notice and Corniche social links. Recruitment preserves
the supplied spelling.

## Styling

Keep the existing drawer/rail geometry and motion. Rename the donor display
font family to `Corniche Display`. Add only list/paragraph spacing needed
inside the existing detail panel. No donor booking, gift, press, hotel,
room, or garden text/URL remains.
