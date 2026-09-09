"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IllustratedSection } from "../components/illustrated-section";
import { BookletPreview } from "../components/booklet-preview";
import { getTotalPages, generatePdf } from "../../src/domain/booklet-utils";
import type { BookletSize, FitMode } from "../../src/domain/booklet-utils";
import { FitModeSelector } from "../components/fit-mode-selector";
import { GitHubButton } from "../components/github-button";
import { BuyMeACoffee } from "../components/buy-me-a-coffee";
import styles from "./page.module.css";

const inputClasses = styles.field;

const selectClasses = styles.select;

const instructions = [
  { key: "instructions1", img: "/images/01-print.svg" },
  { key: "instructions2", img: "/images/02-cut.svg" },
  { key: "instructions3", img: "/images/03-mount.svg" },
  { key: "instructions4", img: "/images/04-fold.svg" },
  { key: "instructions5", img: "/images/05-staple.svg" },
];

export default function Page() {
  const t = useTranslations("Home");
  const [numberOfSheets, setNumberOfSheets] = useState(1);
  const [size, setSize] = useState<BookletSize>("A5");
  const [files, setFiles] = useState<File[] | null>(null);
  const [fitMode, setFitMode] = useState<FitMode>("stretch");
  const [bgColor, setBgColor] = useState("#ffffff");

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const totalPages = getTotalPages(numberOfSheets, size);

  const isSheetsInvalid = numberOfSheets < 1 || numberOfSheets > 50;

  const isDisabled =
    files === null || files.length < totalPages || isSheetsInvalid;

  const onChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    setFiles(fileList ? Array.from(fileList) : null);
  };

  const handleReorder = (newOrder: File[]) => {
    setFiles(newOrder);
  };

  const handleDownload = async () => {
    if (!files) return;
    setIsGenerating(true);
    setError(null);
    try {
      await generatePdf(
        numberOfSheets,
        size,
        fitMode,
        bgColor,
        files,
        (current, total) => {
          setProgress({ current, total });
        },
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : t("generatingError"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {t("title")}
        </h1>
        <p className={styles.description}>
          {t("description")}
        </p>
        <div className={styles.links}>
          <GitHubButton />
          <BuyMeACoffee />
        </div>
      </header>

      <div className={styles.steps}>
        {/* Step 1: Setup */}
        <section>
          <h2
            id="step1"
            className={styles.stepTitle}
          >
            {t("step1")}
          </h2>

          <div className={styles.stepBody}>
            <div>
              <label
                htmlFor="size"
                className={styles.fieldLabel}
              >
                {t("sizeLabel")}
              </label>
              <select
                id="size"
                name="size"
                className={selectClasses}
                value={size}
                onChange={(e) => setSize(e.target.value as BookletSize)}
              >
                <option value="A5">A5 — 148 × 210 mm</option>
                <option value="A6">A6 — 105 × 148 mm</option>
                <option value="A7">A7 — 74 × 105 mm</option>
                <option value="A8">A8 — 52 × 74 mm</option>
              </select>
            </div>

            <div>
              <div className={styles.fieldRow}>
                <label
                  htmlFor="sheets"
                >
                  {t("sheetsLabel")}
                </label>
                <span>
                  {t("sheetsRange")}
                </span>
              </div>
              <div className={styles.stepper}>
                <button
                  onClick={() => {
                    if (numberOfSheets > 1) {
                      setNumberOfSheets(numberOfSheets - 1);
                    }
                  }}
                  disabled={numberOfSheets <= 1}
                  aria-label={t("decreaseSheets")}
                  className={styles.stepperButton}
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={50}
                  id="sheets"
                  name="sheets"
                  className={styles.numberInput}
                  value={numberOfSheets || ""}
                  onChange={(e) => {
                    const raw = parseInt(e.target.value);
                    if (!isNaN(raw)) {
                      setNumberOfSheets(Math.min(50, Math.max(1, raw)));
                    } else {
                      setNumberOfSheets(0);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (numberOfSheets < 50) {
                      setNumberOfSheets(numberOfSheets + 1);
                    }
                  }}
                  disabled={numberOfSheets >= 50}
                  aria-label={t("increaseSheets")}
                  className={styles.stepperButton}
                >
                  +
                </button>
              </div>
              {isSheetsInvalid && (
                <div className={styles.fieldError}>
                  {t("sheetsError")}
                </div>
              )}
            </div>

            <div>
              <div className={styles.fieldRow}>
                <label
                  htmlFor="images"
                >
                  {t("imagesLabel")}
                </label>
                <span>
                  {numberOfSheets > 0
                    ? `${totalPages} ${t("neededSuffix")}`
                    : t("sheetsRequired")}
                </span>
              </div>
              <input
                type="file"
                id="images"
                name="images"
                className={styles.fileInput}
                multiple
                accept="image/*"
                onChange={onChangeFiles}
              />
              <p className={styles.hint}>
                {t("imagesHint")}
              </p>
              {files && files.length < totalPages && (
                <p className={styles.note}>
                  {t("notEnoughFiles", { totalPages })}
                </p>
              )}
            </div>

            <FitModeSelector
              value={fitMode}
              onChange={setFitMode}
            />

            {fitMode === "contain" && (
              <div>
                <label
                  htmlFor="bgColor"
                  className={styles.fieldLabel}
                >
                  {t("bgColorLabel")}
                </label>
                <div className={styles.colorRow}>
                  <input
                    type="color"
                    id="bgColor"
                    name="bgColor"
                    className={styles.colorInput}
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                  <input
                    type="text"
                    className={inputClasses}
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    placeholder="#ffffff"
                    maxLength={7}
                  />
                </div>
              </div>
            )}

          </div>
        </section>

        {/* Step 2: Preview */}
        <section>
          <h2 className={styles.stepTitle}>
            {t("step2")}
          </h2>
          <p className={styles.help}>
            {t("previewHelp")}
          </p>
          <BookletPreview
            files={files}
            totalPages={totalPages}
            fitMode={fitMode}
            backgroundColor={bgColor}
            onReorder={handleReorder}
          />
        </section>

        {/* Step 3: Download */}
        <section>
          <h2 className={styles.stepTitle}>
            {t("step3")}
          </h2>
          <div className={styles.downloadRow}>
            <button
              className={styles.downloadButton}
              onClick={handleDownload}
              disabled={isDisabled || isGenerating}
            >
              {isGenerating ? (
                <>
                  <svg
                    className={styles.spinner}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" strokeDasharray="32" />
                  </svg>
                  {t("generating")}
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {t("downloadPdf")}
                </>
              )}
            </button>
            {isGenerating && progress.total > 0 && (
              <span>
                {t("generatingProgress", {
                  current: progress.current,
                  total: progress.total,
                })}
              </span>
            )}
          </div>
          {error && (
            <p className={styles.error}>
              {error}
            </p>
          )}
        </section>

        {/* Step 4: Mount */}
        <section>
          <h2 className={styles.stepTitle}>
            {t("step4")}
          </h2>

          <div className={styles.instructionsGrid}>
            {instructions.map(({ key, img }) => (
              <IllustratedSection key={key}>
                <IllustratedSection.Text>{t(key)}</IllustratedSection.Text>
                <IllustratedSection.Media>
                  <img src={img} />
                </IllustratedSection.Media>
              </IllustratedSection>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
