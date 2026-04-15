import { expect, describe, it } from "vitest";
import { generateLayout, Sizes } from "./generate-layout";

describe("generate-layout", () => {
  it("should calculate the correct number of pages", () => {
    expect(generateLayout(1, Sizes.A5).totalPages).toBe(4);
    expect(generateLayout(2, Sizes.A5).totalPages).toBe(8);
    expect(generateLayout(1, Sizes.A6).totalPages).toBe(8);
    expect(generateLayout(2, Sizes.A6).totalPages).toBe(16);
    expect(generateLayout(1, Sizes.A7).totalPages).toBe(16);
    expect(generateLayout(2, Sizes.A7).totalPages).toBe(32);
    expect(generateLayout(1, Sizes.A8).totalPages).toBe(32);
    expect(generateLayout(2, Sizes.A8).totalPages).toBe(64);
  });

  it("should print the correct layout for 1 A4 sheet and A5 zine size", () => {
    const { layout } = generateLayout(1, Sizes.A5);
    expect(layout[0]).toEqual([[4, 1]]);
    expect(layout[1]).toEqual([[2, 3]]);
  });

  it("should print the correct layout for 2 A4 sheet and A5 zine size", () => {
    const { layout } = generateLayout(2, Sizes.A5);
    expect(layout[0]).toEqual([[8, 1]]);
    expect(layout[1]).toEqual([[2, 7]]);

    expect(layout[2]).toEqual([[6, 3]]);
    expect(layout[3]).toEqual([[4, 5]]);
  });

  it("should print the correct layout for 3 A4 sheet and A5 zine size", () => {
    const { layout } = generateLayout(3, Sizes.A5);
    expect(layout[0]).toEqual([[12, 1]]);
    expect(layout[1]).toEqual([[2, 11]]);

    expect(layout[2]).toEqual([[10, 3]]);
    expect(layout[3]).toEqual([[4, 9]]);

    expect(layout[4]).toEqual([[8, 5]]);
    expect(layout[5]).toEqual([[6, 7]]);
  });

  it("should print the correct layout for 1 A4 sheet and A6 zine size", () => {
    const { layout } = generateLayout(1, Sizes.A6);
    expect(layout[0]).toEqual([
      [8, 1],
      [6, 3],
    ]);
    expect(layout[1]).toEqual([
      [2, 7],
      [4, 5],
    ]);
  });

  it("should print the correct layout for 4 A4 sheet and A6 zine size", () => {
    const { layout } = generateLayout(4, Sizes.A6);
    expect(layout[0]).toEqual([
      [32, 1],
      [30, 3],
    ]);
    expect(layout[1]).toEqual([
      [2, 31],
      [4, 29],
    ]);

    expect(layout[2]).toEqual([
      [28, 5],
      [26, 7],
    ]);
    expect(layout[3]).toEqual([
      [6, 27],
      [8, 25],
    ]);

    expect(layout[4]).toEqual([
      [24, 9],
      [22, 11],
    ]);
    expect(layout[5]).toEqual([
      [10, 23],
      [12, 21],
    ]);

    expect(layout[6]).toEqual([
      [20, 13],
      [18, 15],
    ]);
    expect(layout[7]).toEqual([
      [14, 19],
      [16, 17],
    ]);
  });

  it("should print the correct layout for 1 A4 sheet and A7 zine size", () => {
    const { layout } = generateLayout(1, Sizes.A7);
    expect(layout[0]).toEqual([
      [16, 1, 14, 3],
      [12, 5, 10, 7],
    ]);
    expect(layout[1]).toEqual([
      [4, 13, 2, 15],
      [8, 9, 6, 11],
    ]);
  });
});
