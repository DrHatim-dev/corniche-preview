"use client";

import { useEffect, useState } from "react";

export default function useRotatingMedia(
  length: number,
  interval: number,
  enabled = true,
) {
  const [index, setIndex] = useState(0);
  const [motionAllowed, setMotionAllowed] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setMotionAllowed(!mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () =>
      mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIndex(0);
    }
  }, [enabled]);

  useEffect(() => {
    if (index >= length) {
      setIndex(0);
    }
  }, [index, length]);

  useEffect(() => {
    if (!enabled || !motionAllowed || length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setIndex((current) => (current + 1) % length);
      }
    }, interval);

    return () => window.clearInterval(timer);
  }, [enabled, interval, length, motionAllowed]);

  return index;
}
