// Prépare le dossier à déposer sur Netlify.
//
//   npm run build:netlify
//
// Produit `netlify-deploy/` à la racine du projet : un site entièrement
// statique, autonome, qu'il suffit de glisser sur app.netlify.com/drop.
// Le reste du projet (source, node_modules, .next) n'est pas concerné.

import { spawnSync } from "node:child_process";
import { cpSync, existsSync, rmSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const exportDir = join(root, "out");
const deployDir = join(root, "netlify-deploy");

// 1. Build statique
console.log("→ build statique (STATIC_EXPORT=true)…");
const build = spawnSync("npm", ["run", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
  env: { ...process.env, STATIC_EXPORT: "true" },
});

if (build.status !== 0) {
  console.error("✗ le build a échoué, rien n'a été préparé.");
  process.exit(build.status ?? 1);
}

if (!existsSync(exportDir)) {
  console.error("✗ dossier `out/` introuvable après le build.");
  process.exit(1);
}

// 2. Dossier de dépôt propre
if (existsSync(deployDir)) rmSync(deployDir, { recursive: true, force: true });
cpSync(exportDir, deployDir, { recursive: true });

// 3. En-têtes de cache (Netlify lit `_headers` à la racine du dépôt).
//    Les noms de fichiers sont stables : on peut cacher longtemps.
writeFileSync(
  join(deployDir, "_headers"),
  `/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate
`,
  "utf8",
);

// 4. Récapitulatif
const walk = (dir) => {
  let files = 0;
  let bytes = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = walk(full);
      files += sub.files;
      bytes += sub.bytes;
    } else {
      files += 1;
      bytes += statSync(full).size;
    }
  }
  return { files, bytes };
};

const { files, bytes } = walk(deployDir);
const pages = readdirSync(deployDir)
  .filter((name) => name.endsWith(".html"))
  .sort();

console.log("");
console.log("✓ dossier prêt :", deployDir);
console.log(`  ${files} fichiers — ${(bytes / 1024 / 1024).toFixed(1)} Mo`);
console.log(`  pages : ${pages.join(", ")}`);
console.log("");
console.log("  Dépôt : ouvrir https://app.netlify.com/drop et y glisser le dossier.");
