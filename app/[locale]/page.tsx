"use client";

import { useBookletForm } from "./use-booklet-form";
import { HomeHeader } from "./components/home-header";
import { SetupSection } from "./components/setup-section";
import { PreviewSection } from "./components/preview-section";
import { DownloadSection } from "./components/download-section";
import { MountSection } from "./components/mount-section";
import styles from "./page.module.css";

export default function Page() {
  const form = useBookletForm();

  return (
    <div className={styles.root}>
      <HomeHeader />
      <SetupSection
        size={form.size}
        onSizeChange={form.setSize}
        sheets={form.numberOfSheets}
        onSheetsChange={form.setNumberOfSheets}
        files={form.files}
        onFilesChange={form.onChangeFiles}
        totalPages={form.totalPages}
        isSheetsInvalid={form.isSheetsInvalid}
        fitMode={form.fitMode}
        onFitModeChange={form.setFitMode}
        bgColor={form.bgColor}
        onBgColorChange={form.setBgColor}
      />
      <PreviewSection
        files={form.files}
        totalPages={form.totalPages}
        fitMode={form.fitMode}
        bgColor={form.bgColor}
        onReorder={form.handleReorder}
      />
      <DownloadSection
        onDownload={form.handleDownload}
        isGenerating={form.isGenerating}
        isDisabled={form.isDisabled}
        error={form.error}
        progress={form.progress}
      />
      <MountSection />
    </div>
  );
}
