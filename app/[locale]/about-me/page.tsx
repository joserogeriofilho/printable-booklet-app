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
      </header>
    </section>
  );
}
