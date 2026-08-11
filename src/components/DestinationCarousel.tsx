"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { experiences } from "@/content/corniche";
import useRotatingMedia from "@/hooks/useRotatingMedia";
import type { Destination } from "@/types/home";
import styles from "./DestinationCarousel.module.css";

const WHEEL_FACTOR = -0.0005;
const TOUCH_FACTOR = 0.001;
// Rythme resserré : le carrousel doit se lire vite, y compris à l'écran
// pendant une démo. Le défilement reste amorti, simplement plus nerveux.
const DAMPING = 11;
const REDUCED_WHEEL_INTERVAL = 140;
const MEDIA_ROTATION_INTERVAL = 2600;
const MEDIA_CROSSFADE_DURATION = 480;

export const DESTINATIONS: readonly Destination[] = experiences.map(
  ({
    slug,
    name,
    href,
    primary,
    secondary,
    image,
    imageAlt,
    gallery,
    tagline,
    description,
    hours,
    labelScale,
  }) => ({
    id: slug,
    label: name,
    href,
    primary,
    secondary,
    image,
    imageAlt,
    gallery,
    tagline,
    descriptions: description,
    hours,
    labelScale,
  }),
);

export interface DestinationCarouselProps {
  interactionLocked: boolean;
  onActiveChange: (index: number, destination: Destination) => void;
}

type CarouselStyle = CSSProperties & {
  "--carousel-primary": string;
  "--carousel-secondary": string;
};

type LinkStyle = CSSProperties & {
  "--label-scale": number;
};

type MediaStyle = CSSProperties & {
  "--frame-primary": string;
  "--frame-secondary": string;
};

const modulo = (value: number, divisor: number) =>
  ((value % divisor) + divisor) % divisor;

const wrap = (value: number, minimum: number, maximum: number) => {
  const range = maximum - minimum;
  return modulo(value - minimum, range) + minimum;
};

interface DestinationMediaProps {
  destination: Destination;
  destinationIndex: number;
  active: boolean;
  preload: boolean;
  rotationEnabled: boolean;
}

function DestinationMedia({
  destination,
  destinationIndex,
  active,
  preload,
  rotationEnabled,
}: DestinationMediaProps) {
  const currentIndex = useRotatingMedia(
    destination.gallery.length,
    MEDIA_ROTATION_INTERVAL,
    rotationEnabled,
  );
  const previousIndexRef = useRef(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!active || !rotationEnabled) {
      previousIndexRef.current = 0;
      setOutgoingIndex(null);
      return;
    }

    const previousIndex = previousIndexRef.current;

    if (previousIndex === currentIndex) {
      return;
    }

    previousIndexRef.current = currentIndex;
    setOutgoingIndex(previousIndex);

    const timeout = window.setTimeout(() => {
      setOutgoingIndex(null);
    }, MEDIA_CROSSFADE_DURATION);

    return () => window.clearTimeout(timeout);
  }, [active, currentIndex, rotationEnabled]);

  const visibleIndex = active ? currentIndex : 0;
  const currentFrame = destination.gallery[visibleIndex];
  const outgoingFrame =
    active && outgoingIndex !== null
      ? destination.gallery[outgoingIndex]
      : null;
  const isInternalTransition = outgoingFrame !== null;
  const shouldRenderFrame = active || preload;
  const mediaStyle: MediaStyle = {
    "--frame-primary": destination.primary,
    "--frame-secondary": destination.secondary,
  };

  return (
    <li
      className={styles.imageItem}
      data-active={active || undefined}
      style={mediaStyle}
    >
      {shouldRenderFrame && outgoingFrame ? (
        <span
          aria-hidden="true"
          className={styles.mediaFrame}
          data-fit={outgoingFrame.fit ?? "cover"}
          data-state="outgoing"
        >
          {outgoingFrame.fit === "contain" ? (
            <img
              alt=""
              aria-hidden="true"
              className={styles.containBackdrop}
              decoding="async"
              draggable={false}
              loading="lazy"
              src={outgoingFrame.src}
            />
          ) : null}
          <img
            alt=""
            aria-hidden="true"
            className={styles.image}
            decoding="async"
            draggable={false}
            loading="lazy"
            src={outgoingFrame.src}
            style={{ objectPosition: outgoingFrame.position }}
          />
        </span>
      ) : null}

      {shouldRenderFrame ? (
        <span
          aria-hidden={active ? undefined : true}
          className={styles.mediaFrame}
          data-fit={currentFrame.fit ?? "cover"}
          data-state={
            active
              ? isInternalTransition
                ? "current"
                : "steady"
              : "inactive"
          }
        >
          {currentFrame.fit === "contain" ? (
            <img
              alt=""
              aria-hidden="true"
              className={styles.containBackdrop}
              decoding="async"
              draggable={false}
              loading="lazy"
              src={currentFrame.src}
            />
          ) : null}
          <img
            alt={active ? currentFrame.alt : ""}
            aria-hidden={active ? undefined : true}
            className={styles.image}
            decoding="async"
            draggable={false}
            fetchPriority={
              destinationIndex === 0 && visibleIndex === 0 ? "high" : "auto"
            }
            loading={
              active && destinationIndex === 0 && visibleIndex === 0
                ? "eager"
                : "lazy"
            }
            src={currentFrame.src}
            style={{ objectPosition: currentFrame.position }}
          />
        </span>
      ) : null}
    </li>
  );
}

