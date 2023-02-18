import type { Tournament, TournamentTeam } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';

import UsageLayout from '@/components/usages/UsageLayout';
import { calcUsageFromPastes } from '@/utils/PokemonUtils';

const TournamentUsageTabs = ['full', 'topcut'] as const;
type TournamentUsageTab = typeof TournamentUsageTabs[number];

const TournamentUsageWrapper = ({ tournament, tournamentTeams }: { tournament: Tournament; tournamentTeams: TournamentTeam[] }) => {
  const { t } = useTranslation(['common']);
  const [tournamentUsageTab, setTournamentUsageTab] = useState<TournamentUsageTab>(TournamentUsageTabs[0]);
  const usages = useMemo(() => {
    const pastes = tournamentTeams.map((tournamentTeam) => tournamentTeam.paste);
    return calcUsageFromPastes(pastes);
  }, []);
  const topCutUsages = useMemo(() => {
    const topCutPastes = tournamentTeams.filter(({ standing }) => standing <= tournament.topcut).map(({ paste }) => paste);
    return calcUsageFromPastes(topCutPastes);
  }, []);
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
      <UsageLayout usages={tournamentUsageTab === 'topcut' ? topCutUsages : usages} title={tournament.name} formatId={tournament.format} formatIdOptions={[]} />
    </>
  );
};

export default TournamentUsageWrapper;
