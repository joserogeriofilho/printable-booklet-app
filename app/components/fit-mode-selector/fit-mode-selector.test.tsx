import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { FitModeSelector } from "./fit-mode-selector";

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));

afterEach(cleanup);

describe("FitModeSelector", () => {
  it("renders three toggle buttons", () => {
    render(<FitModeSelector value="stretch" onChange={vi.fn()} />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("marks the selected mode with aria-pressed", () => {
    render(<FitModeSelector value="cover" onChange={vi.fn()} />);
    expect(
      screen
        .getByRole("button", { name: "fitModeCover" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      screen
        .getByRole("button", { name: "fitModeStretch" })
        .getAttribute("aria-pressed"),
    ).toBe("false");
  });

  it("calls onChange with the clicked mode", () => {
    const onChange = vi.fn();
    render(<FitModeSelector value="stretch" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "fitModeContain" }));
    expect(onChange).toHaveBeenCalledWith("contain");
  });
});