"use client";

import { useTranslations } from "next-intl";
import type { FitMode } from "../../src/domain/booklet-utils";
import { FitModes } from "../../src/domain/booklet-utils";

interface FitModeSelectorProps {
  value: FitMode;
  onChange: (mode: FitMode) => void;
}

const cardSelectedClasses = "";
const cardDefaultClasses = "";

const MODES = [
  {
    mode: FitModes.STRETCH,
    labelKey: "fitModeStretch" as const,
    imgSrc: "/images/img-mode-01.svg",
  },
  {
    mode: FitModes.COVER,
    labelKey: "fitModeCover" as const,
    imgSrc: "/images/img-mode-02.svg",
  },
  {
    mode: FitModes.CONTAIN,
    labelKey: "fitModeContain" as const,
    imgSrc: "/images/img-mode-03.svg",
  },
];

export default function FitModeSelector({
  value,
  onChange,
}: FitModeSelectorProps) {
  const t = useTranslations("Home");

  return (
    <div>
      <span className="block mb-2">
        {t("fitModeLabel")}
      </span>
      <div className="flex gap-2 md:max-w-sm">
        {MODES.map(({ mode, labelKey, imgSrc }) => {
          const selected = value === mode;
          return (
            <label
              key={mode}
              className={`flex-1 min-w-0 flex flex-col items-center gap-2 p-2.5 cursor-pointer ${
                selected ? cardSelectedClasses : cardDefaultClasses
              }`}
            >
              <input
                type="radio"
                name="fitMode"
                value={mode}
                checked={selected}
                onChange={() => onChange(mode)}
                className="sr-only"
              />
              <img src={imgSrc} alt="" className="h-20 w-auto" />
              <span className="text-center">
                {t(labelKey)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
