"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import IllustradedSection from "../components/illustraded-section";
import { getTotalPages, generatePdf } from "../domain";
import type { BookletSize } from "../domain";

const formFieldClasses =
  "w-full max-w-xs px-4 py-2.5 text-sm border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100";

const inputClasses = `${formFieldClasses} placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition`;

const selectClasses = `${formFieldClasses} focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition`;

export default function Page() {
  const t = useTranslations("Home");
  const [numberOfSheets, setNumberOfSheets] = useState(1);
  const [size, setSize] = useState<BookletSize>("A5");
  const [files, setFiles] = useState<FileList | null>(null);

  const totalPages = getTotalPages(numberOfSheets, size);

  const onChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  return (
    <section>
      <header className="mb-8">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          {t("title")}
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-5">
          {t("description")}
        </p>
        <div className="flex flex-row gap-4">
          <a
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
            href="#step1"
          >
            {t("tryItNow")}
          </a>
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
        </div>
      </header>

      <h2 className="mb-5 text-lg font-semibold text-stone-800 dark:text-stone-200 tracking-tight">
        Instructions
      </h2>

      <div className="grid gap-y-5 grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <IllustradedSection>
          <IllustradedSection.Text>
            {t("instructions1")}
          </IllustradedSection.Text>
          <IllustradedSection.Media>
            <img src="/images/01-print.svg" />
          </IllustradedSection.Media>
        </IllustradedSection>

        <IllustradedSection>
          <IllustradedSection.Text>
            {t("instructions2")}
          </IllustradedSection.Text>
          <IllustradedSection.Media>
            <img src="/images/02-cut.svg" />
          </IllustradedSection.Media>
        </IllustradedSection>

        <IllustradedSection>
          <IllustradedSection.Text>
            {t("instructions3")}
          </IllustradedSection.Text>
          <IllustradedSection.Media>
            <img src="/images/03-mount.svg" />
          </IllustradedSection.Media>
        </IllustradedSection>

        <IllustradedSection>
          <IllustradedSection.Text>
            {t("instructions4")}
          </IllustradedSection.Text>
          <IllustradedSection.Media>
            <img src="/images/04-fold.svg" />
          </IllustradedSection.Media>
        </IllustradedSection>

        <IllustradedSection>
          <IllustradedSection.Text>
            {t("instructions5")}
          </IllustradedSection.Text>
          <IllustradedSection.Media>
            <img src="/images/05-staple.svg" />
          </IllustradedSection.Media>
        </IllustradedSection>
      </div>

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
              <input
                type="number"
                min={1}
                max={50}
                id="sheets"
                name="sheets"
                className={inputClasses}
                value={numberOfSheets}
                onChange={(e) =>
                  setNumberOfSheets(parseInt(e.target.value) || 1)
                }
              />
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
                  {totalPages} {t("neededSuffix")}
                </span>
              </div>
              <input
                type="file"
                id="images"
                name="images"
                className="w-full max-w-xs text-sm text-stone-500 dark:text-stone-400 file:mr-4 file:py-2.5 file:px-5 file:rounded file:border-0 file:text-sm file:font-medium file:bg-stone-200 dark:file:bg-stone-700 file:text-stone-700 dark:file:text-stone-200 hover:file:bg-stone-300 dark:hover:file:bg-stone-600 file:cursor-pointer file:transition"
                multiple
                accept="image/*"
                onChange={onChangeFiles}
              />
              <p className="mt-2 text-xs text-stone-400 dark:text-stone-500 max-w-xs">
                {t("imagesHint")}
              </p>
              {files && files.length < totalPages && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
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
          <div className="flex flex-wrap gap-4">
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => files && generatePdf(numberOfSheets, size, files)}
              disabled={!files || files.length < totalPages}
            >
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
            </button>
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
        </section>
      </div>
    </section>
  );
}
