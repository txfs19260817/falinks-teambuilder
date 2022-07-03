import { Specie } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import {
  ColumnDef,
  ColumnFiltersState,
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
  useReactTable,
} from '@tanstack/react-table';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import Table from '@/components/workspace/Table';
import { getPokemonIcon } from '@/utils/Helpers';

function SpeciesTable() {
  const { gen, usages, globalFilter, setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch } = useContext(StoreContext);

  // table settings
  const [data, setData] = useState<Specie[]>(() => [...Array.from(gen.species)]);
  const columns: ColumnDef<Specie>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: (info) => {
        const value = info.getValue();
        return (
          <span>
            <span style={getPokemonIcon(undefined, value, true)}></span>
            {value}
          </span>
        );
      },
    },
    {
      header: 'Types',
      accessorKey: 'types',
      cell: (info) => (
        <span>
          {info.getValue().map((type: string) => (
            <Image className="inline-block" width={32} height={14} key={type} alt={type} title={type} src={Icons.getType(type).url} loading="lazy" />
          ))}
        </span>
      ),
      enableSorting: false,
      filterFn: 'arrIncludes',
    },
    {
      header: 'Abilities',
      accessorKey: 'abilities',
      cell: (info) => Object.values(info.getValue()).join('/'),
      enableSorting: false,
      filterFn: (row, columnId, filterValue) => {
        return Object.values(row.getValue(columnId)).join(' ').toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      id: 'hp',
      header: 'HP',
      accessorFn: (row) => row.baseStats.hp,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: 'atk',
      header: 'ATK',
      accessorFn: (row) => row.baseStats.atk,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: 'def',
      header: 'DEF',
      accessorFn: (row) => row.baseStats.def,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: 'spa',
      header: 'SPA',
      accessorFn: (row) => row.baseStats.spa,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: 'spd',
      header: 'SPD',
      accessorFn: (row) => row.baseStats.spd,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: 'spe',
      header: 'SPE',
      accessorFn: (row) => row.baseStats.spe,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: 'total',
      header: 'Total',
      accessorFn: (row) => row.baseStats,
      cell: (info) => {
        return Object.values<number>(info.getValue()).reduce((acc, curr) => acc + curr, 0);
      },
      enableColumnFilter: false,
      enableGlobalFilter: false,
      sortingFn: (a: Row<any>, b: Row<any>, columnId: string) =>
        Object.values<number>(a.getValue(columnId)).reduce((acc, curr) => acc + curr, 0) -
        Object.values<number>(b.getValue(columnId)).reduce((acc, curr) => acc + curr, 0),
    },
  ];
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
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
  const instance = useReactTable<Specie>({
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
