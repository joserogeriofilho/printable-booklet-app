# ADR-001: Image fit modes

**Date**: 2026-06-24
**Status**: Accepted

## Context

The application renders user-provided images into PDF booklet pages and preview
cards. Before this change, images were always **stretched** to fill the target
A-series cell dimensions, distorting the aspect ratio if the source image had a
different proportion. The preview cards used `object-fill` (CSS) to match this
behaviour.

Users need control over how their images are fitted to the booklet pages.

## Decision

Three mutually exclusive fit modes are exposed via a `<select>` field in the
"Setup your project" section:

| Mode | Name | Behaviour | CSS equivalent |
|------|------|-----------|----------------|
| `stretch` | Stretch to fill | Image is stretched/squished to exactly fill the target dimensions. Aspect ratio is **not** preserved. | `object-fit: fill` |
| `cover` | Crop to fill | Image is scaled proportionally so the entire target area is covered. Overflow on the longer axis is centre-cropped. Aspect ratio **is** preserved. | `object-fit: cover` |
| `contain` | Fit inside | Image is scaled proportionally to fit entirely within the target area. Remaining space is filled with a user-selected background colour. Aspect ratio **is** preserved. | `object-fit: contain` |

When `contain` mode is selected, a second input (colour picker + hex text field)
appears to let users choose the background colour. The default is `#ffffff`.

Both the **PDF output** and the **preview cards** reflect the selected mode.

## Implementation

### Type definition (`src/domain/booklet-utils.ts`)

```ts
export const FitModes = {
  STRETCH: "stretch",
  COVER: "cover",
  CONTAIN: "contain",
} as const;

export type FitMode = (typeof FitModes)[keyof typeof FitModes];
```

### Canvas logic (`src/domain/image-processor.ts`)

The `processImage()` function gained an optional `ProcessOptions` parameter
carrying `fitMode` and `backgroundColor`. The canvas draw logic branches per
mode:

- **stretch**: `ctx.drawImage(img, 0, 0, tw, th)` (unchanged).
- **cover**: compute a uniform scale of `max(tw/iw, th/ih)`, derive the source
  sub-rectangle to crop, then draw.
- **contain**: `fillRect` the background colour, compute a uniform scale of
  `min(tw/iw, th/ih)`, centre the image, then draw.

### PDF generation (`src/domain/booklet-utils.ts`)

`generatePdf()` now accepts `fitMode` and `backgroundColor` parameters, which
are forwarded to `processImage()`.

### Preview component (`app/components/booklet-preview.tsx`)

The `BookletPreview` component accepts `fitMode` and `backgroundColor` as
optional props and maps them to CSS:

- `stretch` → `object-fill`
- `cover` → `object-cover`
- `contain` → `object-contain` + inline `backgroundColor` on the card container

### UI form (`app/[locale]/page.tsx` + `app/components/fit-mode-selector.tsx`)

Two new state hooks (`fitMode`, `bgColor`) drive a `FitModeSelector` component
inside Step 1. The component renders three radio-button cards arranged in a
compact horizontal row, each containing an inline SVG illustration of the
corresponding fit mode (page outline + photo content shape). A conditional
colour input (colour picker + hex text) appears only when `contain` is selected.
The values are passed to both `<BookletPreview>` and `generatePdf()`.

### Internationalisation

New translation keys added to `en.json`, `pt.json`, and `es.json`:
`fitModeLabel`, `fitModeStretch`, `fitModeCover`, `fitModeContain`,
`bgColorLabel`.

## Consequences

- **Positive**: Users gain control over how images appear in the final booklet.
  The preview accurately reflects what the PDF will contain.
- **Positive**: The `FitMode` type and canvas logic are centralised in the
  domain layer, making future fit-mode changes localised.
- **Neutral**: The `generatePdf()` function signature grew from 4 to 6
  parameters. A refactor into a config object could be considered later.
- **Neutral**: `processImage()` has no dedicated unit tests for cover/contain
  modes because canvas mocking in jsdom is brittle. The modes are exercised
  manually and verified via the existing integration tests.
