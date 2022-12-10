// import the original type declarations
import 'i18next';

import abilities from 'public/locales/en/abilities.json';
import ability_descriptions from 'public/locales/en/ability_descriptions.json';
import categories from 'public/locales/en/categories.json';
import common from 'public/locales/en/common.json';
import create from 'public/locales/en/create.json';
import formes from 'public/locales/en/formes.json';
import home from 'public/locales/en/home.json';
import items from 'public/locales/en/items.json';
import moves from 'public/locales/en/moves.json';
import natures from 'public/locales/en/natures.json';
import search from 'public/locales/en/search.json';
import species from 'public/locales/en/species.json';
import types from 'public/locales/en/types.json';

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
      // pokemon terms
      abilities: typeof abilities;
      ability_descriptions: typeof ability_descriptions;
      items: typeof items;
      moves: typeof moves;
      natures: typeof natures;
      species: typeof species;
      types: typeof types;
      categories: typeof categories;
      formes: typeof formes;
    };
    // other
    returnNull: false;
  }
}
