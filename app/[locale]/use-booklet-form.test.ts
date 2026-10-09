import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";
import { useBookletForm } from "./use-booklet-form";

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));
vi.mock("../../src/domain/booklet-utils", async (orig) => {
  const actual = await orig<typeof import("../../src/domain/booklet-utils")>();
  return { ...actual, generatePdf: vi.fn() };
});

afterEach(cleanup);

describe("useBookletForm", () => {
  it("starts with sensible defaults and computes totalPages", () => {
    const { result } = renderHook(() => useBookletForm());
    expect(result.current.numberOfSheets).toBe(1);
    expect(result.current.size).toBe("A5");
    expect(result.current.totalPages).toBe(4);
    expect(result.current.isDisabled).toBe(true);
  });

  it("enables download once enough files are selected", () => {
    const { result } = renderHook(() => useBookletForm());
    act(() => {
      result.current.setFiles([
        new File(["a"], "a.jpg"),
        new File(["b"], "b.jpg"),
        new File(["c"], "c.jpg"),
        new File(["d"], "d.jpg"),
      ]);
    });
    expect(result.current.isDisabled).toBe(false);
  });

  it("flags invalid sheet counts", () => {
    const { result } = renderHook(() => useBookletForm());
    act(() => result.current.setNumberOfSheets(0));
    expect(result.current.isSheetsInvalid).toBe(true);
    expect(result.current.isDisabled).toBe(true);
  });

  it("stores an error when generation fails", async () => {
    const { result } = renderHook(() => useBookletForm());
    const { generatePdf } = await import("../../src/domain/booklet-utils");
    (generatePdf as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("boom"),
    );
    act(() => result.current.setFiles([new File(["a"], "a.jpg")]));

    await act(async () => {
      await result.current.handleDownload();
    });

    expect(result.current.error).toBe("boom");
    expect(result.current.isGenerating).toBe(false);
  });
});
