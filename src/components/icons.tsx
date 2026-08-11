import type { CSSProperties } from "react";

interface AssetIconProps {
  className?: string;
  style?: CSSProperties;
}

export function BrandWordmark({ className, style }: AssetIconProps) {
  return (
    <img
      alt="Corniche"
      className={className}
      draggable={false}
      src="/images/corniche/logo-footer.png"
      style={style}
    />
  );
}

export function RestaurantMark({ className, style }: AssetIconProps) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className={className}
      draggable={false}
      src="/images/corniche/motif.png"
      style={style}
    />
  );
}

export function HotelMark({ className, style }: AssetIconProps) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className={className}
      draggable={false}
      src="/images/corniche/logo-footer.png"
      style={style}
    />
  );
}

export function CloseIcon({ className }: AssetIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 30 30"
    >
      <path d="M2 2 28 28M28 2 2 28" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function ArrowBackIcon({ className }: AssetIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 52 12"
    >
      <path d="M0 6h51M6 1 1 6l5 5" stroke="currentColor" />
    </svg>
  );
}
