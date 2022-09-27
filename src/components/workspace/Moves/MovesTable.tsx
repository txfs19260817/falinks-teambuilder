import { Move } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import { DisplayUsageStatistics } from '@pkmn/smogon';
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Image from 'next/image';
import { useContext, useMemo, useState } from 'react';
import useSWR from 'swr';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import Table from '@/components/workspace/Table';
import { getMovesBySpecie } from '@/utils/PokemonUtils';

function MovesTable({ moveIdx }: { moveIdx: number }) {
  const { globalFilter, setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch } = useContext(StoreContext);
  // get dex & possible moves
  const { gen } = useContext(DexContext);

  // get all moves that learnable by the Pokémon
  const { species } = teamState.getPokemonInTeam(tabIdx) ?? {};
  const { data: learnableMoves } = useSWR<Move[]>(species, (k) => getMovesBySpecie(gen, k));
  // fetch popular moves by this Pokémon
  const { data: popularMoveNames } = useSWR<string[]>( // move names
    species ? `/api/usages/stats/${species}?moves=true` : null, // ?moves=true doesn't work in the API, only used as a cache buster for SWR.
    {
      fallbackData: [],
      fetcher: (u: string) =>
        fetch(u)
          .then((r) => r.json())
          .then((d: DisplayUsageStatistics) =>
            Object.entries(d?.moves ?? {})
              .sort((a, b) => b[1] - a[1])
              .map(([k, _]) => k)
          ),
    }
  );

  // move popular moves to the top
  const data = useMemo<Move[]>(() => {
    if (!learnableMoves) return []; // learnableMoves first
    if (!popularMoveNames || popularMoveNames.length === 0) return learnableMoves;
    return popularMoveNames
      .flatMap((name) => learnableMoves.find((m) => m.name === name) || [])
      .concat(learnableMoves.filter(({ name }) => !popularMoveNames.includes(name)));
  }, [learnableMoves, popularMoveNames]);

  // table settings
  const columns = useMemo<ColumnDef<Move>[]>(
    () => [
      { header: 'Name', accessorKey: 'name' },
      {
        header: 'Type',
        accessorKey: 'type',
        cell: (info) => {
          const type: string = info.getValue<string>();
          return <Image className="inline-block" width={32} height={14} key={type} alt={type} title={type} src={Icons.getType(type).url} loading="lazy" />;
        },
      },
      {
        header: 'Category',
        accessorKey: 'category',
        cell: (info) => {
          const category = info.getValue<string>();
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
          const power = info.getValue<number>();
          return <span>{power === 0 ? '-' : power}</span>;
        },
        enableColumnFilter: false,
        enableGlobalFilter: false,
      },
      {
        header: 'Accuracy',
        accessorKey: 'accuracy',
        cell: (info) => {
          const accuracy = info.getValue<number | true>();
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
    data: data ?? [],
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
    if (!move) return;
    teamState.updatePokemonOneMoveInTeam(tabIdx, moveIdx, move.name);
    focusedFieldDispatch({ type: 'next', payload: focusedFieldState });
  };

  // table render
  return <Table<Move> instance={instance} handleRowClick={handleRowClick} enablePagination={false} />;
}

export default MovesTable;
