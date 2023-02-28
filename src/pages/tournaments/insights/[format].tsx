import { AreaBumpSerie, ResponsiveAreaBump } from '@nivo/bump';
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { FormatInputGroupSelector, formatOptionElement } from '@/components/select/FormatSelector';
import FormatManager from '@/models/FormatManager';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { convertYearWeekToNumber, getISOWeekNumber } from '@/utils/Helpers';
import { calcUsageFromPastes, extractPokemonTrend, getPokemonTranslationKey } from '@/utils/PokemonUtils';
import { listTournaments } from '@/utils/Prisma';
import type { Format, Usage } from '@/utils/Types';

const formatManager = new FormatManager();
const tournamentFormats: Format[] = formatManager.vgcFormats.filter((f) => f.gen === 9);

type MyResponsiveAreaBumpProps = {
  data: AreaBumpSerie<{ x: number; y: number }, {}>[];
};

const MyResponsiveAreaBump = ({ data }: MyResponsiveAreaBumpProps) => {
  const { t } = useTranslation(['common', 'species']);

  return (
    <ResponsiveAreaBump
      data={data}
      align="middle"
      margin={{ top: 36, right: 156, bottom: 36, left: 100 }}
      spacing={6}
      colors={{ scheme: 'nivo' }}
      startLabel={({ id }) => t(getPokemonTranslationKey(id, 'species'))}
      endLabel={({ id }) => t(getPokemonTranslationKey(id, 'species'))}
      tooltip={({ serie }) => (
        <div className="chat chat-start">
          <div className="chat-bubble chat-bubble-primary whitespace-nowrap">
            {t(getPokemonTranslationKey(serie.id, 'species'))}
            <PokemonIcon speciesId={serie.id} />
          </div>
        </div>
      )}
      axisTop={null}
      axisBottom={{
        tickSize: 6,
        tickPadding: 6,
        tickRotation: 15,
        legend: 'YYYY-WW',
        legendPosition: 'middle',
        legendOffset: 30,
        format: (value) => `${value.toString().slice(0, 4)}-${value.toString().slice(4)}`,
      }}
    />
  );
};

const Page = ({ format, trends }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(['common', 'species']);
  const { push } = useRouter();
  return (
    <Main title={`${t('common.routes.official_tournaments.title')}-${format}`} description={t('common.routes.official_tournaments.description')}>
      {/* Chart container w/ height defined */}
      <div className="h-[80vh] w-full">
        <FormatInputGroupSelector
          defaultFormat={format}
          onChange={(e) => push(`/tournaments/insights/${e.target.value}`)}
          options={tournamentFormats.map(formatOptionElement)}
        />
        {/*  Chart component */}
        <MyResponsiveAreaBump data={trends} />
      </div>
    </Main>
  );
};

export const getStaticProps: GetStaticProps<
  {
    format: string;
    trends: AreaBumpSerie<
      {
        x: number;
        y: number;
      },
      {}
    >[];
  } & SSRConfig,
  { format: string }
> = async ({ params, locale }) => {
  const format = params?.format;
  if (!format) {
    return {
      notFound: true,
    };
  }
  // list tournaments by format, populating teams
  const tournaments = await listTournaments({
    format,
    include: true,
  });
  // extract pastes and year-week number from tournaments
  const pasteYearweeks = tournaments.map(({ date, teams }) => ({
    yearWeek: convertYearWeekToNumber(getISOWeekNumber(date)),
    pastes: teams.map(({ paste }) => paste),
  }));
  // then merge teams into one array when they have the date in the same week
  const mergedPasteYearweeks = pasteYearweeks.reduce((acc, { yearWeek, pastes }) => {
    const last = acc[acc.length - 1];
    if (last && last.yearWeek === yearWeek) {
      last.pastes.push(...pastes);
    } else {
      acc.push({ yearWeek, pastes });
    }
    return acc;
  }, [] as { yearWeek: number; pastes: string[] }[]);
  // calculate usage by pastes and dates
  const usageDates: { x: number; usage: Usage[] }[] = mergedPasteYearweeks.map(({ yearWeek, pastes }) => ({
    x: yearWeek,
    usage: calcUsageFromPastes(pastes),
  }));
  // get trends
  const trends = extractPokemonTrend(usageDates, 32);

  return {
    props: {
      format,
      trends,
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['common', 'species'])),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const paths =
    context.locales?.flatMap((locale) =>
      tournamentFormats.map((format) => ({
        params: { format: format.id },
        locale,
      }))
    ) ?? tournamentFormats.map((format) => ({ params: { format: format.id } }));

  return {
    paths,
    fallback: false,
  };
};

export default Page;
