import type { Metadata, Viewport } from "next";
import { hero, site } from "@/content/corniche";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.corniche.ma"),
  title: "Corniche | Casablanca — Bord de mer",
  description: hero.intro,
  applicationName: site.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon:
      "/assets/corniche/library/corniche-global/956-cropped-fav-corniche-01.jpg",
    apple:
      "/assets/corniche/library/corniche-global/956-cropped-fav-corniche-01.jpg",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: site.name,
    title: "Corniche | Casablanca — Bord de mer",
    description: hero.intro,
    images: [
      {
        url: "/assets/corniche/production/corniche-og-1200x630.webp",
        width: 1200,
        height: 630,
        alt: "Corniche, complexe d’exception à Casablanca",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Corniche | Casablanca — Bord de mer",
    description: hero.intro,
    images: ["/assets/corniche/production/corniche-og-1200x630.webp"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0d0d0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preload" href="/fonts/corniche-display.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
