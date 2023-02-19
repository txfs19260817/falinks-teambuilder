import type { ID } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import { useTranslation } from 'next-i18next';

import DexSingleton from '@/models/DexSingleton';

export const PokemonIcon = ({ speciesId }: { speciesId: ID | string }) => {
  const { t } = useTranslation();
  const num = DexSingleton.getGen().species.get(speciesId)?.num;
  const translatedName = t(num, { ns: 'species' }) || speciesId;
  return (
    <span
      role="img"
      title={translatedName}
      style={
        Icons.getPokemon(speciesId, {
          domain: 'cdn.staticaly.com/gh/txfs19260817/falinks-teambuilder-assets@master/',
        }).css
      }
      aria-label={translatedName}
    />
  );
};
