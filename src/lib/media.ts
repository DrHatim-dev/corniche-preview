import manifest from "@/content/media-manifest.json";

type ImageRecord = [string, number, number, number[]];
const images = manifest.images as unknown as Record<string, ImageRecord>;
const videos = manifest.videos as Record<string, string | null>;
const imagePath = (id: string, width: number) => `/assets/corniche/optimized/images/${id}-${width}.webp`;

/** object-fit: cover can enlarge a landscape photo far beyond its container width. */
export function coverImageSizes(src: string, width: string, height: string) {
  const image = images[src];
  if (!image) return width;
  const ratio = (image[1] / image[2]).toFixed(4);
  return `max(${width}, calc(${height} * ${ratio}))`;
}

export function destinationImageSizes(src: string) {
  return `(min-width: 1280px) ${coverImageSizes(src, "31.25vw", "100vh")}, ${coverImageSizes(src, "80vw", "100vh")}`;
}

export function restaurantHeroSizes(src: string) {
  // Desktop heroes never exceed the source's native width or 1920 CSS pixels.
  return `min(100vw, ${Math.min(images[src]?.[1] ?? 1920, 1920)}px)`;
}

export function restaurantGallerySizes(src: string) {
  return coverImageSizes(src, "min(980px, calc(100vw - 48px))", "calc(min(980px, calc(100vw - 48px)) * 1.25)");
}

export function imageUrl(src: string, preferredWidth = 960) {
  const image = images[src];
  if (!image) return src;
  const [id, , , widths] = image;
  return imagePath(id, widths.find(width => width >= preferredWidth) ?? widths[widths.length - 1]);
}

export function responsiveImage(src: string, sizes = "100vw") {
  const image = images[src];
  if (!image) return { src };
  const [id, width, height, widths] = image;
  return {
    src: imageUrl(src, 960),
    srcSet: widths.map(value => `${imagePath(id, value)} ${value}w`).join(", "),
    sizes,
    width,
    height,
  };
}

export function videoUrl(src: string) {
  const id = videos[src];
  return id ? `/assets/corniche/optimized/videos/${id}.mp4` : src;
}
