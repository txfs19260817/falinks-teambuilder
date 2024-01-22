import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Main } from '@/components/layout/Main';
import { getMDDocBySlug, markdownToHtml } from '@/utils/Markdown';

// eslint-disable-next-line no-use-before-define
const About = ({ content }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(['common']);
  return (
    <Main title={t('common.routes.about.title')} description={t('common.routes.about.description')}>
      <article className="prose p-4 lg:prose-xl" dangerouslySetInnerHTML={{ __html: content }}></article>
    </Main>
  );
};

export const getStaticProps: GetStaticProps<{ content: string } & SSRConfig> = async ({ locale }) => {
  const post = getMDDocBySlug('About', 'about', locale);
  const content = await markdownToHtml(post.content);
  return {
    props: {
      content,
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};

export default About;
