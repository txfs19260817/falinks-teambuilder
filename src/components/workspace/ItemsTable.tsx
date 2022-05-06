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
import { ChangeEvent, Key, useContext, useEffect, useMemo, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { OmniFilter } from '@/components/workspace/OmniFilter';
import { PanelProps } from '@/components/workspace/types';
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

export function ItemsTable({ tabIdx, teamState }: PanelProps) {
  // get dex
  const { gen } = useContext(DexContext);

  // table settings
  const [data] = useState<Item[]>(() => [...Array.from(gen.items)]);
  const columns = useMemo<typeof defaultColumns>(() => [...defaultColumns], []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
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
      <div className="btn-group w-full items-center justify-center" aria-label="paginator">
        <button className="btn btn-sm" onClick={() => instance.setPageIndex(0)} disabled={!instance.getCanPreviousPage()}>
          {'<<'}
        </button>
        <button className="btn btn-sm" onClick={() => instance.previousPage()} disabled={!instance.getCanPreviousPage()}>
          {'<'}
        </button>
        <button className="btn btn-sm">
          {instance.getState().pagination.pageIndex + 1} / {instance.getPageCount()}
        </button>
        <button className="btn btn-sm" onClick={() => instance.nextPage()} disabled={!instance.getCanNextPage()}>
          {'>'}
        </button>
        <button className="btn btn-sm" onClick={() => instance.setPageIndex(instance.getPageCount() - 1)} disabled={!instance.getCanNextPage()}>
          {'>>'}
        </button>
        <div className="divider divider-horizontal" />
        <span className="flex items-center gap-1">
          Go to page:
          <input
            className="input input-sm w-16"
            type="number"
            min={1}
            defaultValue={instance.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              instance.setPageIndex(page);
            }}
          />
        </span>
        <div className="divider divider-horizontal" />
        <select
          className="select select-sm"
          value={instance.getState().pagination.pageSize}
          onChange={(e) => {
            instance.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export function ItemInput({ onFocus, teamState, tabIdx }: { onFocus: () => void } & PanelProps) {
  const [item, setItem] = useState<string>('Focus Sash');

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setItem(teamState.team[tabIdx]?.item || 'Focus Sash');
  }, [teamState.team[tabIdx]?.item]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newItem = e.target.value;
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].item = newItem;
  };

  return (
    <div className="tooltip" data-tip="Please pick an item below">
      <label className="input-group-xs input-group input-group-vertical md:input-group-md">
        <span>Item</span>
        <input
          type="text"
          placeholder="Item"
          className="input-bordered input input-xs md:input-md"
          value={item}
          onFocus={onFocus}
          onChange={handleChange}
          onKeyDown={(event) => {
            event.preventDefault();
          }}
        />
      </label>
    </div>
  );
}
