import { Specie } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import { useContext, useMemo } from 'react';
import { Column, useSortBy, useTable } from 'react-table';

import { DexContext } from '@/components/workspace/DexContext';
import { PanelProps } from '@/components/workspace/types';
import { convertStylesStringToObject } from '@/utils/Helpers';

export function PokemonTable(_props: PanelProps) {
  // get dex
  const { gen } = useContext(DexContext);
  const data = useMemo<Specie[]>(() => Array.from(gen.species), []);
  const columns = useMemo<Column<Specie>[]>(
    () =>
      [
        {
          Header: 'Name',
          accessor: 'name',
          Cell: ({ value }) => (
            <span>
              <span style={convertStylesStringToObject(Icons.getPokemon(value).style)}></span>
              {value}
            </span>
          ),
        },
        {
          Header: 'Types',
          accessor: 'types',
          disableSortBy: true,
          Cell: ({ value }) => (
            <span>
              {value.map((type) => (
                <img key={type} className="inline-block" alt={type} src={Icons.getType(type).url} />
              ))}
            </span>
          ),
        },
        {
          Header: 'Abilities',
          accessor: 'abilities',
          disableSortBy: true,
          Cell: ({ value }) => Object.values(value).join('/'),
        },
        {
          Header: 'HP',
          accessor: 'baseStats.hp',
        },
        {
          Header: 'Atk',
          accessor: 'baseStats.atk',
        },
        {
          Header: 'Def',
          accessor: 'baseStats.def',
        },
        {
          Header: 'SpA',
          accessor: 'baseStats.spa',
        },
        {
          Header: 'SpD',
          accessor: 'baseStats.spd',
        },
        {
          Header: 'Spe',
          accessor: 'baseStats.spe',
        },
      ] as Column<Specie>[],
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data }, useSortBy);

  return (
    <table {...getTableProps()} className="table-compact table w-full">
      <thead>
        {headerGroups.map((h, i) => (
          <tr {...h.getHeaderGroupProps()} key={i}>
            {h.headers.map((col, j) => (
              <th {...col.getHeaderProps(col.getSortByToggleProps())} key={j}>
                {col.render('Header')}
                <span>{col.isSorted ? (col.isSortedDesc ? '↓' : '↑') : '↕'}</span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={i} className="hover">
              {row.cells.map((cell, j) => {
                return (
                  <td {...cell.getCellProps()} key={j}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
