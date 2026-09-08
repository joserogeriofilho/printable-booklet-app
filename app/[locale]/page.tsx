"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import IllustratedSection from "../components/illustrated-section";
import BookletPreview from "../components/booklet-preview";
import { getTotalPages, generatePdf } from "../../src/domain/booklet-utils";
import type { BookletSize, FitMode } from "../../src/domain/booklet-utils";
import FitModeSelector from "../components/fit-mode-selector";

const formFieldClasses = "w-full md:max-w-sm px-4 py-2.5";

const inputClasses = formFieldClasses;

const selectClasses = `${formFieldClasses} pr-10`;

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
    <section>
      <header className="mb-8">
        <h1 className="mb-3">
          {t("title")}
        </h1>
        <p className="mb-5">
          {t("description")}
        </p>
        <div className="flex flex-row gap-4">
          <a
            href="https://github.com/joserogeriofilho/printable-booklet-app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-stone-800 text-stone-100 hover:bg-stone-600 dark:bg-stone-600 dark:text-stone-100 dark:hover:bg-stone-400 transition-colors duration-200 rounded"
          >
            <img
              src="/images/github-logo.svg"
              alt="GitHub"
              className="w-5 h-5 mr-2"
            />
            Github
          </a>
          <a
            href="https://www.buymeacoffee.com/roger.sama"
            target="_blank"
            className="inline-flex items-center"
          >
            <img
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
              style={{ height: "36px" }}
              alt="Buy Me a Coffee"
            />
          </a>
        </div>
      </header>

      <div className="space-y-10">
        {/* Step 1: Setup */}
        <section>
          <h2
            id="step1"
            className="mb-5"
          >
            {t("step1")}
          </h2>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="size"
                className="block mb-2"
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
              <div className="flex items-center gap-2 mb-2">
                <label
                  htmlFor="sheets"
                >
                  {t("sheetsLabel")}
                </label>
                <span>
                  {t("sheetsRange")}
                </span>
              </div>
              <div className="flex w-full md:max-w-sm">
                <button
                  onClick={() => {
                    if (numberOfSheets > 1) {
                      setNumberOfSheets(numberOfSheets - 1);
                    }
                  }}
                  disabled={numberOfSheets <= 1}
                  aria-label={t("decreaseSheets")}
                  className="px-4 py-2.5 focus:z-10 disabled:opacity-40 disabled:cursor-not-allowed select-none min-w-[44px]"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={50}
                  id="sheets"
                  name="sheets"
                  className={`${inputClasses} text-center`}
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
                  className="px-4 py-2.5 focus:z-10 disabled:opacity-40 disabled:cursor-not-allowed select-none min-w-[44px]"
                >
                  +
                </button>
              </div>
              {isSheetsInvalid && (
                <div className="mt-2 block">
                  {t("sheetsError")}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
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
                className="w-full md:max-w-sm file:mr-4 file:py-2.5 file:px-5 file:cursor-pointer"
                multiple
                accept="image/*"
                onChange={onChangeFiles}
              />
              <p className="md:max-w-sm mt-2">
                {t("imagesHint")}
              </p>
              {files && files.length < totalPages && (
                <p className="mt-2">
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
                  className="block mb-2"
                >
                  {t("bgColorLabel")}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="bgColor"
                    name="bgColor"
                    className="w-10 h-10 cursor-pointer p-0.5"
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
          <h2 className="mb-5">
            {t("step2")}
          </h2>
          <p className="mb-4">
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
          <h2 className="mb-5">
            {t("step3")}
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={handleDownload}
              disabled={isDisabled || isGenerating}
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin"
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
            <p className="mt-3">
              {error}
            </p>
          )}
        </section>

        {/* Step 4: Mount */}
        <section>
          <h2 className="mb-5">
            {t("step4")}
          </h2>

          <div className="grid gap-y-5 grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
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
