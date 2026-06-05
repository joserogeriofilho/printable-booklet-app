"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const t = useTranslations("ThemeToggle");
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="transition-all text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 flex align-middle relative py-1 px-2 m-1 cursor-pointer"
      aria-label={t("label")}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
