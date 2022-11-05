import '../styles/global.css';

import { Analytics } from '@vercel/analytics/react';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import NextNProgress from 'nextjs-progressbar';

import { AppConfig } from '@/utils/AppConfig';

// @ts-ignore
import nextI18NextConfig from '../../next-i18next.config.js'; // eslint-disable-line import/extensions

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <NextNProgress color={AppConfig.themeColor} />
    <Component {...pageProps} />
    <Analytics />
  </>
);

export default appWithTranslation(MyApp, nextI18NextConfig);
