"use client";

import { useEffect, useState } from "react";
import { responsiveImage } from "@/lib/media";

/** Hold the displayed frame until its replacement can be painted. */
export default function useDecodedMediaIndex(
  requestedIndex: number,
  sources: readonly string[],
  enabled = true,
  { sizes = "100vw", preloadNext = true }: { sizes?: string | ((src: string) => string); preloadNext?: boolean } = {},
) {
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const source = sources[requestedIndex];
  const nextSource = sources[(requestedIndex + 1) % sources.length];
  const currentSizes = typeof sizes === "function" ? sizes(source) : sizes;
  const nextSizes = typeof sizes === "function" ? sizes(nextSource) : sizes;

  useEffect(() => {
    if (!enabled || !source) return;
    let cancelled = false;
    const image = new Image();
    image.decoding = "async";
    const props = responsiveImage(source, currentSizes);
    if (props.sizes) image.sizes = props.sizes;
    if (props.srcSet) image.srcset = props.srcSet;
    image.src = props.src;
    image.decode().then(() => {
      if (!cancelled) setDisplayedIndex(requestedIndex);
    }).catch(() => {
      // Keep the last usable image when a request fails.
    });
    return () => { cancelled = true; };
  }, [enabled, requestedIndex, source, currentSizes]);

  useEffect(() => {
    if (!enabled || !preloadNext || !nextSource || displayedIndex !== requestedIndex) return;
    // The current image gets the connection first; warm only one replacement.
    const timer = window.setTimeout(() => {
      const image = new Image();
      image.decoding = "async";
      image.fetchPriority = "low";
      const props = responsiveImage(nextSource, nextSizes);
      if (props.sizes) image.sizes = props.sizes;
      if (props.srcSet) image.srcset = props.srcSet;
      image.src = props.src;
      image.decode().catch(() => undefined);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [enabled, nextSource, preloadNext, nextSizes, displayedIndex, requestedIndex]);

  return displayedIndex;
}
