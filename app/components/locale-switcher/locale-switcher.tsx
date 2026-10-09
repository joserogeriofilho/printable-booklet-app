"use client";

import { usePathname, useRouter } from "../../../src/i18n/navigation";
import { useLocale } from "next-intl";
import { routing } from "../../../src/i18n/routing";
import { Select } from "../ui/select";
import styles from "./locale-switcher.module.css";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Select
      value={locale}
      onChange={(e) => router.replace(pathname, { locale: e.target.value })}
      aria-label="Language"
      className={styles.select}
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {l}
        </option>
      ))}
    </Select>
  );
}
