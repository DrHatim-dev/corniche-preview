import Link from "next/link";
import { AmbianceBand } from "@/components/AmbianceBand";
import { CustomCursor } from "@/components/CustomCursor";
import { RestaurantCarousel } from "@/components/RestaurantCarousel";
import { experiences, site } from "@/content/corniche";
import { getRestaurantPage } from "@/content/restaurants";
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

  // Le héros tourne sur les vues de salle les plus fortes ; la galerie
  // déroule l’ensemble de la sélection.
  // Photos uniquement au héros : c’est le premier affichage, une vidéo y
  // pèserait sur le chargement et doublonnerait avec la galerie.
  const heroFrames = [
    page.hero,
    ...page.gallery.filter((frame) => frame.type !== "video").slice(0, 3),
  ];

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

      <div className={styles.hero}>
        <RestaurantCarousel
          frames={heroFrames}
          variant="hero"
          label={`${experience.name} en images`}
        />
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
