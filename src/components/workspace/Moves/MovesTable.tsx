import { Move } from '@pkmn/data';
import { DisplayUsageStatistics } from '@pkmn/smogon';
import { ColumnDef, ColumnFiltersState, FilterFnOption, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';
import { useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

import { CategoryIcon } from '@/components/icons/CategoryIcon';
import { TypeIcon } from '@/components/icons/TypeIcon';
import Table from '@/components/table';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import Loading from '@/templates/Loading';
import { getMovesBySpecie } from '@/utils/PokemonUtils';

function MovesTable({ moveIdx }: { moveIdx: number }) {
  const { t } = useTranslation(['common', 'categories', 'moves', 'move_descriptions', 'types']);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch, globalFilter, setGlobalFilter } = useContext(StoreContext);

  // get all moves that learnable by the Pokémon
  const { species } = teamState.getPokemonInTeam(tabIdx) ?? {};
  const { data: learnableMoves } = useSWR<Move[]>(species, (k) => getMovesBySpecie(k, false, teamState.format));
  // fetch popular moves by this Pokémon
  const { data: popularMoveNames } = useSWR<string[]>( // move names
    species ? `/api/usages/stats/${species}?format=${teamState.format}&moves=true` : null, // ?moves=true doesn't work in the API, only used as a cache buster for SWR.
    {
      fallbackData: [],
      fetcher: (u: string) =>
        fetch(u)
          .then((r) => r.json())
          .then((d: DisplayUsageStatistics) =>
            Object.entries(d?.moves ?? {})
              .sort((a, b) => b[1] - a[1])
              .map(([k, _]) => k)
          ),
    }
  );

  // move popular moves to the top
  const data = useMemo<Move[]>(() => {
    if (!learnableMoves) return []; // learnableMoves first
    if (!popularMoveNames || popularMoveNames.length === 0) return learnableMoves;
    return popularMoveNames
      .flatMap((name) => learnableMoves.find((m) => m.name === name) || [])
      .concat(learnableMoves.filter(({ name }) => !popularMoveNames.includes(name)));
  }, [learnableMoves, popularMoveNames]);

  // use a loading component as reading learnset is async
  const isLoading = !learnableMoves;

  // a filter that supports searching by translated name
  const i18nFilterFn: FilterFnOption<Move> = (row, columnId, filterValue) =>
    t(row.original.id, { ns: 'moves' }).includes(filterValue) || row.getValue<string>(columnId).toLowerCase().includes(filterValue.toLowerCase());

  // table settings
  const columns = useMemo<ColumnDef<Move>[]>(
    () => [
      {
        header: t('common.name'),
        accessorKey: 'name',
        cell: ({ row }) => <span>{t(row.original.id, { ns: 'moves' })}</span>,
        filterFn: i18nFilterFn,
        sortingFn: (a, b) => t(a.original.id, { ns: 'moves' }).localeCompare(t(b.original.id, { ns: 'moves' })),
      },
      {
        header: t('common.type'),
        accessorKey: 'type',
        cell: (info) => <TypeIcon typeName={info.getValue<string>()} />,
      },
      {
        header: t('common.category'),
        accessorKey: 'category',
        cell: ({ getValue }) => {
          const category = getValue<string>();
          return <CategoryIcon key={category} category={category} />;
        },
      },
      {
        header: t('common.power'),
        accessorKey: 'basePower',
        cell: (info) => {
          const power = info.getValue<number>();
          return <span>{power === 0 ? '-' : power}</span>;
        },
        enableColumnFilter: false,
        enableGlobalFilter: false,
      },
      {
        header: t('common.accuracy'),
        accessorKey: 'accuracy',
        cell: (info) => {
          const accuracy = info.getValue<number | true>();
          return <span>{accuracy === true ? '-' : accuracy}</span>;
        },
        enableColumnFilter: false,
        enableGlobalFilter: false,
      },
      {
        header: 'PP',
        accessorKey: 'pp',
        enableColumnFilter: false,
        enableGlobalFilter: false,
      },
      {
        id: 'description',
        header: t('common.description'),
        accessorFn: (row) => (row.shortDesc.length ? row.shortDesc : row.desc),
        cell: ({ row, getValue }) => (
          <span>
            {t(row.original.id, {
              ns: 'move_descriptions',
              defaultValue: getValue<string>(),
            })}
          </span>
        ),
        enableColumnFilter: false,
        enableGlobalFilter: false,
        enableSorting: false,
      },
    ],
    []
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // table instance
  const instance = useReactTable<Move>({
    data: data ?? [],
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: i18nFilterFn,
  });

  // a hook that if there is only one row after filtering,
  // and its translated name is the same as the global filter, then select it
  useEffect(() => {
    const filteredRows = instance.getFilteredRowModel().rows;
    if (filteredRows.length !== 1) return;
    // filtered original data
    const { id, name } = filteredRows[0]!.original;
    const translatedName = t(id, { ns: 'moves' });
    if (translatedName !== globalFilter) return;
    teamState.updatePokemonOneMoveInTeam(tabIdx, moveIdx, name);
  }, [globalFilter]);

  // handle table events
  const handleRowClick = (move?: Move) => {
    if (!move) return;
    // Trigger the update of Input
    teamState.triggerUpdate('moves', tabIdx);
    teamState.updatePokemonOneMoveInTeam(tabIdx, moveIdx, move.name);
    focusedFieldDispatch({ type: 'next', payload: focusedFieldState });
  };

  // renders
  return isLoading ? <Loading /> : <Table<Move> instance={instance} handleRowClick={handleRowClick} enablePagination={false} />;
}

export default MovesTable;
