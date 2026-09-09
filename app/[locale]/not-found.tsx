"use client";

import { useTranslations } from "next-intl";
import styles from "./not-found.module.css";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <section className={styles.root}>
      <h1 className={styles.title}>
        {t("title")}
      </h1>
      <p className={styles.description}>{t("description")}</p>
    </section>
  );
}
