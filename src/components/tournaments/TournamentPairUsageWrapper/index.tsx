import type { TournamentTeam } from '@prisma/client';
import { Tournament } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';

import PairUsageTable from '@/components/usages/PairUsageTable';
import { calcPairUsage, pastesToSpeciesArrays } from '@/utils/PokemonUtils';

const TournamentUsageTabs = ['full', 'topcut'] as const;
type TournamentUsageTab = typeof TournamentUsageTabs[number];

const TournamentPairUsageWrapper = ({ tournament, tournamentTeams }: { tournament: Tournament; tournamentTeams: TournamentTeam[] }) => {
  const { t } = useTranslation(['common']);
  const [tournamentUsageTab, setTournamentUsageTab] = useState<TournamentUsageTab>(TournamentUsageTabs[0]);
  const pairUsages = useMemo(() => calcPairUsage(pastesToSpeciesArrays(tournamentTeams.map(({ paste }) => paste))), []);
  const topCutPairUsages = useMemo(
    () => calcPairUsage(pastesToSpeciesArrays(tournamentTeams.filter(({ standing }) => standing <= tournament.topcut).map(({ paste }) => paste))),
    []
  );
  return (
    <>
      {/* Filters */}
      <div className="tabs">
        {TournamentUsageTabs.map((tTab) => (
          <a key={tTab} className={`tab tab-bordered font-bold${tTab === tournamentUsageTab ? ' tab-active' : ''}`} onClick={() => setTournamentUsageTab(tTab)}>
            {t(`common.${tTab}`)}
          </a>
        ))}
      </div>
      {/* Panel */}
      <PairUsageTable pairUsages={tournamentUsageTab === 'topcut' ? topCutPairUsages : pairUsages} nResults={32} />
    </>
  );
};

export default TournamentPairUsageWrapper;
