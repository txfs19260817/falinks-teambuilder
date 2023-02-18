import type { Tournament, TournamentTeam } from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';

import { TournamentOverviewCard } from '@/components/tournaments/TournamentOverviewCard';
import TournamentTeamsTable from '@/components/tournaments/TournamentTeamsTable';
import FormatManager from '@/models/FormatManager';
import Loading from '@/templates/Loading';
import { Main } from '@/templates/Main';
import { getTournament, getTournamentTeams } from '@/utils/Prisma';

const TournamentUsageWrapper = dynamic(() => import('@/components/tournaments/TournamentUsageWrapper'), {
  ssr: true,
  loading: () => <Loading />,
});

const TournamentPairUsageWrapper = dynamic(() => import('@/components/tournaments/TournamentPairUsageWrapper'), {
  ssr: true,
  loading: () => <Loading />,
});

const TournamentTabs = ['teams', 'usage', 'pair'] as const;
type TournamentTab = typeof TournamentTabs[number];

export default function TournamentDetailPage({ tournament, tournamentTeams }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation(['common', 'usages']);
  const [tab, setTab] = useState<TournamentTab>(TournamentTabs[0]);

  return (
    <Main title={tournament.name + t('common.details')} description={tournament.name + t('common.details')}>
      <TournamentOverviewCard tournament={tournament} />
      <div className="tabs">
        {TournamentTabs.map((tTab) => (
          <a key={tTab} className={`tab tab-lifted tab-lg font-bold${tTab === tab ? ' tab-active' : ''}`} onClick={() => setTab(tTab)}>
            {t(tTab, { ns: ['common', 'usages'] })}
          </a>
        ))}
      </div>
      {tab === 'teams' && <TournamentTeamsTable tournamentTeams={tournamentTeams} />}
      {tab === 'usage' && <TournamentUsageWrapper tournament={tournament} tournamentTeams={tournamentTeams} />}
      {tab === 'pair' && <TournamentPairUsageWrapper tournament={tournament} tournamentTeams={tournamentTeams} />}
    </Main>
  );
}

export const getServerSideProps: GetServerSideProps<{ tournament: Tournament; tournamentTeams: TournamentTeam[] }, { id: string }> = async (context) => {
  const tournamentId = +(context.params?.id ?? 0);
  const tournament = await getTournament(tournamentId);
  if (!tournament) return { notFound: true };
  // overwrite format field from id to name
  const formatManager = new FormatManager();
  tournament.format = formatManager.getFormatById(tournament.format)?.name ?? tournament.format;
  const tournamentTeams = await getTournamentTeams(tournamentId);
  return {
    props: {
      tournament: JSON.parse(JSON.stringify(tournament)),
      tournamentTeams,
      ...(await serverSideTranslations(context.locale ?? 'en', ['usages', 'common', 'items', 'moves', 'species', 'abilities', 'types'])),
    },
  };
};
