import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
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

let user: ReturnType<typeof userEvent.setup>;

function createFiles(count: number): File[] {
  return Array.from(
    { length: count },
    (_, i) => new File(["dummy"], `page_${i + 1}.jpg`, { type: "image/jpeg" }),
  );
}

async function clickCard(pageNumber: number) {
  const badges = screen.getAllByText(
    `previewPage_number=${pageNumber}`,
    { selector: "div" },
  );
  const card = badges[0].closest(".flex-shrink-0")!;
  await user.click(card);
}

describe("BookletPreview", () => {
  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
    vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => {
      setTimeout(fn, 0);
      return 0;
    });
    vi.stubGlobal("cancelAnimationFrame", async () => {});
  });

  afterEach(() => {
    cleanup();
  });

  describe("empty state", () => {
    it("renders empty placeholder when files is null", async () => {
      render(<BookletPreview files={null} totalPages={4} />);
      expect(screen.getByText("previewNoFiles")).toBeDefined();
    });

    it("renders empty placeholder when files array is empty", async () => {
      render(<BookletPreview files={[]} totalPages={4} />);
      expect(screen.getByText("previewNoFiles")).toBeDefined();
    });
  });

  describe("modal open on click", () => {
    it("opens move modal when clicking an image card", async () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      await clickCard(1);

      expect(screen.getByText(/moveModalTitle_from=1/)).toBeDefined();
      expect(screen.getByRole("spinbutton")).toBeDefined();
    });

    it("does not open modal when clicking an empty page slot", async () => {
      const files = createFiles(2);
      render(<BookletPreview files={files} totalPages={4} />);

      await clickCard(3);

      expect(screen.queryByText(/moveModalTitle/)).toBeNull();
    });

    it("shows the correct page number in modal title", async () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      await clickCard(3);

      expect(screen.getByText(/moveModalTitle_from=3/)).toBeDefined();
    });

    it("resets input and error when opening modal on a different card", async () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      await clickCard(1);
      const input = screen.getByRole("spinbutton") as HTMLInputElement;
      await user.clear(input);
      await user.type(input, "abc");
      await user.click(screen.getByText("OK"));
      expect(screen.queryByText(/moveModalInvalid/)).toBeDefined();

      await user.click(screen.getByText("moveModalCancel"));
      await clickCard(2);

      const newInput = screen.getByRole("spinbutton") as HTMLInputElement;
      expect(newInput.value).toBe("");
      expect(screen.queryByText(/moveModalInvalid/)).toBeNull();
    });
  });

  describe("modal close", () => {
    it("closes on Cancel button click", async () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      await clickCard(1);
      await user.click(screen.getByText("moveModalCancel"));

      expect(screen.queryByRole("spinbutton")).toBeNull();
    });

    it("closes on overlay click", async () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      await clickCard(1);
      const overlay = screen.getByRole("spinbutton").closest(".fixed")!;
      await user.click(overlay);

      expect(screen.queryByRole("spinbutton")).toBeNull();
    });

    it("closes on Escape key", async () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      await clickCard(1);
      await user.keyboard("{Escape}");

      expect(screen.queryByRole("spinbutton")).toBeNull();
    });

    it("closes on X button click", async () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      await clickCard(1);
      await user.click(screen.getByLabelText("Close"));

      expect(screen.queryByRole("spinbutton")).toBeNull();
    });

    it("does not close when clicking inside the modal panel", async () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      await clickCard(1);
      const input = screen.getByRole("spinbutton");
      await user.click(input);

      expect(screen.getByRole("spinbutton")).toBeDefined();
    });
  });

  describe("valid moves", () => {
    it("moves page forward and calls onReorder", async () => {
      const files = createFiles(4);
      const onReorder = vi.fn();
      render(
        <BookletPreview
          files={files}
          totalPages={4}
          onReorder={onReorder}
        />,
      );

      await clickCard(1);
      await user.clear(screen.getByRole("spinbutton"));
      await user.type(screen.getByRole("spinbutton"), "3");
      await user.click(screen.getByText("OK"));

      expect(onReorder).toHaveBeenCalledTimes(1);
      const reordered = onReorder.mock.calls[0][0] as File[];
      expect(reordered[0].name).toBe("page_2.jpg");
      expect(reordered[1].name).toBe("page_3.jpg");
      expect(reordered[2].name).toBe("page_1.jpg");
      expect(reordered[3].name).toBe("page_4.jpg");
    });

    it("moves page backward and calls onReorder", async () => {
      const files = createFiles(4);
      const onReorder = vi.fn();
      render(
        <BookletPreview
          files={files}
          totalPages={4}
          onReorder={onReorder}
        />,
      );

      await clickCard(4);
      await user.clear(screen.getByRole("spinbutton"));
      await user.type(screen.getByRole("spinbutton"), "2");
      await user.click(screen.getByText("OK"));

      expect(onReorder).toHaveBeenCalledTimes(1);
      const reordered = onReorder.mock.calls[0][0] as File[];
      expect(reordered[0].name).toBe("page_1.jpg");
      expect(reordered[1].name).toBe("page_4.jpg");
      expect(reordered[2].name).toBe("page_2.jpg");
      expect(reordered[3].name).toBe("page_3.jpg");
    });

    it("moves to last position and calls onReorder", async () => {
      const files = createFiles(4);
      const onReorder = vi.fn();
      render(
        <BookletPreview
          files={files}
          totalPages={4}
          onReorder={onReorder}
        />,
      );

      await clickCard(2);
      await user.clear(screen.getByRole("spinbutton"));
      await user.type(screen.getByRole("spinbutton"), "4");
      await user.click(screen.getByText("OK"));

      expect(onReorder).toHaveBeenCalledTimes(1);
      const reordered = onReorder.mock.calls[0][0] as File[];
      expect(reordered[0].name).toBe("page_1.jpg");
      expect(reordered[1].name).toBe("page_3.jpg");
      expect(reordered[2].name).toBe("page_4.jpg");
      expect(reordered[3].name).toBe("page_2.jpg");
    });

    it("closes modal after successful move", async () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      await clickCard(1);
      await user.clear(screen.getByRole("spinbutton"));
      await user.type(screen.getByRole("spinbutton"), "3");
      await user.click(screen.getByText("OK"));

      expect(screen.queryByRole("spinbutton")).toBeNull();
    });

    it("confirms on Enter key", async () => {
      const files = createFiles(4);
      const onReorder = vi.fn();
      render(
        <BookletPreview
          files={files}
          totalPages={4}
          onReorder={onReorder}
        />,
      );

      await clickCard(1);
      await user.clear(screen.getByRole("spinbutton"));
      await user.type(screen.getByRole("spinbutton"), "3");
      await user.keyboard("{Enter}");

      expect(onReorder).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("spinbutton")).toBeNull();
    });
  });

  describe("invalid input", () => {
    it("shows error for empty input", async () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      await clickCard(1);
      await user.click(screen.getByText("OK"));

      expect(screen.getByText("moveModalInvalid_max=4")).toBeDefined();
    });

    it("shows error for zero", async () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      await clickCard(1);
      await user.clear(screen.getByRole("spinbutton"));
      await user.type(screen.getByRole("spinbutton"), "0");
      await user.click(screen.getByText("OK"));

      expect(screen.getByText("moveModalInvalid_max=4")).toBeDefined();
    });

    it("shows error for value greater than totalPages", async () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      await clickCard(1);
      await user.clear(screen.getByRole("spinbutton"));
      await user.type(screen.getByRole("spinbutton"), "5");
      await user.click(screen.getByText("OK"));

      expect(screen.getByText("moveModalInvalid_max=4")).toBeDefined();
    });

    it("shows error for non-numeric input", async () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      await clickCard(1);
      await user.clear(screen.getByRole("spinbutton"));
      await user.type(screen.getByRole("spinbutton"), "abc");
      await user.click(screen.getByText("OK"));

      expect(screen.getByText("moveModalInvalid_max=4")).toBeDefined();
    });

    it("clears error when user starts typing a new value", async () => {
      const files = createFiles(4);
      render(<BookletPreview files={files} totalPages={4} />);

      await clickCard(1);
      await user.click(screen.getByText("OK"));
      expect(screen.getByText("moveModalInvalid_max=4")).toBeDefined();

      await user.clear(screen.getByRole("spinbutton"));
      await user.type(screen.getByRole("spinbutton"), "2");
      expect(screen.queryByText("moveModalInvalid_max=4")).toBeNull();
    });

    it("closes modal without calling onReorder when target equals current position", async () => {
      const files = createFiles(4);
      const onReorder = vi.fn();
      render(
        <BookletPreview
          files={files}
          totalPages={4}
          onReorder={onReorder}
        />,
      );

      await clickCard(2);
      await user.clear(screen.getByRole("spinbutton"));
      await user.type(screen.getByRole("spinbutton"), "2");
      await user.click(screen.getByText("OK"));

      expect(onReorder).not.toHaveBeenCalled();
      expect(screen.queryByRole("spinbutton")).toBeNull();
    });
  });
});
