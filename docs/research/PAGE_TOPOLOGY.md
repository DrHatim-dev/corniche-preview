# Corniche experience topology

## Layer order

1. `DestinationCarousel` — full-viewport experience selector and image stage.
2. `HeaderBrand` — fixed lower-right Corniche wordmark.
3. `BusinessRail` — fixed right-edge reservation, membership, and information
   controls.
4. `BusinessDrawer` — modal reservation or information surface.
5. `IntroOverlay` — first-load Corniche hero and parallax reveal.
6. `CustomCursor` — pointer enhancement for fine-pointer devices.

## Interaction models

- Introduction: time-driven staggered entrance, then click-driven one-shot
  parallax exit.
- Carousel: wheel, touch, and keyboard driven with continuous wrapped
  positioning, damped movement, active color state, and image crossfade.
- Business rail: hover/focus motion and click-driven drawer selection.
- Drawers: click-driven local detail navigation with backdrop, close button,
  Escape, focus trap, focus return, and scroll containment.

## Responsive continuation

- Desktop retains the narrow right image stage and large editorial names.
- Tablet expands the image stage while retaining the vertical carousel.
- Mobile uses an 80% image stage, compact brand mark, 30px business controls,
  and a near-full-width information drawer.

The topology and motion primitives are intentionally unchanged from the
accepted interaction shell; only Corniche content and assets are present.
