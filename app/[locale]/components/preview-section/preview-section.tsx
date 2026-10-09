"use client";

import { useTranslations } from "next-intl";
import type { FitMode } from "../../../../src/domain/booklet-utils";
import { BookletPreview } from "../../../components/booklet-preview";
import styles from "./preview-section.module.css";

interface PreviewSectionProps {
  files: File[] | null;
  totalPages: number;
  fitMode: FitMode;
  bgColor: string;
  onReorder: (files: File[]) => void;
}

export function PreviewSection({
  files,
  totalPages,
  fitMode,
  bgColor,
  onReorder,
}: PreviewSectionProps) {
  const t = useTranslations("Home");

  return (
    <section>
      <h2 id="step2" className={styles.stepTitle}>
        {t("step2")}
      </h2>
      <p className={styles.help}>{t("previewHelp")}</p>
      <BookletPreview
        files={files}
        totalPages={totalPages}
        fitMode={fitMode}
        backgroundColor={bgColor}
        onReorder={onReorder}
      />
    </section>
  );
}
