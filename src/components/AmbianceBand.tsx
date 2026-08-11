"use client";

import { useEffect, useRef } from "react";
import type { GalleryFrame } from "@/content/restaurants";
import styles from "./AmbianceBand.module.css";

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // l’affiche suffit
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const attempt = video.play();
          if (attempt) attempt.catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.root} aria-label={clip.alt}>
      <div className={styles.media}>
        <video
          className={styles.video}
          ref={videoRef}
          src={clip.src}
          poster={clip.poster}
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
