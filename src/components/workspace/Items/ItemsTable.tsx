import { Item } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import {
  ColumnFiltersState,
  createTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useTableInstance,
} from '@tanstack/react-table';
import { useContext, useMemo, useState } from 'react';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import Table from '@/components/workspace/Table';
import { AppConfig } from '@/utils/AppConfig';
import { convertStylesStringToObject } from '@/utils/Helpers';

const table = createTable().setRowType<Item>();
const defaultColumns = [
  table.createDataColumn('name', {
    header: 'Name',
    cell: (info) => {
      const value = info.getValue();
      return (
        <span>
          <span style={convertStylesStringToObject(Icons.getItem(value).style)}></span>
          {value}
        </span>
      );
    },
  }),
  table.createDataColumn((row) => (row.shortDesc.length ? row.shortDesc : row.desc), {
    id: 'description',
    header: 'Description',
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableSorting: false,
  }),
];

function ItemsTable() {
  const { gen, globalFilter, setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch } = useContext(StoreContext);

  // table settings
  const data = useMemo<Item[]>(
    () =>
      AppConfig.popularItems.flatMap((i) => gen.items.get(i) || []).concat(Array.from(gen.items).filter(({ name }) => !AppConfig.popularItems.includes(name))),
    []
  );
  const columns = useMemo<typeof defaultColumns>(() => [...defaultColumns], []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
    pageCount: undefined, // undefined allows the table to calculate the page count for us via instance.getPageCount()
  });

  // table instance
  const instance = useTableInstance(table, {
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
    if (!item || !teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].item = item.name;

    focusedFieldDispatch({ type: 'next', payload: focusedFieldState });
  };

  // table render
  return <Table<Item> instance={instance} handleRowClick={handleRowClick} enablePagination={true} />;
}

export default ItemsTable;
