import type { Tournament, TournamentTeam } from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import TournamentTeamsTable from '@/components/tournaments/TournamentTeamsTable';
import { Main } from '@/templates/Main';
import { getTournament, getTournamentTeams } from '@/utils/Prisma';

const TournamentOverviewCard = ({ tournament }: { tournament: Tournament }) => {
  const { locale, push } = useRouter();
  const { t } = useTranslation(['common']);
  const title2value = [
    { title: t('common.format'), value: tournament.format, actions: null },
    {
      title: t('common.date'),
      value: new Intl.DateTimeFormat(locale).format(Date.parse(tournament.date as unknown as string)),
      actions: null,
    },
    {
      title: t('common.players'),
      value: tournament.players,
      actions: (
        <button
          className="btn-success btn-sm btn"
          onClick={() => {
            push(`/tournaments/${tournament.id}/usages`);
          }}
        >
          {t('common.usage')}
        </button>
      ),
    },
  ];

  return (
    <>
      <h1 className="m-2 text-2xl font-bold">{tournament.name}</h1>
      <div className="stats stats-vertical bg-primary text-primary-content shadow lg:stats-horizontal">
        {title2value.map(({ title, value, actions }) => (
          <div className="stat" key={title}>
            <div className="stat-title">{title}</div>
            <div className="stat-value text-xl lg:text-2xl">{value}</div>
            <div className="stat-actions">{actions}</div>
          </div>
        ))}
      </div>
      <div className="divider" />
    </>
  );
};

export default function TournamentDetailPage({ tournament, tournamentTeams }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation(['common']);
  return (
    <Main title={tournament.name + t('common.details')} description={tournament.name + t('common.details')}>
      <TournamentOverviewCard tournament={tournament} />
      <TournamentTeamsTable tournamentTeams={tournamentTeams} />
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
      ...(await serverSideTranslations(context.locale ?? 'en', ['common', 'species'])),
    },
  };
};
