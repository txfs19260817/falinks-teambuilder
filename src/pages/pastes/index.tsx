import { ClipboardCopyIcon } from '@heroicons/react/solid';
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
import { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import Table from '@/components/workspace/Table';
import { Paste } from '@/models/Paste';
import { Pokemon } from '@/models/Pokemon';
import { Main } from '@/templates/Main';
import { getPokemonIcon } from '@/utils/Helpers';
import clientPromise from '@/utils/MongoDB';

const Pastes = ({ pastes }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { globalFilter, setGlobalFilter } = useContext(DexContext);
  const router = useRouter();

  // table settings
  const [data] = useState<Paste[]>(() => [...Array.from(pastes)]);
  const columns: ColumnDef<Paste>[] = [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ getValue }) => <span title={getValue()}>{`${getValue().substring(0, 32)}`}</span>,
    },
    {
      header: 'Author',
      accessorKey: 'author',
      cell: ({ getValue }) => <span title={getValue()}>{`${getValue().substring(0, 16)}`}</span>,
    },
    {
      header: 'Notes',
      accessorKey: 'notes',
      cell: ({ getValue }) => <span title={getValue()}>{`${getValue().substring(0, 20)}`}</span>,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableSorting: false,
      enableMultiSort: false,
    },
    {
      header: 'Team',
      accessorKey: 'team',
      cell: ({ getValue }) => (
        <span>
          {getValue().map((p: Pokemon) => (
            <span key={p.species} title={p.species} style={getPokemonIcon(undefined, p.species, true)}></span>
          ))}
        </span>
      ),
      filterFn: (row, columnId, filterValue) => {
        return !filterValue.some(
          (val: string) =>
            !row
              .getValue(columnId)
              .map((p: Pokemon) => p.species)
              .includes(val)
        );
      },
    },
    {
      header: 'Paste',
      accessorKey: 'paste',
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableSorting: false,
      enableMultiSort: false,
      cell: ({ getValue }) => (
        <button
          className="btn btn-primary btn-xs"
          onClick={() => {
            navigator.clipboard.writeText(getValue()).then(() => toast('📋 Copied!'));
          }}
        >
          <ClipboardCopyIcon className="h-4 w-4" />
          <span>Copy</span>
        </button>
      ),
    },
    {
      header: 'Details',
      accessorKey: '_id',
      cell: ({ getValue }) => (
        <button
          className="btn btn-secondary btn-xs"
          onClick={(e) => {
            e.preventDefault();
            router.push(`/pastes/${getValue()}`);
          }}
        >
          Details
        </button>
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
  const instance = useReactTable<Paste>({
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
    <Main title="Pastes">
      <Toaster />
      <div className="tabs">
        <a className={`tab tab-lifted tab-md md:tab-lg tab-active`}>Pastes</a>
        <Table<Paste> instance={instance} enablePagination={true} />
      </div>
    </Main>
  );
};

export const getStaticProps: () => Promise<{
  props: { pastes: Paste[] };
}> = async () => {
  const client = await clientPromise;
  const db = client.db('pastes');
  const collection = db.collection('teams');

  const pastes = await collection.find({}).toArray();

  return {
    props: {
      pastes: JSON.parse(JSON.stringify(pastes)) as Paste[],
    },
  };
};

export default Pastes;
