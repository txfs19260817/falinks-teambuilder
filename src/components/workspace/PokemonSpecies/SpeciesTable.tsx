import { Specie } from '@pkmn/data';
import type { StatsTable } from '@pkmn/types';
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFnOption,
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
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { TypeIcon } from '@/components/icons/TypeIcon';
import Loading from '@/components/layout/Loading';
import Table from '@/components/table';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { PresetsSubComponent } from '@/components/workspace/PokemonSpecies/PresetsSubComponent';
import DexSingleton from '@/models/DexSingleton';
import { Pokemon } from '@/models/Pokemon';
import { getPokemonTranslationKey } from '@/utils/PokemonUtils';
import type { Usage } from '@/utils/Types';

function SpeciesTable() {
  const { t } = useTranslation(['common', 'species', 'formes', 'types', 'abilities']);
  const { locale } = useRouter();
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch, globalFilter, setGlobalFilter } = useContext(StoreContext);

  // table settings
  const {
    data: usages,
    error,
    isLoading,
  } = useSWR<Usage[]>(
    // Hack: use `gen9vgc2023regulatione` instead of `gen9vgc2023regf` as there is no usage data for `gen9vgc2023regf`
    `/api/usages/format/${teamState.format === 'gen9vgc2023regf' ? 'gen9vgc2023regulatione' : teamState.format}`,
    (u) => fetch(u).then((r) => r.json()),
    {
      fallbackData: [],
    },
  );
  const speciesList = useMemo<Specie[]>(() => {
    const speciesDex = DexSingleton.getGenByFormat(teamState.format).species;
    if (!usages) {
      return [...Array.from(speciesDex)];
    }
    // sort by usage
    const dataSorted = usages.flatMap((u) => speciesDex.get(u.name) || []);
    dataSorted.push(...Array.from(speciesDex).filter((s) => !dataSorted.includes(s)));
    return dataSorted;
  }, [usages, teamState.format]);
  if (error) {
    toast.error(error);
  }

  // a filter that supports searching by translated name
  const i18nFilterFn: FilterFnOption<Specie> = (row, columnId, filterValue) =>
    t(row.original.id, { ns: 'species' }).includes(filterValue) || row.getValue<string>(columnId).toLowerCase().includes(filterValue.toLowerCase());

  const columns = useMemo<ColumnDef<Specie>[]>(() => {
    return [
      {
        id: 'expander',
        header: () => null,
        cell: ({ row, table }) => {
          return row.getCanExpand() ? (
            <button
              type="button"
              title={t('common.preset.showPreset')}
              className="btn btn-ghost btn-xs cursor-pointer"
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
        header: t('common.pokemon'),
        accessorKey: 'name',
        cell: ({ row }) => (
          <span>
            <PokemonIcon speciesId={row.original.id} />
            {t(getPokemonTranslationKey(row.original.id, 'species'))}
          </span>
        ),
        filterFn: i18nFilterFn,
        sortingFn: (a, b) => t(getPokemonTranslationKey(a.original.id, 'species')).localeCompare(t(getPokemonTranslationKey(b.original.id, 'species'))),
      },
      {
        header: t('common.types'),
        accessorKey: 'types',
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
        header: t('common.abilities'),
        accessorKey: 'abilities',
        cell: ({ getValue }) =>
          Object.values(getValue<object>())
            .map((s) => t(getPokemonTranslationKey(s, 'abilities')))
            .join('/'),
        enableSorting: false,
        filterFn: (row, columnId, filterValue) => {
          const abilities = Object.values(row.getValue<object>(columnId));
          const translatedAbilities = abilities.map((s) => t(getPokemonTranslationKey(s, 'abilities')));
          return translatedAbilities.some((s) => s.includes(filterValue)) || abilities.some((s) => s.toLowerCase().includes(filterValue.toLowerCase()));
        },
      },
      {
        id: 'hp',
        header: t('common.stats.hp'),
        accessorFn: (row) => row.baseStats.hp,
        enableColumnFilter: false,
        enableGlobalFilter: false,
      },
      {
        id: 'atk',
        header: t('common.stats.atk'),
        accessorFn: (row) => row.baseStats.atk,
        enableColumnFilter: false,
        enableGlobalFilter: false,
      },
      {
        id: 'def',
        header: t('common.stats.def'),
        accessorFn: (row) => row.baseStats.def,
        enableColumnFilter: false,
        enableGlobalFilter: false,
      },
      {
        id: 'spa',
        header: t('common.stats.spa'),
        accessorFn: (row) => row.baseStats.spa,
        enableColumnFilter: false,
        enableGlobalFilter: false,
      },
      {
        id: 'spd',
        header: t('common.stats.spd'),
        accessorFn: (row) => row.baseStats.spd,
        enableColumnFilter: false,
        enableGlobalFilter: false,
      },
      {
        id: 'spe',
        header: t('common.stats.spe'),
        accessorFn: (row) => row.baseStats.spe,
        enableColumnFilter: false,
        enableGlobalFilter: false,
      },
      {
        id: 'total',
        header: t('common.total'),
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
    pageSize: 50,
  });

  // table instance
  const instance = useReactTable<Specie>({
    data: speciesList,
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
    globalFilterFn: i18nFilterFn,
  });

  // a hook that if there is only one row after filtering,
  // and its translated name is the same as the global filter, then select it, providing a better UX
  useEffect(() => {
    const filteredRows = instance.getFilteredRowModel().rows;
    // return if there is not only one row
    if (filteredRows.length !== 1) return;
    // return if the result is not the same as the user input
    const translatedName = locale === 'en' ? filteredRows[0]!.original.name : t(filteredRows[0]!.original.id, { ns: 'species' });
    if (translatedName !== globalFilter) return;
    // update the team with the auto selected pokemon
    teamState.updatePokemonInTeam(tabIdx, 'species', filteredRows[0]!.original.name);
  }, [globalFilter]);

  // handle table events
  const handleRowClick = (specie?: Specie) => {
    if (!specie) return;
    // Trigger the update of Input
    teamState.triggerUpdate('species', tabIdx);
    teamState.splicePokemonTeam(tabIdx, 1, new Pokemon(specie.name, '', specie.requiredItem));
    focusedFieldDispatch({ type: 'next', payload: focusedFieldState });
  };

  // table render
  return isLoading ? (
    <Loading />
  ) : (
    <Table<Specie> instance={instance} handleRowClick={handleRowClick} enablePagination={true} renderSubComponent={PresetsSubComponent} />
  );
}

export default SpeciesTable;
