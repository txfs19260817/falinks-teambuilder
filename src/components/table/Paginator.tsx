import { Table } from '@tanstack/react-table';

function Paginator({ instance }: { instance: Table<any> }) {
  return (
    <div className="join w-full items-center justify-center" aria-label="paginator">
      <button className="btn join-item btn-sm" onClick={() => instance.setPageIndex(0)} disabled={!instance.getCanPreviousPage()}>
        {'<<'}
      </button>
      <button className="btn join-item btn-sm" onClick={() => instance.previousPage()} disabled={!instance.getCanPreviousPage()}>
        {'<'}
      </button>
      <button className="btn join-item btn-sm">
        {instance.getState().pagination.pageIndex + 1} / {instance.getPageCount()}
      </button>
      <button className="btn join-item btn-sm" onClick={() => instance.nextPage()} disabled={!instance.getCanNextPage()}>
        {'>'}
      </button>
      <button className="btn join-item btn-sm" onClick={() => instance.setPageIndex(instance.getPageCount() - 1)} disabled={!instance.getCanNextPage()}>
        {'>>'}
      </button>
      <div className="divider join-item divider-horizontal" />
      <span className="join-item flex items-center gap-1">
        📖:
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
      <div className="divider join-item divider-horizontal" />
      <select
        className="join-item select select-sm"
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
  );
}

export default Paginator;
