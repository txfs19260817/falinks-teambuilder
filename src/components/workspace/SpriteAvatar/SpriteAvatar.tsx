import { Sprites } from '@pkmn/img';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';

type SpriteAvatarProps = {
  idx?: number;
};

const placeholderUrl = 'https://play.pokemonshowdown.com/sprites/ani/substitute.gif';

function SpriteAvatar({ idx }: SpriteAvatarProps) {
  const { teamState, tabIdx } = useContext(StoreContext);

  const [spriteUrl, setSpriteUrl] = useState('https://play.pokemonshowdown.com/sprites/ani/incineroar.gif');
  const pm = teamState.team[idx ?? tabIdx]!;

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

  return (
    <div className="avatar flex items-center justify-center py-1">
      <div className="w-32">
        <figure>
          <Image src={spriteUrl} alt="sprite" layout="fill" objectFit="contain" priority={true} />
        </figure>
      </div>
    </div>
  );
}

export default SpriteAvatar;
