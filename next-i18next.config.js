const path = require('path');

const nextI18nConfig = {
  i18n: {
    locales: ['en', 'zh-Hans', 'zh-Hant', 'de', 'es', 'fr', 'it', 'ja', 'ko'],
    defaultLocale: 'en',
    defaultNS: 'common',
    nsSeparator: '.',
    localePath: path.resolve('./public/locales'),
    localeDetection: false
  }
};

module.exports = nextI18nConfig;
