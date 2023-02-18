import type { Tournament } from '@prisma/client';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import TournamentsTable from '@/components/tournaments/TournamentsTable';
import FormatManager from '@/models/FormatManager';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { listTournaments } from '@/utils/Prisma';

const Tournaments = ({ tournaments }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(['common']);
  return (
    <Main title={t('common.routes.tournament.title')} description={t('common.routes.tournament.description')}>
      <TournamentsTable tournaments={tournaments} />
    </Main>
  );
};

export const getStaticProps: GetStaticProps<{ tournaments: Tournament[] } & SSRConfig> = async ({ locale }) => {
  const tournaments = await listTournaments();
  // overwrite format field from id to name
  const formatManager = new FormatManager();
  tournaments.forEach((tournament) => {
    tournament.format = formatManager.getFormatById(tournament.format)?.name ?? tournament.format;
  });
  return {
    props: {
      tournaments: JSON.parse(JSON.stringify(tournaments)) as Tournament[],
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['common', 'species'])),
    },
  };
};

export default Tournaments;