export function DestinationCarousel({
  interactionLocked,
  onActiveChange,
}: DestinationCarouselProps) {
  const rootRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const callbackRef = useRef(onActiveChange);
  const lockedRef = useRef(interactionLocked);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const applyProgressRef = useRef<(progress: number) => void>(() => undefined);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  callbackRef.current = onActiveChange;
  lockedRef.current = interactionLocked;

  const moveByOne = useCallback((direction: 1 | -1) => {
    targetProgressRef.current -= direction / DESTINATIONS.length;

    if (reducedMotionRef.current) {
      currentProgressRef.current = targetProgressRef.current;
      applyProgressRef.current(currentProgressRef.current);
    }
  }, []);

  useEffect(() => {
    callbackRef.current(0, DESTINATIONS[0]);
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const firstItem = itemRefs.current[0];

    if (!root || !firstItem) {
      return;
    }

    let itemHeight = firstItem.getBoundingClientRect().height;
    let viewportHeight = root.clientHeight;
    let frame = 0;
    let previousFrameTime = performance.now();
    let touchY: number | null = null;
    let reducedTouchDistance = 0;
    let reducedWheelReadyAt = 0;

    const commitActiveIndex = (index: number) => {
      if (index === activeIndexRef.current) {
        return;
      }

      activeIndexRef.current = index;
      setActiveIndex(index);
      callbackRef.current(index, DESTINATIONS[index]);
    };

    const applyProgress = (progress: number) => {
      const trackHeight = itemHeight * DESTINATIONS.length;

      if (trackHeight <= 0) {
        return;
      }

      const centerOffset = viewportHeight * 0.5 - itemHeight * 0.5;
      const halfTrack = trackHeight * 0.5;
      const trackOffset = modulo(progress, 1) * trackHeight;

      itemRefs.current.forEach((item, index) => {
        if (!item) {
          return;
        }

        const y = wrap(
          centerOffset + index * itemHeight + trackOffset,
          -halfTrack,
          halfTrack,
        );

        item.style.transform = `translate3d(0, ${y.toFixed(3)}px, 0)`;
      });

      commitActiveIndex(
        modulo(
          Math.round(-progress * DESTINATIONS.length),
          DESTINATIONS.length,
        ),
      );
    };

    applyProgressRef.current = applyProgress;

    const measure = () => {
      viewportHeight = root.clientHeight || window.innerHeight;
      itemHeight =
        firstItem.getBoundingClientRect().height ||
        (window.innerWidth >= 1024 ? 440 : viewportHeight * 0.4);
      applyProgress(currentProgressRef.current);
    };

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    reducedMotionRef.current = reducedMotionQuery.matches;

    const onReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;

      if (event.matches) {
        const snappedProgress =
          Math.round(
            currentProgressRef.current * DESTINATIONS.length,
          ) / DESTINATIONS.length;

        targetProgressRef.current = snappedProgress;
        currentProgressRef.current = snappedProgress;
        applyProgress(snappedProgress);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (lockedRef.current || event.ctrlKey || event.deltaY === 0) {
        return;
      }

      if (event.cancelable) {
        event.preventDefault();
      }

      if (reducedMotionRef.current) {
        const now = performance.now();

        if (now < reducedWheelReadyAt) {
          return;
        }

        reducedWheelReadyAt = now + REDUCED_WHEEL_INTERVAL;
        moveByOne(event.deltaY > 0 ? 1 : -1);
        return;
      }

      targetProgressRef.current += event.deltaY * WHEEL_FACTOR;
    };

    const onTouchStart = (event: TouchEvent) => {
      if (lockedRef.current || event.touches.length !== 1) {
        touchY = null;
        return;
      }

      touchY = event.touches[0].clientY;
      reducedTouchDistance = 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (
        lockedRef.current ||
        touchY === null ||
        event.touches.length !== 1
      ) {
        touchY = null;
        return;
      }

      const nextY = event.touches[0].clientY;
      const deltaY = nextY - touchY;
      touchY = nextY;

      if (event.cancelable) {
        event.preventDefault();
      }

      if (reducedMotionRef.current) {
        reducedTouchDistance += deltaY;
      } else {
        targetProgressRef.current += deltaY * TOUCH_FACTOR;
      }
    };

    const onTouchEnd = () => {
      if (
        reducedMotionRef.current &&
        !lockedRef.current &&
        Math.abs(reducedTouchDistance) >= 12
      ) {
        moveByOne(reducedTouchDistance < 0 ? 1 : -1);
      }

      touchY = null;
      reducedTouchDistance = 0;
    };

    const tick = (time: number) => {
      const deltaTime = Math.min(
        Math.max((time - previousFrameTime) / 1000, 0),
        0.1,
      );
      previousFrameTime = time;

      if (!reducedMotionRef.current) {
        const dampingFactor = 1 - Math.exp(-DAMPING * deltaTime);
        const distance =
          targetProgressRef.current - currentProgressRef.current;

        currentProgressRef.current += distance * dampingFactor;

        if (Math.abs(distance) < 0.000001) {
          currentProgressRef.current = targetProgressRef.current;
        }

        applyProgress(currentProgressRef.current);
      }

      frame = window.requestAnimationFrame(tick);
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);

    measure();
    resizeObserver?.observe(root);
    window.addEventListener("resize", measure);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      reducedMotionQuery.removeEventListener(
        "change",
        onReducedMotionChange,
      );
      applyProgressRef.current = () => undefined;
    };
  }, [moveByOne]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (interactionLocked) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveByOne(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveByOne(-1);
    }
  };

  const activeDestination = DESTINATIONS[activeIndex];
  const previousDestinationIndex = modulo(
    activeIndex - 1,
    DESTINATIONS.length,
  );
  const nextDestinationIndex = modulo(activeIndex + 1, DESTINATIONS.length);
  const carouselStyle: CarouselStyle = {
    "--carousel-primary": activeDestination.primary,
    "--carousel-secondary": activeDestination.secondary,
  };

  return (
    <main
      id="experiences"
      aria-label="Expériences Corniche"
      aria-roledescription="carousel"
      className={styles.root}
      data-interaction-locked={interactionLocked || undefined}
      ref={rootRef}
      style={carouselStyle}
      onKeyDown={onKeyDown}
    >
      <ul className={styles.links}>
        {DESTINATIONS.map((destination, index) => {
          const isActive = index === activeIndex;

          return (
            <li
              className={styles.item}
              key={destination.id}
              ref={(item) => {
                itemRefs.current[index] = item;
              }}
            >
              <Link
                aria-current={isActive ? "page" : undefined}
                className={styles.link}
                data-active={isActive || undefined}
                href={destination.href}
                style={
                  {
                    "--label-scale": destination.labelScale,
                  } as LinkStyle
                }
              >
                <span aria-hidden="true" className={styles.markRow} />
                <span className={styles.title}>{destination.label}</span>
                <span className={styles.visuallyHidden}>
                  <span>{destination.tagline}</span>
                  {destination.descriptions.map((description, paragraphIndex) => (
                    <span key={`${destination.id}-description-${paragraphIndex}`}>
                      {description}
                    </span>
                  ))}
                  <span>{destination.hours}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <ul className={styles.images}>
        {DESTINATIONS.map((destination, index) => (
          <DestinationMedia
            active={index === activeIndex}
            destination={destination}
            destinationIndex={index}
            key={destination.id}
            preload={
              index === previousDestinationIndex ||
              index === nextDestinationIndex
            }
            rotationEnabled={
              index === activeIndex && !interactionLocked
            }
          />
        ))}
      </ul>
    </main>
  );
}

export default DestinationCarousel;
