import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { Select } from "./select";

afterEach(cleanup);

describe("Select", () => {
  it("renders options and forwards change events", () => {
    const onChange = vi.fn();
    render(
      <Select aria-label="lang" value="en" onChange={onChange}>
        <option value="en">en</option>
        <option value="pt">pt</option>
      </Select>,
    );
    fireEvent.change(screen.getByLabelText("lang"), {
      target: { value: "pt" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
