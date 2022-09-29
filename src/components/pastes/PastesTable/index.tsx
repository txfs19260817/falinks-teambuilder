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
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { WithId } from 'mongodb';
import Link from 'next/link';
import { useContext, useState } from 'react';

import Table from '@/components/table';
import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { Pokemon } from '@/models/Pokemon';
import { PokePaste } from '@/models/PokePaste';
import { getPokemonIcon } from '@/utils/PokemonUtils';

const PastesTable = ({ pastes, detailSubPath }: { pastes: WithId<PokePaste>[]; detailSubPath: string | 'vgc' | 'public' }) => {
  const { globalFilter, setGlobalFilter } = useContext(DexContext);

  // table settings
  const [data] = useState<WithId<PokePaste>[]>(() => [...Array.from(pastes)]);
  const columns: ColumnDef<WithId<PokePaste>>[] = [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ getValue }) => <span title={getValue<string>()}>{`${getValue<string>().substring(0, 32)}`}</span>,
    },
    {
      header: 'Author',
      accessorKey: 'author',
      cell: ({ getValue }) => <span title={getValue<string>()}>{`${getValue<string>().substring(0, 16)}`}</span>,
    },
    {
      header: 'Notes',
      accessorKey: 'notes',
      cell: ({ getValue }) => <span title={getValue<string>()}>{`${getValue<string>().substring(0, 48)}`}</span>,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableSorting: false,
      enableMultiSort: false,
    },
    {
      header: 'Team',
      id: 'paste',
      accessorKey: 'paste',
      cell: ({ getValue }) => (
        <span>
          {(Pokemon.convertPasteToTeam(getValue<string>()) || []).map((p) => (
            <span key={p.species} title={p.species} style={getPokemonIcon(undefined, p.species, true)}></span>
          ))}
        </span>
      ),
      filterFn: (row, columnId, filterValue) => {
        const team = Pokemon.convertPasteToTeam(row.getValue<string>(columnId)) || [];
        return !filterValue.some((val: string) => !team.map((p: Pokemon) => p.species).includes(val));
      },
      enableSorting: false,
      enableMultiSort: false,
    },
    {
      header: 'Details',
      accessorKey: '_id',
      cell: ({ getValue }) => (
        <Link href={`/pastes/${detailSubPath}/${getValue<string>()}`}>
          <a className="btn-secondary btn-xs btn">Details</a>
        </Link>
      ),
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableSorting: false,
      enableMultiSort: false,
    },
  ];
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });

  // table instance
  const instance = useReactTable<WithId<PokePaste>>({
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
  return (
    <div className="overflow-x-auto">
      <Table<WithId<PokePaste>> instance={instance} enablePagination={true} />
    </div>
  );
};
export default PastesTable;
