import { Item } from '@pkmn/data';
import { Icons } from '@pkmn/img';
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

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import Table from '@/components/workspace/Table';
import { convertStylesStringToObject } from '@/utils/Helpers';

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
  const { gen, globalFilter, setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch } = useContext(StoreContext);

  // fetch popular items by Pokémon
  const { species } = teamState.getPokemonInTeam(tabIdx) ?? {};
  const { data: itemsUsage } = useSWR<string[]>( // item names
    species ? `/api/usages/stats/${species}` : null,
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
    const localItemsUsage = itemsUsage ?? defaultPopularItems;
    return localItemsUsage.flatMap((i) => gen.items.get(i) || []).concat(Array.from(gen.items).filter(({ name }) => !localItemsUsage.includes(name)));
  }, [itemsUsage]);

  // table settings
  const columns = useMemo<ColumnDef<Item>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ getValue }) => (
          <span>
            <span style={convertStylesStringToObject(Icons.getItem(getValue<string>()).style)}></span>
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
