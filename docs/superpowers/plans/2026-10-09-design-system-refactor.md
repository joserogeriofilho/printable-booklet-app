# Design-System Layer + Structural Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate the app's repeated neo-brutalist styling into a small token + primitive + `Button` design system, fix elevation and layout semantics, and decompose the 312-line home page into focused sections.

**Architecture:** A CSS custom-property token layer (`app/global.css`), a shared CSS-module of surface/interaction primitives (`app/components/ui/primitives.module.css`), reusable UI components under `app/components/ui/` (`button`, `select`, `field`, `stepper`), and page-specific home sections co-located in `app/[locale]/components/` driven by a `use-booklet-form` hook. Root layout owns the document only; the locale layout owns the visible shell (nav, `<main>`, footer, paper frame).

**Tech Stack:** Next.js 16 (App Router, static export), React 19, TypeScript (`strict: false`, `strictNullChecks: true`), native CSS Modules, pnpm, Vitest + @testing-library/react (jsdom), next-intl.

**Spec:** `docs/superpowers/specs/2026-10-09-design-system-refactor-design.md`

## Global Constraints

- Package manager is **pnpm** (never npm/yarn). Node **22** (`.nvmrc`).
- Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build` after each task; all must pass.
- **Native CSS Modules only** — no CSS framework, no utility-class library (Tailwind was deliberately removed).
- Component convention: `app/components/<name>/<name>.tsx` (named export, filename matches folder), `<name>.module.css`, `index.ts` re-export, co-located `<name>.test.tsx`.
- Static export (`output: "export"`), `trailingSlash: true`, images unoptimized. No server runtime logic.
- Dark mode is a `.dark` class on `<html>`. **Do not add global dark token overrides**: only `github-button` and `booklet-preview` are themed today, so dark overrides stay scoped to those components. This preserves current dark-mode behavior exactly.
- Preserve existing behaviour, DOM roles, ARIA labels and visible output except where the spec explicitly changes them.
- `app/global.css` holds resets + tokens only; component styles live in their own module.

## Review Focus

The spec implies these failure modes; each owning task pins them with a test.

1. **Locale-aware nav links.** Nav uses `Link` from `src/i18n/navigation` (adds the locale prefix). Replacing it with a raw `<a>` breaks routing. `Button` must accept `as={Link}`; Task 3 tests the rendered `href` and `aria-current`.
2. **Stepper empty/invalid input.** Clearing or typing non-numeric text must emit `0` (so the "choose 1–50" error still shows) and numeric input clamps to 1–50. Tasks 2 and 5 test this.
3. **Download gating.** The button stays disabled when files are `null`, fewer than `totalPages`, or sheets are invalid. Tasks 5 and 6 test the conditions.
4. **Dark mode scope.** Flipping `--color-shadow`/surface globally would recolor nav and cards in dark mode. Overrides stay on `github-button` / `booklet-preview` roots. Task 3 keeps the existing preview tests and restricts overrides.
5. **Button polymorphism.** `disabled`, `onClick`, `aria-*`, and a custom `as` element must be forwarded. Task 1 tests `button`/`link`/`disabled`/`onClick`/`aria-current`; Task 3 tests the `as={Link}` path.

---

### Task 1: Token layer, primitives, and `Button`

**Files:**
- Modify: `app/global.css`
- Create: `app/components/ui/primitives.module.css`
- Create: `app/components/ui/button/button.tsx`
- Create: `app/components/ui/button/button.module.css`
- Create: `app/components/ui/button/index.ts`
- Test: `app/components/ui/button/button.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `Button` (default export named `Button`) with props
  `{ variant?: "primary" | "secondary" | "icon"; size?: "md" | "sm"; as?: React.ElementType; href?: string; className?: string; children?: React.ReactNode } & common HTML attrs`.
  Also produces composed CSS classes `.surface`, `.surfaceSm`, `.field`, `.pressable`, `.focusRing` in `primitives.module.css` for later tasks.

- [ ] **Step 1: Write the failing test**

`app/components/ui/button/button.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- app/components/ui/button/button.test.tsx`
Expected: FAIL — cannot resolve `./button`.

