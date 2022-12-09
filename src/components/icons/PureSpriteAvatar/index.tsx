import { Sprites } from '@pkmn/img';
import { GenderName, GenerationNum } from '@pkmn/types';
import Image from 'next/legacy/image';

import { AppConfig } from '@/utils/AppConfig';

type SpriteAvatarProps = {
  species?: string;
  shiny?: boolean;
  gender?: GenderName;
  gen?: GenerationNum;
};

export function PureSpriteAvatar({ species, shiny, gender, gen }: SpriteAvatarProps) {
  const url = species
    ? Sprites.getPokemon(species, {
        gen: gen ?? (AppConfig.defaultGen as GenerationNum),
        shiny,
        gender,
      }).url
    : 'https://play.pokemonshowdown.com/sprites/ani/substitute.gif';

  return (
    <div className="avatar flex items-center justify-center py-1">
      <figure className="h-32">
        <Image src={url} alt={species} title={species} layout="fill" objectFit="contain" priority={true} />
      </figure>
    </div>
  );
}
