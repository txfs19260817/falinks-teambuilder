import type { replay } from '@prisma/client';
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
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import Table from '@/components/table';

const ReplaysTable = ({ replays }: { replays: replay[] }) => {
  const { locale } = useRouter();
  const { t } = useTranslation(['common']);

  // table settings
  const columns: ColumnDef<replay>[] = [
    {
      header: t('common.replay'),
      accessorKey: 'id',
      cell: ({ getValue }) => (
        <a href={`https://replay.pokemonshowdown.com/${getValue<string>()}`} target="_blank" rel="noreferrer" className="btn-ghost btn-xs btn">
          🔗
        </a>
      ),
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      header: t('common.rating'),
      accessorKey: 'rating',
    },
    {
      header: `${t('common.player')}1`,
      accessorKey: 'p1',
    },
    {
      header: `${t('common.player')}1's team`,
      accessorKey: 'p1team',
      cell: ({ getValue }) => (
        <span>
          {getValue<string[]>().map((species) => (
            <PokemonIcon key={species} speciesId={species} />
          ))}
        </span>
      ),
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      header: `${t('common.player')}2`,
      accessorKey: 'p2',
    },
    {
      header: `${t('common.player')}2's team`,
      accessorKey: 'p2team',
      cell: ({ getValue }) => (
        <span>
          {getValue<string[]>().map((species) => (
            <PokemonIcon key={species} speciesId={species} />
          ))}
        </span>
      ),
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      header: t('common.createdAt'),
      accessorKey: 'uploadtime',
      cell: ({ getValue }) => new Intl.DateTimeFormat(locale).format(Date.parse(getValue<string>())),
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
  ];
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  // table instance
  const instance = useReactTable<replay>({
    data: replays,
    columns,
    state: {
      columnFilters,
      sorting,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
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
      <Table<replay> instance={instance} enablePagination={true} />
    </div>
  );
};

export default ReplaysTable;
