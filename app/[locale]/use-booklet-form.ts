"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { getTotalPages, generatePdf } from "../../src/domain/booklet-utils";
import type { BookletSize, FitMode } from "../../src/domain/booklet-utils";

export function useBookletForm() {
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

  return {
    numberOfSheets,
    setNumberOfSheets,
    size,
    setSize,
    files,
    setFiles,
    fitMode,
    setFitMode,
    bgColor,
    setBgColor,
    isGenerating,
    error,
    progress,
    totalPages,
    isSheetsInvalid,
    isDisabled,
    onChangeFiles,
    handleReorder,
    handleDownload,
  };
}
