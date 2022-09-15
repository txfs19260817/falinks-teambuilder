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
import { InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import Table from '@/components/workspace/Table';
import { Pokemon } from '@/models/Pokemon';
import { PokePaste } from '@/models/PokePaste';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { getPokemonIcon } from '@/utils/Helpers';
import clientPromise from '@/utils/MongoDB';

const Pastes = ({ pastes }: InferGetStaticPropsType<typeof getStaticProps>) => {
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
      accessorKey: 'paste',
      cell: ({ getValue }) => (
        <span>
          {(Pokemon.convertPasteToTeam(getValue<string>()) || []).map((p) => (
            <span key={p.species} title={p.species} style={getPokemonIcon(undefined, p.species, true)}></span>
          ))}
        </span>
      ),
      filterFn: (row, columnId, filterValue) => {
        return !filterValue.some(
          (val: string) =>
            !row
              .getValue<Pokemon[]>(columnId)
              .map((p: Pokemon) => p.species)
              .includes(val)
        );
      },
      enableSorting: false,
      enableMultiSort: false,
    },
    {
      header: 'Details',
      accessorKey: '_id',
      cell: ({ getValue }) => (
        <Link href={`/pastes/${getValue<string>()}`}>
          <a className="btn btn-secondary btn-xs">Details</a>
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
    <Main title="Pastes">
      <Toaster />
      <div className="tabs">
        <a className={`tab tab-lifted tab-md md:tab-lg tab-active`}>Pastes</a>
        <Table<WithId<PokePaste>> instance={instance} enablePagination={true} />
      </div>
    </Main>
  );
};

export const getStaticProps: () => Promise<{
  props: { pastes: WithId<PokePaste>[] };
}> = async () => {
  const client = await clientPromise;
  const db = client.db(AppConfig.dbName);
  const collection = db.collection<PokePaste>(AppConfig.collectionName.vgcPastes);
  const cursor = collection.find({});

  const pastes: WithId<PokePaste>[] = await cursor.toArray();
  await cursor.close();
  return {
    props: {
      pastes: JSON.parse(JSON.stringify(pastes)) as WithId<PokePaste>[],
    },
  };
};

export default Pastes;
