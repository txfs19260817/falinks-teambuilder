import { Sprites } from '@pkmn/img';
import type { GenderName, GenerationNum } from '@pkmn/types';
import Image from 'next/legacy/image';
import { useTranslation } from 'next-i18next';

import DexSingleton from '@/models/DexSingleton';
import { AppConfig } from '@/utils/AppConfig';

type SpriteAvatarProps = {
  speciesId?: string;
  shiny?: boolean;
  gender?: GenderName;
  gen?: GenerationNum;
  showName?: boolean;
};

export function PureSpriteAvatar({ speciesId, shiny, gender, gen = AppConfig.defaultGen as GenerationNum, showName = false }: SpriteAvatarProps) {
  const { t } = useTranslation();
  const url = speciesId
    ? Sprites.getPokemon(speciesId, {
        gen,
        shiny,
        gender,
      }).url
    : 'https://play.pokemonshowdown.com/sprites/ani/substitute.gif';
  const translatedName = speciesId ? t(DexSingleton.getGen().species.get(speciesId)?.num, { ns: 'species' }) || speciesId : t('substitute', { ns: 'common' });
  return (
    <>
      <div className="avatar flex items-center justify-center py-1">
        <figure className="h-32">
          <Image src={url} alt={translatedName} title={translatedName} layout="fill" objectFit="contain" priority={true} aria-label="Pokémon" />
        </figure>
      </div>
      {showName && <figcaption className="self-end text-center font-bold">{translatedName}</figcaption>}
    </>
  );
}
