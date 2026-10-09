import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { Button } from "./button";

afterEach(cleanup);

describe("Button", () => {
  it("renders a button by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeDefined();
  });

  it("renders an anchor when href is provided", () => {
    render(<Button href="/about">About</Button>);
    const link = screen.getByRole("link", { name: "About" });
    expect(link.getAttribute("href")).toBe("/about");
  });

  it("forwards disabled to the button", () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole("button").hasAttribute("disabled")).toBe(true);
  });

  it("forwards aria-current", () => {
    render(
      <Button href="/" aria-current="page">
        Home
      </Button>,
    );
    expect(screen.getByRole("link").getAttribute("aria-current")).toBe("page");
  });

  it("calls onClick", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("exposes variant and size as data attributes", () => {
    render(
      <Button variant="primary" size="sm">
        Go
      </Button>,
    );
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("data-variant")).toBe("primary");
    expect(btn.getAttribute("data-size")).toBe("sm");
  });
});
