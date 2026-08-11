import Link from "next/link";
import { BrandWordmark } from "./icons";
import styles from "./HeaderBrand.module.css";

export function HeaderBrand() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link aria-label="Accueil — Corniche" className={styles.link} href="/">
          <BrandWordmark className={styles.logo} />
        </Link>
      </div>
    </header>
  );
}
