"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "../../../src/i18n/navigation";
import { ThemeToggle } from "../theme-toggle";
import { LocaleSwitcher } from "../locale-switcher";
import styles from "./nav.module.css";

const navItems = [
  { path: "/", key: "home" },
  { path: "/about-me", key: "aboutMe" },
] as const;

export function Navbar() {
  const t = useTranslations("Nav");
  let pathname = usePathname();

  if (pathname.endsWith("/") && pathname !== "/") {
    pathname = pathname.slice(0, -1);
  }

  return (
    <nav className={styles.nav} id="nav">
      <div className={styles.links}>
        {navItems.map(({ path, key }) => (
          <Link key={path} href={path}>
            {t(key)}
          </Link>
        ))}
      </div>
      <div className={styles.controls}>
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
    </nav>
  );
}
