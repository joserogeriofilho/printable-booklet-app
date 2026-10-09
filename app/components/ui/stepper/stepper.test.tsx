import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { Stepper } from "./stepper";

afterEach(cleanup);

const base = {
  id: "sheets",
  decreaseLabel: "decrease",
  increaseLabel: "increase",
};

function input() {
  return screen.getByRole("spinbutton") as HTMLInputElement;
}

describe("Stepper", () => {
  it("increments by one", () => {
    const onChange = vi.fn();
    render(<Stepper {...base} value={2} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("increase"));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("decrements by one", () => {
    const onChange = vi.fn();
    render(<Stepper {...base} value={2} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("decrease"));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("disables decrease at the minimum", () => {
    render(<Stepper {...base} value={1} onChange={vi.fn()} />);
    expect(
      (screen.getByLabelText("decrease") as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it("disables increase at the maximum", () => {
    render(<Stepper {...base} value={50} onChange={vi.fn()} />);
    expect(
      (screen.getByLabelText("increase") as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it("emits 0 for non-numeric input", () => {
    const onChange = vi.fn();
    render(<Stepper {...base} value={3} onChange={onChange} />);
    fireEvent.change(input(), { target: { value: "abc" } });
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("clamps typed values to the maximum", () => {
    const onChange = vi.fn();
    render(<Stepper {...base} value={3} onChange={onChange} />);
    fireEvent.change(input(), { target: { value: "60" } });
    expect(onChange).toHaveBeenCalledWith(50);
  });

  it("renders an empty input when the value is 0", () => {
    render(<Stepper {...base} value={0} onChange={vi.fn()} />);
    expect(input().value).toBe("");
  });
});
