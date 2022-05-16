import { Column, TableInstance } from '@tanstack/react-table';

export function OmniFilter({ column, instance }: { column: Column<any>; instance: TableInstance<any> }) {
  if (!column.getCanFilter()) return null;
  const firstValue = instance.getPreFilteredRowModel().flatRows[0]?.values[column.id];
  const columnFilterValue = column.getFilterValue();

  if (column.id === 'types' || column.id === 'type') {
    return (
      <select
        className="select select-xs w-16 md:w-24"
        onChange={(e) => {
          column.setFilterValue(e.target.value);
        }}
      >
        <option value="">All</option>
        <option value="Bug">Bug</option>
        <option value="Dark">Dark</option>
        <option value="Dragon">Dragon</option>
        <option value="Electric">Electric</option>
        <option value="Fairy">Fairy</option>
        <option value="Fighting">Fighting</option>
        <option value="Fire">Fire</option>
        <option value="Flying">Flying</option>
        <option value="Ghost">Ghost</option>
        <option value="Grass">Grass</option>
        <option value="Ground">Ground</option>
        <option value="Ice">Ice</option>
        <option value="Normal">Normal</option>
        <option value="Poison">Poison</option>
        <option value="Psychic">Psychic</option>
        <option value="Rock">Rock</option>
        <option value="Steel">Steel</option>
        <option value="Water">Water</option>
      </select>
    );
  }

  if (column.id === 'category') {
    return (
      <select
        className="select select-xs w-16 md:w-24"
        onChange={(e) => {
          column.setFilterValue(e.target.value);
        }}
      >
        <option value="">All</option>
        <option value="Physical">Physical</option>
        <option value="Special">Special</option>
        <option value="Status">Status</option>
      </select>
    );
  }

  if (typeof firstValue === 'number') {
    return (
      <div className="flex space-x-1">
        <input
          type="number"
          min={Number(column.getFacetedMinMaxValues()[0])}
          max={Number(column.getFacetedMinMaxValues()[1])}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={(e) => column.setFilterValue((old: [number, number]) => [e.target.value, old?.[1]])}
          placeholder={`↓ (${column.getFacetedMinMaxValues()[0]})`}
          className="input input-xs w-16 shadow"
        />
        <input
          type="number"
          min={Number(column.getFacetedMinMaxValues()[0])}
          max={Number(column.getFacetedMinMaxValues()[1])}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={(e) => column.setFilterValue((old: [number, number]) => [old?.[0], e.target.value])}
          placeholder={`↑ (${column.getFacetedMinMaxValues()[1]})`}
          className="input input-xs w-16 shadow"
        />
      </div>
    );
  }

  return (
    <input
      type="search"
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`... (${column.getFacetedUniqueValues().size} rows)`}
      className="input input-xs w-24 shadow md:w-32"
    />
  );
}
