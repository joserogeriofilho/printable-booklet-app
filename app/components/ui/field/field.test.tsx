import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Field } from "./field";

afterEach(cleanup);

describe("Field", () => {
  it("associates the label with the control", () => {
    render(
      <Field id="size" label="Size">
        <select id="size" />
      </Field>,
    );
    expect(screen.getByLabelText("Size")).toBeDefined();
  });

  it("renders hint and error", () => {
    render(
      <Field id="x" label="Sheets" hint="1 – 50" error="Choose 1–50">
        <input id="x" />
      </Field>,
    );
    expect(screen.getByText("1 – 50")).toBeDefined();
    expect(screen.getByText("Choose 1–50")).toBeDefined();
  });
});
