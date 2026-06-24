"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { FitMode } from "../../src/domain/booklet-utils";

interface BookletPreviewProps {
  files: File[] | null;
  totalPages: number;
  fitMode?: FitMode;
  backgroundColor?: string;
  onReorder?: (files: File[]) => void;
}

const CARD_WIDTH = 160;
const CARD_GAP = 12;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const BUFFER = 3;

export default function BookletPreview({
  files,
  totalPages,
  fitMode = "stretch",
  backgroundColor,
  onReorder,
}: BookletPreviewProps) {
  const t = useTranslations("Home");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [imageUrls, setImageUrls] = useState<Map<number, string>>(new Map());
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 8 });
  const allUrlsRef = useRef<Set<string>>(new Set());
  const prevFilesRef = useRef(files);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [showMoveModal, setShowMoveModal] = useState<number | null>(null);
  const [moveTarget, setMoveTarget] = useState("");
  const [moveError, setMoveError] = useState<string | null>(null);

  const updateRange = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const viewStart = el.scrollLeft;
    const viewEnd = viewStart + el.clientWidth;

    const start = Math.max(0, Math.floor(viewStart / CARD_STEP) - BUFFER);
    const end = Math.min(
      totalPages,
      Math.ceil(viewEnd / CARD_STEP) + BUFFER,
    );

    setVisibleRange((prev) =>
      prev.start === start && prev.end === end ? prev : { start, end },
    );

    if (!files) return;

    const maxIndex = Math.min(files.length, totalPages);
    const filesChanged = prevFilesRef.current !== files;

    if (filesChanged) {
      allUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      allUrlsRef.current.clear();
      prevFilesRef.current = files;
    }

    const changedFlag = filesChanged;

    setImageUrls((prev) => {
      const base = changedFlag ? new Map() : prev;
      const next = new Map(base);

      base.forEach((url, idx) => {
        if (idx < start || idx >= end) {
          URL.revokeObjectURL(url);
          allUrlsRef.current.delete(url);
          next.delete(idx);
        }
      });

      for (let i = start; i < Math.min(end, maxIndex); i++) {
        if (!next.has(i)) {
          const url = URL.createObjectURL(files![i]);
          allUrlsRef.current.add(url);
          next.set(i, url);
        }
      }

      return next;
    });
  }, [files, totalPages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId = 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          updateRange();
          ticking = false;
        });
        ticking = true;
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    updateRange();

    return () => {
      el.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [updateRange]);

  useEffect(() => {
    const allUrls = allUrlsRef.current;
    return () => {
      allUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (overIndex !== index) setOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = dragIndex;
    setDragIndex(null);
    setOverIndex(null);

    if (fromIndex === null || fromIndex === toIndex || !files) return;

    const reordered = [...files];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    onReorder?.(reordered);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleCardClick = (index: number) => {
    if (!files || index >= files.length) return;
    setShowMoveModal(index);
    setMoveTarget("");
    setMoveError(null);
  };

  const handleModalClose = () => {
    setShowMoveModal(null);
    setMoveTarget("");
    setMoveError(null);
  };

  const handleMoveConfirm = () => {
    if (showMoveModal === null || !files) return;

    const target = parseInt(moveTarget, 10);

    if (isNaN(target) || target < 1 || target > totalPages) {
      setMoveError(t("moveModalInvalid", { max: totalPages }));
      return;
    }

    const targetIndex = target - 1;

    if (targetIndex === showMoveModal) {
      handleModalClose();
      return;
    }

    const reordered = [...files];
    const [moved] = reordered.splice(showMoveModal, 1);
    reordered.splice(targetIndex, 0, moved);
    onReorder?.(reordered);
    handleModalClose();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleMoveConfirm();
    } else if (e.key === "Escape") {
      handleModalClose();
    }
  };

  if (!files || files.length === 0) {
    return (
      <div className="rounded border border-dashed border-stone-300 dark:border-stone-600 bg-stone-100 dark:bg-stone-800/50 py-8 px-6 text-center">
        <p className="text-sm text-stone-400 dark:text-stone-500">
          {t("previewNoFiles")}
        </p>
      </div>
    );
  }

  return (
    <>
    <div
      ref={scrollRef}
      className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 select-none"
      style={{ scrollbarWidth: "thin" }}
    >
      {Array.from({ length: totalPages }, (_, i) => {
        const url = imageUrls.get(i);
        const isVisible = i >= visibleRange.start && i < visibleRange.end;
        const hasImage = i < files.length;
        const isDragging = dragIndex === i;
        const isOver = overIndex === i;

        return (
          <div
            key={i}
            className={`flex-shrink-0 snap-center ${
              isDragging ? "opacity-40" : ""
            } ${hasImage ? "cursor-grab" : ""}`}
            draggable={hasImage}
            onClick={hasImage ? () => handleCardClick(i) : undefined}
            onDragStart={
              hasImage ? (e) => handleDragStart(e, i) : undefined
            }
            onDragOver={
              hasImage ? (e) => handleDragOver(e, i) : undefined
            }
            onDrop={hasImage ? (e) => handleDrop(e, i) : undefined}
            onDragEnd={handleDragEnd}
          >
            <div
              className={`relative w-[160px] aspect-[1/1.414] rounded border overflow-hidden transition-colors ${
                fitMode !== "contain"
                  ? "bg-stone-200 dark:bg-stone-700"
                  : ""
              } ${
                isOver
                  ? "border-red-500 dark:border-red-400"
                  : "border-stone-300 dark:border-stone-600"
              }`}
              style={
                fitMode === "contain" && backgroundColor
                  ? { backgroundColor }
                  : undefined
              }
            >
              <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-stone-900/70 dark:bg-stone-950/80 text-stone-100 leading-tight">
                {t("previewPage", { number: i + 1 })}
              </div>

              {isVisible && url ? (
                <img
                  src={url}
                  alt={t("previewPage", { number: i + 1 })}
                  className={`w-full h-full pointer-events-none ${
                    fitMode === "cover"
                      ? "object-cover"
                      : fitMode === "contain"
                        ? "object-contain"
                        : "object-fill"
                  }`}
                  loading="lazy"
                  draggable={false}
                />
              ) : hasImage ? (
                <div className="w-full h-full animate-pulse bg-stone-300 dark:bg-stone-600" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-stone-400 dark:text-stone-500 font-mono">
                    —
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
    {showMoveModal !== null && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        onClick={handleModalClose}
      >
        <div
          className="bg-white dark:bg-stone-800 rounded-lg shadow-xl p-5 w-72"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200">
              {t("moveModalTitle", { from: showMoveModal + 1 })}
            </h3>
            <button
              onClick={handleModalClose}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={moveTarget}
            onChange={(e) => {
              setMoveTarget(e.target.value);
              setMoveError(null);
            }}
            onKeyDown={handleInputKeyDown}
            className="w-full px-3 py-1.5 text-sm border border-stone-300 dark:border-stone-600 rounded bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder=""
            autoFocus
          />
          {moveError && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {moveError}
            </p>
          )}
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={handleModalClose}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded transition-colors"
            >
              {t("moveModalCancel")}
            </button>
            <button
              onClick={handleMoveConfirm}
              className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
