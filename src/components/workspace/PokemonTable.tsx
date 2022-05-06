import { Specie } from '@pkmn/data';
import { AbilityName, SpeciesAbility } from '@pkmn/dex-types';
import { Icons } from '@pkmn/img';
import { StatsTable } from '@pkmn/types';
import {
  ColumnFiltersState,
  createTable,
  getCoreRowModelSync,
  getFilteredRowModelSync,
  getPaginationRowModel,
  getSortedRowModelSync,
  PaginationState,
  Row,
  SortingState,
  useTableInstance,
} from '@tanstack/react-table';
import { ChangeEvent, Key, useContext, useEffect, useMemo, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { OmniFilter } from '@/components/workspace/OmniFilter';
import { PanelProps } from '@/components/workspace/types';
import { convertStylesStringToObject } from '@/utils/Helpers';

const table = createTable().setRowType<Specie>();
const defaultColumns = [
  table.createDataColumn('name', {
    header: 'Name',
    cell: ({ value }: { value: string }) => (
      <span>
        <span style={convertStylesStringToObject(Icons.getPokemon(value).style)}></span>
        {value}
      </span>
    ),
  }),
  table.createDataColumn('types', {
    header: 'Types',
    cell: ({ value }: { value: string[] }) => (
      <span>
        {value.map((type) => (
          <img className="inline-block" key={type} alt={type} title={type} src={Icons.getType(type).url} loading="lazy" />
        ))}
      </span>
    ),
    enableSorting: false,
    filterFn: 'arrIncludes',
  }),
  table.createDataColumn('abilities', {
    header: 'Abilities',
    cell: ({ value }: { value: SpeciesAbility<AbilityName | ''> }) => Object.values(value).join('/'),
    enableSorting: false,
    filterFn: (row: Row<any>, columnId: string, filterValue: string) => {
      return Object.values(row.values[columnId]).join(' ').toLowerCase().includes(filterValue.toLowerCase());
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
  table.createDataColumn((row) => row.baseStats, {
    id: 'total',
    header: 'Total',
    cell: ({ value }: { value: StatsTable }) => {
      return Object.values(value).reduce((acc, curr) => acc + curr, 0);
    },
    enableColumnFilter: false,
    enableGlobalFilter: false,
    sortingFn: (a: Row<any>, b: Row<any>, columnId: string) =>
      Object.values<number>(a.values[columnId]).reduce((acc, curr) => acc + curr, 0) -
      Object.values<number>(b.values[columnId]).reduce((acc, curr) => acc + curr, 0),
  }),
];

export function PokemonTable({ tabIdx, teamState }: PanelProps) {
  // get dex
  const { gen } = useContext(DexContext);

  // table settings
  const [data] = useState<Specie[]>(() => [...Array.from(gen.species)]);
  const columns = useMemo<typeof defaultColumns>(() => [...defaultColumns], []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
    pageCount: -1, // -1 allows the table to calculate the page count for us via instance.getPageCount()
  });

  // table instance
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
    getFilteredRowModel: getFilteredRowModelSync(),
    getCoreRowModel: getCoreRowModelSync(),
    getSortedRowModel: getSortedRowModelSync(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // handle table events
  const handleRowClick = (specie?: Specie) => {
    if (!specie || !teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].species = specie.name;
    // @ts-ignore
    teamState.team[tabIdx].ability = specie.abilities[0]; // eslint-disable-line prefer-destructuring
    if (specie.requiredItem) {
      // @ts-ignore
      teamState.team[tabIdx].item = specie.requiredItem; // eslint-disable-line prefer-destructuring
    }
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
          {instance.getRowModel().rows.map((row: { id?: Key; original?: Specie; getVisibleCells: () => any[] }) => (
            <tr key={row.id} className="hover" onClick={() => handleRowClick(row.original)}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{cell.renderCell()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="btn-group w-full items-center justify-center" aria-label="paginator">
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

export function SpeciesInput({ onFocus, teamState, tabIdx }: { onFocus: () => void } & PanelProps) {
  const [species, setSpecies] = useState<string>('Pikachu');

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setSpecies(teamState.team[tabIdx]?.species || 'Pikachu');
  }, [teamState.team[tabIdx]?.species]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSp = e.target.value;
    // setSpecies(newSp);
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].species = newSp;
  };

  return (
    <div className="tooltip" data-tip="Please pick Pokémon below">
      <label className="input-group-xs input-group input-group-vertical">
        <span>Species</span>
        <input
          type="text"
          placeholder="Species"
          className="input-primary input input-sm md:input-md"
          value={species}
          onFocus={onFocus}
          onChange={handleChange}
          onKeyDown={(event) => {
            event.preventDefault();
          }}
        />
      </label>
    </div>
  );
}
