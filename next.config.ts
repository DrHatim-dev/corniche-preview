import type { NextConfig } from "next";

// STATIC_EXPORT=true produit un site 100 % statique dans `out/`, destiné au
// dépôt manuel sur Netlify (voir `npm run build:netlify`).
// Sans cette variable, le projet se construit normalement et `next start`
// continue de servir l'aperçu sur le port 4174.
const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  poweredByHeader: false,
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        ...(basePath ? { basePath } : {}),
      }
    : {}),
};

export default nextConfig;
