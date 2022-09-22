import '../styles/global.css';

import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import NextNProgress from 'nextjs-progressbar';

import { AppConfig } from '@/utils/AppConfig';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <NextNProgress color={AppConfig.themeColor} />
    <Component {...pageProps} />
  </>
);

export default appWithTranslation(MyApp);
