// import the original type declarations
import 'i18next';

// import all namespaces (for the default language, only)
import common from 'public/locales/en/common.json';
import create from 'public/locales/en/create.json';
import home from 'public/locales/en/home.json';
import search from 'public/locales/en/search.json';
import table from 'public/locales/en/table.json';

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: 'common';
    // custom resources type
    resources: {
      common: typeof common;
      home: typeof home;
      create: typeof create;
      search: typeof search;
      table: typeof table;
    };
    // other
    returnNull: false;
  }
}
