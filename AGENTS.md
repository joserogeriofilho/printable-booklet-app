# AGENTS.md

## Commands

```bash
pnpm dev       # Next.js dev server
pnpm build     # static export → out/
pnpm start     # serve the static export
pnpm test      # Vitest with jsdom (single run)
pnpm test:watch  # Vitest in watch mode
pnpm lint      # ESLint with eslint-config-next
```

Run a single test: `pnpm test -- -t "pattern"`  
Run tests for a single file: `pnpm test -- path/to/file.test.ts`

Node.js version: `.nvmrc` pins to **22**.

## Architecture

- **`src/domain/`** — Core business logic: booklet layout math and PDF generation (jsPDF). This is the engine. Changes here affect the whole app.
- **`app/page.tsx`** — Single page UI (client component). Form-driven: sheets, size, images → generates and downloads PDF.
- **Static export only** (`next.config.js`: `output: "export"`). No SSR, no API routes, no middleware, no server components with runtime logic. `next build` produces `out/`.

## Gotchas

- **Package manager is `pnpm`**, not npm/yarn.
- **Dark mode** uses `.dark` class on `<html>` with Tailwind v4 `@variant dark` syntax — NOT the classic `darkMode: "class"` config.
- **TypeScript**: `"strict": false`, but `"strictNullChecks": true`.
- **`trailingSlash: true`** is set — all routes end with `/`.
- **Images are unoptimized** — required for static export.
- **Next.js 16 dropped `next lint`** — ESLint is configured manually via `eslint.config.js` with `eslint-config-next`.

## Rules

- Always run `pnpm test` after implementing changes to the code;
- Always check if documentation (AGENTS.md, README.md, /docs/\*) needs to be updated afer a change in the code;
