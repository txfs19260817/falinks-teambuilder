import { TournamentTeam } from '@prisma/client';
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
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import Table from '@/components/table';
import { Pokemon } from '@/models/Pokemon';

const TournamentTeamsTable = ({ tournamentTeams }: { tournamentTeams: TournamentTeam[] }) => {
  const { t } = useTranslation(['common']);
  // table settings
  const columns: ColumnDef<TournamentTeam>[] = [
    {
      header: '#',
      accessorKey: 'standing',
      cell: ({ getValue }) => (getValue<number>() <= 128 ? getValue<number>() : '>128'),
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      header: t('common.tournamentAuthor'),
      accessorKey: 'author',
    },
    {
      id: 'species',
      header: t('common.team'),
      accessorFn: ({ paste }) => Pokemon.convertPasteToTeam(paste)?.map(({ species }) => species) ?? [],
      cell: ({ getValue }) => (
        <span>
          {getValue<string[]>().map((s) => (
            <PokemonIcon speciesId={s} key={s} />
          ))}
        </span>
      ),
      filterFn: (row, columnId, filterValue) => {
        const species = row.getValue<string[]>(columnId);
        return !filterValue.some((v: string) => !species.includes(v));
      },
      enableSorting: false,
      enableMultiSort: false,
    },
    {
      id: 'copy',
      header: t('common.copyOTS'),
      accessorKey: 'paste',
      cell: ({ getValue }) => (
        <button className={'btn-primary btn-xs btn'} onClick={() => navigator.clipboard.writeText(getValue<string>())}>
          {t('common.copy')}
        </button>
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
  const instance = useReactTable<TournamentTeam>({
    data: tournamentTeams,
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
      <Table<TournamentTeam> instance={instance} enablePagination={true} />
    </div>
  );
};

export default TournamentTeamsTable;
