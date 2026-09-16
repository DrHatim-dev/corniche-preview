"use client";

import { useEffect, useRef } from "react";
import styles from "./CustomCursor.module.css";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = cursorRef.current;
    if (!node) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previousTime = 0;
    let visible = false;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;

    const tick = (time: number) => {
      frame = 0;
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      const blend = 1 - Math.exp(-50 * delta);
      x += (targetX - x) * blend;
      y += (targetY - y) * blend;
      const settled = Math.abs(targetX - x) + Math.abs(targetY - y) < 0.1;
      if (settled) { x = targetX; y = targetY; }
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!settled) frame = requestAnimationFrame(tick);
    };

    const hide = () => {
      visible = false;
      node.classList.remove(styles.visible);
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onMove = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches || document.hidden || event.pointerType === "touch") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        x = targetX;
        y = targetY;
        node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        node.classList.add(styles.visible);
        visible = true;
      }
      const element = event.target instanceof Element ? event.target : null;
      node.classList.toggle(styles.active, Boolean(element?.closest("a, button, [role='button']")));
      if (!frame) {
        previousTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("mouseleave", hide);
    document.addEventListener("visibilitychange", hide);
    finePointer.addEventListener("change", hide);
    reducedMotion.addEventListener("change", hide);
    return () => {
      hide();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.removeEventListener("visibilitychange", hide);
      finePointer.removeEventListener("change", hide);
      reducedMotion.removeEventListener("change", hide);
    };
  }, []);

  return <div aria-hidden="true" className={styles.cursor} ref={cursorRef} />;
}
