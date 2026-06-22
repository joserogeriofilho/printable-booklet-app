import { processImage } from "./image-processor";

const A4_WIDTH = 210; // 210 mm
const A4_HEIGHT = 297; // 297 mm

export const Sizes = {
  A5: "A5",
  A6: "A6",
  A7: "A7",
  A8: "A8",
} as const;

export type BookletSize = keyof typeof Sizes;

type Cell = {
  row: number;
  col: number;
  fileIndex: number;
};

export type ProgressCallback = (current: number, total: number) => void;

const Configs = {
  A5: {
    cols: 2,
    rows: 1,
    portrait: false,
  },
  A6: {
    cols: 2,
    rows: 2,
    portrait: true,
  },
  A7: {
    cols: 4,
    rows: 2,
    portrait: false,
  },
  A8: {
    cols: 4,
    rows: 4,
    portrait: true,
  },
} as const;

export const getTotalPages = (numberOfSheets: number, size: BookletSize) => {
  const config = Configs[size];
  return numberOfSheets * config.rows * config.cols * 2;
};

export const generateLayout = (numberOfSheets: number, size: BookletSize) => {
  const config = Configs[size];

  const totalPages = numberOfSheets * config.rows * config.cols * 2;

  const layout = Array.from({ length: numberOfSheets * 2 }, () =>
    Array.from({ length: config.rows }, () => Array(config.cols).fill(0)),
  );

  let count = 0;

  for (let page = 0; page < numberOfSheets * 2; page += 2) {
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col += 2) {
        // Front
        layout[page][row][col] = totalPages - count;
        layout[page][row][col + 1] = count + 1;

        // Back
        layout[page + 1][row][config.cols - col - 1] =
          layout[page][row][col] - 1;
        layout[page + 1][row][config.cols - col - 2] =
          layout[page][row][col + 1] + 1;

        count += 2;
      }
    }
  }

  return {
    totalPages,
    layout,
  };
};

export const generatePdf = async (
  numberOfSheets: number,
  size: BookletSize,
  files: File[],
  onProgress?: ProgressCallback,
) => {
  const { layout } = generateLayout(numberOfSheets, size);

  const bookletPageWidth = Configs[size].portrait
    ? A4_WIDTH / Configs[size].cols
    : A4_HEIGHT / Configs[size].cols;
  const bookletPageHeight = Configs[size].portrait
    ? A4_HEIGHT / Configs[size].rows
    : A4_WIDTH / Configs[size].rows;

  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({
    orientation: Configs[size].portrait ? "portrait" : "landscape",
    unit: "mm",
    format: "a4",
  });

  const rows = Configs[size].rows;
  const cols = Configs[size].cols;
  const totalCells = numberOfSheets * 2 * rows * cols;
  let processed = 0;

  for (let page = 0; page < numberOfSheets * 2; page++) {
    const cells: Cell[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const fileIndex = layout[page][row][col] - 1;
        if (!files[fileIndex]) {
          throw new Error(
            `Missing image for page ${page + 1}, row ${row + 1}, col ${col + 1}`,
          );
        }
        cells.push({ row, col, fileIndex });
      }
    }

    // Process all images for this page in parallel
    const results = await Promise.all(
      cells.map(({ row, col, fileIndex }) =>
        processImage(
          files[fileIndex],
          bookletPageWidth,
          bookletPageHeight,
        ).then((imgBase64) => {
          processed++;
          onProgress?.(processed, totalCells);
          return { row, col, imgBase64 };
        }),
      ),
    );

    // Place images on the page
    for (const { row, col, imgBase64 } of results) {
      doc.addImage(
        imgBase64 as string,
        "JPEG",
        col * bookletPageWidth,
        row * bookletPageHeight,
        bookletPageWidth,
        bookletPageHeight,
      );
    }

    if (page < numberOfSheets * 2 - 1) {
      doc.addPage();
    }
  }

  doc.save("a4.pdf");
};
