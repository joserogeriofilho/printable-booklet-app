"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "../../src/i18n/navigation";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitcher } from "./locale-switcher";

const navItems = [
  { path: "/", key: "home" },
  { path: "/about-me", key: "aboutMe" },
] as const;

const activeClasses = "";

const linkClasses = "flex align-middle relative py-1 px-2 m-1";

export function Navbar() {
  const t = useTranslations("Nav");
  let pathname = usePathname();

  if (pathname.endsWith("/") && pathname !== "/") {
    pathname = pathname.slice(0, -1);
  }

  return (
    <aside className="-ml-[8px] mb-8">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-center relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row items-center space-x-0 pr-10">
            {navItems.map(({ path, key }) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={path}
                  href={path}
                  className={`${linkClasses} ${isActive ? activeClasses : ""}`}
                >
                  {t(key)}
                </Link>
              );
            })}
          </div>
          <div className="ml-auto flex flex-row items-center">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </aside>
  );
}
