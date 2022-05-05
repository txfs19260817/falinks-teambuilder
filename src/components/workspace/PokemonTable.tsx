import { Specie } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import {
  Column,
  ColumnFiltersState,
  createTable,
  getColumnFilteredRowModelSync,
  getCoreRowModelSync,
  getGlobalFilteredRowModelSync,
  getPaginationRowModel,
  getSortedRowModelSync,
  PaginationState,
  Row,
  SortingState,
  TableInstance,
  useTableInstance,
} from '@tanstack/react-table';
import { useContext, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { PanelProps } from '@/components/workspace/types';
import { convertStylesStringToObject } from '@/utils/Helpers';

const table = createTable().setRowType<Specie>();
const defaultColumns = [
  table.createDataColumn('name', {
    header: 'Name',
    cell: ({ value }) => (
      <span>
        <span style={convertStylesStringToObject(Icons.getPokemon(value).style)}></span>
        {value}
      </span>
    ),
  }),
  table.createDataColumn('types', {
    header: 'Types',
    enableSorting: false,
    cell: ({ value }) => (
      <span>
        {value.map((type) => (
          <img key={type} className="inline-block" alt={type} src={Icons.getType(type).url} loading="lazy" />
        ))}
      </span>
    ),
    filterFn: (rows: Row<any>[], _columnIds: string[], filterValue: any) => {
      return rows.filter((row) => row.values.types.includes(filterValue));
    },
  }),
  table.createDataColumn('abilities', {
    header: 'Abilities',
    enableSorting: false,
    cell: ({ value }) => Object.values(value).join('/'),
    filterFn: (rows: Row<any>[], _columnIds: string[], filterValue: string) => {
      return rows.filter((row) => JSON.stringify(row.values.abilities).toLowerCase().includes(filterValue.toLowerCase()));
    },
  }),
  table.createDataColumn((row) => row.baseStats.hp, {
    id: 'hp',
    header: 'HP',
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
  table.createDataColumn((row) => row.baseStats.atk, {
    id: 'atk',
    header: 'ATK',
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
  table.createDataColumn((row) => row.baseStats.def, {
    id: 'def',
    header: 'DEF',
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
  table.createDataColumn((row) => row.baseStats.spa, {
    id: 'spa',
    header: 'SPA',
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
  table.createDataColumn((row) => row.baseStats.spd, {
    id: 'spd',
    header: 'SPD',
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
  table.createDataColumn((row) => row.baseStats.spe, {
    id: 'spe',
    header: 'SPE',
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
];

function Filter({ column, instance }: { column: Column<any>; instance: TableInstance<any> }) {
  if (!column.getCanColumnFilter()) return null;
  const firstValue = instance.getPreColumnFilteredRowModel().flatRows[0]?.values[column.id];
  const columnFilterValue = column.getColumnFilterValue();

  if (Array.isArray(firstValue) && column.id === 'types') {
    return (
      <select
        onChange={(e) => {
          column.setColumnFilterValue(e.target.value);
        }}
      >
        <option value="">All</option>
        <option value="Grass">Grass</option>
        <option value="Fire">Fire</option>
        <option value="Water">Water</option>
        <option value="Bug">Bug</option>
        <option value="Normal">Normal</option>
        <option value="Poison">Poison</option>
        <option value="Electric">Electric</option>
        <option value="Ground">Ground</option>
        <option value="Rock">Rock</option>
        <option value="Flying">Flying</option>
        <option value="Fighting">Fighting</option>
        <option value="Psychic">Psychic</option>
        <option value="Ice">Ice</option>
        <option value="Ghost">Ghost</option>
        <option value="Dragon">Dragon</option>
        <option value="Dark">Dark</option>
        <option value="Steel">Steel</option>
        <option value="Fairy">Fairy</option>
      </select>
    );
  }

  if (typeof firstValue === 'number') {
    return (
      <div className="flex space-x-1">
        <input
          type="number"
          min={Number(column.getPreFilteredMinMaxValues()[0])}
          max={Number(column.getPreFilteredMinMaxValues()[1])}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={(e) => column.setColumnFilterValue((old: [number, number]) => [e.target.value, old?.[1]])}
          placeholder={`↓ (${column.getPreFilteredMinMaxValues()[0]})`}
          className="input input-xs w-16 shadow"
        />
        <input
          type="number"
          min={Number(column.getPreFilteredMinMaxValues()[0])}
          max={Number(column.getPreFilteredMinMaxValues()[1])}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={(e) => column.setColumnFilterValue((old: [number, number]) => [old?.[0], e.target.value])}
          placeholder={`↑ (${column.getPreFilteredMinMaxValues()[1]})`}
          className="input input-xs w-16 shadow"
        />
      </div>
    );
  }
  return (
    <input
      type="search"
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setColumnFilterValue(e.target.value)}
      placeholder={`... (${column.getPreFilteredUniqueValues().size} rows)`}
      className="input input-xs w-24 shadow md:w-32"
    />
  );
}

export function PokemonTable(_props: PanelProps) {
  // get dex
  const { gen } = useContext(DexContext);
  const [data] = useState<Specie[]>(() => [...Array.from(gen.species)]);
  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
    pageCount: -1, // -1 allows the table to calculate the page count for us via instance.getPageCount()
  });
  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      sorting,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getColumnFilteredRowModel: getColumnFilteredRowModelSync(),
    getGlobalFilteredRowModel: getGlobalFilteredRowModelSync(),
    getCoreRowModel: getCoreRowModelSync(),
    getSortedRowModel: getSortedRowModelSync(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <>
      <table className="table-compact relative table w-full">
        <thead>
          {instance.getHeaderGroups().map((headerGroup) => (
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
                      <Filter column={header.column} instance={instance} />
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {instance.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{cell.renderCell()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="btn-group w-full items-center justify-center">
        <button className="btn btn-sm" onClick={() => instance.setPageIndex(0)} disabled={!instance.getCanPreviousPage()}>
          {'<<'}
        </button>
        <button className="btn btn-sm" onClick={() => instance.previousPage()} disabled={!instance.getCanPreviousPage()}>
          {'<'}
        </button>
        <button className="btn btn-sm">
          {instance.getState().pagination.pageIndex + 1} / {instance.getPageCount()}
        </button>
        <button className="btn btn-sm" onClick={() => instance.nextPage()} disabled={!instance.getCanNextPage()}>
          {'>'}
        </button>
        <button className="btn btn-sm" onClick={() => instance.setPageIndex(instance.getPageCount() - 1)} disabled={!instance.getCanNextPage()}>
          {'>>'}
        </button>
        <div className="divider divider-horizontal" />
        <span className="flex items-center gap-1">
          Go to page:
          <input
            className="input input-sm w-16"
            type="number"
            min={1}
            defaultValue={instance.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              instance.setPageIndex(page);
            }}
          />
        </span>
        <div className="divider divider-horizontal" />
        <select
          className="select select-sm"
          value={instance.getState().pagination.pageSize}
          onChange={(e) => {
            instance.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
