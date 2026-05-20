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
        {t.rich("description", {
          p: (chunks) => (
            <p className="text text-stone-500 dark:text-stone-400 leading-relaxed mb-2">
              {chunks}
            </p>
          ),
          github: (chunks) => (
            <a
              href="https://github.com/joserogeriofilho"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {chunks}
            </a>
          ),
          linkedin: (chunks) => (
            <a
              href="https://linkedin.com/in/joserogeriofilho"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {chunks}
            </a>
          ),
        })}
      </header>
    </section>
  );
}
