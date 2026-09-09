"use client";

import { useTranslations } from "next-intl";
import styles from "./about-me.module.css";

export default function Page() {
  const t = useTranslations("About");

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {t("title")}
        </h1>
        {t.rich("description", {
          p: (chunks) => (
            <p className={styles.paragraph}>
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
