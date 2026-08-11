"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import styles from "./IntroOverlay.module.css";

export interface IntroOverlayProps {
  onComplete: () => void;
}

interface Partner {
  name: string;
  href: string;
  src: string;
}


// Hero vidéo : quatre clips qui suivent la ligne de la baseline,
// du déjeuner face à l’océan jusqu’au bout de la nuit.
// Ce sont les mêmes fichiers que les pages adresse : déjà en cache.
const HERO_VIDEOS = [
  {
    src: "/assets/corniche/videos/marion/ambiance.mp4",
    poster: "/assets/corniche/videos/marion/posters/ambiance.jpg",
    alt: "Le Marion et sa vue sur l’Atlantique",
  },
  {
    src: "/assets/corniche/videos/sunset/ambiance.mp4",
    poster: "/assets/corniche/videos/sunset/posters/ambiance.jpg",
    alt: "La terrasse du Sunset face à l’océan",
  },
  {
    src: "/assets/corniche/videos/aiku/ambiance.mp4",
    poster: "/assets/corniche/videos/aiku/posters/ambiance.jpg",
    alt: "Les façades lumineuses d’Aï-Ku à la nuit tombée",
  },
  {
    src: "/assets/corniche/videos/louna/ambiance.mp4",
    poster: "/assets/corniche/videos/louna/posters/ambiance.jpg",
    alt: "Le cabaret Louna en scène",
  },
] as const;

const HERO_INTERVAL_MS = 3200;
const HERO_CROSSFADE_MS = 620;

const TITLE_GROUPS = [
  { text: "Corniche", weight: "medium" },
] as const;

// Hiérarchie : où l’on est, ce que c’est, l’invitation.
// Le dress code n’est plus ici : il est déjà servi au moment utile,
// dans les tiroirs Réservation et Membership.
const SUBTITLE_LINES = [
  "Casablanca, face à l’océan",
  "Six restaurants, un seul lieu",
  "Du déjeuner au bout de la nuit",
] as const;

const PARTNERS: readonly Partner[] = [
  {
    name: "Corniche",
    href: "#experiences",
    src: "/assets/corniche/library/corniche-global/973-logo-footer.png",
  },
  {
    name: "Marion",
    href: "#experiences",
    src: "/assets/corniche/library/marion/922-marion-logo-01.png",
  },
  {
    name: "Amor & Amor",
    href: "#experiences",
    src: "/assets/corniche/library/amoramor/1037-logo-amoramor.png",
  },
  {
    name: "Mesanueva",
    href: "#experiences",
    src: "/images/corniche/mesanueva-logo.png",
  },
  {
    name: "Louna",
    href: "#experiences",
    src: "/assets/corniche/library/louna/729-logo-louna.png",
  },
  {
    name: "Motif Corniche",
    href: "#experiences",
    src: "/assets/corniche/library/corniche-global/996-motifcorniche-01.png",
  },
] as const;

const styleWithIndex = (
  property: "--reveal-index" | "--partner-index",
  index: number,
) => ({ [property]: index } as CSSProperties);

