import { Sprites } from '@pkmn/img';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/StoreContext';

function SpriteAvatar() {
  const { teamState, tabIdx } = useContext(StoreContext);

  const [spriteUrl, setSpriteUrl] = useState('https://play.pokemonshowdown.com/sprites/ani/pikachu.gif');
  const pm = teamState.team[tabIdx]!;

  useEffect(() => {
    if (!pm) return;
    const { species, shiny } = pm;
    const { url } = Sprites.getPokemon(species, {
      gen: 8,
      shiny,
      // gender: gender as GenderName,
    });
    setSpriteUrl(url);
  }, [pm, pm.species, pm.shiny]);

  return (
    <div className="avatar flex items-center justify-center py-1">
      <div className="w-48 rounded-xl">
        <Image src={spriteUrl} alt="sprite" layout="fill" objectFit="contain" priority={true} />
      </div>
    </div>
  );
}

export default SpriteAvatar;
