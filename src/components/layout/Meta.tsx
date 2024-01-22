import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import { AppConfig } from '@/utils/AppConfig';

type IMetaProps = {
  title: string;
  description: string;
};

const Meta = ({ title, description }: IMetaProps) => {
  const { basePath } = useRouter();
  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
      </Head>
      <NextSeo
        title={title}
        titleTemplate={`%s | ${AppConfig.site_name}`}
        defaultTitle={AppConfig.site_name}
        themeColor={AppConfig.themeColor}
        description={description}
        canonical={AppConfig.canonical}
        languageAlternates={AppConfig.locales.map((locale) => ({
          hrefLang: locale,
          href: `${AppConfig.canonical}${locale === AppConfig.defaultLocale ? '' : `/${locale}`}`,
        }))}
        openGraph={{
          title,
          description,
          url: AppConfig.canonical,
          images: [
            {
              url: `${basePath}/assets/images/hero.jpg`,
              width: 1200,
              height: 628,
              alt: title,
            },
            {
              url: `${basePath}/icons/apple-touch-icon.png`,
              width: 180,
              height: 180,
              alt: title,
            },
          ],
          site_name: AppConfig.site_name,
        }}
        twitter={{
          handle: '@dora_865',
          cardType: 'summary_large_image',
        }}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: `${basePath}/icons/favicon.ico`,
          },
          {
            rel: 'apple-touch-icon',
            href: `${basePath}/icons/apple-touch-icon.png`,
            sizes: '180x180',
          },
          {
            rel: 'mask-icon',
            href: `${basePath}/icons/safari-pinned-tab.svg`,
            color: AppConfig.themeColor,
          },
          {
            rel: 'icon',
            href: `${basePath}/icons/favicon-32x32.png`,
            sizes: '32x32',
          },
          {
            rel: 'icon',
            href: `${basePath}/icons/favicon-16x16.png`,
            sizes: '16x16',
          },
          {
            rel: 'icon',
            href: `${basePath}/icons/android-chrome-192x192.png`,
            sizes: '192x192',
          },
          {
            rel: 'icon',
            href: `${basePath}/icons/android-chrome-384x384.png`,
            sizes: '384x384',
          },
          {
            rel: 'icon',
            href: `${basePath}/icons/android-chrome-512x512.png`,
            sizes: '512x512',
          },
        ]}
      />
    </>
  );
};

export { Meta };
