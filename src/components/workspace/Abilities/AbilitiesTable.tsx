import { Ability, Generation } from '@pkmn/data';
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useContext, useEffect, useMemo, useState } from 'react';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import Table from '@/components/workspace/Table';

function getAbilitiesBySpecie(gen: Generation, speciesName?: string): Ability[] {
  const abilitiesMap = gen.species.get(speciesName ?? '')?.abilities;
  // return all abilities by default
  if (!abilitiesMap) {
    return Array.from(gen.abilities);
  }
  return Object.values(abilitiesMap)
    .map((a: string) => gen.abilities.get(a))
    .filter((a) => a != null) as Ability[];
}

function AbilitiesTable() {
  // get dex & possible abilities
  const { gen, globalFilter, setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch } = useContext(StoreContext);

  // table settings
  const [data, setData] = useState<Ability[]>([]);
  useEffect(() => {
    setData(() => [...getAbilitiesBySpecie(gen, teamState.getPokemonInTeam(tabIdx)?.species)]);
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
