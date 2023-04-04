import type { Tournament } from '@prisma/client';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import TournamentsTable from '@/components/tournaments/TournamentsTable';
import FormatManager from '@/models/FormatManager';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { listTournaments } from '@/utils/Prisma';

const TournamentCarousel = ({ tournaments }: { tournaments: Tournament[] }) => {
  const { t } = useTranslation(['common']);
  const { locale, push } = useRouter();
  const nameToPhotoUrl = (name: string) =>
    `https://cdn.staticaly.com/gh/txfs19260817/falinks-teambuilder-assets@master/citys/${name.replaceAll(' ', '-')}.webp`;
  const nameToLogoUrl = (name: string) => {
    if (name.includes('Regional')) return `https://cdn.staticaly.com/gh/txfs19260817/falinks-teambuilder-assets@master/championships/small/regional.png`;
    if (name.includes('Oceania')) return `https://cdn.staticaly.com/gh/txfs19260817/falinks-teambuilder-assets@master/championships/small/ocic.png`;
    if (name.includes('Europe')) return `https://cdn.staticaly.com/gh/txfs19260817/falinks-teambuilder-assets@master/championships/small/euic.png`;
    if (name.includes('North America')) return `https://cdn.staticaly.com/gh/txfs19260817/falinks-teambuilder-assets@master/championships/small/naic.png`;
    if (name.includes('Latin America')) return `https://cdn.staticaly.com/gh/txfs19260817/falinks-teambuilder-assets@master/championships/small/laic.png`;
    if (name.includes('World')) return `https://cdn.staticaly.com/gh/txfs19260817/falinks-teambuilder-assets@master/championships/small/world.png`;
    return `https://cdn.staticaly.com/gh/txfs19260817/falinks-teambuilder-assets@master/championships/small/play.png`;
  };
  return (
    <>
      <div className="carousel w-full">
        {tournaments.map(({ date, format, id, name, players, source }) => (
          <div
            key={id}
            id={`item${id}`}
            className="carousel-item w-full items-center justify-center"
            style={{
              backgroundImage: `url('${nameToPhotoUrl(name)}')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="card glass my-6">
              <figure>
                <img src={nameToLogoUrl(name)} alt="Champ_Series_logo" width={256} />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{name}</h2>
                <p className="flex flex-col gap-2">
                  <span className="badge-primary badge">{format}</span>
                  <span>{`${t('common.players')}: ${players}`}</span>
                  <span>{`${t('common.date')}: ${new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(Date.parse(date as unknown as string))}`}</span>
                </p>
                <div className="card-actions justify-end">
                  <a className="btn-secondary btn" href={source} target={'_blank'} rel="noreferrer">
                    🏠 {t('common.source')}
                  </a>
                  <button className="btn-primary btn" onClick={() => push(`/tournaments/${id}`)}>
                    📊 {t('common.details')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-full justify-center gap-2 py-2">
        {tournaments.map(({ id }, index) => (
          <a key={id} href={`#item${id}`} className="btn-xs btn">
            {index + 1}
          </a>
        ))}
      </div>
    </>
  );
};

const Tournaments = ({ tournaments }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(['common']);
  return (
    <Main title={t('common.routes.official_tournaments.title')} description={t('common.routes.official_tournaments.description')}>
      <TournamentCarousel tournaments={tournaments.filter(({ format }) => format.endsWith('C')).sort((a, b) => b.id - a.id)} />
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
