"use client";

import type { CSSProperties } from "react";
import type { DrawerKind } from "@/types/home";
import type { BusinessDetailKind } from "./BusinessDrawer";
import styles from "./BusinessRail.module.css";

interface BusinessRailProps {
  primaryColor: string;
  activeDrawer: DrawerKind;
  onDrawerChange: (
    drawer: DrawerKind,
    initialDetail?: BusinessDetailKind | null,
  ) => void;
}

interface RailButtonProps {
  active: boolean;
  children: string;
  onClick: () => void;
}

function RailButton({
  active,
  children,
  onClick,
}: RailButtonProps) {
  return (
    <button
      aria-expanded={active}
      aria-haspopup="dialog"
      className={styles.control}
      data-active={active || undefined}
      type="button"
      onClick={onClick}
    >
      <span className={styles.inner}>
        <span className={styles.text}>{children}</span>
      </span>
    </button>
  );
}

export function BusinessRail({
  primaryColor,
  activeDrawer,
  onDrawerChange,
}: BusinessRailProps) {
  const railStyle = {
    "--business-primary": primaryColor,
  } as CSSProperties;

  return (
    <nav
      aria-label="Réservations et informations"
      className={styles.rail}
      style={railStyle}
    >
      <RailButton
        active={activeDrawer === "reservation"}
        onClick={() => onDrawerChange("reservation")}
      >
        Réserver
      </RailButton>

      <RailButton
        active={activeDrawer === "information"}
        onClick={() => onDrawerChange("information", "membership")}
      >
        Membership
      </RailButton>

      <RailButton
        active={activeDrawer === "information"}
        onClick={() => onDrawerChange("information", "dresscode")}
      >
        Dress code
      </RailButton>
    </nav>
  );
}

export default BusinessRail;
