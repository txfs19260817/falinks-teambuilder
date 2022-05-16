import { Ability, Generation } from '@pkmn/data';
import { ColumnFiltersState, createTable, getCoreRowModelSync, getFilteredRowModelSync, getSortedRowModelSync, useTableInstance } from '@tanstack/react-table';
import { Key, useContext, useEffect, useMemo, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { StoreContext } from '@/components/workspace/StoreContext';
import OmniFilter from '@/components/workspace/Table/OmniFilter';

const table = createTable().setRowType<Ability>();
const defaultColumns = [
  table.createDataColumn('name', {
    header: 'Name',
  }),
  table.createDataColumn('shortDesc', {
    header: 'Description',
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableSorting: false,
  }),
];

function getAbilitiesBySpecie(gen: Generation, speciesName?: string): Ability[] {
  const abilitiesMap = gen.species.get(speciesName ?? '')?.abilities;
  // return all abilities by default
  if (!abilitiesMap) {
    return Array.from(gen.abilities);
  }
  return Object.values(abilitiesMap)
    .map((a: string) => gen.abilities.get(a))
    .filter((a) => a != null) as Ability[];
}

function AbilitiesTable() {
  const { globalFilter, setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx } = useContext(StoreContext);
  // get dex & possible abilities
  const { gen } = useContext(DexContext);

  // table settings
  const [data, setData] = useState<Ability[]>([]);
  useEffect(() => {
    setData(() => [...getAbilitiesBySpecie(gen, teamState.team[tabIdx]?.species)]);
  }, [teamState.team[tabIdx]?.species]);
  const columns = useMemo<typeof defaultColumns>(() => [...defaultColumns], []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // table instance
  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModelSync(),
    getCoreRowModel: getCoreRowModelSync(),
    getSortedRowModel: getSortedRowModelSync(),
  });

  // handle table events
  const handleRowClick = (ability?: Ability) => {
    if (!ability || !teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].ability = ability.name;
  };

  // table render
  return (
    <>
      <table className="table-compact relative table w-full">
        <thead>
          {instance.getHeaderGroups().map((headerGroup: { id?: Key; headers: any[] }) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan} className="sticky top-0">
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        {...{
                          className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {header.renderHeader()}
                        {{
                          asc: '↑',
                          desc: '↓',
                        }[header.column.getIsSorted() as string] ?? (header.column.getCanSort() ? '⇵' : null)}
                      </div>
                      <OmniFilter column={header.column} instance={instance} />
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {instance.getRowModel().rows.map((row: { id?: Key; original?: Ability; getVisibleCells: () => any[] }) => (
            <tr key={row.id} className="hover" onClick={() => handleRowClick(row.original)}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{cell.renderCell()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default AbilitiesTable;