- [ ] **Step 3: Implement tokens, primitives, and Button**

Add to the top of `app/global.css` (after the `@import` line):

```css
:root {
  --color-bg: #ffffff;
  --color-fg: #000000;
  --color-surface: #ffffff;
  --color-surface-fg: #000000;

  --color-border: #000000;
  --color-shadow: #000000;
  --color-muted: #f5f5f4;
  --color-muted-fg: #78716c;
  --color-danger: red;

  --color-primary: #000000;
  --color-primary-fg: #ffffff;
  --color-primary-hover: #57534e;

  --shadow: 4px 4px var(--color-shadow);
  --shadow-sm: 2px 2px var(--color-shadow);
  --shadow-offset: 4px;
  --border-width: 1px;
}
```

Create `app/components/ui/primitives.module.css` with classes `.surface`, `.surfaceSm`, `.field` (border only, **no** shadow), `.pressable` (cursor + transition, and `:active:not(:disabled)` translates by `var(--shadow-offset)` and collapses the shadow to `0 0 0 var(--color-shadow)`), and `.focusRing` (`:focus-visible` outline). `.surface`/`.surfaceSm` use `1px solid var(--color-border)`, `var(--shadow)`/`var(--shadow-sm)`, and `var(--color-surface)`.

Create `app/components/ui/button/button.module.css`: `.button` composes `pressable focusRing` from `../primitives.module.css`, is `inline-flex`, `font: inherit`, border `var(--border-width) solid var(--color-border)`, `box-shadow: var(--shadow)`, surface background/foreground, `text-decoration: none`, `user-select: none`. Variants: `.primary` (primary bg/fg, hover `--color-primary-hover`), `.secondary` (surface, hover inverts to primary bg/fg), `.icon` (compact padding). Sizes: `.md` and `.sm` set padding. Disabled: `opacity: .4; cursor: not-allowed`.

Create `app/components/ui/button/button.tsx`:

```tsx
import styles from "./button.module.css";

type ButtonVariant = "primary" | "secondary" | "icon";
type ButtonSize = "md" | "sm";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
  as?: React.ElementType;
  href?: string;
  [key: string]: unknown;
}

export function Button({
  variant = "secondary",
  size = "md",
  className,
  children,
  as,
  href,
  ...rest
}: ButtonProps) {
  const Component = (as ?? (href ? "a" : "button")) as React.ElementType;
  const cls = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");
  return (
    <Component
      className={cls}
      href={href}
      data-variant={variant}
      data-size={size}
      {...rest}
    >
      {children}
    </Component>
  );
}
```

Create `app/components/ui/button/index.ts`: `export { Button } from "./button";`

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- app/components/ui/button/button.test.tsx`
Expected: PASS (6 tests). Also run `pnpm typecheck`.

- [ ] **Step 5: Commit**

```bash
git add app/global.css app/components/ui
git commit -m "feat(ui): add design tokens, primitives, and Button component"
```

---

### Task 2: `Field`, `Select`, and `Stepper` primitives

**Files:**
- Create: `app/components/ui/field/field.tsx`, `field.module.css`, `index.ts`, `field.test.tsx`
- Create: `app/components/ui/select/select.tsx`, `select.module.css`, `index.ts`, `select.test.tsx`
- Create: `app/components/ui/stepper/stepper.tsx`, `stepper.module.css`, `index.ts`, `stepper.test.tsx`

**Interfaces:**
- Consumes: `primitives.module.css` (`.field`), Task 1 tokens.
- Produces:
  - `Field({ id?: string; label: string; hint?: React.ReactNode; error?: React.ReactNode; children: React.ReactNode })` — renders a label row (`<label htmlFor={id}>` + optional hint), `children`, and optional error. Child control must carry the matching `id`.
  - `Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string })` — a `<select>` styled with the `.field` primitive.
  - `Stepper({ id: string; value: number; onChange: (value: number) => void; decreaseLabel: string; increaseLabel: string; min?: number; max?: number; className?: string })` — defaults `min = 1`, `max = 50`; emits `0` for non-numeric input, clamps numeric input to `[min, max]`, emits `value ± 1` from the buttons, disables each button at its bound, and renders the input value as `value || ""`.

- [ ] **Step 1: Write the failing tests**

`field.test.tsx`:

```tsx
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
```

`stepper.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { Stepper } from "./stepper";

