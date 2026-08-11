import { copyFile, mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const sourceRoot =
  process.env.CORNICHE_ASSET_SOURCE ??
  "C:\\Users\\alexa\\Downloads\\corniche";
const curated = join(sourceRoot, "public", "images", "corniche");
const library = join(sourceRoot, "Assets", "corniche", "images");

const assets = [
  ...[
    "aiku.jpg",
    "amoramor.jpg",
    "events.jpg",
    "hero.jpg",
    "kiki.jpg",
    "logo.png",
    "logo.svg",
    "logo-footer.png",
    "louna.jpg",
    "marion.jpg",
    "mesanueva.jpg",
    "ocean.jpg",
    "sunset.jpg",
    "tagine.jpg",
  ].map((name) => ({ from: join(curated, name), to: name })),
  { from: join(library, "favicon-192.jpg"), to: "favicon-192.jpg" },
  {
    from: join(library, "home--MotifCorniche-01.png"),
    to: "motif.png",
  },
  {
    from: join(library, "amoramor--logo-amoramor.png"),
    to: "amoramor-logo.png",
  },
  {
    from: join(library, "louna--Logo-Louna.png"),
    to: "louna-logo.png",
  },
  {
    from: join(library, "marion--Marion-Logo-01.png"),
    to: "marion-logo.png",
  },
  {
    from: join(library, "mesanueva--mesanueva.png"),
    to: "mesanueva-logo.png",
  },
  {
    from: join(library, "membership--Membership-VIPCARD-web.jpg"),
    to: "membership-vip-card.jpg",
  },
  {
    from: join(library, "membership--Bg-Membership.jpg"),
    to: "membership-bg.jpg",
  },
  {
    from: join(library, "membership--cofferet2.png"),
    to: "membership-coffret.png",
  },
  {
    from: join(library, "events--bookflip.jpg"),
    to: "events-program.jpg",
  },
  {
    from: join(library, "events--menunoelverso.jpg"),
    to: "menu-noel.jpg",
  },
  {
    from: join(library, "events--menu-marion-recto-2.0.jpg"),
    to: "menu-31-recto.jpg",
  },
  {
    from: join(library, "events--menu-marion-verso-2.O.jpg"),
    to: "menu-31-verso.jpg",
  },
  {
    from: join(library, "louna--la-scene-compressor.png"),
    to: "la-scene.png",
  },
];

const destinationRoot = join(projectRoot, "public", "images", "corniche");
await mkdir(destinationRoot, { recursive: true });

for (const asset of assets) {
  const info = await stat(asset.from);
  if (!info.isFile() || info.size === 0) {
    throw new Error(`Invalid source asset: ${asset.from}`);
  }

  const destination = join(destinationRoot, asset.to);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(asset.from, destination);
  console.log(`${asset.to} (${info.size} bytes)`);
}
