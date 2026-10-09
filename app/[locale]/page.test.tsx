import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Page from "./page";

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));
vi.mock("../../src/domain/booklet-utils", async (orig) => {
  const actual = await orig<typeof import("../../src/domain/booklet-utils")>();
  return { ...actual, generatePdf: vi.fn() };
});

afterEach(cleanup);

describe("Home page", () => {
  it("renders the four step headings", () => {
    render(<Page />);
    expect(screen.getByText("step1")).toBeDefined();
    expect(screen.getByText("step2")).toBeDefined();
    expect(screen.getByText("step3")).toBeDefined();
    expect(screen.getByText("step4")).toBeDefined();
  });

  it("keeps the download button disabled until files are selected", () => {
    render(<Page />);
    expect(
      (
        screen.getByRole("button", {
          name: /downloadPdf/,
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
});
