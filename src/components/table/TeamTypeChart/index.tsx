import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { TypeIcon } from '@/components/icons/TypeIcon';
import { ExtendedTypeEffectiveness, Type2EffectivenessMap } from '@/utils/Types';

type TeamTypeChartProps = {
  teamTypeChart: Type2EffectivenessMap;
};

export function TeamTypeChart({ teamTypeChart }: TeamTypeChartProps) {
  return (
    <table className="table-zebra table-compact table">
      <thead>
        <tr>
          <th>Type</th>
          {[0, 0.25, 0.5, 1, 2, 4].map((multiplier) => (
            <th key={multiplier}>×{multiplier}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from(teamTypeChart).map(([typeName, mul2speciesIds]) => (
          <tr key={typeName}>
            <td>
              <TypeIcon typeName={typeName} />
            </td>
            {[0, 0.25, 0.5, 1, 2, 4].map((multiplier) => (
              <td key={multiplier} className="border-l-2 border-base-content/30">
                <div className="grid grid-cols-2">
                  {mul2speciesIds[multiplier as ExtendedTypeEffectiveness].map((sid) => (
                    <PokemonIcon key={sid} speciesId={sid} />
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
