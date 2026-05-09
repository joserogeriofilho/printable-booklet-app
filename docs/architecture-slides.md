---
marp: true
theme: default
paginate: true
---

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Fira+Code:wght@400;500;700&display=swap');

:root {
  --color-background: #0d1117;
  --color-foreground: #c9d1d9;
  --color-heading: #58a6ff;
  --color-accent: #7ee787;
  --color-code-bg: #161b22;
  --color-border: #30363d;
  --font-default: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Meiryo', sans-serif;
  --font-code: 'Fira Code', 'Consolas', 'Monaco', monospace;
}

section {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-default);
  font-weight: 400;
  box-sizing: border-box;
  border-left: 4px solid var(--color-accent);
  position: relative;
  line-height: 1.6;
  font-size: 20px;
  padding: 56px;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
  padding: 0;
  font-family: var(--font-code);
}

h1 {
  font-size: 52px;
  line-height: 1.3;
  text-align: left;
}

h1::before {
  content: '# ';
  color: var(--color-accent);
}

h2 {
  font-size: 38px;
  margin-bottom: 40px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-border);
}

h2::before {
  content: '## ';
  color: var(--color-accent);
}

h3 {
  color: var(--color-foreground);
  font-size: 26px;
  margin-top: 32px;
  margin-bottom: 12px;
}

h3::before {
  content: '### ';
  color: var(--color-accent);
}

ul, ol {
  padding-left: 32px;
}

li {
  margin-bottom: 10px;
}

li::marker {
  color: var(--color-accent);
}

pre {
  background-color: var(--color-code-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  font-family: var(--font-code);
  font-size: 16px;
  line-height: 1.5;
}

code {
  background-color: var(--color-code-bg);
  color: var(--color-accent);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: var(--font-code);
  font-size: 0.9em;
}

pre code {
  background-color: transparent;
  padding: 0;
  color: var(--color-foreground);
}

footer {
  font-size: 14px;
  color: #8b949e;
  font-family: var(--font-code);
  position: absolute;
  left: 56px;
  right: 56px;
  bottom: 40px;
  text-align: right;
}

footer::before {
  content: '// ';
  color: var(--color-accent);
}

section.lead {
  border-left: 4px solid var(--color-accent);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

section.lead h1 {
  margin-bottom: 24px;
}

section.lead p {
  font-size: 22px;
  color: var(--color-foreground);
  font-family: var(--font-code);
}

strong {
  color: var(--color-accent);
  font-weight: 700;
}
</style>

<!-- _class: lead -->

# Printable Booklet App

Architecture Overview

---

## Tech Stack

- **Next.js 14** — App Router, client components
- **Static Export** — `output: "export"`, no SSR / API routes
- **jsPDF** — Client-side PDF generation
- **Tailwind CSS v4** — Dark mode via `@variant dark`
- **next-intl** — Internationalisation (i18n)
- **TypeScript** — `strictNullChecks: true`
- **Vitest** — Unit tests with jsdom
- **pnpm** — Package manager

---

## Routing

`app/page.tsx` — Entry point, auto-detects locale

```ts
const localeMap: Record<string, string> = {
  pt: "pt", "pt-BR": "pt", "pt-PT": "pt",
  es: "es", "es-ES": "es", "es-MX": "es", "es-AR": "es",
};

function detectLocale(): string {
  return localeMap[navigator.language] || "en";
}
```

- Reads `navigator.language` → redirects to `/[locale]/`
- Falls back to `"en"` for unsupported locales

---

## Main Page UI

`app/[locale]/page.tsx` — Form-driven, 3-step flow

- **Step 1 — Setup**: Booklet size (A5–A8), sheet count (1–50), image upload
- **Step 2 — Preview**: Placeholder (dashed box)
- **Step 3 — Download**: Generates `a4.pdf` via `generatePdf()`

Validation: disables download until `files.length >= totalPages`

---

## Domain Layer

`app/domain/` — Core business logic engine

```
domain/
├── index.ts              # Barrel exports
├── booklet-utils.ts       # Layout math + PDF generation
├── image-processor.ts     # Canvas-based image resampling
└── booklet-utils.test.ts  # Vitest unit tests
```

- **Zero framework dependencies** — pure logic, testable in isolation
- Exports: `generateLayout`, `getTotalPages`, `generatePdf`

---

## Layout Algorithm

`generateLayout(nSheets, size)` — Grid-based page ordering

| Size | Cols | Rows | Portrait | Pages/Sheet |
|------|------|------|----------|-------------|
| A5   | 2    | 1    | No       | 4           |
| A6   | 2    | 2    | Yes      | 8           |
| A7   | 4    | 2    | No       | 16          |
| A8   | 4    | 4    | Yes      | 32          |

- Front/back pairing: `layout[page]` + `layout[page+1]` form a sheet
- Tested with Vitest for all sizes and sheet counts

---

## Layout Example

A5 zine, 1 sheet = 4 pages on 1 A4 paper

```
Front (page 0):           Back (page 1):
┌───────────┐            ┌───────────┐
│   4   1   │            │   2   3   │
└───────────┘            └───────────┘
```

```ts
layout[0] → [[4, 1]]    // front
layout[1] → [[2, 3]]    // back
```

Folding and stapling produces correct reading order.

---

## PDF Generation

`generatePdf(nSheets, size, files)` — jsPDF pipeline

1. Compute `layout` via `generateLayout()`
2. Calculate cell dimensions in mm from A4 page
3. For each cell: `processImage(file, width, height)` → JPEG data URL
4. Place image via `doc.addImage()` at correct position
5. Add new pages between sheets
6. Trigger download: `doc.save("a4.pdf")`

---

## Image Processing

`processImage(file, wMm, hMm)` — Canvas resampling

```
File → FileReader → dataURL → HTMLImageElement
     → Canvas (200 DPI) → JPEG 92% → base64 string
```

- **200 DPI** resolution (`PX_PER_MM = 200 / 25.4`)
- **Format normalisation**: HEIC, WebP, AVIF, TIFF → sRGB JPEG
- Avoids jsPDF's limited image format support

---

## Key Decisions

- **Static export only** — no server runtime, deploy anywhere
- **Client-only PDF** — zero backend cost, private data stays local
- **Domain isolation** — `app/domain/` has no UI or framework imports
- **Canvas pipeline** — handles any browser-decodable image format
- **Typed booklet sizes** — `BookletSize` union from `Sizes` const object
- **Dark mode** — Tailwind v4 `@variant dark`, class-based toggle

---

<!-- _class: lead -->

# Thank You

`pnpm dev` → `pnpm test` → `pnpm build` → `out/`
