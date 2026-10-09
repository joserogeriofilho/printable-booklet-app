"use client";

import { useTranslations } from "next-intl";
import { Button } from "../../../components/ui/button";
import styles from "./download-section.module.css";

interface DownloadSectionProps {
  onDownload: () => void;
  isGenerating: boolean;
  isDisabled: boolean;
  error: string | null;
  progress: { current: number; total: number };
}

export function DownloadSection({
  onDownload,
  isGenerating,
  isDisabled,
  error,
  progress,
}: DownloadSectionProps) {
  const t = useTranslations("Home");

  return (
    <section>
      <h2 id="step3" className={styles.stepTitle}>
        {t("step3")}
      </h2>
      <div className={styles.downloadRow}>
        <Button
          variant="primary"
          onClick={onDownload}
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
        </Button>
        {isGenerating && progress.total > 0 && (
          <span>
            {t("generatingProgress", {
              current: progress.current,
              total: progress.total,
            })}
          </span>
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
}
