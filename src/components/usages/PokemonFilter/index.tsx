import React, { ChangeEvent } from 'react';

export function PokemonFilter(props: { value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="input-group-xs input-group">
      <span>Pokémon</span>
      <input
        type="text"
        className="input-ghost input input-sm bg-base-100 text-base-content placeholder:text-neutral focus:bg-base-100"
        placeholder="Filter by name"
        value={props.value}
        onChange={props.onChange}
      />
    </label>
  );
}
