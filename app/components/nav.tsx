"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

const navItems = {
  "/": {
    name: "home",
  },
  "/about-me": {
    name: "about me",
  },
};

export function Navbar() {
  let pathname = usePathname();
  if (pathname.endsWith("/") && pathname !== "/") {
    pathname = pathname.slice(0, -1);
  }

  return (
    <aside className="-ml-[8px] mb-8 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row items-center space-x-0 pr-10">
            {Object.entries(navItems).map(([path, { name }]) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={path}
                  href={path}
                  className={`transition-all text-stone-600 dark:text-stone-400 flex align-middle relative py-1 px-2 m-1 text-sm ${
                    isActive
                      ? "font-medium text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400"
                      : "hover:text-stone-900 dark:hover:text-stone-200"
                  }`}
                >
                  {name}
                </Link>
              );
            })}
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </aside>
  );
}
