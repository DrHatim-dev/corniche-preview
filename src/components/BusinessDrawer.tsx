"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  contact,
  events,
  experiences,
  experiencesCopy,
  hero,
  intro,
  membership,
  recrutement,
  site,
  social,
} from "@/content/corniche";
import type { DrawerKind } from "@/types/home";
import { ArrowBackIcon, CloseIcon } from "./icons";
import styles from "./BusinessDrawer.module.css";

type OpenDrawerKind = Exclude<DrawerKind, null>;
export type BusinessDetailKind =
  | "dresscode"
  | "complex"
  | "experiences"
  | "events"
  | "membership"
  | "contact"
  | "recrutement";

interface BusinessDrawerProps {
  kind: OpenDrawerKind;
  primaryColor: string;
  initialDetail?: BusinessDetailKind | null;
  onClose: () => void;
}

const INFORMATION_DETAIL_ORDER = [
  "complex",
  "experiences",
  "events",
  "membership",
  "contact",
  "recrutement",
] as const satisfies readonly BusinessDetailKind[];

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function ExternalLink({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <a
      className={className}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

export function BusinessDrawer({
  kind,
  primaryColor,
  initialDetail = null,
  onClose,
}: BusinessDrawerProps) {
  const [detail, setDetail] = useState<BusinessDetailKind | null>(
    initialDetail,
  );
  const [isClosing, setIsClosing] = useState(false);
  const [entered, setEntered] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closingRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const drawerStyle = {
    "--business-primary": primaryColor,
  } as CSSProperties;

  const requestClose = useCallback(() => {
    if (closingRef.current) {
      return;
    }

    closingRef.current = true;
    setIsClosing(true);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    closeTimerRef.current = setTimeout(
      () => onCloseRef.current(),
      reduceMotion ? 0 : 220,
    );
  }, []);

  useEffect(() => {
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    setDetail(initialDetail);
  }, [initialDetail, kind]);

  useEffect(() => {
    if (detail) {
      backButtonRef.current?.focus();
    }
  }, [detail]);

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }

      previousFocusRef.current?.focus();
    };
  }, [requestClose]);

  const showDetail = (nextDetail: BusinessDetailKind) => {
    setDetail(nextDetail);
  };

  return (
    <div
      className={`${styles.root}${isClosing ? ` ${styles.closing}` : ""}`}
      data-entered={entered || undefined}
      style={drawerStyle}
    >
      <div
        aria-hidden="true"
        className={styles.backdrop}
        onClick={requestClose}
      />

      <aside
        aria-labelledby={titleId}
        aria-modal="true"
        className={styles.drawer}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <h2 className={styles.visuallyHidden} id={titleId}>
          {kind === "reservation"
            ? "Réservations"
            : "Informations pratiques"}
        </h2>

        <div className={styles.topBar}>
          {detail ? (
            <div className={styles.detailControls}>
              <button
                aria-label="Retour"
                className={styles.backButton}
                ref={backButtonRef}
                type="button"
                onClick={() => setDetail(null)}
              >
                <ArrowBackIcon />
              </button>

              {kind === "information" ? (
                <ol aria-hidden="true" className={styles.steps}>
                  {INFORMATION_DETAIL_ORDER.map((item) => (
                    <li
                      className={detail === item ? styles.currentStep : ""}
                      key={item}
                    />
                  ))}
                </ol>
              ) : null}
            </div>
          ) : null}

          <button
            aria-label="Fermer"
            className={styles.closeButton}
            ref={closeButtonRef}
            type="button"
            onClick={requestClose}
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.scrollArea} data-lenis-prevent="">
          {detail ? (
            <DetailPanel detail={detail} />
          ) : kind === "reservation" ? (
            <nav aria-label="Réserver" className={styles.navigation}>
              <a className={styles.link} href={site.phoneHref}>
                Réserver une table
              </a>

              <a className={styles.link} href={site.phoneHref}>
                Appeler Corniche
              </a>

              <button
                className={styles.link}
                type="button"
                onClick={() => showDetail("dresscode")}
              >
                Dress code élégant
              </button>
            </nav>
          ) : (
            <nav aria-label="Informations" className={styles.navigation}>
              <button
                className={styles.link}
                type="button"
                onClick={() => showDetail("complex")}
              >
                Le complexe
              </button>

              <button
                className={styles.link}
                type="button"
                onClick={() => showDetail("experiences")}
              >
                Expériences
              </button>

              <button
                className={styles.link}
                type="button"
                onClick={() => showDetail("events")}
              >
                Events
              </button>

              <button
                className={styles.link}
                type="button"
                onClick={() => showDetail("membership")}
              >
                Membership
              </button>

              <button
                className={styles.link}
                type="button"
                onClick={() => showDetail("contact")}
              >
                Contact
              </button>

              <button
                className={styles.link}
                type="button"
                onClick={() => showDetail("recrutement")}
              >
                Recrutement
              </button>
            </nav>
          )}
        </div>
      </aside>
    </div>
  );
}

