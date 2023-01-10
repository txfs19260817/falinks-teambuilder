import type { TypeEffectiveness } from '@pkmn/data';
import { useTranslation } from 'next-i18next';

import { TeamTypeCategoryMatrix } from '@/components/table/TeamTypeCategoryMatrix';
import { TeamTypeChart } from '@/components/table/TeamTypeChart';
import { Pokemon } from '@/models/Pokemon';

const TeamInsight = ({ team }: { team: Pokemon[] }) => {
  const { t } = useTranslation(['common']);
  const { defenseMap, offenseMap, defenseTeraMap } = Pokemon.getTeamTypeChart(team);
  return (
    <div className="flex flex-col gap-2 overflow-x-auto p-2">
      <h1 className="text-2xl font-bold">{t('common.insights')}</h1>
      {/* type category matrix */}
      <h2 className="text-xl font-bold">{t('common.typeCategoryMatrix')}</h2>
      <TeamTypeCategoryMatrix teamMemberCategories={Pokemon.getTeamMemberCategories(team)} />
      {/* defense map */}
      <h2 className="text-xl font-bold">{t('common.defense')}</h2>
      <TeamTypeChart teamTypeChart={defenseMap} additionalTypeChart={defenseTeraMap} direction={'defense'} />
      {/* offense map */}
      <h2 className="text-xl font-bold">{t('common.offense')}</h2>
      <TeamTypeChart<TypeEffectiveness> teamTypeChart={offenseMap} direction={'offense'} />
    </div>
  );
};

export default TeamInsight;
