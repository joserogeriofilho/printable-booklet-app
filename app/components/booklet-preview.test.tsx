import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import BookletPreview from "./booklet-preview";

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

function createFiles(count: number): File[] {
  return Array.from(
    { length: count },
    (_, i) => new File(["dummy"], `page_${i + 1}.jpg`, { type: "image/jpeg" }),
  );
}

function clickCard(pageNumber: number) {
  const badges = screen.getAllByText(
    `previewPage_number=${pageNumber}`,
    { selector: "div" },
  );
  const card = badges[0].closest(".flex-shrink-0")!;
  fireEvent.click(card);
}

describe("BookletPreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => {
      setTimeout(fn, 0);
      return 0;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});
  });

  afterEach(() => {
    cleanup();
  });

  describe("empty state", () => {
    it("renders empty placeholder when files is null", () => {
      render(<BookletPreview files={null} totalPages={4} />);
      expect(screen.getByText("previewNoFiles")).toBeDefined();
    });

    it("renders empty placeholder when files array is empty", () => {
      render(<BookletPreview files={[]} totalPages={4} />);
      expect(screen.getByText("previewNoFiles")).toBeDefined();
    });
  });

  describe("modal open on click", () => {
    it("opens move modal when clicking an image card", () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      clickCard(1);

      expect(screen.getByText(/moveModalTitle_from=1/)).toBeDefined();
      expect(screen.getByRole("spinbutton")).toBeDefined();
    });

    it("does not open modal when clicking an empty page slot", () => {
      const files = createFiles(2);
      render(<BookletPreview files={files} totalPages={4} />);

      clickCard(3);

      expect(screen.queryByText(/moveModalTitle/)).toBeNull();
    });

    it("shows the correct page number in modal title", () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      clickCard(3);

      expect(screen.getByText(/moveModalTitle_from=3/)).toBeDefined();
    });

    it("resets input and error when opening modal on a different card", () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      clickCard(1);
      const input = screen.getByRole("spinbutton") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "abc" } });
      fireEvent.click(screen.getByText("OK"));
      expect(screen.queryByText(/moveModalInvalid/)).toBeDefined();

      fireEvent.click(screen.getByText("moveModalCancel"));
      clickCard(2);

      const newInput = screen.getByRole("spinbutton") as HTMLInputElement;
      expect(newInput.value).toBe("");
      expect(screen.queryByText(/moveModalInvalid/)).toBeNull();
    });
  });

  describe("modal close", () => {
    it("closes on Cancel button click", () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      clickCard(1);
      fireEvent.click(screen.getByText("moveModalCancel"));

      expect(screen.queryByRole("spinbutton")).toBeNull();
    });

    it("closes on overlay click", () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      clickCard(1);
      const overlay = screen.getByRole("spinbutton").closest(".fixed")!;
      fireEvent.click(overlay);

      expect(screen.queryByRole("spinbutton")).toBeNull();
    });

    it("closes on Escape key", () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      clickCard(1);
      fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Escape" });

      expect(screen.queryByRole("spinbutton")).toBeNull();
    });

    it("closes on X button click", () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      clickCard(1);
      fireEvent.click(screen.getByLabelText("Close"));

      expect(screen.queryByRole("spinbutton")).toBeNull();
    });

    it("does not close when clicking inside the modal panel", () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      clickCard(1);
      const input = screen.getByRole("spinbutton");
      fireEvent.click(input);

      expect(screen.getByRole("spinbutton")).toBeDefined();
    });
  });

  describe("valid moves", () => {
    it("moves page forward and calls onReorder", () => {
      const files = createFiles(4);
      const onReorder = vi.fn();
      render(
        <BookletPreview
          files={files}
          totalPages={4}
          onReorder={onReorder}
        />,
      );

      clickCard(1);
      fireEvent.change(screen.getByRole("spinbutton"), {
        target: { value: "3" },
      });
      fireEvent.click(screen.getByText("OK"));

      expect(onReorder).toHaveBeenCalledTimes(1);
      const reordered = onReorder.mock.calls[0][0] as File[];
      expect(reordered[0].name).toBe("page_2.jpg");
      expect(reordered[1].name).toBe("page_3.jpg");
      expect(reordered[2].name).toBe("page_1.jpg");
      expect(reordered[3].name).toBe("page_4.jpg");
    });

    it("moves page backward and calls onReorder", () => {
      const files = createFiles(4);
      const onReorder = vi.fn();
      render(
        <BookletPreview
          files={files}
          totalPages={4}
          onReorder={onReorder}
        />,
      );

      clickCard(4);
      fireEvent.change(screen.getByRole("spinbutton"), {
        target: { value: "2" },
      });
      fireEvent.click(screen.getByText("OK"));

      expect(onReorder).toHaveBeenCalledTimes(1);
      const reordered = onReorder.mock.calls[0][0] as File[];
      expect(reordered[0].name).toBe("page_1.jpg");
      expect(reordered[1].name).toBe("page_4.jpg");
      expect(reordered[2].name).toBe("page_2.jpg");
      expect(reordered[3].name).toBe("page_3.jpg");
    });

    it("moves to last position and calls onReorder", () => {
      const files = createFiles(4);
      const onReorder = vi.fn();
      render(
        <BookletPreview
          files={files}
          totalPages={4}
          onReorder={onReorder}
        />,
      );

      clickCard(2);
      fireEvent.change(screen.getByRole("spinbutton"), {
        target: { value: "4" },
      });
      fireEvent.click(screen.getByText("OK"));

      expect(onReorder).toHaveBeenCalledTimes(1);
      const reordered = onReorder.mock.calls[0][0] as File[];
      expect(reordered[0].name).toBe("page_1.jpg");
      expect(reordered[1].name).toBe("page_3.jpg");
      expect(reordered[2].name).toBe("page_4.jpg");
      expect(reordered[3].name).toBe("page_2.jpg");
    });

    it("closes modal after successful move", () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      clickCard(1);
      fireEvent.change(screen.getByRole("spinbutton"), {
        target: { value: "3" },
      });
      fireEvent.click(screen.getByText("OK"));

      expect(screen.queryByRole("spinbutton")).toBeNull();
    });

    it("confirms on Enter key", () => {
      const files = createFiles(4);
      const onReorder = vi.fn();
      render(
        <BookletPreview
          files={files}
          totalPages={4}
          onReorder={onReorder}
        />,
      );

      clickCard(1);
      fireEvent.change(screen.getByRole("spinbutton"), {
        target: { value: "3" },
      });
      fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Enter" });

      expect(onReorder).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("spinbutton")).toBeNull();
    });
  });

  describe("invalid input", () => {
    it("shows error for empty input", () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      clickCard(1);
      fireEvent.click(screen.getByText("OK"));

      expect(screen.getByText("moveModalInvalid_max=4")).toBeDefined();
    });

    it("shows error for zero", () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      clickCard(1);
      fireEvent.change(screen.getByRole("spinbutton"), {
        target: { value: "0" },
      });
      fireEvent.click(screen.getByText("OK"));

      expect(screen.getByText("moveModalInvalid_max=4")).toBeDefined();
    });

    it("shows error for value greater than totalPages", () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      clickCard(1);
      fireEvent.change(screen.getByRole("spinbutton"), {
        target: { value: "5" },
      });
      fireEvent.click(screen.getByText("OK"));

      expect(screen.getByText("moveModalInvalid_max=4")).toBeDefined();
    });

    it("shows error for non-numeric input", () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      clickCard(1);
      fireEvent.change(screen.getByRole("spinbutton"), {
        target: { value: "abc" },
      });
      fireEvent.click(screen.getByText("OK"));

      expect(screen.getByText("moveModalInvalid_max=4")).toBeDefined();
    });

    it("clears error when user starts typing a new value", () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      clickCard(1);
      fireEvent.click(screen.getByText("OK"));
      expect(screen.getByText("moveModalInvalid_max=4")).toBeDefined();

      fireEvent.change(screen.getByRole("spinbutton"), {
        target: { value: "2" },
      });
      expect(screen.queryByText("moveModalInvalid_max=4")).toBeNull();
    });

    it("closes modal without calling onReorder when target equals current position", () => {
      const files = createFiles(4);
      const onReorder = vi.fn();
      render(
        <BookletPreview
          files={files}
          totalPages={4}
          onReorder={onReorder}
        />,
      );

      clickCard(2);
      fireEvent.change(screen.getByRole("spinbutton"), {
        target: { value: "2" },
      });
      fireEvent.click(screen.getByText("OK"));

      expect(onReorder).not.toHaveBeenCalled();
      expect(screen.queryByRole("spinbutton")).toBeNull();
    });
  });
});
