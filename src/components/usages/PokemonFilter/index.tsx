import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { getPokemonTranslationKey } from '@/utils/PokemonUtils';
import type { Usage } from '@/utils/Types';

type PokemonFilterProps = {
  usages: Usage[];
  setSelectedRank: (r: number) => void;
  drawerID: string;
};

export function PokemonFilter({ usages, drawerID, setSelectedRank }: PokemonFilterProps) {
  const { t } = useTranslation(['common', 'usages']);
  const [pokemonNameFilter, setPokemonNameFilter] = useState<string>('');
  const i18nPokemonNameFilter = ({ name }: Usage) =>
    t(getPokemonTranslationKey(name, 'species')).includes(pokemonNameFilter) || name.toLowerCase().includes(pokemonNameFilter.toLowerCase());
  return (
    <>
      <label className="join">
        <span>{t('common.pokemon')}</span>
        <input
          type="search"
          className="input input-ghost input-sm bg-base-100 text-base-content placeholder:text-neutral/50 focus:bg-base-100"
          placeholder={t('usages.filter.placeholder')}
          value={pokemonNameFilter}
          onChange={(e) => setPokemonNameFilter(e.target.value)}
        />
      </label>
      {(usages || [])
        .filter(i18nPokemonNameFilter) // apply filter that user typed in
        .map(({ name, rank }) => (
          <li key={name}>
            {/* use label to close drawer on mobile view after clicking the button */}
            <label
              htmlFor={drawerID}
              role="button"
              className="btn btn-ghost btn-block m-1 w-full bg-base-100 text-xs"
              onClick={() => setSelectedRank(rank)} // rank is 0-indexed and is equivalent to the origin index in the usages array
            >
              <PokemonIcon speciesId={name} />
              <span>{t(getPokemonTranslationKey(name, 'species'))}</span>
            </label>
          </li>
        ))}
    </>
  );
}
