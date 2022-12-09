import type { Ability } from '@pkmn/data';
import { ColumnDef, ColumnFiltersState, FilterFnOption, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';
import { useContext, useEffect, useMemo, useState } from 'react';

import Table from '@/components/table';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { getAbilitiesBySpecie } from '@/utils/PokemonUtils';

function AbilitiesTable() {
  const { t } = useTranslation(['common', 'abilities']);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch, globalFilter, setGlobalFilter } = useContext(StoreContext);

  // table settings
  const [data, setData] = useState<Ability[]>([]);
  useEffect(() => {
    setData(() => [...getAbilitiesBySpecie(teamState.getPokemonInTeam(tabIdx)?.species)]);
  }, [teamState.getPokemonInTeam(tabIdx)?.species]);

  // a filter that supports searching by translated name
  const i18nFilterFn: FilterFnOption<Ability> = (row, columnId, filterValue) =>
    t(`abilities.${row.original.id}`).includes(filterValue) || row.getValue<string>(columnId).toLowerCase().includes(filterValue.toLowerCase());

  // table settings
  const columns = useMemo<ColumnDef<Ability>[]>(
    () => [
      {
        header: t('common.name'),
        accessorKey: 'name',
        cell: ({ row }) => <span>{t(row.original.id, { ns: 'abilities' })}</span>,
        filterFn: i18nFilterFn,
      },
      {
        header: t('common.description'),
        accessorKey: 'shortDesc',
        enableColumnFilter: false,
        enableGlobalFilter: false,
        enableSorting: false,
      },
    ],
    []
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // table instance
  const instance = useReactTable<Ability>({
    data,
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
    const translatedName = t(id, { ns: 'abilities' });
    if (translatedName !== globalFilter) return;
    teamState.updatePokemonInTeam(tabIdx, 'ability', name);
  }, [globalFilter]);

  // handle table events
  const handleRowClick = (ability?: Ability) => {
    if (!ability) return;
    // Trigger the update of Input
    teamState.triggerUpdate('ability', tabIdx);
    teamState.updatePokemonInTeam(tabIdx, 'ability', ability.name);
    focusedFieldDispatch({ type: 'next', payload: focusedFieldState });
  };

  // table render
  return <Table<Ability> instance={instance} handleRowClick={handleRowClick} enablePagination={false} />;
}

export default AbilitiesTable;
