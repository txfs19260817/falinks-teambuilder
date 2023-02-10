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
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useContext, useState } from 'react';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import Table from '@/components/table';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { duplicateArrayWith2DArray } from '@/utils/Helpers';
import { getAllFormesForSameFuncSpecies } from '@/utils/PokemonUtils';
import type { PastesList, PastesListItem } from '@/utils/Prisma';

type PastesTableProps = {
  pastes: PastesList;
  enableDateShared?: boolean;
  enableFormat?: boolean;
};

const PastesTable = ({ pastes, enableDateShared = false, enableFormat = false }: PastesTableProps) => {
  const { locale } = useRouter();
  const { t } = useTranslation(['common']);
  const { globalFilter, setGlobalFilter } = useContext(StoreContext);

  // table settings
  const columns: ColumnDef<PastesListItem>[] = [
    {
      header: t('common.pasteTableHeader.title'),
      accessorKey: 'title',
      cell: ({ getValue }) => <span title={getValue<string>()}>{`${getValue<string>()}`}</span>,
    },
    {
      header: t('common.author'),
      accessorKey: 'author',
      cell: ({ getValue }) => <span title={getValue<string>()}>{`${getValue<string>().substring(0, 20)}`}</span>,
    },
    {
      header: t('common.format'),
      accessorKey: 'format',
    },
    {
      header: t('common.team'),
      id: 'species',
      accessorKey: 'species',
      cell: ({ getValue }) => (
        <span>
          {getValue<string[]>()
            .sort()
            .map((species) => (
              <PokemonIcon key={species} speciesId={species} />
            ))}
        </span>
      ),
      filterFn: (row, columnId, filterValue) => {
        const species = row.getValue<string[]>(columnId); // Get all species in the row
        const bases = filterValue.map(getAllFormesForSameFuncSpecies) as string[][]; // Get all formes (who have unchanged func) for each species if it has any
        const filterValueArrays: string[][] = duplicateArrayWith2DArray(filterValue, bases) as string[][]; // Cartesian product of filterValue and bases
        return filterValueArrays.some((fs) => fs.every((v) => species.includes(v)));
      },
      enableSorting: false,
      enableMultiSort: false,
    },
    {
      id: 'createdAt',
      header: t('common.createdAt'),
      // Derive the true createdAt date from the CUID
      accessorKey: 'id',
      cell: ({ getValue }) => {
        const d = new Date(parseInt(getValue<string>().slice(1, 9), 36));
        return (
          <span>
            {new Intl.DateTimeFormat(locale ?? 'en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }).format(d)}
          </span>
        );
      },
      sortingFn: (a, b, columnId) =>
        new Date(parseInt(a.getValue<string>(columnId).slice(1, 9), 36)).getTime() - new Date(parseInt(b.getValue<string>(columnId).slice(1, 9), 36)).getTime(),
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: 'dateShared',
      header: t('common.pasteTableHeader.dateShared'),
      // The original createdAt date is Date Shared in VGCPastes
      accessorKey: 'createdAt',
      cell: ({ getValue }) => (
        <span>
          {new Intl.DateTimeFormat(locale ?? 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }).format(new Date(getValue<string>()))}
        </span>
      ),
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      header: t('common.details'),
      accessorKey: 'id',
      cell: ({ getValue }) => (
        <Link role="button" href={`/pastes/${getValue<string>()}`} className="btn-outline btn-ghost btn-xs btn" target="_blank">
          ℹ️
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
    initialState: {
      columnVisibility: {
        dateShared: enableDateShared,
        format: enableFormat,
      },
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
