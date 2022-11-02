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
import Link from 'next/link';
import { useContext, useState } from 'react';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import Table from '@/components/table';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';
import type { PastesList, PastesListItem } from '@/utils/Prisma';

const PastesTable = ({ pastes }: { pastes: PastesList }) => {
  const { globalFilter, setGlobalFilter } = useContext(StoreContext);

  // table settings
  const columns: ColumnDef<PastesListItem>[] = [
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
      header: 'Team',
      id: 'paste',
      accessorKey: 'paste',
      cell: ({ getValue }) => (
        <span>
          {(Pokemon.convertPasteToTeam(getValue<string>()) || []).map(({ species }) => (
            <PokemonIcon key={species} speciesId={species} />
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
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ getValue }) => <span>{new Date(getValue<string>()).toLocaleDateString()}</span>,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      header: 'Details',
      accessorKey: 'id',
      cell: ({ getValue }) => (
        <Link href={`/pastes/${getValue<string>()}`}>
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
  const instance = useReactTable<PastesListItem>({
    data: pastes,
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
      <Table<PastesListItem> instance={instance} enablePagination={true} />
    </div>
  );
};
export default PastesTable;
