// Retire du dossier de dépôt les fichiers que le site construit ne demande
// jamais. Rien n'est supprimé : les fichiers écartés sont déplacés dans
// `netlify-deploy-unused/`, pour pouvoir revenir en arrière.
//
//   npm run prune:netlify

import {
  readdirSync,
  readFileSync,
  statSync,
  mkdirSync,
  renameSync,
  existsSync,
  rmSync,
} from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const deployDir = join(root, "netlify-deploy");
const unusedDir = join(root, "netlify-deploy-unused");

if (!existsSync(deployDir)) {
  console.error("✗ lancer d'abord `npm run build:netlify`.");
  process.exit(1);
}

const walk = (dir) => {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
};

const allFiles = walk(deployDir);

// 1. Tout ce que le site peut citer : HTML, CSS, JS, JSON, plus les fichiers
//    Netlify. On y cherche les chemins littéraux.
const textExt = new Set([".html", ".css", ".js", ".json", ".txt", ".map"]);
const referenced = new Set();
const pathPattern = /\/(?:assets|images|fonts)\/[A-Za-z0-9._~\-/%@()' ]+?\.[A-Za-z0-9]{2,5}/g;

for (const file of allFiles) {
  const ext = file.slice(file.lastIndexOf("."));
  if (!textExt.has(ext)) continue;
  const body = readFileSync(file, "utf8");
  for (const match of body.matchAll(pathPattern)) {
    referenced.add(decodeURIComponent(match[0]));
  }
}

// 2. Fichiers médias présents dans le dossier
const mediaRoots = ["assets", "images", "fonts"];
const mediaFiles = allFiles.filter((f) => {
  const rel = relative(deployDir, f).split(sep).join("/");
  return mediaRoots.some((r) => rel.startsWith(r + "/"));
});

const isReferenced = (file) => {
  const rel = "/" + relative(deployDir, file).split(sep).join("/");
  return referenced.has(rel);
};

const orphans = mediaFiles.filter((f) => !isReferenced(f));

// 3. Déplacement
if (existsSync(unusedDir)) rmSync(unusedDir, { recursive: true, force: true });

let movedBytes = 0;
for (const file of orphans) {
  const rel = relative(deployDir, file);
  const target = join(unusedDir, rel);
  mkdirSync(dirname(target), { recursive: true });
  movedBytes += statSync(file).size;
  renameSync(file, target);
}

// 4. Dossiers vidés
const pruneEmpty = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) pruneEmpty(join(dir, entry.name));
  }
  if (readdirSync(dir).length === 0) rmSync(dir, { recursive: true, force: true });
};
for (const r of mediaRoots) {
  const d = join(deployDir, r);
  if (existsSync(d)) pruneEmpty(d);
}

const after = walk(deployDir);
const afterBytes = after.reduce((n, f) => n + statSync(f).size, 0);

console.log(`médias cités par le site : ${referenced.size}`);
console.log(`fichiers écartés         : ${orphans.length} (${(movedBytes / 1024 / 1024).toFixed(1)} Mo)`);
console.log(`  → ${unusedDir}`);
console.log("");
console.log(`dossier de dépôt : ${after.length} fichiers — ${(afterBytes / 1024 / 1024).toFixed(1)} Mo`);
