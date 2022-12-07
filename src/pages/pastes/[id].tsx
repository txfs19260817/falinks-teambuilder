import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SWRConfig } from 'swr';

import PasteLayout from '@/components/pastes/PasteLayout';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';
import { getPaste, listPastes } from '@/utils/Prisma';

export default function Page({ fallback, id, title }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <SWRConfig value={{ fallback }}>
      <Main title={`Paste - ${title}`} description={`Paste - ${title}`}>
        <PasteLayout id={id} />
      </Main>
    </SWRConfig>
  );
}

export const getStaticProps: GetStaticProps<{ id: string; title: string; fallback: { [p: string]: any } } & SSRConfig, { id: string }> = async ({
  params,
  locale,
}) => {
  if (!params) {
    return {
      notFound: true,
    };
  }
  const { id } = params;
  const data = await getPaste(id);

  return data
    ? {
        props: {
          id,
          title: data.title,
          fallback: {
            [id]: JSON.parse(JSON.stringify(data)),
          },
          ...(await serverSideTranslations(locale ?? AppConfig.defaultLocale, ['common', 'moves', 'types', 'species', 'categories'])),
        },
      }
    : {
        notFound: true,
      };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const ids = await listPastes(undefined, undefined, undefined, true).then((pastes) => (pastes as { id: string }[]).map(({ id }) => id));

  const paths =
    context.locales?.flatMap((locale) =>
      ids.map((id) => ({
        params: { id },
        locale,
      }))
    ) ?? ids.map((id) => ({ params: { id } }));

  return {
    paths,
    fallback: 'blocking',
  };
};
