"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { GalleryFrame } from "@/content/restaurants";
import styles from "./RestaurantCarousel.module.css";
import useMotionEnvironment from "@/hooks/useMotionEnvironment";
import useDecodedMediaIndex from "@/hooks/useDecodedMediaIndex";
import ResponsiveImage from "./ResponsiveImage";
import { imageUrl, videoUrl, restaurantHeroSizes, restaurantGallerySizes } from "@/lib/media";

// Laisser chaque adresse se lire avant un fondu court, sans flash de fond.
const INTERVAL_HERO_MS = 4200;
const INTERVAL_STAGE_MS = 4800;
const FADE_HERO_MS = 300;
const FADE_STAGE_MS = 300;
// Un clip garde la main le temps d’être vu, sans immobiliser la page.
const VIDEO_HOLD_MS = 6000;

type Props = {
  frames: readonly GalleryFrame[];
  variant: "hero" | "stage";
  label: string;
};

export function RestaurantCarousel({ frames, variant, label }: Props) {
  const [requestedIndex, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { reducedMotion, visible, saveData } = useMotionEnvironment();
  const stageRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [nearView, setNearView] = useState(variant === "hero");
  const index = useDecodedMediaIndex(
    requestedIndex,
    frames.map((frame) => frame.type === "video" ? frame.poster ?? "" : frame.src),
    nearView && visible,
    { sizes: variant === "stage" ? restaurantGallerySizes : restaurantHeroSizes, preloadNext: inView && !saveData && !reducedMotion },
  );
  const previousIndex = useRef(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const go = useCallback(
    (next: number) => {
      if (frames.length) setIndex((next + frames.length) % frames.length);
    },
    [frames.length],
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    const warmObserver = new IntersectionObserver(([entry]) => setNearView(entry.isIntersecting), { rootMargin: "240px" });
    observer.observe(stage);
    warmObserver.observe(stage);
    return () => { observer.disconnect(); warmObserver.disconnect(); };
  }, []);

  const isStage = variant === "stage";
  const fadeMs = isStage ? FADE_STAGE_MS : FADE_HERO_MS;
  useLayoutEffect(() => {
    if (index === previousIndex.current) return;
    setOutgoingIndex(previousIndex.current);
    previousIndex.current = index;
    const timer = window.setTimeout(() => setOutgoingIndex(null), reducedMotion ? 0 : fadeMs);
    return () => window.clearTimeout(timer);
  }, [index, fadeMs, reducedMotion]);
  // Un clip a besoin de son temps : on laisse la vidéo se dérouler avant
  // d’enchaîner, alors qu’une photo garde le rythme court.
  const activeIsVideo = frames[index]?.type === "video";
  const intervalMs = activeIsVideo
    ? VIDEO_HOLD_MS
    : isStage
      ? INTERVAL_STAGE_MS
      : INTERVAL_HERO_MS;

  useEffect(() => {
    if (frames.length < 2 || paused || reducedMotion || saveData || !visible || !inView || requestedIndex !== index) return;
    const timer = window.setTimeout(() => {
      if (document.hidden) return;
      setIndex((current) => (current + 1) % frames.length);
    }, intervalMs);
    return () => window.clearTimeout(timer);
  }, [frames.length, paused, intervalMs, index, requestedIndex, reducedMotion, saveData, visible, inView]);

  // Lecture réservée au cadre actif : rien ne tourne en fond.
  useEffect(() => {
    videoRefs.current.forEach((video, frameIndex) => {
      if (!video) return;
      if (frameIndex === index && !reducedMotion && !saveData && visible && inView && !paused) {
        const attempt = video.play();
        if (attempt) attempt.catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [index, reducedMotion, saveData, visible, inView, paused]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(requestedIndex + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(requestedIndex - 1);
    }
  };

  const stack = (
    <div
      ref={stageRef}
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
      onBlur={isStage ? (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      } : undefined}
      onKeyDown={isStage ? onKeyDown : undefined}
      tabIndex={isStage ? 0 : undefined}
    >
      {frames.map((frame, frameIndex) => {
        const active = frameIndex === index;
        const renderMedia = (nearView || !isStage) && (active || frameIndex === outgoingIndex);
        return (
          <div
            className={`${styles.frame} ${active ? styles.frameActive : ""}`}
            data-outgoing={frameIndex === outgoingIndex || undefined}
            key={frame.src}
            aria-hidden={!active}
          >
            {renderMedia && (frame.type === "video" ? (
              <video
                className={styles.image}
                ref={(node) => {
                  videoRefs.current[frameIndex] = node;
                }}
                src={inView && !reducedMotion && !saveData ? videoUrl(frame.src) : undefined}
                poster={frame.poster ? imageUrl(frame.poster, 640) : undefined}
                muted
                loop
                playsInline
                // Rien ne part sur le réseau tant que le cadre n’est pas joué :
                // seule l’affiche est chargée.
                preload="none"
                aria-label={frame.alt}
              />
            ) : (
              <ResponsiveImage
                className={styles.image}
                src={frame.src}
                sizes={isStage ? restaurantGallerySizes(frame.src) : restaurantHeroSizes(frame.src)}
                alt={active ? frame.alt : ""}
                decoding="async"
                loading="eager"
                fetchPriority={frameIndex === 0 && !isStage ? "high" : undefined}
              />
            ))}
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
          onClick={() => go(requestedIndex - 1)}
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
          onClick={() => go(requestedIndex + 1)}
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
