/**
 * @type {import('next').NextConfig}
 */
const nextI18nConfig = {
  i18n: {
    locales: ['en', 'zh-Hans'],
    defaultLocale: 'en',
    localeDetection: false
  }
};

module.exports = nextI18nConfig;
