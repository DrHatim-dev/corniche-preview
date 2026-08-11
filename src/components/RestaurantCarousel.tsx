"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryFrame } from "@/content/restaurants";
import styles from "./RestaurantCarousel.module.css";

// Rythme volontairement rapide : le fondu se voit à peine, l’image suivante
// arrive avant que l’œil ne s’installe.
// Le héros défile deux fois plus vite que la galerie : il accroche à l’arrivée,
// alors que la galerie se regarde.
const INTERVAL_HERO_MS = 1500;
const INTERVAL_STAGE_MS = 2400;
const FADE_HERO_MS = 380;
const FADE_STAGE_MS = 420;
// Un clip garde la main le temps d’être vu, sans immobiliser la page.
const VIDEO_HOLD_MS = 6000;

type Props = {
  frames: readonly GalleryFrame[];
  variant: "hero" | "stage";
  label: string;
};

export function RestaurantCarousel({ frames, variant, label }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const go = useCallback(
    (next: number) => {
      setIndex((current) => {
        const total = frames.length;
        return (next + total) % total;
      });
    },
    [frames.length],
  );

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const isStage = variant === "stage";
  const fadeMs = isStage ? FADE_STAGE_MS : FADE_HERO_MS;
  // Un clip a besoin de son temps : on laisse la vidéo se dérouler avant
  // d’enchaîner, alors qu’une photo garde le rythme court.
  const activeIsVideo = frames[index]?.type === "video";
  const intervalMs = activeIsVideo
    ? VIDEO_HOLD_MS
    : isStage
      ? INTERVAL_STAGE_MS
      : INTERVAL_HERO_MS;

  useEffect(() => {
    if (frames.length < 2 || paused || reducedMotion.current) return;
    const timer = window.setTimeout(() => {
      if (document.hidden) return;
      setIndex((current) => (current + 1) % frames.length);
    }, intervalMs);
    return () => window.clearTimeout(timer);
  }, [frames.length, paused, intervalMs, index]);

  // Lecture réservée au cadre actif : rien ne tourne en fond.
  useEffect(() => {
    videoRefs.current.forEach((video, frameIndex) => {
      if (!video) return;
      if (frameIndex === index && !reducedMotion.current) {
        const attempt = video.play();
        if (attempt) attempt.catch(() => undefined);
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [index]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    }
  };

  const stack = (
    <div
      className={isStage ? styles.stage : styles.heroStage}
      style={
        {
          "--carousel-fade": `${fadeMs}ms`,
          "--carousel-cycle": `${intervalMs}ms`,
        } as React.CSSProperties
      }
      aria-roledescription="carrousel"
      aria-label={label}
      onMouseEnter={isStage ? () => setPaused(true) : undefined}
      onMouseLeave={isStage ? () => setPaused(false) : undefined}
      onFocus={isStage ? () => setPaused(true) : undefined}
      onBlur={isStage ? () => setPaused(false) : undefined}
      onKeyDown={isStage ? onKeyDown : undefined}
      tabIndex={isStage ? 0 : undefined}
    >
      {frames.map((frame, frameIndex) => {
        const active = frameIndex === index;
        return (
          <div
            className={`${styles.frame} ${active ? styles.frameActive : ""}`}
            key={frame.src}
            aria-hidden={!active}
          >
            {frame.type === "video" ? (
              <video
                className={styles.image}
                ref={(node) => {
                  videoRefs.current[frameIndex] = node;
                }}
                src={frame.src}
                poster={frame.poster}
                muted
                loop
                playsInline
                // Rien ne part sur le réseau tant que le cadre n’est pas joué :
                // seule l’affiche est chargée.
                preload="none"
                aria-label={frame.alt}
              />
            ) : (
              <img
                className={styles.image}
                src={frame.src}
                alt={active ? frame.alt : ""}
                loading={frameIndex === 0 ? "eager" : "lazy"}
                fetchPriority={frameIndex === 0 && !isStage ? "high" : undefined}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  if (!isStage) {
    return stack;
  }

  return (
    <section className={styles.root}>
      {stack}

      <div className={styles.controls}>
        <button
          className={styles.arrow}
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Image précédente"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 2 4 8l6 6"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="square"
            />
          </svg>
        </button>

        <div className={styles.dots}>
          {frames.map((frame, frameIndex) => (
            <button
              className={`${styles.dot} ${
                frameIndex === index ? styles.dotActive : ""
              }`}
              key={frame.src}
              type="button"
              onClick={() => go(frameIndex)}
              aria-label={`Image ${frameIndex + 1} sur ${frames.length}`}
              aria-current={frameIndex === index || undefined}
            />
          ))}
        </div>

        <button
          className={styles.arrow}
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Image suivante"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 2l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="square"
            />
          </svg>
        </button>
      </div>

      <p className={styles.caption}>{frames[index]?.alt}</p>
    </section>
  );
}
