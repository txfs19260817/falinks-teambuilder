import type { ID } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import { useTranslation } from 'next-i18next';

import { getPokemonTranslationKey } from '@/utils/PokemonUtils';

type PokemonIconProps = {
  speciesId: ID | string;
};

export const PokemonIcon = ({ speciesId }: PokemonIconProps) => {
  const { t } = useTranslation();
  const translatedName = t(getPokemonTranslationKey(speciesId, 'species'));
  const pokemonIconStyle = Icons.getPokemon(speciesId).css;

  return <span role="img" title={translatedName} aria-label={translatedName} style={pokemonIconStyle} />;
};
