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
import Image from 'next/image';
import { useContext, useMemo, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { StoreContext } from '@/components/workspace/StoreContext';
import Table from '@/components/workspace/Table';
import { getPokemonIcon } from '@/utils/Helpers';

const table = createTable().setRowType<Specie>();
const defaultColumns = [
  table.createDataColumn('name', {
    header: 'Name',
    cell: ({ value }) => {
      return (
        <span>
          <span style={getPokemonIcon(undefined, value, true)}></span>
          {value}
        </span>
      );
    },
  }),
  table.createDataColumn('types', {
    header: 'Types',
    cell: ({ value }: { value: string[] }) => (
      <span>
        {value.map((type) => (
          <Image className="inline-block" width={32} height={14} key={type} alt={type} title={type} src={Icons.getType(type).url} loading="lazy" />
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

function SpeciesTable() {
  const { globalFilter, setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch } = useContext(StoreContext);
  // get dex
  const { gen } = useContext(DexContext);

  // table settings
  const data = useMemo<Specie[]>(() => [...Array.from(gen.species)], []);
  const columns = useMemo<typeof defaultColumns>(() => [...defaultColumns], []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
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
    if (specie.requiredItem) {
      // @ts-ignore
      teamState.team[tabIdx].item = specie.requiredItem; // eslint-disable-line prefer-destructuring
    }
    // @ts-ignore
    teamState.team[tabIdx].moves.splice(0, 4, ...['', '', '', '']);

    focusedFieldDispatch({ type: 'next', payload: focusedFieldState });
  };

  // table render
  return <Table<Specie> instance={instance} handleRowClick={handleRowClick} enablePagination={true} />;
}

export default SpeciesTable;
