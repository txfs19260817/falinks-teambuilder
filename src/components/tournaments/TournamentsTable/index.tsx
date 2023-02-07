import type { Tournament } from '@prisma/client';
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

import Table from '@/components/table';

const TournamentsTable = ({ tournaments }: { tournaments: Tournament[] }) => {
  const { locale } = useRouter();
  const { t } = useTranslation(['common']);
  // table settings
  const columns: ColumnDef<Tournament>[] = [
    {
      header: t('common.name'),
      accessorKey: 'name',
      cell: ({ getValue, row }) => (
        <a href={row.original.source} target="_blank" rel="noreferrer" className="link">
          {getValue<string>()}
        </a>
      ),
    },
    {
      header: t('common.format'),
      accessorKey: 'format',
    },
    {
      header: t('common.date'),
      accessorKey: 'date',
      cell: ({ getValue }) =>
        new Intl.DateTimeFormat(locale, {
          dateStyle: 'long',
        }).format(Date.parse(getValue<string>())),
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      header: t('common.players'),
      accessorKey: 'players',
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      header: t('common.details'),
      accessorKey: 'id',
      cell: ({ getValue }) => (
        <a href={`/tournaments/${getValue<string>()}`} className="btn-primary btn-xs btn">
          📊 {t('common.details')}
        </a>
      ),
      enableSorting: false,
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
  const instance = useReactTable<Tournament>({
    data: tournaments,
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
      <Table<Tournament> instance={instance} enablePagination={true} />
    </div>
  );
};

export default TournamentsTable;
