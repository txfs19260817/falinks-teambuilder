import { useContext, useMemo, useState } from 'react';

import { TeamTypeCategoryMatrix } from '@/components/table/TeamTypeCategoryMatrix';
import { TeamTypeChart } from '@/components/table/TeamTypeChart';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { TeamMembersGallery } from '@/components/workspace/Overview/TeamMembersGallery';
import { TeamMetaSetters } from '@/components/workspace/Overview/TeamMetaSetters';

const tabs = ['Team', 'Types', 'Defense', 'Offense'] as const;
type Tabs = typeof tabs[number];

export function OverviewTabBtn() {
  const { tabIdx, setTabIdx } = useContext(StoreContext);
  return (
    <button
      role="tab"
      aria-label="Overview"
      className={`tab tab-lifted tab-md md:tab-lg ${tabIdx === -1 ? 'tab-active' : 'text-info-content bg-info'}`}
      onClick={() => setTabIdx(-1)}
    >
      Overview
    </button>
  );
}

function Overview() {
  const [tab, setTab] = useState<Tabs>('Team');
  const { teamState } = useContext(StoreContext);
  const teamCategories = useMemo(() => teamState.getTeamMemberCategories(), [teamState]);
  const { defenseMap, offenseMap, defenseTeraMap } = useMemo(() => teamState.getTeamTypeChart(), [teamState]);

  return (
    <div className="mockup-window border bg-base-300">
      <TeamMetaSetters />
      <div className="tabs tabs-boxed">
        {tabs.map((t) => (
          <a role="tab" aria-label={t} key={t} className={`tab ${tab === t ? 'tab-active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </a>
        ))}
      </div>
      <div className="flex flex-col">
        {tab === 'Team' && <TeamMembersGallery />}
        {tab === 'Types' && <TeamTypeCategoryMatrix teamMemberCategories={teamCategories} />}
        {tab === 'Defense' && <TeamTypeChart teamTypeChart={defenseMap} additionalTypeChart={defenseTeraMap} direction={'defense'} />}
        {tab === 'Offense' && <TeamTypeChart teamTypeChart={offenseMap} direction={'offense'} />}
      </div>
    </div>
  );
}

export default Overview;
