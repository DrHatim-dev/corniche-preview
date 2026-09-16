import Link from "next/link";
import type { CSSProperties } from "react";
import { AmbianceBand } from "@/components/AmbianceBand";
import { CustomCursor } from "@/components/CustomCursor";
import { RestaurantCarousel } from "@/components/RestaurantCarousel";
import { experiences, site } from "@/content/corniche";
import { getRestaurantPage } from "@/content/restaurants";
import { coverImageSizes, responsiveImage, restaurantHeroSizes } from "@/lib/media";
import styles from "./RestaurantPage.module.css";

type Props = {
  slug: string;
};

export function RestaurantPage({ slug }: Props) {
  const experience = experiences.find((item) => item.slug === slug);
  const page = getRestaurantPage(slug);

  if (!experience || !page) {
    throw new Error(`Adresse inconnue : ${slug}`);
  }

  // A stable, art-directed hero. Portrait gallery images are not wide banners.
  const hero = responsiveImage(page.hero.src, restaurantHeroSizes(page.hero.src));
  const mobileSrc = page.hero.mobileSrc ?? page.hero.src;
  const mobileHero = responsiveImage(mobileSrc, coverImageSizes(mobileSrc, "100vw", "125vw"));
  const heroStyle = {
    "--hero-max-width": `${Math.min(hero.width ?? 1920, 1920)}px`,
    "--hero-aspect-ratio": `${hero.width ?? 16} / ${hero.height ?? 9}`,
    "--hero-position": page.hero.position ?? "50% 50%",
    "--hero-mobile-position": page.hero.mobilePosition ?? "50% 50%",
  } as CSSProperties;

  return (
    <main className={styles.root}>
      {/* Le global impose cursor:none (curseur maison de l’accueil).
          Sans ce composant, le pointeur disparaît sur ces pages. */}
      <CustomCursor />

      <header className={styles.bar}>
        <Link href="/" aria-label="Retour à l’accueil Corniche">
          <img
            className={styles.wordmark}
            src="/assets/corniche/library/corniche-global/973-logo-footer.png"
            alt="Corniche"
            width={132}
            height={30}
          />
        </Link>
        <a className={styles.barLink} href={site.phoneHref}>
          {site.phone}
        </a>
      </header>

      <div className={styles.hero} style={heroStyle}>
        <picture className={styles.heroMedia}>
          <source
            media="(max-width: 699px)"
            srcSet={mobileHero.srcSet ?? mobileHero.src}
            sizes={mobileHero.sizes}
            width={mobileHero.width}
            height={mobileHero.height}
          />
          <img
            {...hero}
            className={styles.heroImage}
            alt={page.hero.alt}
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        </picture>
        <div className={styles.heroVeil} aria-hidden="true" />
        <div className={styles.heroText}>
          <h1 className={styles.name}>{experience.name}</h1>
          <p className={styles.tagline}>{experience.tagline}</p>
        </div>
      </div>

      <section className={styles.body}>
        {experience.description.map((paragraph) => (
          <p className={styles.paragraph} key={paragraph}>
            {paragraph}
          </p>
        ))}

        <div className={styles.facts}>
          <div>
            <p className={styles.factLabel}>Horaires</p>
            <p className={styles.factValue}>{experience.hours}</p>
          </div>
          <div>
            <p className={styles.factLabel}>Adresse</p>
            <p className={styles.factValue}>{site.address}</p>
          </div>
        </div>

        <a className={styles.reserve} href={site.phoneHref}>
          Réserver une table
        </a>
      </section>

      {page.ambiance ? (
        <AmbianceBand
          clip={page.ambiance}
          tagline={experience.tagline}
          hours={experience.hours}
        />
      ) : null}

      <RestaurantCarousel
        frames={page.gallery}
        variant="stage"
        label={`Galerie ${experience.name}`}
      />

      <footer className={styles.footer}>
        <Link className={styles.footerLink} href="/">
          Les six restaurants
        </Link>
        <a className={styles.footerLink} href={site.phoneHref}>
          Réserver · {site.phone}
        </a>
      </footer>
    </main>
  );
}
