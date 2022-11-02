import { Ability } from '@pkmn/data';
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useContext, useEffect, useMemo, useState } from 'react';

import Table from '@/components/table';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { getAbilitiesBySpecie } from '@/utils/PokemonUtils';

function AbilitiesTable() {
  // get dex & possible abilities
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch, globalFilter, setGlobalFilter } = useContext(StoreContext);

  // table settings
  const [data, setData] = useState<Ability[]>([]);
  useEffect(() => {
    setData(() => [...getAbilitiesBySpecie(teamState.getPokemonInTeam(tabIdx)?.species)]);
  }, [teamState.getPokemonInTeam(tabIdx)?.species]);
  const columns = useMemo<ColumnDef<Ability>[]>(
    () => [
      { header: 'Name', accessorKey: 'name' },
      {
        header: 'Description',
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
  });

  // handle table events
  const handleRowClick = (ability?: Ability) => {
    if (!ability) return;
    teamState.updatePokemonInTeam(tabIdx, 'ability', ability.name);

    focusedFieldDispatch({ type: 'next', payload: focusedFieldState });
  };

  // table render
  return <Table<Ability> instance={instance} handleRowClick={handleRowClick} enablePagination={false} />;
}

export default AbilitiesTable;
