<p align="center">
  <h1 align="center">Printable Booklet</h1>

  <p align="center">
    An open source web app that turns images into a printable booklet.
    <br />
    <a href="https://rogersama.com/printable-booklet"><strong>Try it online »</strong></a>
    <br />
    <br />
  </p>
</p>

## About the project

<img src="https://github.com/user-attachments/assets/6e8e40cc-7e31-4d8c-9d86-2531f7c0854b" alt="Screenshot of the web app">

<br />
<br />

Printable Booklet is an web app that takes a batch of images and arranges them into a print-ready booklet layout. It handles the math of positioning images across A4 sheets so you can print on both sides of the paper, cut, fold, and staple it all into a proper little book.

**How it works:**

1. **Setup** — Pick your page size (A5, A6, A7 or A8), choose how many A4 sheets you want and select your images.
2. **Generate** — Hit the download button and download the generated PDF file.
3. **Print and mount** - Print in both sides of the paper, cut the spreads, mount them and staple your booklet.

The entire process happens in your browser — no images are ever uploaded to a server. The entire app is built as a static website so it can be run locally easily for private use, no backend is necessary. It supports English, Portuguese, and Spanish languages.

## Getting Started

### Built With

- [Next.js](https://nextjs.org/) — React framework, static export mode
- [React 19](https://react.dev/) — UI library
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first CSS framework
- [jsPDF](https://github.com/parallax/jsPDF) — Client-side PDF generation

### Running Locally

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

## The Author

[José Rogério Filho](https://github.com/joserogeriofilho)

## License

This project is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html) — see the [LICENSE](LICENSE.md) file for details.
