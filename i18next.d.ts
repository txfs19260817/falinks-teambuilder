// import the original type declarations
import 'i18next';

import abilities from 'public/locales/en/abilities.json';
import ability_descriptions from 'public/locales/en/ability_descriptions.json';
import categories from 'public/locales/en/categories.json';
import common from 'public/locales/en/common.json';
import create from 'public/locales/en/create.json';
import formes from 'public/locales/en/formes.json';
import home from 'public/locales/en/home.json';
import item_descriptions from 'public/locales/en/item_descriptions.json';
import items from 'public/locales/en/items.json';
import move_descriptions from 'public/locales/en/move_descriptions.json';
import moves from 'public/locales/en/moves.json';
import natures from 'public/locales/en/natures.json';
import paste from 'public/locales/en/paste.json';
import search from 'public/locales/en/search.json';
import species from 'public/locales/en/species.json';
import tools from 'public/locales/en/tools.json';
import types from 'public/locales/en/types.json';

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: 'common';
    nsSeparator: '.';
    // custom resources type
    resources: {
      common: typeof common;
      home: typeof home;
      create: typeof create;
      search: typeof search;
      paste: typeof paste;
      tools: typeof tools;
      // pokemon terms
      abilities: typeof abilities;
      ability_descriptions: typeof ability_descriptions;
      items: typeof items;
      item_descriptions: typeof item_descriptions;
      moves: typeof moves;
      move_descriptions: typeof move_descriptions;
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
