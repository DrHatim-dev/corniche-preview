# Motion and media performance

Updated 2026-09-16. The GitHub Pages build remains a static export.

## Media pipeline

Original photographs and clips remain untouched. `scripts/optimize-media.cjs` creates content-addressed WebP variants and silent H.264 MP4 clips under `public/assets/corniche/optimized/`, plus `src/content/media-manifest.json`. The derived assets are committed, so Pages does not need a media encoder.

The preparation script uses the installed Sharp/TypeScript packages and the executable named by `CORNICHE_FFMPEG`. Its versioned hash must change if encoding settings change. `media-optimization-summary.json` records the conversion totals.

- 110 image sources: 44.91 MB originally; 11.72 MB for their largest generated variants.
- 18 clips: 21.69 MB originally; 9.57 MB after encoding, preserving frame rate and adding MP4 fast-start metadata.
- Images use responsive WebP sources with dimensions. Full-height cover crops are sized by both width and height to avoid blurry mobile photographs.
- The intro does not request the restaurant photos behind it. Its video starts after the initial document load.
- Restaurant galleries mount only current/outgoing media and warm one replacement. Below-fold photos, video sources, and posters are deferred.
- Videos pause offscreen, in hidden tabs, and when reduced motion is enabled. Data Saver / slow-2G / 2G connections receive posters instead of autoplaying clips.

## Motion

Cursor and carousel loops stop when settled. Pointer movement changes transforms rather than top/left. Wheel input is normalized and gently snaps; current images remain displayed while replacements decode. Shared easing does not overshoot. Drawer transitions can reverse during entry.

## Verification

TypeScript and the production Pages export passed. Browser checks cover desktop, touch navigation, all six restaurant routes, drawers, reduced motion, delayed image decoding, background media, and Data Saver. Screenshots were visually inspected.

Uncached local mobile loading comparison (390 × 844, DPR 2, identical load + 2.5-second sampling window, local HTTP without compression):

| Page | Before media optimization | After |
| --- | ---: | ---: |
| Homepage | 7.27 MB | 1.20 MB |
| Marion | 3.04 MB | 1.19 MB |
| Louna | 1.25 MB | 0.69 MB |

The original published pointer/wheel baseline performed 399 layout recalculations; the final local build performed 6 in the same 40-step sequence. No runtime errors, failed asset requests, or layout shifts were observed in the final local regression checks. These are reproducible lab observations, not field Core Web Vitals or guarantees for every device/network.

Reference guidance: [video loading](https://web.dev/articles/lazy-loading-video), [Next.js link prefetching](https://nextjs.org/docs/app/api-reference/components/link).
