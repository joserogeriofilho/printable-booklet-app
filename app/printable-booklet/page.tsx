"use client";

import { useState } from "react";
import { getTotalPages } from "./domain";
import type { BookletSize } from "./domain";

export default function Page() {
  const [numberOfSheets, setNumberOfSheets] = useState(1);
  const [size, setSize] = useState<BookletSize>("A5");

  const totalPages = getTotalPages(numberOfSheets, size);

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Printable booklet
      </h1>

      <h2 className="mt-4 mb-4 text-lg font-medium">Setup your project</h2>
      <div className="flex flex-row mb-2 items-center">
        <label htmlFor="sheets" className="text-sm font-medium mr-2">
          Sheets
        </label>
        <span className="text-xs">Min 1, max 50 sheets</span>
      </div>
      <input
        type="number"
        min={1}
        max={50}
        id="sheets"
        name="sheets"
        className="mb-2"
        value={numberOfSheets}
        onChange={(e) => setNumberOfSheets(parseInt(e.target.value) || 1)}
      />

      <label htmlFor="size" className="block mb-2 text-sm font-medium">
        Size
      </label>

      <select
        id="size"
        name="size"
        className="mb-2"
        value={size}
        onChange={(e) => setSize(e.target.value as BookletSize)}
      >
        <option value="A5">A5</option>
        <option value="A6">A6</option>
        <option value="A7">A7</option>
        <option value="A8">A8</option>
      </select>
      <div className="flex flex-row mb-2 items-center">
        <label htmlFor="images" className="text-sm font-medium mr-2">
          Images
        </label>
        <span className="text-xs">Select {totalPages} images</span>
      </div>
      <input type="file" id="images" name="images" className="mb-2" multiple />

      <h2 className="mt-4 mb-4 text-lg font-medium">Preview</h2>
      <span>Soon...</span>

      <h2 className="mt-4 mb-4 text-lg font-medium">Download</h2>
      <button>Download</button>
    </section>
  );
}
