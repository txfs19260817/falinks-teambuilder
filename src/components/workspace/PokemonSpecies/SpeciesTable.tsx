import { Specie } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import { StatsTable } from '@pkmn/types';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getExpandedRowModel,
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
import { useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import Table from '@/components/workspace/Table';
import { Pokemon } from '@/models/Pokemon';
import { PokePaste } from '@/models/PokePaste';
import Loading from '@/templates/Loading';
import { getPokemonIcon } from '@/utils/Helpers';

const PresetsSubComponent = (row: Row<Specie>) => {
  const { tabIdx, teamState } = useContext(StoreContext);
  const { data, error } = useSWR<PokePaste[]>(`/api/usages/presets/${row.original.name}`, (url) => fetch(url).then((r) => r.json()));
  if (error || (Array.isArray(data) && data.length === 0)) return <div className="w-full text-center">No Preset found</div>;
  if (!data) {
    return <Loading />;
  }
  const handlePresetClick = (preset: string) => {
    // replace current team with `preset` which is a PokemonSet.
    teamState.splicePokemonTeam(tabIdx, 1, Pokemon.importSet(preset));
  };

  return (
    <>
      <div className="carousel-center carousel rounded-box w-full bg-base-300 p-1">
        {data.map((p, i) => (
          <div key={i} id={`preset-${i}`} className="carousel-item w-1/5">
            <pre
              title="Click to load this set"
              className="rounded-box m-1 w-full cursor-pointer whitespace-pre-wrap border border-neutral bg-base-100 p-1 text-xs leading-tight tracking-tighter hover:border-primary hover:shadow-2xl"
              onClick={() => handlePresetClick(p.paste)}
            >
              <h6 className="text-base-content/50">{`/* From ${p.title} by ${p.author} */\n`}</h6>
              {p.paste}
            </pre>
          </div>
        ))}
      </div>
    </>
  );
};

function SpeciesTable() {
  const { gen, usages, globalFilter, setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch } = useContext(StoreContext);

  // table settings
  const [data, setData] = useState<Specie[]>(() => [...Array.from(gen.species)]);
  const columns = useMemo<ColumnDef<Specie>[]>(() => {
    return [
      {
        id: 'expander',
        header: () => null,
        cell: ({ row, table }) => {
          return row.getCanExpand() ? (
            <button
              type="button"
              title="Show Presets"
              className="btn-ghost btn-xs btn cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                // Because `useSWR` is used in `PresetsSubComponent`,
                // only allow one row to be expanded at a time to avoid more hooks get re-rendered
                table.resetExpanded(false);
                // if closed, open it; otherwise, close all
                if (!row.getIsExpanded()) {
                  row.toggleExpanded();
                }
              }}
            >
              {row.getIsExpanded() ? '📖' : '📕'}
            </button>
          ) : null;
        },
        enableSorting: false,
        enableFiltering: false,
      },
      {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ getValue }) => (
          <span>
            <span style={getPokemonIcon(undefined, getValue<string>(), true)}></span>
            {getValue<string>()}
          </span>
        ),
      },
      {
        header: 'Types',
        accessorKey: 'types',
        cell: (info) => (
          <span>
            {info.getValue<string[]>().map((type) => (
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
        cell: (info) => Object.values(info.getValue<object>()).join('/'),
        enableSorting: false,
        filterFn: (row, columnId, filterValue) => {
          return Object.values(row.getValue<object>(columnId)).join(' ').toLowerCase().includes(filterValue.toLowerCase());
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
          return Object.values<number>(info.getValue<StatsTable>()).reduce((acc, curr) => acc + curr, 0);
        },
        enableColumnFilter: false,
        enableGlobalFilter: false,
        sortingFn: (a: Row<any>, b: Row<any>, columnId: string) =>
          Object.values<number>(a.getValue(columnId)).reduce((acc, curr) => acc + curr, 0) -
          Object.values<number>(b.getValue(columnId)).reduce((acc, curr) => acc + curr, 0),
      },
    ];
  }, []);
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
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel(),
  });

  // handle table events
  const handleRowClick = (specie?: Specie) => {
    if (!specie) return;
    teamState.splicePokemonTeam(tabIdx, 1, new Pokemon(specie.name, '', specie.requiredItem));
    focusedFieldDispatch({ type: 'next', payload: focusedFieldState });
    setGlobalFilter(''); // clear search words on table
  };

  // table render
  return <Table<Specie> instance={instance} handleRowClick={handleRowClick} enablePagination={true} renderSubComponent={PresetsSubComponent} />;
}

export default SpeciesTable;
