import type { replay } from '@prisma/client';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import ReplaysTable from '@/components/replays/ReplaysTable';
import SpeciesMultiSelect from '@/components/replays/SpeciesMultiSelect';
import { FormatInputGroupSelector, formatOptionElements } from '@/components/select/FormatSelector';
import FormatManager from '@/models/FormatManager';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { listReplays } from '@/utils/Prisma';
import type { Format } from '@/utils/Types';

const replayFormats: Format[] = new FormatManager().vgcFormats.filter((f) => f.gen === 9);

const ReplaySearchCard = ({ format, speciesOptions }: { format: string; speciesOptions: string[] }) => {
  const { push } = useRouter();
  const { t } = useTranslation(['common', 'species']);

  return (
    <div className="dropdown">
      <label tabIndex={0} className="btn-primary btn-sm btn m-1" role="button" aria-label="Search">
        🔍{t('common.search')} ({replayFormats.find((f) => f.id === format)?.name ?? format})
      </label>
      <div tabIndex={0} className="card dropdown-content card-compact bg-base-100 p-2  shadow">
        <div className="card-body">
          <h3 className="card-title">{t('common.search')}</h3>
          <FormatInputGroupSelector defaultFormat={format} onChange={(e) => push(`/replays/${e.target.value}`)} options={formatOptionElements(replayFormats)} />
          <SpeciesMultiSelect
            species={speciesOptions}
            onChange={(options) => {
              push(`/replays/${format}?species=${(options as { value: string }[]).map((e) => e.value).join(',')}`);
            }}
          />
        </div>
      </div>
    </div>
  );
};

const Replays = ({ format, replays }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { query } = useRouter();
  const { t } = useTranslation(['common', 'species']);
  const speciesFilter = query.species && typeof query.species === 'string' ? query.species.split(',') : [];
  const filteredReplays =
    speciesFilter.length === 0
      ? replays
      : [
          ...replays.filter((e) => speciesFilter.every((f) => e.p1team.includes(f))),
          ...replays.filter((e) => speciesFilter.every((f) => e.p2team.includes(f))),
        ].filter((e, i, a) => a.findIndex((f) => f.id === e.id) === i);
  const uniqueSpecies = Array.from(new Set(filteredReplays.flatMap((e) => [...e.p1team, ...e.p2team])));

  return (
    <Main title={t('common.routes.replay.title')} description={t('common.routes.replay.description')}>
      <ReplaySearchCard format={format} speciesOptions={uniqueSpecies} />
      <ReplaysTable replays={filteredReplays} />
    </Main>
  );
};

export const getStaticProps: GetStaticProps<{ replays: replay[]; format: string } & SSRConfig, { format: string }> = async ({ params, locale }) => {
  const format = params?.format ?? AppConfig.defaultFormat;
  const replays = await listReplays({
    format,
  });

  return {
    props: {
      replays: JSON.parse(JSON.stringify(replays)),
      format,
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['common', 'species'])),
    },
    revalidate: 60 * 60 * 24, // 1 day
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const paths =
    context.locales?.flatMap((locale) =>
      replayFormats.map((format) => ({
        params: { format: format.id },
        locale,
      }))
    ) ?? replayFormats.map((format) => ({ params: { format: format.id } }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export default Replays;
