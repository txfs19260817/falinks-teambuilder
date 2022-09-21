import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Main } from '@/templates/Main';
import { getMDDocBySlug, markdownToHtml } from '@/utils/Markdown';

const About = ({ content }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Main title="About">
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
