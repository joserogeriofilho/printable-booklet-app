"use client";

import { useTranslations } from "next-intl";
import type { BookletSize, FitMode } from "../../../../src/domain/booklet-utils";
import { FitModeSelector } from "../../../components/fit-mode-selector";
import { Field } from "../../../components/ui/field";
import { Select } from "../../../components/ui/select";
import { Stepper } from "../../../components/ui/stepper";
import styles from "./setup-section.module.css";

interface SetupSectionProps {
  size: BookletSize;
  onSizeChange: (size: BookletSize) => void;
  sheets: number;
  onSheetsChange: (sheets: number) => void;
  files: File[] | null;
  onFilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalPages: number;
  isSheetsInvalid: boolean;
  fitMode: FitMode;
  onFitModeChange: (mode: FitMode) => void;
  bgColor: string;
  onBgColorChange: (color: string) => void;
}

export function SetupSection({
  size,
  onSizeChange,
  sheets,
  onSheetsChange,
  files,
  onFilesChange,
  totalPages,
  isSheetsInvalid,
  fitMode,
  onFitModeChange,
  bgColor,
  onBgColorChange,
}: SetupSectionProps) {
  const t = useTranslations("Home");

  return (
    <section>
      <h2 id="step1" className={styles.stepTitle}>
        {t("step1")}
      </h2>

      <div className={styles.stepBody}>
        <Field id="size" label={t("sizeLabel")}>
          <Select
            id="size"
            name="size"
            value={size}
            onChange={(e) => onSizeChange(e.target.value as BookletSize)}
          >
            <option value="A5">A5 — 148 × 210 mm</option>
            <option value="A6">A6 — 105 × 148 mm</option>
            <option value="A7">A7 — 74 × 105 mm</option>
            <option value="A8">A8 — 52 × 74 mm</option>
          </Select>
        </Field>

        <Field
          id="sheets"
          label={t("sheetsLabel")}
          hint={t("sheetsRange")}
          error={isSheetsInvalid ? t("sheetsError") : undefined}
        >
          <Stepper
            id="sheets"
            value={sheets}
            onChange={onSheetsChange}
            decreaseLabel={t("decreaseSheets")}
            increaseLabel={t("increaseSheets")}
          />
        </Field>

        <Field
          id="images"
          label={t("imagesLabel")}
          hint={
            sheets > 0
              ? `${totalPages} ${t("neededSuffix")}`
              : t("sheetsRequired")
          }
        >
          <input
            type="file"
            id="images"
            name="images"
            className={styles.fileInput}
            multiple
            accept="image/*"
            onChange={onFilesChange}
          />
          {files && files.length < totalPages && (
            <p className={styles.errorMessage}>
              {t("notEnoughFiles", { totalPages })}
            </p>
          )}
        </Field>

        <FitModeSelector value={fitMode} onChange={onFitModeChange} />

        {fitMode === "contain" && (
          <Field id="bgColor" label={t("bgColorLabel")}>
            <div className={styles.colorRow}>
              <input
                type="color"
                id="bgColor"
                name="bgColor"
                className={styles.colorInput}
                value={bgColor}
                onChange={(e) => onBgColorChange(e.target.value)}
              />
              <input
                type="text"
                className={styles.colorText}
                value={bgColor}
                onChange={(e) => onBgColorChange(e.target.value)}
                placeholder="#ffffff"
                maxLength={7}
              />
            </div>
          </Field>
        )}
      </div>
    </section>
  );
}
