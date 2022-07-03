import { flexRender, Table } from '@tanstack/react-table';
import { Key } from 'react';

import OmniFilter from '@/components/workspace/Table/OmniFilter';

function Header({ instance }: { instance: Table<any> }) {
  return (
    <thead className="sticky z-50">
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
                    {flexRender(header.column.columnDef.header, header.getContext())}
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
  );
}

export default Header;
