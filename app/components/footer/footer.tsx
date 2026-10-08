"use client";

import { useTranslations } from "next-intl";
import { Link } from "../../../src/i18n/navigation";
import styles from "./footer.module.css";

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer>
      <ul className={styles.list}>
        <li>
          <Link
            className={styles.link}
            href="https://github.com/joserogeriofilho/printable-booklet-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ArrowIcon />
            <span className={styles.linkText}>{t("site")}</span>
          </Link>
        </li>
      </ul>
      <p className={styles.copyright}>
        {t("copyright", { year: new Date().getFullYear() })}
      </p>
    </footer>
  );
}
