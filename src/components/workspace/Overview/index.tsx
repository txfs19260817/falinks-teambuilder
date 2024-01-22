import { useTranslation } from 'next-i18next';
import { useContext, useMemo, useState } from 'react';

import { TeamTypeCategoryMatrix } from '@/components/table/TeamTypeCategoryMatrix';
import { TeamTypeChart } from '@/components/table/TeamTypeChart';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { TeamMembersGallery } from '@/components/workspace/Overview/TeamMembersGallery';
import { TeamMetaSetters } from '@/components/workspace/Overview/TeamMetaSetters';

const tabs = ['Team', 'Types', 'Defense', 'Offense'] as const;
type Tabs = (typeof tabs)[number];

export function OverviewTabBtn() {
  const { t } = useTranslation(['common']);
  const { tabIdx, setTabIdx } = useContext(StoreContext);
  return (
    <button
      role="tab"
      aria-label={t('common.overview')}
      className={`tab ${tabIdx === -1 ? 'tab-active' : 'bg-info text-info-content'}`}
      onClick={() => setTabIdx(-1)}
    >
      {t('common.overview')}
    </button>
  );
}

function Overview() {
  const { t } = useTranslation(['common']);
  const [currentTab, setCurrentTab] = useState<Tabs>('Team');
  const { teamState } = useContext(StoreContext);
  const teamCategories = useMemo(() => teamState.getTeamMemberCategories(), [teamState]);
  const { defenseMap, offenseMap, defenseTeraMap } = useMemo(() => teamState.getTeamTypeChart(), [teamState]);

  return (
    <div className="mockup-window border bg-base-300">
      <TeamMetaSetters />
      <div className="tabs-boxed tabs">
        {tabs.map((tab) => (
          <a role="tab" aria-label={tab} key={tab} className={`tab ${currentTab === tab ? 'tab-active' : ''}`} onClick={() => setCurrentTab(tab)}>
            {t(tab.toLowerCase(), { ns: 'common' })}
          </a>
        ))}
      </div>
      <div className="flex flex-col">
        {currentTab === 'Team' && <TeamMembersGallery />}
        {currentTab === 'Types' && <TeamTypeCategoryMatrix teamMemberCategories={teamCategories} />}
        {currentTab === 'Defense' && <TeamTypeChart teamTypeChart={defenseMap} additionalTypeChart={defenseTeraMap} direction={'defense'} />}
        {currentTab === 'Offense' && <TeamTypeChart teamTypeChart={offenseMap} direction={'offense'} />}
      </div>
    </div>
  );
}

export default Overview;
