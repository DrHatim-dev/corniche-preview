"use client";

import { useEffect, useState } from "react";
import useMotionEnvironment from "./useMotionEnvironment";

export default function useRotatingMedia(
  length: number,
  interval: number,
  enabled = true,
) {
  const [index, setIndex] = useState(0);
  const { reducedMotion, visible, saveData } = useMotionEnvironment();

  useEffect(() => {
    if (index >= length) {
      setIndex(0);
    }
  }, [index, length]);

  useEffect(() => {
    if (!enabled || reducedMotion || saveData || !visible || length < 2) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % length);
    }, interval);

    return () => window.clearTimeout(timer);
  }, [enabled, index, interval, length, reducedMotion, visible, saveData]);

  return index;
}
