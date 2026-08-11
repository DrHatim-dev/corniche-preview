import type { MediaFrame } from "@/content/corniche";

export type DrawerKind = "reservation" | "information" | null;

export interface Destination {
  id: string;
  label: string;
  href: string;
  primary: string;
  secondary: string;
  image: string;
  imageAlt: string;
  gallery: readonly MediaFrame[];
  tagline: string;
  descriptions: readonly string[];
  hours: string;
  labelScale: number;
}

export interface PartnerMark {
  id: string;
  href: string;
  src: string;
  alt: string;
  className?: string;
}
