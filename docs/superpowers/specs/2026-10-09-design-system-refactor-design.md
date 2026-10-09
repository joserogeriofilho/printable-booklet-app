# Design: Design-system layer + structural refactor

**Date**: 2026-10-09
**Status**: Draft (awaiting review)
**Related**: [ADR-001](../adr-001-image-fit-modes.md), AGENTS.md

## Context

The app has grown organically and its presentation layer now suffers from three
related problems.

1. **No shared visual vocabulary.** The neo-brutalist surface
   (`border: 1px solid black; box-shadow: 4px 4px black; background: white`) is
   copy-pasted in roughly ten CSS modules. Dark mode is applied by hand
   (`:global(.dark) …`), and only the booklet-preview modal/badge/cards are
   actually themed.
2. **No `Button` component.** At least six button-like elements duplicate
   padding, border, shadow, cursor, hover and disabled styling
   (`.downloadButton`, `.stepperButton`, `.modalButton`, `.modalClose`,
   `.githubButton`, `theme-toggle .button`, nav links). None has a pressed state.
3. **Elevation is applied to the wrong elements.** The A4-sheet number input
   (via `.stepper`), the booklet-size `<select>`, the locale `<select>`, the
   colour swatch and the file-selector button all carry the drop shadow, mixing
   "elevated/actionable" with "form input".

In addition, structure is muddled:

- `app/layout.tsx` renders `<html><body><main>{children}</main></body></html>`,
  while `app/[locale]/layout.tsx` renders `Navbar`/`Footer` *inside* that
  `<main>`. The site nav and footer are therefore semantically inside the main
  content region.
- `app/[locale]/page.tsx` is 312 lines: state, handlers, and four inline
  `<section>`s (setup, preview, download, mount) plus a header. Only the fit-mode
  selector, preview and illustrated section are extracted.

The goal is to consolidate styles into a small design system, fix
elevation/semantics, and decompose the home page — **without** adding a CSS
framework (Tailwind was deliberately removed in commit `f414733`).

## Goals

- One source of truth for colours, borders and shadows (including dark mode).
- One `Button` component owning behaviour, variants and the pressed animation.
- Inputs look like inputs (border, no elevation); buttons/cards/dialogs keep it.
- Buttons have a 3D "press" animation (shadow collapses on `:active`).
- Root vs locale layout responsibilities are clear and semantically correct.
- The home page is composed from focused section components.

## Non-goals

- Introducing a CSS framework or utility-class system.
- Expanding dark mode into a full theme. Tokens encode **current** dark-mode
  behaviour; broadening it is a separate feature.
- Reworking the domain layer (`src/domain/`) or PDF generation.
- Redesigning copy, spacing scale or the visual identity.

## Constraints

- Native CSS Modules only; no framework.
- `pnpm` + Vitest (jsdom); `pnpm test`, `pnpm build` must stay green.
- Static export (`output: "export"`), class-based dark mode (`.dark` on
  `<html>`), `trailingSlash: true`.
- Follow the `app/components/<name>/` convention: `<name>.tsx` (named export),
  `<name>.module.css`, `index.ts`, tests co-located.
- Documentation must be updated when code changes (AGENTS.md rule).

---

## Design

### 1. Token layer (`app/global.css`)

Define CSS custom properties on `:root` and override the subset that currently
flips under `.dark`:

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

