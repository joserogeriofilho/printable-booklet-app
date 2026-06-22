"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";

interface BookletPreviewProps {
  files: FileList | null;
  totalPages: number;
}

const CARD_WIDTH = 160;
const CARD_GAP = 12;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const BUFFER = 3;

export default function BookletPreview({
  files,
  totalPages,
}: BookletPreviewProps) {
  const t = useTranslations("Home");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [imageUrls, setImageUrls] = useState<Map<number, string>>(new Map());
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 8 });
  const allUrlsRef = useRef<Set<string>>(new Set());

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

    setImageUrls((prev) => {
      const next = new Map(prev);

      for (const [idx, url] of prev) {
        if (idx < start || idx >= end) {
          URL.revokeObjectURL(url);
          allUrlsRef.current.delete(url);
          next.delete(idx);
        }
      }

      for (let i = start; i < Math.min(end, maxIndex); i++) {
        if (!next.has(i)) {
          const url = URL.createObjectURL(files[i]);
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
    updateRange(); // eslint-disable-line react-hooks/set-state-in-effect

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
    <div
      ref={scrollRef}
      className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2"
      style={{ scrollbarWidth: "thin" }}
    >
      {Array.from({ length: totalPages }, (_, i) => {
        const url = imageUrls.get(i);
        const isVisible = i >= visibleRange.start && i < visibleRange.end;
        const hasImage = i < files.length;

        return (
          <div key={i} className="flex-shrink-0 snap-center">
            <div className="relative w-[160px] aspect-[1/1.414] bg-stone-200 dark:bg-stone-700 rounded border border-stone-300 dark:border-stone-600 overflow-hidden">
              <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-stone-900/70 dark:bg-stone-950/80 text-stone-100 leading-tight">
                {t("previewPage", { number: i + 1 })}
              </div>

              {isVisible && url ? (
                <img
                  src={url}
                  alt={t("previewPage", { number: i + 1 })}
                  className="w-full h-full object-cover"
                  loading="lazy"
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
  );
}
