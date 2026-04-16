export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Printable booklet
      </h1>
      <h2 className="mb-4 text-lg font-medium">Setup your project</h2>
      <label htmlFor="sheets" className="block mb-2 text-sm font-medium">
        Sheets
      </label>
      <input
        type="number"
        min={1}
        max={50}
        id="sheets"
        name="sheets"
        className="mb-4"
      />
      <label htmlFor="size" className="block mb-2 text-sm font-medium">
        Size
      </label>
      <select id="size" name="size" className="mb-4">
        <option value="A5">A5</option>
        <option value="A6">A6</option>
        <option value="A7">A7</option>
        <option value="A8">A8</option>
      </select>
    </section>
  );
}
