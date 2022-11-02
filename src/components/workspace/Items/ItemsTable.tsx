import { Item } from '@pkmn/data';
import { DisplayUsageStatistics } from '@pkmn/smogon';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useContext, useMemo, useState } from 'react';
import useSWR from 'swr';

import { ItemIcon } from '@/components/icons/ItemIcon';
import Table from '@/components/table';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import DexSingleton from '@/models/DexSingleton';

const defaultPopularItems = [
  'Aguav Berry',
  'Assault Vest',
  'Choice Band',
  'Choice Scarf',
  'Choice Specs',
  'Eviolite',
  'Expert Belt',
  'Figy Berry',
  'Focus Sash',
  'Iapapa Berry',
  'Leftovers',
  'Life Orb',
  'Mago Berry',
  'Mental Herb',
  'Power Herb',
  'Rocky Helmet',
  'Shuca Berry',
  'Sitrus Berry',
  'Weakness Policy',
  'Wiki Berry',
];

function ItemsTable() {
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch, globalFilter, setGlobalFilter } = useContext(StoreContext);

  // fetch popular items by Pokémon
  const { species } = teamState.getPokemonInTeam(tabIdx) ?? {};
  const { data: popularItemNames } = useSWR<string[]>( // item names
    species ? `/api/usages/stats/${species}?format=${teamState.format}&items=true` : null, // ?items=true doesn't work in the API, only used as a cache buster for SWR.
    {
      fallbackData: defaultPopularItems,
      fetcher: (u: string) =>
        fetch(u)
          .then((r) => r.json())
          .then((d: DisplayUsageStatistics) => Object.keys(d?.items ?? {})),
    }
  );

  // move popular items to the top
  const data = useMemo<Item[]>(() => {
    const gen = DexSingleton.getGen();
    const popularItem = popularItemNames ?? defaultPopularItems;
    return popularItem.flatMap((i) => gen.items.get(i) || []).concat(Array.from(gen.items).filter(({ name }) => !popularItem.includes(name)));
  }, [popularItemNames]);

  // table settings
  const columns = useMemo<ColumnDef<Item>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ getValue }) => (
          <span>
            <ItemIcon itemName={getValue<string>()} />
            {getValue<string>()}
          </span>
        ),
      },
      {
        id: 'description',
        header: 'Description',
        accessorFn: (row) => (row.shortDesc.length ? row.shortDesc : row.desc),
        enableColumnFilter: false,
        enableGlobalFilter: false,
        enableSorting: false,
      },
    ],
    []
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  // table instance
  const instance = useReactTable<Item>({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // handle table events
  const handleRowClick = (item?: Item) => {
    if (!item) return;
    teamState.updatePokemonInTeam(tabIdx, 'item', item.name);
    focusedFieldDispatch({ type: 'next', payload: focusedFieldState });
  };

  // table render
  return <Table<Item> instance={instance} handleRowClick={handleRowClick} enablePagination={true} />;
}

export default ItemsTable;
