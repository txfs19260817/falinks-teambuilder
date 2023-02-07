import { Tournament } from '@prisma/client';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const TournamentOverviewCard = ({ tournament }: { tournament: Tournament }) => {
  const { locale } = useRouter();
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
      actions: null,
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
    </>
  );
};

export { TournamentOverviewCard };
