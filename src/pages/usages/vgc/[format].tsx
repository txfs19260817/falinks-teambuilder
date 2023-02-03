import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { UsageLayout } from '@/components/usages/UsageLayout';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import type { Usage } from '@/utils/Types';

const format2gist: Record<string, string> = {
  gen9vgc2023series1: 'https://gist.githubusercontent.com/txfs19260817/9e3311a3253e0fb46fcc2459bab6c65d/raw/gen9vgc2023series1.json',
  gen9vgc2023series2: 'https://gist.githubusercontent.com/txfs19260817/67ca12acee3728da83c8ce6419e2d1b2/raw/gen9vgc2023series2.json',
};

const UsagePage = ({ usages, format }: { usages: Usage[]; format: string }) => {
  const { t } = useTranslation(['common']);

  return (
    <Main title={t('common.routes.vgc_usage.title')} description={t('common.routes.vgc_usage.description')}>
      <UsageLayout usages={usages} format={format} formatOptions={Object.keys(format2gist)} />
    </Main>
  );
};

function Page(data: InferGetStaticPropsType<typeof getStaticProps>) {
  return <UsagePage {...data} />;
}

export const getStaticProps: GetStaticProps<{ usages: Usage[]; format: string } & SSRConfig, { format: string }> = async ({ params, locale }) => {
  const format = params?.format ?? '';
  const gistUrl = format2gist[format];
  if (!gistUrl) {
    return { notFound: true };
  }
  const usages = (await fetch(gistUrl).then((r) => r.json())) as Usage[];
  const N = 100;

  return {
    props: {
      // pick the top N entries
      usages: usages.slice(0, N),
      format,
      ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['usages', 'common', 'items', 'moves', 'species', 'abilities', 'natures', 'types'])),
    },
    revalidate: 86400, // 1 day
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
