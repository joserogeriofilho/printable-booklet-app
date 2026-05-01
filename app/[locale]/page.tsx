"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { getTotalPages, generatePdf } from "../domain";
import type { BookletSize } from "../domain";

const formFieldClasses =
  "w-full max-w-xs px-4 py-2.5 text-sm border border-stone-300 dark:border-stone-600 rounded-sm bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100";

const inputClasses = `${formFieldClasses} placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition`;

const selectClasses = `${formFieldClasses} focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition`;

export default function Page() {
  const t = useTranslations("Home");
  const [numberOfSheets, setNumberOfSheets] = useState(1);
  const [size, setSize] = useState<BookletSize>("A5");
  const [files, setFiles] = useState<FileList | null>(null);

  const totalPages = getTotalPages(numberOfSheets, size);

  return (
    <section>
      <header className="mb-12">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          {t("title")}
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-md">
          {t("description")}
        </p>
      </header>

      <div className="space-y-10">
        {/* Step 1: Setup */}
        <section>
          <h2 className="mb-5 text-lg font-semibold text-stone-800 dark:text-stone-200 tracking-tight">
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
                className="w-full max-w-xs text-sm text-stone-500 dark:text-stone-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-stone-200 dark:file:bg-stone-700 file:text-stone-700 dark:file:text-stone-200 hover:file:bg-stone-300 dark:hover:file:bg-stone-600 file:cursor-pointer file:transition"
                multiple
                onChange={(e) => setFiles(e.target.files)}
              />
              <p className="mt-2 text-xs text-stone-400 dark:text-stone-500 max-w-xs">
                {t("imagesHint")}
              </p>
            </div>
          </div>
        </section>

        {/* Step 2: Preview */}
        <section>
          <h2 className="mb-5 text-lg font-semibold text-stone-800 dark:text-stone-200 tracking-tight">
            {t("step2")}
          </h2>
          <div className="rounded-sm border border-dashed border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-800/50 py-8 px-6 text-center">
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
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => files && generatePdf(numberOfSheets, size, files)}
            disabled={!files}
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
        </section>
      </div>
    </section>
  );
}
