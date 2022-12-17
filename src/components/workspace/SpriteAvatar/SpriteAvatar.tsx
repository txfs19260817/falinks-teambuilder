import { useContext } from 'react';

import { PureSpriteAvatar } from '@/components/icons/PureSpriteAvatar';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';

type SpriteAvatarProps = {
  idx?: number; // index in `teamState.team`
  pokemon?: Pokemon;
};

function SpriteAvatar({ idx, pokemon }: SpriteAvatarProps) {
  const { teamState, tabIdx } = useContext(StoreContext);
  const { species, shiny } = pokemon ?? teamState.getPokemonInTeam(idx ?? tabIdx) ?? {};
  return <PureSpriteAvatar speciesId={species} shiny={shiny} />;
}

export default SpriteAvatar;
