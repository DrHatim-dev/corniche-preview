import { promises as fs } from "node:fs";
import path from "node:path";

const outDir = path.resolve("out");
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "")
  .trim()
  .replace(/\/$/, "");

if (!basePath || !/^\/[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)*$/.test(basePath)) {
  throw new Error(
    "NEXT_PUBLIC_BASE_PATH must be a non-empty URL path such as /corniche-preview",
  );
}

const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".map",
  ".svg",
  ".txt",
  ".webmanifest",
  ".xml",
]);

const rootPublicPath = /(?<![A-Za-z0-9.:%-])\/(assets|fonts|images)\//g;

async function collectFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
    } else if (textExtensions.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

const files = await collectFiles(outDir);
let rewrittenFiles = 0;

for (const file of files) {
  const original = await fs.readFile(file, "utf8");
  const rewritten = original.replace(
    rootPublicPath,
    `${basePath}/$1/`,
  );

  if (rewritten !== original) {
    await fs.writeFile(file, rewritten);
    rewrittenFiles += 1;
  }
}

await fs.writeFile(path.join(outDir, ".nojekyll"), "");

console.log(
  `Prepared GitHub Pages export at ${basePath} (${rewrittenFiles} files rewritten).`,
);
