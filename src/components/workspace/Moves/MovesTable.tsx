import { Generation, Move } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import { ColumnFiltersState, createTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useTableInstance } from '@tanstack/react-table';
import Image from 'next/image';
import { useContext, useEffect, useMemo, useState } from 'react';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import Table from '@/components/workspace/Table';
import { AppConfig } from '@/utils/AppConfig';
import { trimGmaxFromName } from '@/utils/Helpers';

const table = createTable().setRowType<Move>();
const defaultColumns = [
  table.createDataColumn('name', {
    header: 'Name',
  }),
  table.createDataColumn('type', {
    header: 'Type',
    cell: (info) => {
      const type = info.getValue();
      return <Image className="inline-block" width={32} height={14} key={type} alt={type} title={type} src={Icons.getType(type).url} loading="lazy" />;
    },
  }),
  table.createDataColumn('category', {
    header: 'Category',
  }),
  table.createDataColumn('basePower', {
    header: 'Power',
    cell: (info) => {
      const power = info.getValue();
      return <span>{power === 0 ? '-' : power}</span>;
    },
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
  table.createDataColumn('accuracy', {
    header: 'Accuracy',
    cell: (info) => {
      const accuracy = info.getValue();
      return <span>{accuracy === true ? '-' : accuracy}</span>;
    },
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

function MovesTable({ moveIdx }: { moveIdx: number }) {
  const { globalFilter, setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch } = useContext(StoreContext);
  // get dex & possible moves
  const { gen } = useContext(DexContext);

  // table settings
  const [data, setData] = useState<Move[]>([]);
  useEffect(() => {
    getMovesBySpecie(gen, teamState.team[tabIdx]?.species).then((moves) => setData(moves));
  }, [teamState.team[tabIdx]?.species]);
  const columns = useMemo<typeof defaultColumns>(() => [...defaultColumns], []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // handle table events
  const handleRowClick = (move?: Move) => {
    if (!move || !teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].moves.splice(moveIdx, 1, move.name);

    focusedFieldDispatch({ type: 'next', payload: focusedFieldState });
  };

  // table render
  return <Table<Move> instance={instance} handleRowClick={handleRowClick} enablePagination={false} />;
}

export default MovesTable;
