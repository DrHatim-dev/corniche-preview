"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);
  const previousTime = useRef<number | null>(null);
  const visibleRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const tick = (time: number) => {
      const node = cursorRef.current;
      const previous = previousTime.current ?? time;
      const delta = Math.min((time - previous) / 1000, 0.1);
      const blend = 1 - Math.exp(-50 * delta);
      current.current.x += (pointer.current.x - current.current.x) * blend;
      current.current.y += (pointer.current.y - current.current.y) * blend;
      if (node) {
        node.style.left = `${current.current.x}px`;
        node.style.top = `${current.current.y}px`;
      }
      previousTime.current = time;
      frame.current = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };
      if (!visibleRef.current) {
        current.current = pointer.current;
        visibleRef.current = true;
        setVisible(true);
      }
      const element = event.target instanceof Element ? event.target : null;
      setActive(Boolean(element?.closest("a, button, [role='button']")));
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    frame.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={[
        styles.cursor,
        visible ? styles.visible : "",
        active ? styles.active : "",
      ]
        .filter(Boolean)
        .join(" ")}
      ref={cursorRef}
    />
  );
}
