import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { UsageLayout } from '@/components/usages/UsageLayout';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { postProcessUsage } from '@/utils/PokemonUtils';
import type { Usage } from '@/utils/Types';

const UsagePage = ({ usages, format }: { usages: Usage[]; format: string }) => {
  const { t } = useTranslation(['common']);

  return (
    <Main title={t('common.routes.smogon_usage.title')} description={t('common.routes.smogon_usage.description')}>
      <UsageLayout usages={usages} format={format} />
    </Main>
  );
};

function Page(data: InferGetStaticPropsType<typeof getStaticProps>) {
  return <UsagePage {...data} />;
}

export const getStaticProps: GetStaticProps<{ usages: Usage[]; format: string } & SSRConfig, { format: string }> = async ({ params, locale }) => {
  const format = params?.format ?? AppConfig.defaultFormat;
  const usages = await postProcessUsage(format);
  // delete TeraTypes attribute for each usage as Smogon doesn't give it
  usages.forEach((u) => {
    delete u.TeraTypes;
  });
  const N = 100;

  return {
    props: {
      // pick the top N entries
      usages: usages.slice(0, N),
      format,
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['usages', 'common', 'items', 'moves', 'species', 'abilities', 'natures', 'types'])),
    },
    revalidate: 604800, // 1 week
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const paths =
    context.locales?.flatMap((locale) =>
      AppConfig.formats.map((format) => ({
        params: { format },
        locale,
      }))
    ) ?? AppConfig.formats.map((format) => ({ params: { format } }));

  return {
    paths,
    fallback: true,
  };
};

export default Page;
