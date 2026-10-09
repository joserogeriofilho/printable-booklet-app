import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { DownloadSection } from "./download-section";

vi.mock("next-intl", () => ({
  useTranslations:
    () =>
    (key: string, params?: Record<string, string | number>) => {
      if (params) {
        const paramStr = Object.entries(params)
          .map(([k, v]) => `${k}=${v}`)
          .join("_");
        return `${key}_${paramStr}`;
      }
      return key;
    },
}));

afterEach(cleanup);

const base = {
  onDownload: vi.fn(),
  isGenerating: false,
  isDisabled: false,
  error: null,
  progress: { current: 0, total: 0 },
};

describe("DownloadSection", () => {
  it("disables the button when not ready", () => {
    render(<DownloadSection {...base} isDisabled />);
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it("calls onDownload", () => {
    const onDownload = vi.fn();
    render(<DownloadSection {...base} onDownload={onDownload} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it("shows progress while generating", () => {
    render(
      <DownloadSection
        {...base}
        isGenerating
        progress={{ current: 2, total: 4 }}
      />,
    );
    expect(
      screen.getByText(/generatingProgress_current=2_total=4/),
    ).toBeDefined();
  });
});
