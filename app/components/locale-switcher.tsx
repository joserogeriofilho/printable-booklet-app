"use client";

import { usePathname, useRouter } from "../../src/i18n/navigation";
import { useLocale } from "next-intl";
import { routing } from "../../src/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <select
      value={locale}
      onChange={(e) => router.replace(pathname, { locale: e.target.value })}
      className="bg-transparent text-stone-600 dark:text-stone-400 text-sm font-mono uppercase py-1 pl-4 pr-10 m-1 cursor-pointer border border-stone-300 dark:border-stone-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {l}
        </option>
      ))}
    </select>
  );
}
