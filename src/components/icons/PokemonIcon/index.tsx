import type { ID } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import { useTranslation } from 'next-i18next';

import DexSingleton from '@/models/DexSingleton';

export const PokemonIcon = ({ speciesId }: { speciesId: ID | string }) => {
  const { t } = useTranslation();
  const num = DexSingleton.getGen().species.get(speciesId)?.num;
  const translatedName = t(num, { ns: 'species' }) || speciesId;
  return <span role="img" title={translatedName} style={Icons.getPokemon(speciesId).css} aria-label={translatedName} />;
};
