import { Specie } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import {
  ColumnFiltersState,
  createTable,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useTableInstance,
} from '@tanstack/react-table';
import Image from 'next/image';
import { useContext, useEffect, useMemo, useState } from 'react';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import Table from '@/components/workspace/Table';
import { getPokemonIcon } from '@/utils/Helpers';

const table = createTable().setRowType<Specie>();
const defaultColumns = [
  table.createDataColumn('name', {
    header: 'Name',
    cell: (info) => {
      const value = info.getValue();
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
    cell: (info) => (
      <span>
        {info.getValue().map((type) => (
          <Image className="inline-block" width={32} height={14} key={type} alt={type} title={type} src={Icons.getType(type).url} loading="lazy" />
        ))}
      </span>
    ),
    enableSorting: false,
    filterFn: 'arrIncludes',
  }),
  table.createDataColumn('abilities', {
    header: 'Abilities',
    cell: (info) => Object.values(info.getValue()).join('/'),
    enableSorting: false,
    filterFn: (row, columnId, filterValue) => {
      return Object.values(row.getValue(columnId)).join(' ').toLowerCase().includes(filterValue.toLowerCase());
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
    cell: (info) => {
      return Object.values(info.getValue()).reduce((acc, curr) => acc + curr, 0);
    },
    enableColumnFilter: false,
    enableGlobalFilter: false,
    sortingFn: (a: Row<any>, b: Row<any>, columnId: string) =>
      Object.values<number>(a.getValue(columnId)).reduce((acc, curr) => acc + curr, 0) -
      Object.values<number>(b.getValue(columnId)).reduce((acc, curr) => acc + curr, 0),
  }),
];

function SpeciesTable() {
  const { gen, usages, globalFilter, setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch } = useContext(StoreContext);

  // table settings
  const [data, setData] = useState<Specie[]>(() => [...Array.from(gen.species)]);
  const columns = useMemo<typeof defaultColumns>(() => [...defaultColumns], []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
    pageCount: undefined, // undefined allows the table to calculate the page count for us via instance.getPageCount()
  });

  // sorting by usages
  useEffect(() => {
    if (usages.length > 0) {
      const usageSorted = usages.flatMap((u) => gen.species.get(u.name) || []);
      usageSorted.push(...Array.from(gen.species).filter((s) => !usageSorted.includes(s)));
      setData(usageSorted);
    }
  }, [usages]);

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
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // handle table events
  const handleRowClick = (specie?: Specie) => {
    if (!specie || !teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].species = specie.name;
    // @ts-ignore
    teamState.team[tabIdx].ability = '';
    // @ts-ignore
    teamState.team[tabIdx].item = specie.requiredItem ?? ''; // eslint-disable-line prefer-destructuring
    // @ts-ignore
    teamState.team[tabIdx].moves.splice(0, 4, ...['', '', '', '']);

    focusedFieldDispatch({ type: 'next', payload: focusedFieldState });
    setGlobalFilter('');
  };

  // table render
  return <Table<Specie> instance={instance} handleRowClick={handleRowClick} enablePagination={true} />;
}

export default SpeciesTable;
