"use client";

import { useTranslations } from "next-intl";
import type { FitMode } from "../../../src/domain/booklet-utils";
import { FitModes } from "../../../src/domain/booklet-utils";
import styles from "./fit-mode-selector.module.css";

interface FitModeSelectorProps {
  value: FitMode;
  onChange: (mode: FitMode) => void;
}

const MODES = [
  {
    mode: FitModes.STRETCH,
    labelKey: "fitModeStretch" as const,
    imgSrc: "/images/img-mode-01.svg",
  },
  {
    mode: FitModes.COVER,
    labelKey: "fitModeCover" as const,
    imgSrc: "/images/img-mode-02.svg",
  },
  {
    mode: FitModes.CONTAIN,
    labelKey: "fitModeContain" as const,
    imgSrc: "/images/img-mode-03.svg",
  },
];

export function FitModeSelector({ value, onChange }: FitModeSelectorProps) {
  const t = useTranslations("Home");

  return (
    <div
      className={styles.container}
      role="group"
      aria-label={t("fitModeLabel")}
    >
      <h3>{t("fitModeLabel")}</h3>
      <div className={styles.options}>
        {MODES.map(({ mode, labelKey, imgSrc }) => {
          const selected = value === mode;
          return (
            <button
              key={mode}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(mode)}
              className={[
                styles.card,
                selected ? styles.cardSelected : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className={styles.header}>
                <span className={styles.text}>{t(labelKey)}</span>
              </span>
              <img src={imgSrc} alt="" className={styles.image} />
            </button>
          );
        })}
      </div>
    </div>
  );
}