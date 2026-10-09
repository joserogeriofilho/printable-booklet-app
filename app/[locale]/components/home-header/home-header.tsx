"use client";

import { useTranslations } from "next-intl";
import { GitHubButton } from "../../../components/github-button";
import { BuyMeACoffee } from "../../../components/buy-me-a-coffee";
import styles from "./home-header.module.css";

export function HomeHeader() {
  const t = useTranslations("Home");

  return (
    <header className={styles.header}>
      <h1>{t("title")}</h1>
      <p className={styles.description}>{t("description")}</p>
      <div className={styles.links}>
        <GitHubButton />
        <BuyMeACoffee />
      </div>
    </header>
  );
}
