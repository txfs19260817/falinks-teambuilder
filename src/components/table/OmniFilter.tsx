import { Column, Table } from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { MultiSelect } from '@/components/select/MultiSelect';
import { ValueWithEmojiSelector } from '@/components/select/ValueWithEmojiSelector';
import { Pokemon } from '@/models/Pokemon';
import { getPokemonTranslationKey, moveCategoriesWithEmoji, typesWithEmoji } from '@/utils/PokemonUtils';

function OmniFilter({ column, instance }: { column: Column<any>; instance: Table<any> }) {
  const { t } = useTranslation(['common', 'species']);
  if (!column.getCanFilter()) return null;
  const firstValue = instance.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();

  if (column.id === 'types' || column.id === 'type') {
    return (
      <ValueWithEmojiSelector
        options={typesWithEmoji}
        className="select-xs w-16 md:w-24"
        emptyOption="-"
        enableEmojis={false}
        onChange={(e) => {
          column.setFilterValue(e.target.value);
        }}
      />
    );
  }

  if (column.id === 'category') {
    return (
      <ValueWithEmojiSelector
        options={moveCategoriesWithEmoji}
        className="select-xs w-16 md:w-24"
        emptyOption="-"
        enableEmojis={false}
        onChange={(e) => {
          column.setFilterValue(e.target.value);
        }}
      />
    );
  }

  if (column.id === 'paste') {
    // all teams
    const teams = instance
      .getFilteredRowModel()
      .flatRows.map((row) => row.getValue<string>(column.id))
      .map((paste) => Pokemon.convertPasteToTeam(paste) || []);
    // get all unique pokemon
    const options = Array.from(new Set(teams.flat().map((p: Pokemon) => p.species)))
      .sort((a, b) => a.localeCompare(b))
      .map((e) => ({
        value: e,
        label: t(getPokemonTranslationKey(e, 'species')),
      }));
    // return a select component
    return (
      <MultiSelect
        options={options}
        placeholder={`${t('common.pokemon')} ...`}
        onChange={(e) => {
          column.setFilterValue(e.map((p) => p.value));
        }}
        iconGetter={(key: string) => <PokemonIcon speciesId={key} />}
      />
    );
  }

  if (typeof firstValue === 'number') {
    return (
      <div className="flex space-x-1">
        <input
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0])}
          max={Number(column.getFacetedMinMaxValues()?.[1])}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={(e) => column.setFilterValue((old: [number, number]) => [e.target.value, old?.[1]])}
          placeholder="↓"
          className="input input-xs w-16 shadow"
        />
        <input
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0])}
          max={Number(column.getFacetedMinMaxValues()?.[1])}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={(e) => column.setFilterValue((old: [number, number]) => [old?.[0], e.target.value])}
          placeholder="↑"
          className="input input-xs w-16 shadow"
        />
      </div>
    );
  }

  return (
    <input
      type="search"
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`... (#${column.getFacetedUniqueValues().size})`}
      className="input input-xs w-24 shadow md:w-32"
    />
  );
}

export default OmniFilter;
