import { Icons } from '@pkmn/img';

import { convertStylesStringToObject } from '@/utils/Helpers';
import { Usage } from '@/utils/Types';

export function PokemonList({
  drawerID,
  pokemonNameFilter,
  setSelectedIndex,
  usages,
}: {
  drawerID: string;
  pokemonNameFilter: string;
  setSelectedIndex: (i: number) => void;
  usages: Usage[];
}) {
  return (
    <>
      {(usages || [])
        .filter((usage) => usage.name.toLowerCase().includes(pokemonNameFilter.toLowerCase())) // apply filter that user typed in
        .map((usage) => (
          <li key={usage.name}>
            {/* use label to close drawer on mobile view */}
            <label
              htmlFor={drawerID}
              role="button"
              className="btn-ghost btn-block btn m-1 w-full bg-base-100 text-xs"
              onClick={() => setSelectedIndex(usage.rank)} // rank is 0-indexed and is equivalent to the origin index in the usages array
            >
              <span style={convertStylesStringToObject(Icons.getPokemon(usage.name).style)} />
              <span>{usage.name}</span>
            </label>
          </li>
        ))}
    </>
  );
}