export function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  // Index piloté ici (et non par useRotatingMedia) pour que la flèche
  // relance le compte à rebours au lieu de couper un clip en deux.
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroLayers, setHeroLayers] = useState<{
    current: number;
    outgoing: number | null;
  }>({ current: 0, outgoing: null });
  const displayedHeroIndexRef = useRef(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const activatedRef = useRef(false);
  const completeTimerRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const goToNextHero = useCallback(() => {
    setHeroIndex((current) => (current + 1) % HERO_VIDEOS.length);
  }, []);

  // Défilement automatique, remis à zéro à chaque changement (donc au clic
  // sur la flèche). Rien ne tourne si l’onglet est masqué.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      if (!document.hidden) goToNextHero();
    }, HERO_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [heroIndex, goToNextHero]);

  // Seul le clip affiché tourne.
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === heroIndex) {
        const attempt = video.play();
        if (attempt) attempt.catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [heroIndex, heroLayers]);

  useEffect(() => {
    if (heroIndex === displayedHeroIndexRef.current) {
      return;
    }

    const outgoing = displayedHeroIndexRef.current;
    displayedHeroIndexRef.current = heroIndex;
    setHeroLayers({ current: heroIndex, outgoing });

    const crossfadeTimer = window.setTimeout(() => {
      setHeroLayers((layers) =>
        layers.current === heroIndex
          ? { current: layers.current, outgoing: null }
          : layers,
      );
    }, HERO_CROSSFADE_MS);

    return () => window.clearTimeout(crossfadeTimer);
  }, [heroIndex]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setEntered(true);
      return;
    }

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setEntered(true));
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, []);

  useEffect(
    () => () => {
      if (completeTimerRef.current !== null) {
        window.clearTimeout(completeTimerRef.current);
      }
    },
    [],
  );

  const beginExit = useCallback(() => {
    if (activatedRef.current) {
      return;
    }

    activatedRef.current = true;
    setLeaving(true);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    completeTimerRef.current = window.setTimeout(
      () => onCompleteRef.current(),
      reducedMotion ? 160 : 520,
    );
  }, []);

  // Descendre = entrer. Molette, geste tactile, flèche bas, page suivante ou
  // espace déclenchent la même sortie que « Voir les restaurants ».
  useEffect(() => {
    const exitKeys = new Set([
      "ArrowDown",
      "PageDown",
      "End",
      " ",
      "Spacebar",
      "Enter",
    ]);

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY > 0) beginExit();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      // On laisse la flèche et le bouton gérer leur propre activation.
      if (event.target instanceof HTMLButtonElement) return;
      if (exitKeys.has(event.key)) beginExit();
    };

    let touchStartY: number | null = null;
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY === null) return;
      const current = event.touches[0]?.clientY ?? touchStartY;
      if (touchStartY - current > 28) beginExit();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [beginExit]);

  let titleLetterIndex = 0;
  let subtitleWordIndex = 0;

  const rootClassName = [
    styles.root,
    entered ? styles.entered : "",
    leaving ? styles.leaving : "",
  ]
    .filter(Boolean)
    .join(" ");

  const renderHeroFrame = (
    index: number,
    state: "current" | "incoming" | "outgoing",
  ) => {
    const media = HERO_VIDEOS[index];
    const frameClassName = [
      styles.posterFrame,
      state === "incoming" ? styles.posterFrameIncoming : "",
      state === "outgoing" ? styles.posterFrameOutgoing : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={frameClassName}
        aria-hidden="true"
        key={`hero-frame-${index}`}
      >
        {/* Brume : l’affiche du clip, floutée, qui habille toute la largeur. */}
        <img
          className={styles.posterBlur}
          src={media.poster}
          alt=""
          aria-hidden="true"
          draggable={false}
          fetchPriority={index === 0 ? "high" : "auto"}
        />
        <div className={styles.posterFog} aria-hidden="true" />
        {/* Premier plan : le clip, aux bords fondus dans la brume.
            Le masque est porté par l’enveloppe, pas par la balise vidéo :
            masquer directement un <video> n’est pas fiable selon le rendu GPU. */}
        <div className={styles.posterVideoWrap}>
          <video
            className={styles.posterVideo}
            ref={(node) => {
              videoRefs.current[index] = node;
            }}
            src={media.src}
            poster={media.poster}
            muted
            loop
            playsInline
            preload={index === 0 ? "metadata" : "none"}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  };

  return (
    <section
      className={rootClassName}
      aria-label="Introduction"
      data-intro-overlay=""
    >
      <div className={styles.mediaLayer} aria-hidden="true">
        {heroLayers.outgoing !== null
          ? renderHeroFrame(heroLayers.outgoing, "outgoing")
          : null}
        {renderHeroFrame(
          heroLayers.current,
          heroLayers.outgoing === null ? "current" : "incoming",
        )}
      </div>

      <button
        className={styles.heroArrow}
        type="button"
        onClick={goToNextHero}
        aria-label="Clip suivant"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 4l8 8-8 8"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="square"
          />
        </svg>
      </button>

      <div className={styles.copyFrame}>
        <div className={styles.copy}>
          <h1 className={styles.title} aria-label="Corniche">
            {TITLE_GROUPS.map((group, groupIndex) => (
              <span
                className={`${styles.titleGroup} ${
                  group.weight === "medium"
                    ? styles.titleMedium
                    : styles.titleLight
                }`}
                aria-hidden="true"
                key={group.text}
              >
                {Array.from(group.text).map((letter) => {
                  const index = titleLetterIndex++;

                  return (
                    <span className={styles.letterMask} key={`${letter}-${index}`}>
                      <span
                        className={styles.letter}
                        style={styleWithIndex("--reveal-index", index)}
                      >
                        {letter}
                      </span>
                    </span>
                  );
                })}
                {groupIndex < TITLE_GROUPS.length - 1 && (
                  <span className={styles.titleSpace} />
                )}
              </span>
            ))}
          </h1>

          <p
            className={styles.subtitle}
            aria-label={SUBTITLE_LINES.join(". ")}
          >
            {SUBTITLE_LINES.map((line) => (
              <span className={styles.subtitleLine} aria-hidden="true" key={line}>
                {line.split(" ").map((word, wordIndex, words) => {
                  const index = subtitleWordIndex++;

                  return (
                    <Fragment key={`${word}-${wordIndex}`}>
                      <span className={styles.wordMask}>
                        <span
                          className={styles.word}
                          style={styleWithIndex("--reveal-index", index)}
                        >
                          {word}
                        </span>
                      </span>
                      {wordIndex < words.length - 1 ? " " : null}
                    </Fragment>
                  );
                })}
              </span>
            ))}
          </p>

          <button
            className={styles.cta}
            type="button"
            onClick={beginExit}
            disabled={leaving}
          >
            Voir les restaurants
          </button>
        </div>
      </div>

      <nav className={styles.partners} aria-label="Univers Corniche">
        {PARTNERS.map((partner, index) => (
          <span
            className={styles.partnerSlot}
            style={styleWithIndex("--partner-index", index)}
            key={partner.name}
          >
            <a
              className={styles.partner}
              href={partner.href}
              aria-label={partner.name}
            >
              <img
                className={styles.partnerLogo}
                src={partner.src}
                alt={partner.name}
                draggable={false}
              />
            </a>
          </span>
        ))}
      </nav>
    </section>
  );
}

export default IntroOverlay;
