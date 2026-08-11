# Corniche — Casablanca

Une expérience premium et responsive en une page pour le complexe Corniche,
en bord de mer à Casablanca. Le site utilise Next.js, React et TypeScript.
Toutes les images affichées sont intégrées localement au projet.

## Lancer le site

```bash
npm install
npm run dev -- -H 127.0.0.1 -p 4174
```

Ouvrir `http://127.0.0.1:4174`.

## Vérifications

```bash
npm run typecheck
npm run build
```

Le média d’ouverture et les galeries du carrousel utilisent exclusivement des
images Corniche locales. Les photographies alternent dans les cadres existants
du clone, sans vidéo ni média distant.

Les actions de réservation et de contact utilisent le numéro Corniche fourni.
Le projet ne collecte aucune donnée de réservation, de paiement, d’adhésion,
de recrutement ou donnée personnelle.

Le plan de contenu, les spécifications des composants, les notes de
vérification et les captures finales se trouvent dans `docs/`.
