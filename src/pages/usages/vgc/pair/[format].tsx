import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { FormatSelector } from '@/components/select/FormatSelector';
import PairUsageTable from '@/components/usages/PairUsageTable';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { calcPairUsage } from '@/utils/PokemonUtils';
import { listPastes } from '@/utils/Prisma';
import type { PairUsage } from '@/utils/Types';

const formats = AppConfig.formats.filter((f) => f.includes('vgc'));

function PairPage({ pairUsages, format }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation(['common', 'usages', 'species']);
  const { push } = useRouter();
  return (
    <Main title={`${t('common.routes.vgc_usage_pair.title')}-${format}`} description={t('common.routes.vgc_usage_pair.description')}>
      <div className="grid grid-cols-1 gap-4 overflow-x-scroll p-4">
        <h1 className="text-2xl font-bold">
          [{format}] VGCPastes {t('usages.pairUsage')}
        </h1>
        <FormatSelector defaultFormat={format} formats={formats} handleChange={(e) => push(`/usages/vgc/pair/${e.target.value}`)} />
        <PairUsageTable pairUsages={pairUsages} minimumCount={10} />
      </div>
    </Main>
  );
}

export const getStaticProps: GetStaticProps<{ pairUsages: PairUsage[]; format: string } & SSRConfig, { format: string }> = async ({ params, locale }) => {
  const format = params?.format ?? '';
  if (!format) {
    return { notFound: true };
  }
  const pairUsages = await listPastes({
    format,
    isOfficial: true,
    isPublic: true,
  })
    .then((r) => r.map((p) => p.species))
    .then(calcPairUsage);

  return {
    props: {
      pairUsages,
      format,
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['usages', 'common', 'species'])),
    },
    revalidate: 86400, // 1 day
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const paths =
    context.locales?.flatMap((locale) =>
      formats.map((format) => ({
        params: { format },
        locale,
      }))
    ) ?? formats.map((format) => ({ params: { format } }));

  return {
    paths,
    fallback: true,
  };
};

export default PairPage;
