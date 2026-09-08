"use client";

import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("About");

  return (
    <section>
      <header className="mb-12">
        <h1 className="mb-3">
          {t("title")}
        </h1>
        {t.rich("description", {
          p: (chunks) => (
            <p className="mb-2">
              {chunks}
            </p>
          ),
          github: (chunks) => (
            <a
              href="https://github.com/joserogeriofilho"
              target="_blank"
              rel="noopener noreferrer"
            >
              {chunks}
            </a>
          ),
          linkedin: (chunks) => (
            <a
              href="https://linkedin.com/in/joserogeriofilho"
              target="_blank"
              rel="noopener noreferrer"
            >
              {chunks}
            </a>
          ),
        })}
      </header>
    </section>
  );
}
