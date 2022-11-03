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
  return (
    <table className="table-zebra table-compact table">
      <thead>
        <tr>
          <th>Category\Type</th>
          {types.map((t) => (
            <th key={t}>
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
            {types.map((t) => (
              <td key={t} className="border-l-2 border-base-content/30">
                {teamMembers
                  .filter((s) => s.types.includes(t))
                  .map(({ id }) => (
                    <PokemonIcon key={id} speciesId={id} />
                  ))}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
