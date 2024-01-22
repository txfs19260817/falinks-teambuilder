import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Main } from '@/components/layout/Main';
import UsageLayout from '@/components/usages/UsageLayout';
import { AppConfig } from '@/utils/AppConfig';
import type { Usage } from '@/utils/Types';

const format2gist: Record<string, string> = {
  gen9vgc2023series1: 'https://gist.githubusercontent.com/txfs19260817/9e3311a3253e0fb46fcc2459bab6c65d/raw/gen9vgc2023series1.json',
  gen9vgc2023series2: 'https://gist.githubusercontent.com/txfs19260817/67ca12acee3728da83c8ce6419e2d1b2/raw/gen9vgc2023series2.json',
  gen9vgc2023regulationc: 'https://gist.githubusercontent.com/txfs19260817/f952b9a9012cb1b375772a106b40b26f/raw/gen9vgc2023regulationc.json',
  gen9vgc2023regulationd: 'https://gist.githubusercontent.com/txfs19260817/d19939b8c6ec893559c2a3251276dbc6/raw/gen9vgc2023regulationd.json',
  gen9vgc2023regulatione: 'https://gist.githubusercontent.com/txfs19260817/f8c0acae8e7f88b8dc7b5ecce68a8c7e/raw/gen9vgc2023regulatione.json',
  gen9vgc2023regf: 'https://gist.githubusercontent.com/txfs19260817/d4f1e76b20ff9fe4d72c8cb3e52b3ade/raw/gen9vgc2023regf.json',
};

// eslint-disable-next-line no-use-before-define
function Page({ usages, format }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation(['common']);

  return (
    <Main title={`${t('common.routes.vgc_usage.title')}-${format}`} description={t('common.routes.vgc_usage.description')}>
      <UsageLayout usages={usages} formatId={format} formatIdOptions={Object.keys(format2gist)} />
    </Main>
  );
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
  const formats = Object.keys(format2gist);
  const paths =
    context.locales?.flatMap((locale) =>
      formats.map((format) => ({
        params: { format },
        locale,
      })),
    ) ?? formats.map((format) => ({ params: { format } }));

  return {
    paths,
    fallback: true,
  };
};

export default Page;
