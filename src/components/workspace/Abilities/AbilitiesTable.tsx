import { Ability, Generation } from '@pkmn/data';
import { ColumnFiltersState, createTable, getCoreRowModelSync, getFilteredRowModelSync, getSortedRowModelSync, useTableInstance } from '@tanstack/react-table';
import { useContext, useEffect, useMemo, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { StoreContext } from '@/components/workspace/StoreContext';
import Table from '@/components/workspace/Table';

const table = createTable().setRowType<Ability>();
const defaultColumns = [
  table.createDataColumn('name', {
    header: 'Name',
  }),
  table.createDataColumn('shortDesc', {
    header: 'Description',
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableSorting: false,
  }),
];

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
  const { globalFilter, setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx } = useContext(StoreContext);
  // get dex & possible abilities
  const { gen } = useContext(DexContext);

  // table settings
  const [data, setData] = useState<Ability[]>([]);
  useEffect(() => {
    setData(() => [...getAbilitiesBySpecie(gen, teamState.team[tabIdx]?.species)]);
  }, [teamState.team[tabIdx]?.species]);
  const columns = useMemo<typeof defaultColumns>(() => [...defaultColumns], []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // table instance
  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModelSync(),
    getCoreRowModel: getCoreRowModelSync(),
    getSortedRowModel: getSortedRowModelSync(),
  });

  // handle table events
  const handleRowClick = (ability?: Ability) => {
    if (!ability || !teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].ability = ability.name;
  };

  // table render
  return <Table<Ability> instance={instance} handleRowClick={handleRowClick} enablePagination={false} />;
}

export default AbilitiesTable;
