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
          protocol: 'https',
          domain: 'raw.githubusercontent.com/MK-404/Giudizio-showdown-sprites/30a337a0d5e0c28035517c1a0eeb133d73347b2d',
        }).css
      }
      aria-label={translatedName}
    />
  );
};
