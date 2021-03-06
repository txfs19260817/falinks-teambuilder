import { Column, Table } from '@tanstack/react-table';
import React from 'react';
import Select, { components, OptionProps } from 'react-select';

import { Pokemon } from '@/models/Pokemon';
import { getPokemonIcon } from '@/utils/Helpers';

const TailwindStyledInput = ({ children, innerProps, ...props }: OptionProps) => {
  const species = (props.data as { value: string }).value;
  return (
    <components.Option
      {...props}
      innerProps={{
        ...innerProps,
        className: 'select w-full',
      }}
    >
      {children}
      <span key={species} title={species} style={getPokemonIcon(undefined, species, true)}></span>
    </components.Option>
  );
};

function OmniFilter({ column, instance }: { column: Column<any>; instance: Table<any> }) {
  if (!column.getCanFilter()) return null;
  const firstValue = instance.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();

  if (column.id === 'types' || column.id === 'type') {
    return (
      <select
        className="select select-xs w-16 md:w-24"
        onChange={(e) => {
          column.setFilterValue(e.target.value);
        }}
      >
        <option value="">All</option>
        <option value="Bug">Bug</option>
        <option value="Dark">Dark</option>
        <option value="Dragon">Dragon</option>
        <option value="Electric">Electric</option>
        <option value="Fairy">Fairy</option>
        <option value="Fighting">Fighting</option>
        <option value="Fire">Fire</option>
        <option value="Flying">Flying</option>
        <option value="Ghost">Ghost</option>
        <option value="Grass">Grass</option>
        <option value="Ground">Ground</option>
        <option value="Ice">Ice</option>
        <option value="Normal">Normal</option>
        <option value="Poison">Poison</option>
        <option value="Psychic">Psychic</option>
        <option value="Rock">Rock</option>
        <option value="Steel">Steel</option>
        <option value="Water">Water</option>
      </select>
    );
  }

  if (column.id === 'category') {
    return (
      <select
        className="select select-xs w-16 md:w-24"
        onChange={(e) => {
          column.setFilterValue(e.target.value);
        }}
      >
        <option value="">All</option>
        <option value="Physical">Physical</option>
        <option value="Special">Special</option>
        <option value="Status">Status</option>
      </select>
    );
  }

  if (column.id === 'team') {
    const options = Array.from(
      new Set(
        instance
          .getPreFilteredRowModel()
          .flatRows.map((row) => row.getValue(column.id))
          .flat()
          .map((p: Pokemon) => p.species)
      )
    )
      .sort((a, b) => a.localeCompare(b))
      .map((e) => ({ value: e, label: e }));
    return (
      <Select
        isMulti
        id="team-member-select"
        instanceId="team-member-select"
        name="team"
        options={options}
        onChange={(e) => {
          column.setFilterValue(e.map((p: any) => p.value));
        }}
        // @ts-ignore
        components={{ Option: TailwindStyledInput }}
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
          placeholder="???"
          className="input input-xs w-16 shadow"
        />
        <input
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0])}
          max={Number(column.getFacetedMinMaxValues()?.[1])}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={(e) => column.setFilterValue((old: [number, number]) => [old?.[0], e.target.value])}
          placeholder="???"
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
      placeholder={`... (${column.getFacetedUniqueValues().size} rows)`}
      className="input input-xs w-24 shadow md:w-32"
    />
  );
}

export default OmniFilter;