function DetailPanel({ detail }: { detail: BusinessDetailKind }) {
  if (detail === "dresscode") {
    return (
      <section className={styles.detailPanel}>
        <p className={styles.eyebrow}>{contact.eyebrow}</p>
        <h3>{contact.title}</h3>
        <p>{contact.text}</p>
        <p>{hero.heroNotice}</p>
        <p>{contact.notice}</p>
        <a className={styles.detailLink} href={site.phoneHref}>
          {contact.cta}
        </a>
        <a className={styles.detailLink} href={site.phoneHref}>
          {site.phone}
        </a>
        <address>{site.address}</address>
      </section>
    );
  }

  if (detail === "complex") {
    return (
      <section className={styles.detailPanel}>
        <h3>{intro.eyebrow}</h3>
        {intro.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    );
  }

  if (detail === "experiences") {
    return (
      <section className={styles.detailPanel}>
        <p className={styles.eyebrow}>{experiencesCopy.eyebrow}</p>
        <h3>{experiencesCopy.title}</h3>
        <p>{experiencesCopy.intro}</p>
        <ul className={styles.contentList}>
          {experiences.map((experience) => (
            <li key={experience.slug}>
              <h4>{experience.name}</h4>
              <p>{experience.tagline}</p>
              {experience.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>{experience.hours}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (detail === "events") {
    return (
      <section className={styles.detailPanel}>
        <p className={styles.eyebrow}>{events.eyebrow}</p>
        <h3>{events.title}</h3>
        <p>{events.intro}</p>
        <ul className={styles.contentList}>
          {events.program.map((item) => (
            <li key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.detail}</p>
            </li>
          ))}
        </ul>
        <a className={styles.detailLink} href={site.phoneHref}>
          {site.phone}
        </a>
        <ExternalLink
          className={styles.detailLink}
          href="https://www.corniche.ma/events/"
        >
          {events.cta}
        </ExternalLink>
      </section>
    );
  }

  if (detail === "membership") {
    return (
      <section className={styles.detailPanel}>
        <p className={styles.eyebrow}>{membership.eyebrow}</p>
        <h3>{membership.title}</h3>
        <p>{membership.tagline}</p>
        <p>{membership.intro}</p>
        <h4>{membership.privilegesTitle}</h4>
        <ul className={styles.compactList}>
          {membership.privileges.map((privilege) => (
            <li key={privilege}>{privilege}</li>
          ))}
        </ul>
        <p>{membership.discretion}</p>
        <p>{membership.closing}</p>
        <ExternalLink
          className={styles.detailLink}
          href="https://www.corniche.ma/membership/"
        >
          {membership.cta}
        </ExternalLink>
      </section>
    );
  }

  if (detail === "contact") {
    return (
      <section className={styles.detailPanel}>
        <p className={styles.eyebrow}>{contact.eyebrow}</p>
        <h3>{contact.title}</h3>
        <p>{contact.text}</p>
        <a className={styles.detailLink} href={site.phoneHref}>
          {contact.cta}
        </a>
        <a className={styles.detailLink} href={site.phoneHref}>
          {site.phone}
        </a>
        <address>{site.address}</address>
        <p>{hero.heroNotice}</p>
        <p>{contact.notice}</p>
        <div className={styles.socialLinks}>
          <ExternalLink href={social.instagram}>Instagram</ExternalLink>
          <ExternalLink href={social.facebook}>Facebook</ExternalLink>
          <ExternalLink href={social.tripadvisor}>Tripadvisor</ExternalLink>
          <ExternalLink href={social.whatsapp}>WhatsApp</ExternalLink>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.detailPanel}>
      <h3>{recrutement.title}</h3>
      {recrutement.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <ul className={styles.compactList}>
        {recrutement.fields.map((field) => (
          <li key={field}>{field}</li>
        ))}
      </ul>
    </section>
  );
}

export default BusinessDrawer;
