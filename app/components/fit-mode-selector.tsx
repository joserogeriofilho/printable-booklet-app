"use client";

import { useTranslations } from "next-intl";
import type { FitMode } from "../../src/domain/booklet-utils";
import { FitModes } from "../../src/domain/booklet-utils";

interface FitModeSelectorProps {
  value: FitMode;
  onChange: (mode: FitMode) => void;
}

const cardSelectedClasses =
  "border-red-500 dark:border-red-400 ring-2 ring-red-500 dark:ring-red-400";
const cardDefaultClasses =
  "border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 hover:border-stone-400 dark:hover:border-stone-500";
const strokeColor = "#a8a29e";
const redFill = "#dc2626";
const bgFill = "#e7e5e4";

function StretchIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-auto shrink-0"
      aria-hidden="true"
    >
      <rect
        x="22"
        y="10"
        width="56"
        height="80"
        rx="3"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeDasharray="4,3"
      />
      <rect
        x="22"
        y="26"
        width="56"
        height="48"
        rx="2"
        fill="none"
        stroke={redFill}
        strokeWidth="1.25"
        strokeDasharray="3,2"
        opacity="0.5"
      />
      <rect
        x="22"
        y="10"
        width="56"
        height="80"
        rx="2"
        fill={redFill}
        fillOpacity="0.2"
      />
    </svg>
  );
}

function CoverIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-auto shrink-0"
      aria-hidden="true"
    >
      <rect
        x="22"
        y="10"
        width="56"
        height="80"
        rx="3"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeDasharray="4,3"
      />
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        rx="2"
        fill="none"
        stroke={redFill}
        strokeWidth="1.25"
        strokeDasharray="3,2"
        opacity="0.45"
      />
      <line
        x1="10"
        y1="10"
        x2="22"
        y2="10"
        stroke={redFill}
        strokeWidth="1"
        strokeDasharray="2,2"
        opacity="0.4"
      />
      <line
        x1="78"
        y1="10"
        x2="90"
        y2="10"
        stroke={redFill}
        strokeWidth="1"
        strokeDasharray="2,2"
        opacity="0.4"
      />
      <line
        x1="10"
        y1="90"
        x2="22"
        y2="90"
        stroke={redFill}
        strokeWidth="1"
        strokeDasharray="2,2"
        opacity="0.4"
      />
      <line
        x1="78"
        y1="90"
        x2="90"
        y2="90"
        stroke={redFill}
        strokeWidth="1"
        strokeDasharray="2,2"
        opacity="0.4"
      />
      <rect
        x="22"
        y="10"
        width="56"
        height="80"
        rx="3"
        fill={redFill}
        fillOpacity="0.2"
      />
    </svg>
  );
}

function ContainIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-auto shrink-0"
      aria-hidden="true"
    >
      <rect
        x="22"
        y="10"
        width="56"
        height="80"
        rx="3"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeDasharray="4,3"
      />
      <rect
        x="22"
        y="10"
        width="56"
        height="80"
        rx="3"
        fill={bgFill}
        fillOpacity="0.7"
      />
      <rect
        x="22"
        y="24"
        width="56"
        height="52"
        rx="2"
        fill={redFill}
        fillOpacity="0.2"
      />
      <rect
        x="22"
        y="24"
        width="56"
        height="52"
        rx="2"
        fill="none"
        stroke={redFill}
        strokeWidth="1.25"
      />
      <rect
        x="64"
        y="14"
        width="10"
        height="10"
        rx="1.5"
        fill={bgFill}
        stroke={strokeColor}
        strokeWidth="1"
      />
    </svg>
  );
}

const MODES = [
  { mode: FitModes.STRETCH, labelKey: "fitModeStretch" as const, Icon: StretchIcon },
  { mode: FitModes.COVER, labelKey: "fitModeCover" as const, Icon: CoverIcon },
  { mode: FitModes.CONTAIN, labelKey: "fitModeContain" as const, Icon: ContainIcon },
];

export default function FitModeSelector({
  value,
  onChange,
}: FitModeSelectorProps) {
  const t = useTranslations("Home");

  return (
    <div>
      <span className="block mb-2 text-sm font-medium text-stone-700 dark:text-stone-300">
        {t("fitModeLabel")}
      </span>
      <div className="flex gap-2 md:max-w-sm">
        {MODES.map(({ mode, labelKey, Icon }) => {
          const selected = value === mode;
          return (
            <label
              key={mode}
              className={`flex-1 min-w-0 flex flex-col items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
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
              <Icon />
              <span className="text-[11px] leading-tight text-center font-medium text-stone-700 dark:text-stone-300">
                {t(labelKey)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
