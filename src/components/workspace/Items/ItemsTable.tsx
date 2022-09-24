import { Item } from '@pkmn/data';
import { Icons } from '@pkmn/img';
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

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import Table from '@/components/workspace/Table';
import { AppConfig } from '@/utils/AppConfig';
import { convertStylesStringToObject } from '@/utils/Helpers';

function ItemsTable() {
  const { gen, globalFilter, setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch } = useContext(StoreContext);

  // table settings
  const data = useMemo<Item[]>(
    () =>
      AppConfig.popularItems.flatMap((i) => gen.items.get(i) || []).concat(Array.from(gen.items).filter(({ name }) => !AppConfig.popularItems.includes(name))),
    []
  );
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
