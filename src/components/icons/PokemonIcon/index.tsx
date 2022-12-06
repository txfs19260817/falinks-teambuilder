import type { ID } from '@pkmn/data';
import { Icons } from '@pkmn/img';

export const PokemonIcon = ({ speciesId }: { speciesId: ID | string }) => <span title={speciesId} style={Icons.getPokemon(speciesId).css} />;
