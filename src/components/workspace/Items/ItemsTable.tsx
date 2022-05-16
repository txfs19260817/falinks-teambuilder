import { Item } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import {
  ColumnFiltersState,
  createTable,
  getCoreRowModelSync,
  getFilteredRowModelSync,
  getPaginationRowModel,
  getSortedRowModelSync,
  PaginationState,
  useTableInstance,
} from '@tanstack/react-table';
import { Key, useContext, useMemo, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { StoreContext } from '@/components/workspace/StoreContext';
import OmniFilter from '@/components/workspace/Table/OmniFilter';
import Paginator from '@/components/workspace/Table/Paginator';
import { convertStylesStringToObject } from '@/utils/Helpers';

const table = createTable().setRowType<Item>();
const defaultColumns = [
  table.createDataColumn('name', {
    header: 'Name',
    cell: ({ value }: { value: string }) => (
      <span>
        <span style={convertStylesStringToObject(Icons.getItem(value).style)}></span>
        {value}
      </span>
    ),
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
  const { globalFilter, setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx } = useContext(StoreContext);
  // get dex
  const { gen } = useContext(DexContext);

  // table settings
  const [data] = useState<Item[]>(() => [...Array.from(gen.items)]);
  const columns = useMemo<typeof defaultColumns>(() => [...defaultColumns], []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
    pageCount: -1, // -1 allows the table to calculate the page count for us via instance.getPageCount()
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
    getFilteredRowModel: getFilteredRowModelSync(),
    getCoreRowModel: getCoreRowModelSync(),
    getSortedRowModel: getSortedRowModelSync(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // handle table events
  const handleRowClick = (item?: Item) => {
    if (!item || !teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].item = item.name;
  };

  // table render
  return (
    <>
      <table className="table-compact relative table w-full">
        <thead>
          {instance.getHeaderGroups().map((headerGroup: { id?: Key; headers: any[] }) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan} className="sticky top-0">
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        {...{
                          className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {header.renderHeader()}
                        {{
                          asc: '↑',
                          desc: '↓',
                        }[header.column.getIsSorted() as string] ?? (header.column.getCanSort() ? '⇵' : null)}
                      </div>
                      <OmniFilter column={header.column} instance={instance} />
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {instance.getRowModel().rows.map((row: { id?: Key; original?: Item; getVisibleCells: () => any[] }) => (
            <tr key={row.id} className="hover" onClick={() => handleRowClick(row.original)}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{cell.renderCell()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-2" />
      <Paginator instance={instance} />
    </>
  );
}

export default ItemsTable;
