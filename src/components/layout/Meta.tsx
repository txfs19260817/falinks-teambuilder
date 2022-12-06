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
  const { basePath, locale } = useRouter();

  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
        <meta name="application-name" content={AppConfig.site_name} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={AppConfig.site_name} />
        <meta name="description" content={AppConfig.description} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content={AppConfig.themeColor} />
        <meta name="google-site-verification" content="4zAL7ELcuwsgjP3ZQGRztOrVwu0fBFaa7eVohcc2J2Y" />
        <link rel="icon" href={`${basePath}/favicon.ico`} key="favicon" />
        <link rel="icon" type="image/png" sizes="16x16" href={`${basePath}/favicon-16x16.png`} key="icon16" />
        <link rel="icon" type="image/png" sizes="32x32" href={`${basePath}/favicon-32x32.png`} key="icon32" />
        <link rel="apple-touch-icon" href={`${basePath}/apple-touch-icon.png`} key="apple" />
        <link rel="shortcut icon" href={`${basePath}/favicon.ico`} key="favicon" />
        <link rel="mask-icon" href={`${basePath}/safari-pinned-tab.svg`} color="#5bbad5" />
        <link rel="manifest" href={`${basePath}/manifest.json`} />
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
          locale: locale || AppConfig.defaultLocale,
          images: [
            {
              url: `${AppConfig.canonical}/assets/images/hero.jpg`,
              width: 1200,
              height: 628,
              alt: AppConfig.site_name,
            },
            {
              url: `${basePath}/apple-touch-icon.png`,
              width: 180,
              height: 180,
              alt: AppConfig.site_name,
            },
          ],
          site_name: AppConfig.site_name,
        }}
        twitter={{
          handle: '@dora_865',
          cardType: 'summary_large_image',
        }}
      />
    </>
  );
};

export { Meta };
