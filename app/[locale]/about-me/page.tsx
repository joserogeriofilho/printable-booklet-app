"use client";

import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("About");

  return (
    <section>
      <header className="mb-12">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          {t("title")}
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-md">
          {t("description")}
        </p>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-4 py-2 bg-stone-800 text-stone-100 hover:bg-stone-600 dark:bg-stone-600 dark:text-stone-100 dark:hover:bg-stone-400 transition-colors duration-200 rounded mr-4"
        >
          Github
        </a>

        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-stone-100 hover:bg-blue-700 dark:bg-blue-600 dark:text-stone-100 dark:hover:bg-blue-400 transition-colors duration-200 rounded"
        >
          Linkedin
        </a>
      </header>
    </section>
  );
}
