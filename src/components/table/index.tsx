import { flexRender, Row, Table } from '@tanstack/react-table';
import { Fragment } from 'react';

import Header from '@/components/table/Header';
import Paginator from '@/components/table/Paginator';

type TableProps<D> = {
  instance: Table<any>;
  enablePagination?: boolean;
  handleRowClick?: (d?: D) => void;
  renderSubComponent?: (row: Row<D>) => JSX.Element;
};

function defaultSubComponentRenderer<D>(row: Row<D>) {
  return (
    <pre>
      <code>{JSON.stringify(row.original, null, 2)}</code>
    </pre>
  );
}

function TableWrapper<D>({ instance, enablePagination, handleRowClick = () => {}, renderSubComponent = defaultSubComponentRenderer }: TableProps<D>) {
  return (
    <>
      <table className="table table-zebra table-xs relative w-full bg-base-100">
        <Header instance={instance} />
        <tbody>
          {instance.getRowModel().rows.map((row) => {
            return (
              <Fragment key={row.id}>
                <tr className="hover" onClick={() => handleRowClick(row.original)}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}> {flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
                {/* Sub component */}
                {row.getIsExpanded() && (
                  <tr>
                    {/* 2nd row is a custom 1 cell row */}
                    <td colSpan={row.getVisibleCells().length}>{renderSubComponent(row)}</td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      {enablePagination && (
        <>
          <div className="h-2" />
          <Paginator instance={instance} />
        </>
      )}
    </>
  );
}

export default TableWrapper;
