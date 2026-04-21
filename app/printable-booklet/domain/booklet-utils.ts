import { jsPDF } from "jspdf";

const A4_WIDTH = 210;
const A4_HEIGHT = 297;

export const Sizes = {
  A5: "A5",
  A6: "A6",
  A7: "A7",
  A8: "A8",
} as const;

export type BookletSize = keyof typeof Sizes;

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
  files: FileList,
) => {
  const { layout } = generateLayout(numberOfSheets, size);

  const bookletPageWidth = Configs[size].portrait
    ? A4_WIDTH / Configs[size].cols
    : A4_HEIGHT / Configs[size].cols;
  const bookletPageHeight = Configs[size].portrait
    ? A4_HEIGHT / Configs[size].rows
    : A4_WIDTH / Configs[size].rows;

  const doc = new jsPDF({
    orientation: Configs[size].portrait ? "portrait" : "landscape",
    unit: "mm",
    format: "a4",
  });

  // Add image for each cell in the layout
  for (let page = 0; page < numberOfSheets * 2; page++) {
    for (let row = 0; row < Configs[size].rows; row++) {
      for (let col = 0; col < Configs[size].cols; col++) {
        const imgBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(files[layout[page][row][col] - 1]);
        });

        doc.addImage(
          imgBase64 as string,
          "JPEG",
          col * bookletPageWidth,
          row * bookletPageHeight,
          bookletPageWidth,
          bookletPageHeight,
        );
      }
    }

    if (page < numberOfSheets * 2 - 1) {
      doc.addPage();
    }
  }

  doc.save("a4.pdf");
};
