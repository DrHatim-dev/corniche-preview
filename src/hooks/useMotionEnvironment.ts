"use client";

import { useEffect, useState } from "react";

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };

/** Keep media and animation loops in sync with live system preferences. */
export default function useMotionEnvironment() {
  const [environment, setEnvironment] = useState({ reducedMotion: true, visible: false, saveData: false });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    const update = () => setEnvironment({
      reducedMotion: query.matches,
      visible: !document.hidden,
      saveData: Boolean(connection?.saveData || /^(slow-)?2g$/.test(connection?.effectiveType ?? "")),
    });
    update();
    query.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    connection?.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      connection?.removeEventListener("change", update);
    };
  }, []);

  return environment;
}
