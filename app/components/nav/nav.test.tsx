import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Navbar } from "./nav";

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));
vi.mock("../../../src/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => "/",
}));
vi.mock("../theme-toggle", () => ({ ThemeToggle: () => <span /> }));
vi.mock("../locale-switcher", () => ({ LocaleSwitcher: () => <span /> }));

afterEach(cleanup);

describe("Navbar", () => {
  it("renders locale-aware links via the shared Link", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "home" }).getAttribute("href")).toBe(
      "/",
    );
    expect(
      screen.getByRole("link", { name: "aboutMe" }).getAttribute("href"),
    ).toBe("/about-me");
  });

  it("marks the active route with aria-current", () => {
    render(<Navbar />);
    expect(
      screen.getByRole("link", { name: "home" }).getAttribute("aria-current"),
    ).toBe("page");
  });
});
