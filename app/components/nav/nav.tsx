"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "../../../src/i18n/navigation";
import { ThemeToggle } from "../theme-toggle";
import { LocaleSwitcher } from "../locale-switcher";
import { Button } from "../ui/button";
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
          <Button
            key={path}
            as={Link}
            href={path}
            variant="secondary"
            aria-current={pathname === path ? "page" : undefined}
          >
            {t(key)}
          </Button>
        ))}
      </div>
      <div className={styles.controls}>
        {/* Removing the theme toggle while the dark theme has not been implemented */}
        {/* <ThemeToggle /> */}
        <LocaleSwitcher />
      </div>
    </nav>
  );
}
