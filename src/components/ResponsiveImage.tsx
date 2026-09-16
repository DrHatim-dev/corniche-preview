import type { ImgHTMLAttributes } from "react";
import { responsiveImage } from "@/lib/media";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { src: string };

export default function ResponsiveImage({ src, sizes = "100vw", ...props }: Props) {
  return <img {...responsiveImage(src, sizes)} decoding="async" {...props} />;
}
