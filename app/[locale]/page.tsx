"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import IllustratedSection from "../components/illustrated-section";
import { getTotalPages, generatePdf } from "../../src/domain/booklet-utils";
import type { BookletSize } from "../../src/domain/booklet-utils";

const formFieldClasses =
  "w-full md:max-w-sm px-4 py-2.5 text-sm border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100";

const inputClasses = `${formFieldClasses} placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition`;

const selectClasses = `${formFieldClasses} pr-10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition`;

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
  const [files, setFiles] = useState<FileList | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const totalPages = getTotalPages(numberOfSheets, size);

  const isSheetsInvalid = numberOfSheets < 1 || numberOfSheets > 50;

  const isDisabled =
    files === null || files.length < totalPages || isSheetsInvalid;

  const onChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleDownload = async () => {
    if (!files) return;
    setIsGenerating(true);
    setError(null);
    try {
      await generatePdf(numberOfSheets, size, files, (current, total) => {
        setProgress({ current, total });
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : t("generatingError"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section>
      <header className="mb-8">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          {t("title")}
        </h1>
        <p className="text text-stone-500 dark:text-stone-400 leading-relaxed mb-5">
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
            className="inline-flex items-center bg-[#FFDD00] text-stone-900 hover:bg-[#f5d600] dark:bg-[#FFDD00] dark:text-stone-900 dark:hover:bg-[#f5d600] transition-colors duration-200 rounded"
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
            className="mb-5 text-lg font-semibold text-stone-800 dark:text-stone-200 tracking-tight"
          >
            {t("step1")}
          </h2>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="size"
                className="block mb-2 text-sm font-medium text-stone-700 dark:text-stone-300"
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
                  className="text-sm font-medium text-stone-700 dark:text-stone-300"
                >
                  {t("sheetsLabel")}
                </label>
                <span className="text-xs text-stone-400 dark:text-stone-500 font-mono">
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
                  className="px-4 py-2.5 text-lg font-medium border border-r-0 border-stone-300 dark:border-stone-600 rounded-l bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 active:bg-stone-200 dark:active:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:z-10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 select-none leading-none min-w-[44px]"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={50}
                  id="sheets"
                  name="sheets"
                  className={`${inputClasses} rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    isSheetsInvalid
                      ? "!border-red-500 dark:!border-red-400 !ring-red-500"
                      : ""
                  }`}
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
                  className="px-4 py-2.5 text-lg font-medium border border-l-0 border-stone-300 dark:border-stone-600 rounded-r bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 active:bg-stone-200 dark:active:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:z-10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 select-none leading-none min-w-[44px]"
                >
                  +
                </button>
              </div>
              {isSheetsInvalid && (
                <div className="text-xs text-red-600 dark:text-red-400 mt-2 block">
                  {t("sheetsError")}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label
                  htmlFor="images"
                  className="text-sm font-medium text-stone-700 dark:text-stone-300"
                >
                  {t("imagesLabel")}
                </label>
                <span className="text-xs text-stone-400 dark:text-stone-500 font-mono">
                  {numberOfSheets > 0
                    ? `${totalPages} ${t("neededSuffix")}`
                    : t("sheetsRequired")}
                </span>
              </div>
              <input
                type="file"
                id="images"
                name="images"
                className="w-full md:max-w-sm text-sm text-stone-500 dark:text-stone-400 file:mr-4 file:py-2.5 file:px-5 file:rounded file:border-0 file:text-sm file:font-medium file:bg-stone-200 dark:file:bg-stone-700 file:text-stone-700 dark:file:text-stone-200 hover:file:bg-stone-300 dark:hover:file:bg-stone-600 file:cursor-pointer file:transition"
                multiple
                accept="image/*"
                onChange={onChangeFiles}
              />
              <p className="md:max-w-sm mt-2 text-xs text-stone-400 dark:text-stone-500">
                {t("imagesHint")}
              </p>
              {files && files.length < totalPages && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  {t("notEnoughFiles", { totalPages })}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Step 2: Preview */}
        <section>
          <h2 className="mb-5 text-lg font-semibold text-stone-800 dark:text-stone-200 tracking-tight">
            {t("step2")}
          </h2>
          <div className="rounded border border-dashed border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-800/50 py-8 px-6 text-center">
            <p className="text-sm text-stone-400 dark:text-stone-500">
              {t("previewPlaceholder")}
            </p>
          </div>
        </section>

        {/* Step 3: Download */}
        <section>
          <h2 className="mb-5 text-lg font-semibold text-stone-800 dark:text-stone-200 tracking-tight">
            {t("step3")}
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
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
              <span className="text-sm text-stone-500 dark:text-stone-400 font-mono">
                {t("generatingProgress", {
                  current: progress.current,
                  total: progress.total,
                })}
              </span>
            )}
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </section>

        {/* Step 4: Mount */}
        <section>
          <h2 className="mb-5 text-lg font-semibold text-stone-800 dark:text-stone-200 tracking-tight">
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
