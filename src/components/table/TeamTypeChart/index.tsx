import type { TypeEffectiveness } from '@pkmn/data';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { TypeIcon } from '@/components/icons/TypeIcon';
import DexSingleton from '@/models/DexSingleton';
import { typesWithEmoji } from '@/utils/PokemonUtils';
import type { ExtendedTypeEffectiveness, Type2EffectivenessMap } from '@/utils/Types';

function multiplierToBgClass(multiplier: ExtendedTypeEffectiveness) {
  switch (multiplier) {
    case 0:
      return 'bg-success/30';
    case 0.25:
      return 'bg-success/20';
    case 0.5:
      return 'bg-success/10';
    case 1:
      return 'bg-neutral-content';
    case 2:
      return 'bg-error/10';
    case 4:
      return 'bg-error/20';
    default:
      return '';
  }
}

function Cell({ direction, id }: { direction: 'offense' | 'defense'; id: string }) {
  if (direction === 'defense') return <PokemonIcon speciesId={id} />;
  const move = DexSingleton.getGen().moves.get(id);
  if (!move) return null;

  // TODO: STAB bold
  return (
    <span className="badge">
      {typesWithEmoji.find((t) => t.value === move.type)?.emoji}
      {move.name}
    </span>
  );
}

export function TeamTypeChart<T extends ExtendedTypeEffectiveness | TypeEffectiveness = ExtendedTypeEffectiveness>({
  teamTypeChart,
  direction,
}: {
  teamTypeChart: Type2EffectivenessMap<T>;
  direction: T extends TypeEffectiveness ? 'offense' : 'defense';
}) {
  const multipliers = (direction === 'offense' ? Array.from([0, 0.5, 1, 2]) : Array.from([0, 0.25, 0.5, 1, 2, 4])) as Array<T>;
  return (
    <table className="table-compact table">
      <thead>
        <tr>
          <th>Type</th>
          {multipliers.map((multiplier) => (
            <th key={multiplier}>×{multiplier}</th>
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
              <td key={multiplier} className={`border-l-2 border-base-content/30 ${multiplierToBgClass(multiplier)}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {mul2Ids[multiplier].map((id) => (
                    <Cell key={id} direction={direction} id={id} />
                  ))}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
