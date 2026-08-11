# Corniche behavior specification

## Introduction

- Corniche title letters reveal from below with the existing stagger.
- Subtitle words, CTA, and six Corniche marks follow the existing stagger.
- `Découvrir les expériences` performs the existing one-second split/parallax
  exit and then unlocks the experience carousel.
- The background is a static supplied Corniche photograph; no video element
  or remote media request is used.

## Experience carousel

- Mouse wheel, one-finger touch, Arrow Up, and Arrow Down move through all
  eight supplied concepts.
- The list wraps infinitely with the existing requestAnimationFrame damping.
- Active text, background color, business rail, and local image update
  together.
- Reduced motion snaps one item per intentional input.

## Business surfaces

- `Réserver` opens the reservation drawer.
- `Membership` opens the information drawer directly on Corniche Membership.
- `Infos` opens the six-item Corniche information index.
- Drawers close by close button, backdrop, or Escape; focus is trapped while
  open and restored afterward.
- Reservation and contact actions use the supplied telephone or supplied
  Corniche social links. No form, booking, payment, CV, or personal data is
  transmitted by this interface.
