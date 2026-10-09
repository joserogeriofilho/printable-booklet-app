import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { SetupSection } from "./setup-section";

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));
vi.mock("../../../components/fit-mode-selector", () => ({
  FitModeSelector: () => <span />,
}));

afterEach(cleanup);

const base = {
  size: "A5" as const,
  onSizeChange: () => {},
  sheets: 1,
  onSheetsChange: vi.fn(),
  files: null,
  onFilesChange: () => {},
  totalPages: 4,
  isSheetsInvalid: false,
  fitMode: "stretch" as const,
  onFitModeChange: () => {},
  bgColor: "#ffffff",
  onBgColorChange: () => {},
};

describe("SetupSection", () => {
  it("renders size, sheets, and content controls", () => {
    render(<SetupSection {...base} />);
    expect(screen.getByLabelText("sizeLabel")).toBeDefined();
    expect(screen.getByLabelText("imagesLabel")).toBeDefined();
    expect(screen.getByRole("spinbutton")).toBeDefined();
  });

  it("emits sheet changes from the stepper", () => {
    const onSheetsChange = vi.fn();
    render(<SetupSection {...base} onSheetsChange={onSheetsChange} />);
    fireEvent.click(screen.getByLabelText("increaseSheets"));
    expect(onSheetsChange).toHaveBeenCalledWith(2);
  });

  it("shows the sheet error when invalid", () => {
    render(<SetupSection {...base} isSheetsInvalid />);
    expect(screen.getByText("sheetsError")).toBeDefined();
  });
});
