import { Item } from '@pkmn/data';
import { DisplayUsageStatistics } from '@pkmn/smogon';
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFnOption,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';
import { useContext, useEffect, useMemo, useState } from 'react';
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
  const { t } = useTranslation(['common', 'items', 'item_descriptions']);
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

  // a filter that supports searching by translated name
  const i18nFilterFn: FilterFnOption<Item> = (row, columnId, filterValue) =>
    t(`items.${row.original.id}`).includes(filterValue) || row.getValue<string>(columnId).toLowerCase().includes(filterValue.toLowerCase());

  // table settings
  const columns = useMemo<ColumnDef<Item>[]>(
    () => [
      {
        header: t('common.name'),
        accessorKey: 'name',
        cell: ({ getValue, row }) => (
          <span>
            <ItemIcon itemName={getValue<string>()} />
            <span>
              {t(row.original.id, {
                ns: 'items',
                defaultValue: getValue<string>(),
              })}
            </span>
          </span>
        ),
        filterFn: i18nFilterFn,
        sortingFn: (a, b) => t(a.original.id, { ns: 'items' }).localeCompare(t(b.original.id, { ns: 'items' })),
      },
      {
        id: 'description',
        header: t('common.description'),
        accessorFn: (row) => (row.shortDesc ? row.shortDesc : row.desc),
        cell: ({ row, getValue }) => (
          <span>
            {t(row.original.id, {
              ns: 'item_descriptions',
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
    globalFilterFn: i18nFilterFn,
  });

  // a hook that if there is only one row after filtering,
  // and its translated name is the same as the global filter, then select it
  useEffect(() => {
    const filteredRows = instance.getFilteredRowModel().rows;
    if (filteredRows.length !== 1) return;
    // filtered original data
    const { id, name } = filteredRows[0]!.original;
    const translatedName = t(id, { ns: 'items' });
    if (translatedName !== globalFilter) return;
    teamState.updatePokemonInTeam(tabIdx, 'item', name);
  }, [globalFilter]);

  // handle table events
  const handleRowClick = (item?: Item) => {
    if (!item) return;
    // Trigger the update of Input
    teamState.triggerUpdate('item', tabIdx);
    teamState.updatePokemonInTeam(tabIdx, 'item', item.name);
    focusedFieldDispatch({ type: 'next', payload: focusedFieldState });
  };

  // table render
  return <Table<Item> instance={instance} handleRowClick={handleRowClick} enablePagination={true} />;
}

export default ItemsTable;
