type BookletSize = "A5" | "A6";

const BookletProps = {
  A5: {
    spreadsPerPage: 1,
    spreadsPerRow: 1,
  },
  A6: {
    spreadsPerPage: 2,
    spreadsPerRow: 1,
  },
};

type Layout = number[][][];

const generatePrintableLayout = (
  numberOfSheets: number,
  sizeOfZine: BookletSize,
) => {
  console.log("spreads per row: " + BookletProps[sizeOfZine].spreadsPerRow);

  return [[[1]]];
};
