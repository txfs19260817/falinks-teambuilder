import { Sprites } from '@pkmn/img';
import type { GenderName, GenerationNum } from '@pkmn/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import DexSingleton from '@/models/DexSingleton';
import { AppConfig } from '@/utils/AppConfig';

type SpriteAvatarProps = {
  speciesId?: string;
  shiny?: boolean;
  gender?: GenderName;
  gen?: GenerationNum;
  showName?: boolean;
  size?: number;
};

export function PureSpriteAvatar({ speciesId, shiny, gender, gen = AppConfig.defaultGen as GenerationNum, showName = false, size = 256 }: SpriteAvatarProps) {
  const { t } = useTranslation();
  const url = speciesId ? Sprites.getPokemon(speciesId, { gen, shiny, gender }).url : 'https://play.pokemonshowdown.com/sprites/ani/substitute.gif';
  const translatedName = speciesId ? t(DexSingleton.getGen().species.get(speciesId)?.num, { ns: 'species' }) || speciesId : t('substitute', { ns: 'common' });

  return (
    <div className="flex flex-col items-center justify-center">
      <Image src={url} alt={translatedName} width={size} height={size} />
      {showName && <figcaption className="mt-2 text-center">{translatedName}</figcaption>}
    </div>
  );
}
