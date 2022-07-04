import { Generation, Move } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Image from 'next/image';
import { useContext, useEffect, useMemo, useState } from 'react';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import Table from '@/components/workspace/Table';

const getMovesBySpecie = (gen: Generation, speciesName?: string): Promise<Move[]> => {
  return gen.learnsets.get(speciesName || '').then(async (l) => {
    const res = Object.entries(l?.learnset ?? []).flatMap((e) => gen.moves.get(e[0]) ?? []);
    const baseSpecies = gen.species.get(speciesName || '')?.baseSpecies ?? '';
    if (baseSpecies !== speciesName && baseSpecies !== '') {
      return res.concat(await getMovesBySpecie(gen, baseSpecies));
    }
    return res;
  });
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
  const columns = useMemo<ColumnDef<Move>[]>(
    () => [
      { header: 'Name', accessorKey: 'name' },
      {
        header: 'Type',
        accessorKey: 'type',
        cell: (info) => {
          const type: string = info.getValue();
          return <Image className="inline-block" width={32} height={14} key={type} alt={type} title={type} src={Icons.getType(type).url} loading="lazy" />;
        },
      },
      {
        header: 'Category',
        accessorKey: 'category',
        cell: (info) => {
          const category = info.getValue();
          return (
            <Image
              className="inline-block"
              width={32}
              height={14}
              key={category}
              alt={category}
              title={category}
              src={`/assets/moves/categories/${category}.png`}
              loading="lazy"
            />
          );
        },
      },
      {
        header: 'Power',
        accessorKey: 'basePower',
        cell: (info) => {
          const power = info.getValue();
          return <span>{power === 0 ? '-' : power}</span>;
        },
        enableColumnFilter: false,
        enableGlobalFilter: false,
      },
      {
        header: 'Accuracy',
        accessorKey: 'accuracy',
        cell: (info) => {
          const accuracy = info.getValue();
          return <span>{accuracy === true ? '-' : accuracy}</span>;
        },
        enableColumnFilter: false,
        enableGlobalFilter: false,
      },
      {
        header: 'PP',
        accessorKey: 'pp',
        enableColumnFilter: false,
        enableGlobalFilter: false,
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

  // table instance
  const instance = useReactTable<Move>({
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
