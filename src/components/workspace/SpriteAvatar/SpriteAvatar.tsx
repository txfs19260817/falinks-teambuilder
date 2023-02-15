import { GenerationNum } from '@pkmn/types';
import { useContext } from 'react';

import { PureSpriteAvatar } from '@/components/icons/PureSpriteAvatar';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';
import { AppConfig } from '@/utils/AppConfig';
import { getGenNumberFromFormat } from '@/utils/PokemonUtils';

type SpriteAvatarProps = {
  idx?: number; // index in `teamState.team`
  pokemon?: Pokemon;
};

function SpriteAvatar({ idx, pokemon }: SpriteAvatarProps) {
  const { teamState, tabIdx } = useContext(StoreContext);
  const { species, shiny } = pokemon ?? teamState.getPokemonInTeam(idx ?? tabIdx) ?? {};
  const genNum = (getGenNumberFromFormat(teamState.format) ?? AppConfig.defaultGen) as GenerationNum;
  return <PureSpriteAvatar speciesId={species} shiny={shiny} gen={genNum} />;
}

export default SpriteAvatar;
