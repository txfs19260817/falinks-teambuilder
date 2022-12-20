import { AreaBumpDatum, ResponsiveAreaBump } from '@nivo/bump';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMemo } from 'react';

import { PokemonIcon } from '@/components/icons/PokemonIcon';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { convertYearWeekToNumber, getISOWeekNumber } from '@/utils/Helpers';
import { getPokemonTranslationKey } from '@/utils/PokemonUtils';
import { prisma } from '@/utils/Prisma';

type ResponsiveBumpProps = {
  data: {
    id: string;
    data: AreaBumpDatum[];
  }[];
  title: string;
};

const MyResponsiveBump = ({ data, title }: ResponsiveBumpProps) => {
  const { t } = useTranslation(['common', 'species']);
  const xMin = Math.min(...data.flatMap(({ data: d }) => d.map((x) => +x)));
  const xMax = Math.max(...data.flatMap(({ data: d }) => d.map((x) => +x)));
  const xValues = Array.from({ length: xMax - xMin + 1 }, (_, i) => i + xMin);
  return (
    <ResponsiveAreaBump
      data={data}
      margin={{ top: 50, right: 100, bottom: 50, left: 100 }}
      spacing={8}
      colors={{ scheme: 'nivo' }}
      blendMode="multiply"
      align="end"
      axisTop={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: xValues,
        legend: title,
        legendPosition: 'middle',
        legendOffset: -36,
      }}
      tooltip={({ serie }) => (
        <div className="chat chat-start">
          <div className="chat-bubble">
            <PokemonIcon speciesId={serie.id} />
            <span className="whitespace-nowrap" style={{ color: serie.color }}>
              {t(getPokemonTranslationKey(serie.id, 'species'))}
            </span>
          </div>
        </div>
      )}
      endLabel={({ id }) => t(getPokemonTranslationKey(id, 'species'))}
    />
  );
};

export default function InsightsPage({ statsRawData, format }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation(['common']);

  const filteredGroupedData = useMemo<ResponsiveBumpProps['data']>(() => {
    // Filter the species array
    const flattenedData = statsRawData.flatMap(({ yearWeek, species }) =>
      species.map((s) => ({
        yearWeek,
        species: s,
      }))
    );
    // Group by yearWeek and rank each species
    const groupedData = Object.entries(
      flattenedData.reduce((acc, { yearWeek, species }) => {
        if (!acc[yearWeek]) {
          acc[yearWeek] = [];
        }
        acc[yearWeek]!.push(species);
        return acc;
      }, {} as Record<number, string[]>)
    ).map(([yearWeek, species]) => ({
      yearWeek: Number(yearWeek),
      species: Object.entries(
        // Count the number of occurrences of each species
        species.reduce((acc, s) => {
          if (!acc[s]) {
            acc[s] = 0;
          }
          acc[s] += 1;
          return acc;
        }, {} as Record<string, number>)
      )
        // Sort by number of occurrences then pick the top 10
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20),
    }));
    // Convert the grouped data into the format that nivo wants
    const species2ywNum = new Map<ResponsiveBumpProps['data'][number]['id'], ResponsiveBumpProps['data'][number]['data']>();
    groupedData.forEach(({ yearWeek, species }) => {
      species.forEach(([s, n]) => {
        if (!species2ywNum.has(s)) {
          species2ywNum.set(s, []);
        }
        species2ywNum.get(s)!.push({
          x: yearWeek,
          y: n,
        });
      });
    });
    return Array.from(species2ywNum.entries()).map(([id, data]) => ({
      id,
      data,
    }));
  }, []);
  return (
    <Main title={`${t('common.routes.vgc_pastes.title')} ${t('common.insights')} - ${format}`}>
      <div className="flex h-[668px] flex-col gap-4">
        <MyResponsiveBump data={filteredGroupedData} title={`${format} 📈`} />
      </div>
    </Main>
  );
}

const vgcFormats = [
  'gen9vgc2023series1',
  // 'gen8spikemuthcup', 'gen8battlestadiumdoublesseries13', 'gen8vgc2022'
];

export const getStaticProps: GetStaticProps<
  {
    statsRawData: {
      species: string[];
      yearWeek: number;
    }[];
    format: string;
  } & SSRConfig,
  { format: string }
> = async ({ params, locale }) => {
  const format = params?.format ?? AppConfig.defaultFormat;
  const statsRawData = await prisma.pokepaste
    .findMany({
      select: {
        jsonPaste: true,
        createdAt: true,
      },
      where: {
        format,
        isOfficial: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
    .then((r) =>
      r.map(({ jsonPaste, createdAt, ...rest }) => ({
        ...rest,
        species: (jsonPaste as { species: string }[]).map((s) => s.species),
        yearWeek: convertYearWeekToNumber(getISOWeekNumber(createdAt)),
      }))
    );

  return {
    props: {
      statsRawData,
      format,
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['common', 'species'])),
    },
    revalidate: 60 * 60, // 1 hour
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const paths =
    context.locales?.flatMap((locale) =>
      vgcFormats.map((format) => ({
        params: { format },
        locale,
      }))
    ) ?? vgcFormats.map((format) => ({ params: { format } }));

  return {
    paths,
    fallback: 'blocking',
  };
};
