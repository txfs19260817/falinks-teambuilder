import { StatsTable } from '@pkmn/types';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import fs from 'fs';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { join } from 'path';
import { useContext, useState } from 'react';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { TypeIcon } from '@/components/icons/TypeIcon';
import Table from '@/components/table';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';

type Gen9Dex = {
  id: number;
  num: number; // reginal dex number
  name: string;
  raw_name: string;
  stats: StatsTable;
  type: string[];
  abilities: string[];
  moves: string[];
  egg_groups: string[];
};

const DexTable = ({ dex }: { dex: Gen9Dex[] }) => {
  const { globalFilter, setGlobalFilter } = useContext(StoreContext);

  // table settings
  const columns: ColumnDef<Gen9Dex>[] = [
    {
      header: 'Dex No.',
      accessorKey: 'num',
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ getValue }) => (
        <>
          <PokemonIcon speciesId={getValue<string>()} />
          <span title={getValue<string>()}>{`${getValue<string>()}`}</span>
        </>
      ),
    },
    {
      header: 'Types',
      accessorKey: 'type',
      cell: ({ getValue }) => (
        <span>
          {getValue<string[]>().map((typeName) => (
            <TypeIcon key={typeName} typeName={typeName} />
          ))}
        </span>
      ),
      enableSorting: false,
      filterFn: 'arrIncludes',
    },
    {
      header: 'Abilities',
      accessorKey: 'abilities',
      cell: ({ getValue }) => <span>{getValue<string[]>().join('/')}</span>,
      filterFn: (row, columnId, filterValue) => {
        return row.getValue<string[]>(columnId).join(' ').toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      id: 'hp',
      header: 'HP',
      accessorFn: (row) => row.stats.hp,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: 'atk',
      header: 'ATK',
      accessorFn: (row) => row.stats.atk,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: 'def',
      header: 'DEF',
      accessorFn: (row) => row.stats.def,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: 'spa',
      header: 'SPA',
      accessorFn: (row) => row.stats.spa,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: 'spd',
      header: 'SPD',
      accessorFn: (row) => row.stats.spd,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: 'spe',
      header: 'SPE',
      accessorFn: (row) => row.stats.spe,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      id: 'total',
      header: 'Total',
      accessorFn: (row) => row.stats,
      cell: (info) => {
        return Object.values<number>(info.getValue<StatsTable>()).reduce((acc, curr) => acc + curr, 0);
      },
      enableColumnFilter: false,
      enableGlobalFilter: false,
      sortingFn: (a: Row<any>, b: Row<any>, columnId: string) =>
        Object.values<number>(a.getValue(columnId)).reduce((acc, curr) => acc + curr, 0) -
        Object.values<number>(b.getValue(columnId)).reduce((acc, curr) => acc + curr, 0),
    },
    {
      header: 'Details',
      accessorKey: 'raw_name',
      cell: ({ getValue }) => (
        <Link href={`/gen9dex/${getValue<string>()}`}>
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

  // table instance
  const instance = useReactTable<Gen9Dex>({
    data: dex,
    columns,
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });
  return (
    <div className="overflow-x-auto">
      <Table<Gen9Dex> instance={instance} enablePagination={false} />
    </div>
  );
};

const IndexPage = ({ dex }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Main title="Gen 9 Pokedex">
      <DexTable dex={dex} />
    </Main>
  );
};

export const getStaticProps: GetStaticProps<{ dex: Gen9Dex[] } & SSRConfig> = async ({ locale }) => {
  const dexContents = fs.readFileSync(join(process.cwd(), 'public/assets/gen9dex/pokemon.json'), 'utf8');
  const dex = JSON.parse(dexContents) as Gen9Dex[];

  return {
    props: {
      dex,
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['common'])),
    },
  };
};

export default IndexPage;
