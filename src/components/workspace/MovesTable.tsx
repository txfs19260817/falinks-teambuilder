import { Generation, Move } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import { ColumnFiltersState, createTable, getCoreRowModelSync, getFilteredRowModelSync, getSortedRowModelSync, useTableInstance } from '@tanstack/react-table';
import Image from 'next/image';
import { ChangeEvent, Key, useContext, useEffect, useMemo, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { OmniFilter } from '@/components/workspace/OmniFilter';
import { PanelProps } from '@/components/workspace/types';
import { AppConfig } from '@/utils/AppConfig';
import { trimGmaxFromName } from '@/utils/Helpers';

const table = createTable().setRowType<Move>();
const defaultColumns = [
  table.createDataColumn('name', {
    header: 'Name',
  }),
  table.createDataColumn('type', {
    header: 'Type',
    cell: ({ value: type }: { value: string }) => (
      <Image className="inline-block" width={32} height={14} key={type} alt={type} title={type} src={Icons.getType(type).url} loading="lazy" />
    ),
  }),
  table.createDataColumn('category', {
    header: 'Category',
  }),
  table.createDataColumn('basePower', {
    header: 'Power',
    cell: ({ value }: { value: number }) => <span>{value === 0 ? '-' : value}</span>,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
  table.createDataColumn('accuracy', {
    header: 'Accuracy',
    cell: ({ value }: { value: true | number }) => <span>{value === true ? '-' : value}</span>,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
  table.createDataColumn('pp', {
    header: 'PP',
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
  table.createDataColumn((row) => (row.shortDesc.length ? row.shortDesc : row.desc), {
    id: 'description',
    header: 'Description',
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enableSorting: false,
  }),
];

const getMovesBySpecie = (gen: Generation, speciesName?: string): Promise<Move[]> => {
  return gen.learnsets.get(trimGmaxFromName(speciesName || '')).then((l) =>
    Object.entries(l?.learnset ?? [])
      .filter((e) => e[1].some((v) => v.startsWith(AppConfig.defaultGen.toString())))
      .flatMap((e) => gen.moves.get(e[0]) ?? [])
  );
};

export function MovesTable({ moveIdx, tabIdx, teamState }: { moveIdx: number } & PanelProps) {
  // get dex & possible moves
  const { gen } = useContext(DexContext);

  // table settings
  const [data, setData] = useState<Move[]>([]);
  useEffect(() => {
    getMovesBySpecie(gen, teamState.team[tabIdx]?.species).then((moves) => setData(moves));
  }, [teamState.team[tabIdx]?.species]);
  const columns = useMemo<typeof defaultColumns>(() => [...defaultColumns], []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // table instance
  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModelSync(),
    getCoreRowModel: getCoreRowModelSync(),
    getSortedRowModel: getSortedRowModelSync(),
  });

  // handle table events
  const handleRowClick = (move?: Move) => {
    if (!move || !teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].moves.splice(moveIdx, 1, move.name);
  };

  // table render
  return (
    <>
      <table className="table-compact relative table w-full">
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
          {instance.getRowModel().rows.map((row: { id?: Key; original?: Move; getVisibleCells: () => any[] }) => (
            <tr key={row.id} className="hover" onClick={() => handleRowClick(row.original)}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{cell.renderCell()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export function MoveInput({ onFocus, moveIdx, teamState, tabIdx }: { onFocus: () => void; moveIdx: number } & PanelProps) {
  const [move, setMove] = useState<string>('');

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setMove(teamState.team[tabIdx]?.moves[moveIdx] || '');
  }, [teamState.team[tabIdx]?.moves[moveIdx]]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMove = e.target.value;
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].moves.splice(moveIdx, 1, newMove);
  };

  return (
    <div className="tooltip" data-tip="Please pick a move below">
      <label className="input-group-xs input-group input-group-vertical">
        <span>Move {moveIdx + 1}</span>
        <input
          type="text"
          placeholder="Move"
          className="input-accent input input-xs md:input-md"
          value={move}
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