afterEach(cleanup);

const base = { id: "sheets", decreaseLabel: "decrease", increaseLabel: "increase" };

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
    expect((screen.getByLabelText("decrease") as HTMLButtonElement).disabled).toBe(true);
  });

  it("disables increase at the maximum", () => {
    render(<Stepper {...base} value={50} onChange={vi.fn()} />);
    expect((screen.getByLabelText("increase") as HTMLButtonElement).disabled).toBe(true);
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
```

`select.test.tsx`:

```tsx
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
    fireEvent.change(screen.getByLabelText("lang"), { target: { value: "pt" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test -- app/components/ui`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement the three primitives**

- `field.tsx`: render `<div>` → label row (`<label htmlFor={id}>{label}</label>`, then `{hint && <span>{hint}</span>}`), `{children}`, then `{error && <div className={styles.error}>{error}</div>}`.
- `select.tsx`: `const cls = [styles.select, className].filter(Boolean).join(" "); return <select className={cls} {...rest}>{children}</select>;`
- `stepper.tsx`: two `<button type="button">` with the given aria-labels, a centred `<input type="number">` (`value={value || ""}`), wired as described in Interfaces. Buttons get the shared `.pressable` styling via their own module; the container uses the `.field` primitive styling (border, no shadow).

Each module re-exports its component from `index.ts`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- app/components/ui`
Expected: PASS. Also `pnpm typecheck`.

- [ ] **Step 5: Commit**

```bash
git add app/components/ui
git commit -m "feat(ui): add Field, Select, and Stepper primitives"
```

---

### Task 3: Migrate shared components to the primitives

**Files:**
- Modify: `app/components/nav/nav.tsx`, `app/components/nav/nav.module.css`
- Modify: `app/components/locale-switcher/locale-switcher.tsx`, `app/components/locale-switcher/locale-switcher.module.css`
- Modify: `app/components/theme-toggle/theme-toggle.tsx`, `app/components/theme-toggle/theme-toggle.module.css`
- Modify: `app/components/github-button/github-button.tsx`, `app/components/github-button/github-button.module.css`
- Modify: `app/components/buy-me-a-coffee/buy-me-a-coffee.module.css`
- Modify: `app/components/booklet-preview/booklet-preview.tsx`, `app/components/booklet-preview/booklet-preview.module.css`
- Test: `app/components/nav/nav.test.tsx` (new); existing `app/components/booklet-preview/booklet-preview.test.tsx` must keep passing

**Interfaces:**
- Consumes: `Button`, `Select` from Tasks 1–2; tokens.
- Produces: no new exports; components keep their public signatures.

- [ ] **Step 1: Write the failing nav test**

`app/components/nav/nav.test.tsx`:

```tsx
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
    expect(screen.getByRole("link", { name: "home" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", { name: "aboutMe" }).getAttribute("href")).toBe("/about-me");
  });

  it("marks the active route with aria-current", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "home" }).getAttribute("aria-current")).toBe("page");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- app/components/nav/nav.test.tsx`
Expected: FAIL — the current nav has no `aria-current`.

- [ ] **Step 3: Migrate each component**

- **nav**: render `<Button as={Link} href={path} variant="secondary" aria-current={pathname === path ? "page" : undefined}>`. Delete the link-surface CSS from `nav.module.css`; keep only layout (`.nav`, `.links`, `.controls`). The active/hover invert now comes from `Button.secondary` + the `[aria-current="page"]` rule (add `.button[aria-current="page"]` styling as a variant hook in `button.module.css` if not already covered by hover).
- **locale-switcher**: replace the native select with `<Select aria-label=... value={locale} onChange={...}>`. Remove the shadow rule.
- **theme-toggle**: replace `<button>` with `<Button variant="icon" aria-label={t("label")}>`; drop the local border/shadow/hover CSS.
- **github-button**: render `<Button as="a" href={...} target="_blank" rel="noopener noreferrer" variant="primary" className={styles.githubButton}>` with the logo `<img>` and text as children. Keep the existing `:global(.dark)` brand overrides in `github-button.module.css` (they are a **scoped** dark tweak; do not move them to global tokens).
- **buy-me-a-coffee**: keep the image link; compose `.pressable` from primitives and change `box-shadow: 4px 4px black` to `var(--shadow)`.
- **booklet-preview**: replace `.modalClose` with `<Button variant="icon" size="sm" aria-label="Close">`, and the two `.modalButton`s with `<Button variant="secondary" size="sm">`. Delete those four class rules. Replace the `:global(.dark)` rules by **scoped token overrides on `.modal`**:

  ```css
  :global(.dark) .modal {
    --color-surface: #1c1917;
    --color-surface-fg: #f5f5f4;
    --color-border: #f5f5f4;
    --color-shadow: #f5f5f4;
    --color-primary: #f5f5f4;
    --color-primary-fg: #1c1917;
  }
  ```

  `.modal` and its Button children then theme via tokens; the badge/card/placeholder rules can likewise use `--color-*` tokens (kept scoped to this module).

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test` (full suite), `pnpm typecheck`, `pnpm lint`, `pnpm build`
Expected: PASS. The existing booklet-preview tests (modal open/close, cancel/OK, Escape, overlay) still pass. Grep `app` for `box-shadow: 4px 4px black` and `:global(.dark)` — only `__global__` token/scope usages should remain, no literal shadow triples.

- [ ] **Step 5: Commit**

```bash
git add app/components
git commit -m "refactor(ui): migrate shared components to Button/Select primitives"
```

---

### Task 4: Restructure the layouts

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/layout.module.css`
- Modify: `app/[locale]/layout.tsx`
- Modify: `app/[locale]/layout.module.css`

**Interfaces:**
- Consumes: tokens.
- Produces: root layout renders only `<html><body>`; locale layout renders the shell with `<main>`.

- [ ] **Step 1: Move the document/shell boundary**

- `app/layout.tsx`: keep `metadata` and the `global.css` import; render `<html lang="en"><body className={styles.body}>{children}</body></html>`. **Remove** the `<main>` element and the `layout.module.css` `styles.main` usage.
- `app/layout.module.css`: `.body` keeps `max-width: 56rem; margin-left/right: auto`. Remove `.main`. Move the `@media (min-width: 1280px)` grid-background block into `[locale]/layout.module.css` (it belongs with the shell) or keep the `html` background here if cleaner — either way the paper frame must move.
- `app/[locale]/layout.tsx`: render `<LangSync/>`, then a shell `<div className={styles.page}><Navbar/><main className={styles.main}>{children}</main><Footer/></div>`, then `Analytics`/`SpeedInsights`.
- `app/[locale]/layout.module.css`: `.page` = column flex, gap `3rem`, and at `min-width: 1280px` the padding `3.5rem`, `border: 1px solid var(--color-border)`, `box-shadow: var(--shadow)`, and the `html` grid background. `.main` = `flex: 1 1 auto; min-width: 0`.

- [ ] **Step 2: Verify structure**

Run: `pnpm build` — expected success.
Run: `Select-String -Path app/layout.tsx -Pattern "<main"` — expected **no match**.
Run: `Select-String -Path "app/[locale]/layout.tsx" -Pattern "<main"` — expected one match.
Manually load `pnpm dev` and confirm nav/footer sit outside the `<main>` element in DevTools and the ≥1280px paper frame still wraps nav + content + footer.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx app/layout.module.css "app/[locale]/layout.tsx" "app/[locale]/layout.module.css"
git commit -m "refactor(layout): root owns document, locale owns shell"
```

---

### Task 5: `use-booklet-form` hook

**Files:**
- Create: `app/[locale]/use-booklet-form.ts`
- Test: `app/[locale]/use-booklet-form.test.ts`

**Interfaces:**
- Consumes: `getTotalPages`, `generatePdf`, `BookletSize`, `FitMode` from `../../src/domain/booklet-utils`; `useTranslations("Home")`.
- Produces: a `useBookletForm()` hook returning:
  `{ numberOfSheets, setNumberOfSheets, size, setSize, files, setFiles, fitMode, setFitMode, bgColor, setBgColor, isGenerating, error, progress, totalPages, isSheetsInvalid, isDisabled, onChangeFiles, handleReorder, handleDownload }`
  with `progress: { current: number; total: number }` and `isDisabled = files === null || files.length < totalPages || isSheetsInvalid`. Defaults: sheets `1`, size `"A5"`, files `null`, fitMode `"stretch"`, bgColor `"#ffffff"`.

- [ ] **Step 1: Write the failing hook test**

`app/[locale]/use-booklet-form.test.ts` (mock next-intl and the domain `generatePdf`):

```ts
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
    (generatePdf as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("boom"));
    act(() => result.current.setFiles([new File(["a"], "a.jpg")]));

    await act(async () => {
      await result.current.handleDownload();
    });

    expect(result.current.error).toBe("boom");
    expect(result.current.isGenerating).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- "app/[locale]/use-booklet-form.test.ts"`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the hook**

Move the state, `totalPages`, `isSheetsInvalid`, `isDisabled`, `onChangeFiles`, `handleReorder`, and `handleDownload` logic verbatim from `app/[locale]/page.tsx` (lines 3–73) into `use-booklet-form.ts`. Keep the same error fallback (`t("generatingError")`) and progress callback.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- "app/[locale]/use-booklet-form.test.ts"`
Expected: PASS. `pnpm typecheck`.

- [ ] **Step 5: Commit**

```bash
git add "app/[locale]/use-booklet-form.ts" "app/[locale]/use-booklet-form.test.ts"
git commit -m "refactor(home): extract useBookletForm hook"
```

---

### Task 6: Home section components

**Files:**
- Create: `app/[locale]/components/home-header/home-header.tsx`, `home-header.module.css`, `index.ts`
- Create: `app/[locale]/components/setup-section/setup-section.tsx`, `setup-section.module.css`, `index.ts`, `setup-section.test.tsx`
- Create: `app/[locale]/components/preview-section/preview-section.tsx`, `preview-section.module.css`, `index.ts`
- Create: `app/[locale]/components/download-section/download-section.tsx`, `download-section.module.css`, `index.ts`, `download-section.test.tsx`
- Create: `app/[locale]/components/mount-section/mount-section.tsx`, `mount-section.module.css`, `index.ts`

**Interfaces:**
- Consumes: `Field`, `Select`, `Stepper`, `Button`; `FitModeSelector`, `BookletPreview`, `IllustratedSection`, `GitHubButton`, `BuyMeACoffee`; `BookletSize`, `FitMode`.
- Produces:
  - `HomeHeader()` — title/description + GitHub/coffee links.
  - `SetupSection({ size, onSizeChange, sheets, onSheetsChange, files, onFilesChange, totalPages, isSheetsInvalid, fitMode, onFitModeChange, bgColor, onBgColorChange })`.
  - `PreviewSection({ files, totalPages, fitMode, bgColor, onReorder })`.
  - `DownloadSection({ onDownload, isGenerating, isDisabled, error, progress })` where `progress: { current: number; total: number }`.
  - `MountSection()` — the four illustrated instructions.

- [ ] **Step 1: Write the failing section tests**

`setup-section.test.tsx` (mock `next-intl`; keep the real `Field`/`Select`/`Stepper` so wiring is exercised; mock `FitModeSelector`):

```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { SetupSection } from "./setup-section";

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));
vi.mock("../../../components/fit-mode-selector", () => ({ FitModeSelector: () => <span /> }));

afterEach(cleanup);

const base = {
  size: "A5" as const,
  onSizeChange: () => {},
  sheets: 1,
  onSheetsChange: vi.fn(),
  files: null,
  onFilesChange: () => {},
  totalPages: 4,
  isSheetsInvalid: false,
  fitMode: "stretch" as const,
  onFitModeChange: () => {},
  bgColor: "#ffffff",
  onBgColorChange: () => {},
};

describe("SetupSection", () => {
  it("renders size, sheets, and content controls", () => {
    render(<SetupSection {...base} />);
    expect(screen.getByLabelText("sizeLabel")).toBeDefined();
    expect(screen.getByLabelText("imagesLabel")).toBeDefined();
    expect(screen.getByRole("spinbutton")).toBeDefined();
  });

  it("emits sheet changes from the stepper", () => {
    const onSheetsChange = vi.fn();
    render(<SetupSection {...base} onSheetsChange={onSheetsChange} />);
    fireEvent.click(screen.getByLabelText("increaseSheets"));
    expect(onSheetsChange).toHaveBeenCalledWith(2);
  });

  it("shows the sheet error when invalid", () => {
    render(<SetupSection {...base} isSheetsInvalid />);
    expect(screen.getByText("sheetsError")).toBeDefined();
  });
});
```

`download-section.test.tsx`:

```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { DownloadSection } from "./download-section";

vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));

afterEach(cleanup);

const base = { onDownload: vi.fn(), isGenerating: false, isDisabled: false, error: null, progress: { current: 0, total: 0 } };

describe("DownloadSection", () => {
  it("disables the button when not ready", () => {
    render(<DownloadSection {...base} isDisabled />);
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
  });

  it("calls onDownload", () => {
    const onDownload = vi.fn();
    render(<DownloadSection {...base} onDownload={onDownload} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it("shows progress while generating", () => {
    render(<DownloadSection {...base} isGenerating progress={{ current: 2, total: 4 }} />);
    expect(screen.getByText(/generatingProgress_current=2_total=4/)).toBeDefined();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test -- "app/[locale]/components"`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement the sections**

Port the matching JSX from `app/[locale]/page.tsx`:
- Header (lines 77–84) → `HomeHeader`.
- Step 1 (lines 87–217) → `SetupSection`, using `Select` for size, `Field` for each label/hint/error group, `Stepper` for sheets, and the existing `FitModeSelector`/colour row. The file input keeps a button-styled `::file-selector-button` via this module.
- Step 2 (lines 220–232) → `PreviewSection`.
- Step 3 (lines 235–291) → `DownloadSection`, using `<Button variant="primary">` so the spinner inherits the press/hover styles.
- Step 4 (lines 294–309) → `MountSection`.

Move the corresponding CSS rules (`.stepTitle`, `.stepBody`, `.fieldLabel`, `.labelRow`, `.fieldError`, `.errorMessage`, `.colorRow`, `.fileInput`, `.downloadRow`, `.error`, `.instructionsContainer`, `.header`, `.title`, `.description`, `.links`, `.help`) into the owning section modules. Use tokens instead of literals.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test -- "app/[locale]/components"` and `pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "app/[locale]/components"
git commit -m "feat(home): extract home page section components"
```

---

### Task 7: Compose the home page

**Files:**
- Modify: `app/[locale]/page.tsx`
- Modify: `app/[locale]/page.module.css`
- Test: `app/[locale]/page.test.tsx`

**Interfaces:**
- Consumes: `useBookletForm`; the five section components.
- Produces: `Page` composes `<HomeHeader/>`, `<SetupSection/>`, `<PreviewSection/>`, `<DownloadSection/>`, `<MountSection/>` and passes the hook values as props.

- [ ] **Step 1: Write the failing page test**

`app/[locale]/page.test.tsx`:

```tsx
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
    expect((screen.getByRole("button", { name: /downloadPdf/ }) as HTMLButtonElement).disabled).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- "app/[locale]/page.test.tsx"`
Expected: FAIL — the current page is one component with inline sections; text/roles may still resolve, so confirm the failure is specifically the new composition (adjust imports first if needed).

- [ ] **Step 3: Rewrite `page.tsx` as composition**

```tsx
"use client";

import { useBookletForm } from "./use-booklet-form";
import { HomeHeader } from "./components/home-header";
import { SetupSection } from "./components/setup-section";
import { PreviewSection } from "./components/preview-section";
import { DownloadSection } from "./components/download-section";
import { MountSection } from "./components/mount-section";
import styles from "./page.module.css";

export default function Page() {
  const form = useBookletForm();
  return (
    <div className={styles.root}>
      <HomeHeader />
      <SetupSection
        size={form.size}
        onSizeChange={form.setSize}
        sheets={form.numberOfSheets}
        onSheetsChange={form.setNumberOfSheets}
        files={form.files}
        onFilesChange={form.onChangeFiles}
        totalPages={form.totalPages}
        isSheetsInvalid={form.isSheetsInvalid}
        fitMode={form.fitMode}
        onFitModeChange={form.setFitMode}
        bgColor={form.bgColor}
        onBgColorChange={form.setBgColor}
      />
      <PreviewSection
        files={form.files}
        totalPages={form.totalPages}
        fitMode={form.fitMode}
        bgColor={form.bgColor}
        onReorder={form.handleReorder}
      />
      <DownloadSection
        onDownload={form.handleDownload}
        isGenerating={form.isGenerating}
        isDisabled={form.isDisabled}
        error={form.error}
        progress={form.progress}
      />
      <MountSection />
    </div>
  );
}
```

Reduce `page.module.css` to `.root { display: flex; flex-direction: column; gap: 4rem; }` (all other rules moved in Task 6).

- [ ] **Step 4: Run tests and full checks**

Run: `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build`
Expected: PASS. Confirm `app/[locale]/page.tsx` is roughly 40–70 lines.

- [ ] **Step 5: Commit**

```bash
git add "app/[locale]/page.tsx" "app/[locale]/page.module.css" "app/[locale]/page.test.tsx"
git commit -m "refactor(home): compose page from sections and form hook"
```

---

### Task 8: Update documentation

**Files:**
- Modify: `AGENTS.md`
- Modify: `README.md`
- Modify: `docs/architecture-slides.md` (only the layout/CSS slides)

**Interfaces:** none.

- [ ] **Step 1: Update AGENTS.md**

In **Architecture**, document the new tiers:
- `app/components/ui/` — reusable design-system primitives (`Button`, `Select`, `Field`, `Stepper`) and `primitives.module.css`.
- Page-specific components are co-located with the page (e.g. `app/[locale]/components/`).
- Design tokens live in `app/global.css`; components reference `var(--…)` and must not hard-code shadows/borders; dark overrides are scoped to the component that themes today.

Update the **Gotchas** dark-mode bullet to state that overrides are scoped, not global.

- [ ] **Step 2: Update README.md**

In **Built With**, note the CSS-token + primitives layer alongside "Native CSS — CSS Modules per component".

- [ ] **Step 3: Update architecture slides**

In `docs/architecture-slides.md`, update the "Tech Stack" / "Main Page UI" / "Key Decisions" slides to reflect the two-layout split, the `ui/` primitives, and the home section decomposition.

- [ ] **Step 4: Commit**

```bash
git add AGENTS.md README.md docs/architecture-slides.md
git commit -m "docs: document design system, ui primitives, and layout split"
```

---

## Self-Review

**Spec coverage:** tokens (Task 1), primitives (Task 1), `Button` + migration table (Tasks 1, 3), inputs lose elevation (Tasks 2, 6 — Stepper/Field/Select; locale select in Task 3), layout restructure (Task 4), home decomposition + hook (Tasks 5–7), sequencing/docs (Task 8). All spec sections map to a task.

**Step scan:** each step is one action with a checkable result; test steps carry the assertions, code steps carry signatures + pinned values, no transcript bodies.

**Type consistency:** `Button` props, `Stepper` `onChange(value: number)`, `Field` props, and the `useBookletForm` return shape are used with the same names across Tasks 5–7. `progress` is `{ current, total }` everywhere.

**Review Focus:** the five items each have a home — 1 & 5 in Task 3 (nav `as={Link}`), 2 in Tasks 2/5, 3 in Tasks 5/6, 4 in Task 3 (scoped dark overrides).

**Proportion:** the plan names signatures and tests; implementation bodies are left to the executor except where the spec pins exact values (tokens, dark scope).
