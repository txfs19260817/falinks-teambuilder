import { Column, Table } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { MultiSelect } from '@/components/select/MultiSelect';
import { ValueWithEmojiSelector } from '@/components/select/ValueWithEmojiSelector';
import { findIntersections } from '@/utils/Helpers';
import { getAllFormesForSameFuncSpecies, getPokemonTranslationKey, moveCategoriesWithEmoji, typesWithEmoji } from '@/utils/PokemonUtils';

function OmniFilter({ column, instance }: { column: Column<any>; instance: Table<any> }) {
  const { t } = useTranslation(['common', 'species']);
  const { locale } = useRouter();
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
        ariaLabel={column.id}
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
        ariaLabel={column.id}
      />
    );
  }

  if (column.id === 'species') {
    // all species from rows
    const species: string[][] = instance.getFilteredRowModel().flatRows.map(({ getValue }) => getValue<string[]>(column.id));
    // get all unique pokemon
    const speciesSet = new Set(species.flat());
    // remove intersections
    (findIntersections(species) ?? []).forEach((s) => speciesSet.delete(s));
    // append all formes
    speciesSet.forEach((s) => {
      const formes = getAllFormesForSameFuncSpecies(s);
      // replace species with its base forme if it has one
      if (formes.length > 0 && formes[0] !== s) {
        speciesSet.delete(s);
        speciesSet.add(formes[0]!);
      }
    });
    // create options, then sort them in the current locale
    const options = Array.from(speciesSet)
      .map((e) => ({
        value: e,
        label: locale === 'en' ? e : t(getPokemonTranslationKey(e, 'species')),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    // return a select component
    return (
      <MultiSelect
        options={options}
        placeholder={`${t('common.pokemon')} ...`}
        onChange={(e) => {
          column.setFilterValue(e.map((p) => p.value));
        }}
        iconGetter={(key: string) => <PokemonIcon speciesId={key} />}
        ariaLabel={column.id}
      />
    );
  }

  if (column.id === 'format') {
    // all formats
    const formats = instance.getPreFilteredRowModel().flatRows.map(({ getValue }) => getValue<string>(column.id));
    // get all unique formats
    const options = Array.from(new Set(formats));
    // return a select component
    return (
      <select
        className={`select select-xs w-16 md:w-24`}
        onChange={(e) => {
          column.setFilterValue(e.target.value);
        }}
        aria-label={column.id}
      >
        <option value="">-</option>
        {options.map((format, i) => (
          <option key={i} value={format}>
            {format}
          </option>
        ))}
      </select>
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
      role="searchbox"
      aria-label={column.id}
    />
  );
}

export default OmniFilter;
