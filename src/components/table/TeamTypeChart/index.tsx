import type { TypeEffectiveness } from '@pkmn/data';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { TypeIcon } from '@/components/icons/TypeIcon';
import DexSingleton from '@/models/DexSingleton';
import { typesWithEmoji } from '@/utils/PokemonUtils';
import type { ExtendedTypeEffectiveness, Type2EffectivenessMap } from '@/utils/Types';

function multiplierToBgClass(multiplier: ExtendedTypeEffectiveness, direction: 'offense' | 'defense') {
  switch (multiplier) {
    case 0:
      return direction === 'defense' ? 'bg-success/30' : 'bg-error/20';
    case 0.25:
      return 'bg-success/20';
    case 0.5:
      return direction === 'defense' ? 'bg-success/10' : 'bg-error/10';
    case 1:
      return 'bg-neutral-content';
    case 2:
      return direction === 'defense' ? 'bg-error/10' : 'bg-success/10';
    case 4:
      return 'bg-error/20';
    default:
      return '';
  }
}

function typeToBgClass(type: string) {
  switch (type.toLowerCase()) {
    case 'normal':
      return 'bg-types-normal';
    case 'fire':
      return 'bg-types-fire';
    case 'water':
      return 'bg-types-water';
    case 'electric':
      return 'bg-types-electric';
    case 'grass':
      return 'bg-types-grass';
    case 'ice':
      return 'bg-types-ice';
    case 'fighting':
      return 'bg-types-fighting';
    case 'poison':
      return 'bg-types-poison';
    case 'ground':
      return 'bg-types-ground';
    case 'flying':
      return 'bg-types-flying';
    case 'psychic':
      return 'bg-types-psychic';
    case 'bug':
      return 'bg-types-bug';
    case 'rock':
      return 'bg-types-rock';
    case 'ghost':
      return 'bg-types-ghost';
    case 'dragon':
      return 'bg-types-dragon';
    case 'dark':
      return 'bg-types-dark';
    case 'steel':
      return 'bg-types-steel';
    case 'fairy':
      return 'bg-types-fairy';
    default:
      return '';
  }
}

function TableCell({ direction, id, bordered = false }: { direction: 'offense' | 'defense'; id: string; bordered?: boolean }) {
  // defense
  if (direction === 'defense') {
    // add hexagon border for, e.g., tera-typed species
    return !bordered ? (
      <PokemonIcon speciesId={id} />
    ) : (
      <div className="avatar" title="Terastallized">
        <div className="mask mask-hexagon bg-info">
          <PokemonIcon speciesId={id} />
        </div>
      </div>
    );
  }

  // offense
  const move = DexSingleton.getGen().moves.get(id);
  if (!move) return null;

  return (
    <span className={`m-1 badge badge-xs sm:badge-sm md:badge-md ${typeToBgClass(move.type)} text-base-100 w-24 md:w-32`}>
      {typesWithEmoji.find((t) => t.value === move.type)?.emoji}
      {move.name}
    </span>
  );
}

export function TeamTypeChart<T extends ExtendedTypeEffectiveness | TypeEffectiveness = ExtendedTypeEffectiveness>({
  teamTypeChart,
  direction,
  additionalTypeChart,
}: {
  teamTypeChart: Type2EffectivenessMap<T>;
  direction: T extends TypeEffectiveness ? 'offense' : 'defense';
  additionalTypeChart?: Type2EffectivenessMap<T>; // for defensive tera type chart
}) {
  const multipliers = (direction === 'offense' ? Array.from([0, 0.5, 1, 2]) : Array.from([0, 0.25, 0.5, 1, 2, 4])) as Array<T>;
  return (
    <table className="table-compact table">
      <thead>
        <tr>
          <th>Type</th>
          {multipliers.map((multiplier) => (
            // hide the 1x multiplier for mobile
            <th key={multiplier} className={`${multiplier === 1 ? 'hidden md:table-cell' : ''}`}>
              ×{multiplier}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from(teamTypeChart).map(([typeName, mul2Ids]) => (
          <tr key={typeName}>
            <td>
              <TypeIcon typeName={typeName} />
            </td>
            {multipliers.map((multiplier) => (
              <td
                key={multiplier}
                className={`${multiplier === 1 ? 'hidden md:table-cell' : ''} border-l-2 border-base-content/30 ${multiplierToBgClass(multiplier, direction)}`}
              >
                <div className={`grid grid-cols-1 ${direction === 'offense' ? 'xl:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
                  {mul2Ids[multiplier].map((id) => (
                    <TableCell key={id} direction={direction} id={id} />
                  ))}
                  {additionalTypeChart &&
                    additionalTypeChart.get(typeName)?.[multiplier].map((id) => <TableCell key={id} direction={direction} id={id} bordered={true} />)}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
