import type { Tournament, TournamentTeam } from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';

import { TournamentOverviewCard } from '@/components/tournaments/TournamentOverviewCard';
import TournamentTeamsTable from '@/components/tournaments/TournamentTeamsTable';
import Loading from '@/templates/Loading';
import { Main } from '@/templates/Main';
import { getTournament, getTournamentTeams } from '@/utils/Prisma';

const TournamentUsageWrapper = dynamic(() => import('@/components/tournaments/TournamentUsageWrapper'), {
  ssr: true,
  loading: () => <Loading />,
});

const TournamentTabs = ['teams', 'usage'] as const;
type TournamentTab = typeof TournamentTabs[number];

export default function TournamentDetailPage({ tournament, tournamentTeams }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation(['common']);
  const [tab, setTab] = useState<TournamentTab>(TournamentTabs[0]);
  return (
    <Main title={tournament.name + t('common.details')} description={tournament.name + t('common.details')}>
      <TournamentOverviewCard tournament={tournament} />
      <div className="tabs">
        {TournamentTabs.map((tTab) => (
          <a key={tTab} className={`tab tab-lifted tab-lg font-bold${tTab === tab ? ' tab-active' : ''}`} onClick={() => setTab(tTab)}>
            {t(`common.${tTab}`)}
          </a>
        ))}
      </div>
      {tab === 'teams' && <TournamentTeamsTable tournamentTeams={tournamentTeams} />}
      {tab === 'usage' && <TournamentUsageWrapper tournament={tournament} tournamentTeams={tournamentTeams} />}
    </Main>
  );
}

export const getServerSideProps: GetServerSideProps<{ tournament: Tournament; tournamentTeams: TournamentTeam[] }, { id: string }> = async (context) => {
  const tournamentId = +(context.params?.id ?? 0);
  const tournament = await getTournament(tournamentId);
  const tournamentTeams = await getTournamentTeams(tournamentId);
  return {
    props: {
      tournament: JSON.parse(JSON.stringify(tournament)),
      tournamentTeams,
      ...(await serverSideTranslations(context.locale ?? 'en', ['usages', 'common', 'items', 'moves', 'species', 'abilities', 'types'])),
    },
  };
};
