"use client";

import { useTranslations } from "next-intl";
import { IllustratedSection } from "../../../components/illustrated-section";
import styles from "./mount-section.module.css";

const instructions = [
  { key: "instructions1", img: "/images/01-print.svg" },
  { key: "instructions2", img: "/images/02-cut.svg" },
  { key: "instructions3", img: "/images/03-mount.svg" },
  { key: "instructions5", img: "/images/05-staple.svg" },
] as const;

export function MountSection() {
  const t = useTranslations("Home");

  return (
    <section>
      <h2 id="step4" className={styles.stepTitle}>
        {t("step4")}
      </h2>

      <div className={styles.instructionsContainer}>
        {instructions.map(({ key, img }) => (
          <IllustratedSection key={key}>
            <IllustratedSection.Text>{t(key)}</IllustratedSection.Text>
            <IllustratedSection.Media>
              <img src={img} alt="" />
            </IllustratedSection.Media>
          </IllustratedSection>
        ))}
      </div>
    </section>
  );
}
