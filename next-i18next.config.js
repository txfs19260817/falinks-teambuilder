const path = require('path');

const nextI18nConfig = {
  i18n: {
    locales: ['en', 'zh-Hans'],
    defaultLocale: 'en',
    defaultNS: 'common',
    nsSeparator: '.',
    localePath: path.resolve('./public/locales'),
    localeDetection: false
  }
};

module.exports = nextI18nConfig;
