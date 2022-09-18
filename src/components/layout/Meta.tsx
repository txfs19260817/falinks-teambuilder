import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import { AppConfig } from '@/utils/AppConfig';

type IMetaProps = {
  title: string;
  description: string;
  canonical?: string;
};

const Meta = (props: IMetaProps) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta name="viewport" content="width=device-width,initial-scale=1" key="viewport" />
        <link rel="apple-touch-icon" href={`${router.basePath}/apple-touch-icon.png`} key="apple" />
        <link rel="icon" type="image/png" sizes="32x32" href={`${router.basePath}/favicon-32x32.png`} key="icon32" />
        <link rel="icon" type="image/png" sizes="16x16" href={`${router.basePath}/favicon-16x16.png`} key="icon16" />
        <link rel="icon" href={`${router.basePath}/favicon.ico`} key="favicon" />
        <title>{props.title}</title>
      </Head>
      <NextSeo
        title={props.title}
        description={props.description}
        canonical={AppConfig.canonical}
        openGraph={{
          title: props.title,
          description: props.description,
          url: props.canonical,
          locale: AppConfig.locale,
          images: [
            {
              url: `${AppConfig.canonical}/assets/images/hero.jpg`,
              width: 1200,
              height: 628,
              alt: props.title,
            },
          ],
          site_name: AppConfig.site_name,
        }}
        twitter={{
          handle: '@dora_865',
          site: '@FalinksT',
          cardType: 'summary_large_image',
        }}
      />
    </>
  );
};

export { Meta };
