"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryFrame } from "@/content/restaurants";
import styles from "./AmbianceBand.module.css";
import useMotionEnvironment from "@/hooks/useMotionEnvironment";
import { imageUrl, videoUrl } from "@/lib/media";

type Props = {
  clip: GalleryFrame;
  tagline: string;
  hours: string;
};

/**
 * Moment vidéo de l’adresse. Les clips sont des reels verticaux : on les
 * affiche dans leur format, à leur définition, et c’est le texte qui occupe
 * la largeur — pas une image étirée.
 * Le clip ne se charge et ne tourne que lorsqu’il est à l’écran.
 */
export function AmbianceBand({ clip, tagline, hours }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [nearView, setNearView] = useState(false);
  const { reducedMotion, visible, saveData } = useMotionEnvironment();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    const warmObserver = new IntersectionObserver(
      ([entry]) => setNearView(entry.isIntersecting),
      { rootMargin: "240px" },
    );
    observer.observe(video);
    warmObserver.observe(video);
    return () => { observer.disconnect(); warmObserver.disconnect(); };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (nearView && inView && visible && !reducedMotion && !saveData) {
      video.play().catch(() => undefined);
    } else video.pause();
  }, [inView, nearView, visible, reducedMotion, saveData]);

  return (
    <section className={styles.root} aria-label={clip.alt}>
      <div className={styles.media}>
        <video
          className={styles.video}
          ref={videoRef}
          src={nearView && !reducedMotion && !saveData ? videoUrl(clip.src) : undefined}
          poster={nearView && clip.poster ? imageUrl(clip.poster, 640) : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-label={clip.alt}
        />
      </div>

      <div className={styles.aside}>
        <p className={styles.tagline}>{tagline}</p>
        <div className={styles.rule} aria-hidden="true" />
        <p className={styles.hours}>{hours}</p>
      </div>
    </section>
  );
}
