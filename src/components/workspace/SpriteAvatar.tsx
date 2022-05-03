import { Sprites } from '@pkmn/img';
import { useEffect, useState } from 'react';

import { PanelProps } from '@/components/workspace/types';

export function SpriteAvatar({ teamState, tabIdx }: PanelProps) {
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
        <img src={spriteUrl} alt="sprite" />
      </div>
    </div>
  );
}