.dark {
  --color-shadow: #f5f5f4;
  /* plus the surface values booklet-preview already themes today */
}
```

`.dark` starts minimal — only what the app already inverts — so this change is
visually neutral in light mode.

### 2. Shared primitives (`app/components/ui/primitives.module.css`)

A single CSS module owning the recurring surface and interaction patterns.
Components pull classes in with `composes`:

| Class | Responsibility |
|---|---|
| `.surface` | border + `var(--shadow)` + surface background |
| `.surfaceSm` | border + `var(--shadow-sm)` + surface background |
| `.field` | input chrome: border only, **no** shadow, surface background |
| `.pressable` | cursor + transition; `:active` translates by `--shadow-offset` and collapses the shadow |
| `.focusRing` | shared `:focus-visible` outline |
| `.disabled` | `opacity: .4; cursor: not-allowed` |

The pressed rule:

```css
.pressable { transition: transform 60ms ease, box-shadow 60ms ease; }
.pressable:active:not(:disabled) {
  transform: translate(var(--shadow-offset), var(--shadow-offset));
  box-shadow: 0 0 0 var(--color-shadow);
}
```

`composes` across files is supported by Next.js. If it proves undesirable, the
fallback is tokens-only (the surface triple then repeats, but references vars).

### 3. `Button` component (`app/components/ui/button/`)

- **Polymorphic:** renders `<a>` when `href` is provided, otherwise `<button>`.
- **`variant`:** `primary` | `secondary` | `icon`.
- **`size`:** `md` | `sm`.
- **Owns:** hover, `:active` press (translate + shadow collapse), `:disabled`,
  `:focus-visible`, `[aria-current="page"]` selected style, and `composes` from
  `primitives.module.css` for surface/press/focus/disabled.

Migration map:

| Current | Replacement |
|---|---|
| `.downloadButton` | `<Button variant="primary">` (spinner as child) |
| `.modalButton` | `<Button variant="secondary" size="sm">` |
| `.modalClose` | `<Button variant="icon" size="sm" aria-label>` |
| `theme-toggle .button` | `<Button variant="icon">` |
| nav `<a>` links | `<Button href variant="secondary">` + `aria-current` |
| `github-button` | `<Button href variant="primary">` + logo child |
| `buy-me-a-coffee` | stays branded; only shadow → `var(--shadow)` |
| `.fileInput::file-selector-button` | field tokens; native pseudo-element retained |

### 4. Inputs lose elevation

Remove `box-shadow` from `.field`, `.select`, the number input, the locale
select and the colour swatch; border only. The file-selector button remains
button-like.

**Stepper decision:** the `±` number control becomes a flat bordered field. Its
`±` buttons give feedback via background, not the 3D shadow-collapse press
(the press effect needs a shadow, which the container no longer has).

### 5. Layout restructure

```
app/layout.tsx
  <html><body>{children}</body></html>          // document only

app/page.tsx                                    // locale redirect, no shell

app/[locale]/layout.tsx
  providers + <LangSync/> +
    <div class="page">                          // paper-window frame (≥1280)
      <Navbar/>
      <main class="main">{children}</main>
      <Footer/>
    </div>
  + <Analytics/> <SpeedInsights/>
```

- `app/layout.tsx` keeps only `<html>`, `<body>`, `global.css` and metadata.
- The paper-window frame (max-width, margin, ≥1280 border + shadow + padding)
  moves to the locale shell and wraps nav + main + footer together, so the visual
  is preserved.
- `<main>` now contains **only** page content; nav and footer are siblings.

### 6. Home decomposition

**Shared controls** (`app/components/ui/`): `button`, `select`, `field`
(label + optional hint + error), `stepper`.

**Page-specific sections** co-located in `app/[locale]/components/`:
`home-header`, `setup-section`, `preview-section`, `download-section`,
`mount-section`.

**Logic** is extracted to `app/[locale]/use-booklet-form.ts` (state, derived
values, handlers). `page.tsx` becomes pure composition (~40 lines) that passes
props/callbacks to the sections. The hook is unit-testable with `renderHook`.

### 7. Sequencing

1. Token layer (visually neutral).
2. Primitives module + `Button` + `select`/`field`/`stepper`; migrate components
   one at a time.
3. Input shadow removal (+ stepper change).
4. Layout restructure.
5. Home decomposition.
6. Documentation updates.

## Testing strategy

- `Button`: renders `<a>` vs `<button>`; variant/size classes; `disabled`;
  `aria-current`.
- `Stepper`: increment/decrement, clamp 1–50, disabled at bounds, change event.
- `Field`: label/hint/error rendering and label association.
- Home sections: setup validation disables download; sections render with props.
- `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm build` after each phase.
- Domain tests (`src/domain/booklet-utils.test.ts`) remain untouched.

## Documentation

- **AGENTS.md**: document the new `ui/` primitives tier, page-section
  co-location, token usage, and the `Button` convention.
- **README.md**: note the design-token layer in "Built With".
- **docs/architecture-slides.md**: optional; update if it references the old
  layout/CSS approach.

## Risks / trade-offs

- `composes` across CSS modules is the only "new" mechanism; fallback is
  tokens-only.
- Splitting the home page increases file count; mitigated by tight, single-purpose
  sections and a logic hook.
- The stepper's `±` press feedback differs from other buttons by design.
- Dark mode stays partial; anyone expecting a full theme should treat that as a
  follow-up.

## Resolved decisions

- Approach: **tokens + shared primitives**.
- `Button`: **polymorphic, `primary | secondary | icon`**.
- Location: **shared `ui/` + co-located page sections**.
- Layout: **root = document, locale = visible shell**.
- Decomposition: **sections + field primitives**.
- Stepper: **flat field, background-based `±` feedback**.
- Dark mode: **encode current behaviour only**.
