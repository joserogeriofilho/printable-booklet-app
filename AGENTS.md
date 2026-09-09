# AGENTS.md

## Commands

```bash
pnpm dev       # Next.js dev server
pnpm build     # static export → out/
pnpm start     # serve the static export
pnpm test      # Vitest with jsdom (single run)
pnpm test:watch  # Vitest in watch mode
pnpm lint      # ESLint with eslint-config-next
pnpm typecheck  # TypeScript type checking (tsc --noEmit)
```

Run a single test: `pnpm test -- -t "pattern"`  
Run tests for a single file: `pnpm test -- path/to/file.test.ts`

Node.js version: `.nvmrc` pins to **22**.

## Architecture

- **`src/domain/`** — Core business logic: booklet layout math and PDF generation (jsPDF). This is the engine. Changes here affect the whole app.
- **`app/[locale]/page.tsx`** — Single page UI (client component). Form-driven: sheets, size, images → generates and downloads PDF.
- **`app/components/`** — One folder per component, all named after the component: `<name>.tsx` (the component, named export, filename matches the folder name), `<name>.module.css` (component styles), `index.ts` (re-exports the component). Tests live in the same folder (e.g. `booklet-preview/booklet-preview.test.tsx`).
- **Static export only** (`next.config.js`: `output: "export"`). No SSR, no API routes, no middleware, no server components with runtime logic. `next build` produces `out/`.

## Gotchas

- **Package manager is `pnpm`**, not npm/yarn.
- **Styling is native CSS** (no CSS framework). Each component has its own CSS Module (`<name>.module.css` in the component folder); `app/global.css` holds only resets (`box-sizing`, `html`/`body`/`ul`/`img` defaults), while `app/layout.tsx` uses `app/layout.module.css` for the app shell. Pages use their co-located `<page>.module.css`.
- **Dark mode** uses a `.dark` class on `<html>` (toggled by `ThemeToggle`). In CSS Modules, target it with `:global(.dark) .className`.
- **TypeScript**: `"strict": false`, but `"strictNullChecks": true`.
- **`trailingSlash: true`** is set — all routes end with `/`.
- **Images are unoptimized** — required for static export.
- **Next.js 16 dropped `next lint`** — ESLint is configured manually via `eslint.config.js` with `eslint-config-next`.

## Rules

- Always run `pnpm test` after implementing changes to the code;
- Always check if documentation (AGENTS.md, README.md, /docs/\*) needs to be updated afer a change in the code;
