import type { MoveCategory, Specie } from '@pkmn/data';

import { CategoryIcon } from '@/components/icons/CategoryIcon';
import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { TypeIcon } from '@/components/icons/TypeIcon';
import { typesWithEmoji } from '@/utils/PokemonUtils';

export function TeamTypeCategoryMatrix({
  teamMemberCategories,
}: {
  teamMemberCategories: {
    [key in MoveCategory]: Specie[];
  };
}) {
  const types = typesWithEmoji.map((type) => type.value).filter((v) => v !== '???');
  const hidableBitmap = types.map(
    (t) =>
      !teamMemberCategories.Physical.some((s) => s.types.includes(t)) &&
      !teamMemberCategories.Special.some((s) => s.types.includes(t)) &&
      !teamMemberCategories.Status.some((s) => s.types.includes(t))
  );

  return (
    <table className="table-zebra table-compact table">
      <thead>
        <tr>
          <th>
            <span className="hidden lg:table-cell">Category\Type</span>
          </th>
          {types.map((t, i) => (
            <th key={t} className={`${hidableBitmap[i] ? 'hidden lg:table-cell' : ''}`}>
              <TypeIcon typeName={t} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(teamMemberCategories).map(([category, teamMembers]) => (
          <tr key={category}>
            <td>
              <CategoryIcon category={category} />
            </td>
            {types.map((t, i) => (
              <td key={t} className={`${hidableBitmap[i] ? 'hidden lg:table-cell' : ''} border-l-2 border-base-content/30 p-0 md:p-1`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {teamMembers
                    .filter((s) => s.types.includes(t))
                    .map(({ id }) => (
                      <PokemonIcon key={id} speciesId={id} />
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
