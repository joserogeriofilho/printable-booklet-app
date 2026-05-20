# Printable Booklet

A client-side web app that turns your images into a printable booklet. Fold, staple, and share your own zine.

## Description

Printable Booklet is a browser-based tool that takes a batch of images and arranges them into a print-ready booklet layout. It handles the math of booklet imposition — spreading pages across double-sided sheets so that when you fold and staple, every page lands in the right place.

**How it works:**

1. **Setup** — Pick your paper size (A4 or Letter), choose how many sheets you have, and upload your images. The order you select the images determines the page order in the final booklet.
2. **Generate** — Hit _Download PDF_ and the app crunches the layout math, producing a single PDF with properly imposed pages ready for double-sided printing.

The entire process happens in your browser — no images are ever uploaded to a server. The app is built as a static site so it can be run locally easily for private use. It supports English, Portuguese, and Spanish out of the box.

## Built With

- [Next.js](https://nextjs.org/) — React framework, static export mode
- [React 19](https://react.dev/) — UI library
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first CSS framework
- [jsPDF](https://github.com/parallax/jsPDF) — Client-side PDF generation

## Getting Started

1. Clone the repo
   ```bash
   git clone https://github.com/joserogeriofilho/printable-booklet-app.git
   ```
2. Install dependencies
   ```bash
   pnpm install
   ```
3. Run the app in dev mode
   ```bash
   pnpm dev
   ```
4. Open http://localhost:3000 in your browser

## Roadmap

- [x] First release with PDF generation
- [ ] Advanced options allowing to crop images to fit page resolution
- [ ] Preview of the pages
- [ ] Allow to change the order of the pages in the preview

## Contact

José Rogério Filho  
[@joserogeriofilho](https://github.com/joserogeriofilho)

## Version History

- 0.1
  - Initial Release

## License

This project is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html) — see the [LICENSE](LICENSE) file for details.
