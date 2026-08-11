import type { Metadata } from "next";
import { RestaurantPage } from "@/components/RestaurantPage";
import { experiences } from "@/content/corniche";
import { getRestaurantPage } from "@/content/restaurants";

const SLUG = "amoramor";

const experience = experiences.find((item) => item.slug === SLUG)!;
const page = getRestaurantPage(SLUG)!;

export const metadata: Metadata = {
  title: `${experience.name} | Corniche Casablanca`,
  description: experience.tagline,
  alternates: { canonical: `/${SLUG}` },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: `/${SLUG}`,
    siteName: "Corniche",
    title: `${experience.name} | Corniche Casablanca`,
    description: experience.tagline,
    images: [{ url: page.hero.src, alt: page.hero.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${experience.name} | Corniche Casablanca`,
    description: experience.tagline,
    images: [page.hero.src],
  },
};

export default function Page() {
  return <RestaurantPage slug={SLUG} />;
}
