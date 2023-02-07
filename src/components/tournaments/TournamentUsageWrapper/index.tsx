import type { Tournament, TournamentTeam } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';

import UsageLayout from '@/components/usages/UsageLayout';
import { calcUsageFromPastes } from '@/utils/PokemonUtils';

const TournamentUsageWrapper = ({ tournament, tournamentTeams }: { tournament: Tournament; tournamentTeams: TournamentTeam[] }) => {
  const { t } = useTranslation(['common']);
  const [showTopCut, setShowTopCut] = useState(false);
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
        <a className={`tab tab-bordered${showTopCut ? ' ' : ' tab-active'}`} onClick={() => setShowTopCut(false)}>
          {t('common.full')}
        </a>
        <a className={`tab tab-bordered${showTopCut ? ' tab-active' : ''}`} onClick={() => setShowTopCut(true)}>
          {t('common.topcut')}
        </a>
      </div>
      <UsageLayout usages={showTopCut ? topCutUsages : usages} title={tournament.name} format={tournament.format} formatOptions={[]} />
    </>
  );
};

export default TournamentUsageWrapper;
