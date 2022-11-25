import type { MoveCategory, Specie } from '@pkmn/data';
import { useTranslation } from 'next-i18next';

import { CategoryIcon } from '@/components/icons/CategoryIcon';
import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { RoundTypeIcon } from '@/components/icons/RoundTypeIcon';
import { typesWithEmoji } from '@/utils/PokemonUtils';

export function TeamTypeCategoryMatrix({
  teamMemberCategories,
}: {
  teamMemberCategories: {
    [key in MoveCategory]: Specie[];
  };
}) {
  const { t } = useTranslation('table');

  const types = typesWithEmoji.map((type) => type.value).filter((v) => v !== '???');
  // hide empty columns on mobile devices to avoid overflow/too compact
  const hidableBitmap = types.map(
    (type) =>
      !teamMemberCategories.Physical.some((s) => s.types.includes(type)) &&
      !teamMemberCategories.Special.some((s) => s.types.includes(type)) &&
      !teamMemberCategories.Status.some((s) => s.types.includes(type))
  );

  return (
    <table className="table-zebra table-compact table">
      <thead>
        <tr>
          <th>
            <span className="hidden lg:table-cell">{t('category_types', { defaultValue: 'Category\\Types' })}</span>
          </th>
          {types.map((type, i) => (
            <th key={type} className={`${hidableBitmap[i] ? 'hidden lg:table-cell' : ''}`}>
              <RoundTypeIcon typeName={type} /> {t(`common:types.${type.toLowerCase()}`)}
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
            {types.map((type, i) => (
              <td key={type} className={`${hidableBitmap[i] ? 'hidden lg:table-cell' : ''} border-l-2 border-base-content/30 p-0 md:p-1`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {teamMembers
                    .filter((s) => s.types.includes(type))
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
