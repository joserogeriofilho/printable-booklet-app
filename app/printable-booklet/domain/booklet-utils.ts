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
  },
  A6: {
    cols: 2,
    rows: 2,
  },
  A7: {
    cols: 4,
    rows: 2,
  },
  A8: {
    cols: 4,
    rows: 4,
  },
} as const;

export const getTotalPages = (numberOfSheets: number, size: BookletSize) => {
  const config = Configs[size];
  return numberOfSheets * config.rows * config.cols * 2;
};

export const generateLayout = (numberOfSheets: number, size: BookletSize) => {
  const config = Configs[size];

  console.log("config", config);

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
