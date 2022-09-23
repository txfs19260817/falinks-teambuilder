import { Sprites } from '@pkmn/img';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';

type SpriteAvatarProps = {
  idx?: number; // index in `teamState.team`
  pokemon?: Pokemon;
};

const placeholderUrl = 'https://play.pokemonshowdown.com/sprites/ani/substitute.gif';

export function PureSpriteAvatar({ url }: { url: string }) {
  return (
    <div className="avatar flex items-center justify-center py-1">
      <figure className="h-32">
        <Image src={url} alt="sprite" layout="fill" objectFit="contain" priority={true} />
      </figure>
    </div>
  );
}

function SpriteAvatar({ idx, pokemon }: SpriteAvatarProps) {
  const { teamState, tabIdx } = useContext(StoreContext);

  const [spriteUrl, setSpriteUrl] = useState('https://play.pokemonshowdown.com/sprites/ani/substitute.gif');
  const pm = pokemon ?? teamState.team[idx ?? tabIdx]!;

  useEffect(() => {
    if (!pm) {
      setSpriteUrl(placeholderUrl);
      return;
    }
    const { species, shiny } = pm;
    const { url } = Sprites.getPokemon(species, {
      gen: 8,
      shiny,
      // gender: gender as GenderName,
    });
    setSpriteUrl(url);
  }, [pm, pm?.species, pm?.shiny]);

  return <PureSpriteAvatar url={spriteUrl} />;
}

export default SpriteAvatar;
