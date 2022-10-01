// @ts-ignore
// eslint-disable-next-line import/extensions
import tailwindConfig from '../../tailwind.config.js';

type Route = {
  id: string;
  path: string;
  name: string;
  target: string;
  children?: Route[];
};

const routes: Route[] = [
  {
    id: 'home',
    name: 'Home',
    path: '/',
    target: '_self',
  },
  {
    id: 'paste',
    name: 'Pastes',
    path: '',
    target: '',
    children: [
      {
        id: 'user_paste',
        name: 'User Paste',
        path: '/pastes/public',
        target: '_self',
      },
      {
        id: 'vgc_paste',
        name: 'VGC Paste',
        path: '/pastes/vgc',
        target: '_self',
      },
      {
        id: 'create_paste',
        name: 'Create',
        path: '/pastes/create',
        target: '_self',
      },
    ],
  },
  {
    id: 'usage',
    name: 'Usage',
    path: '/usages',
    target: '_self',
  },
  {
    id: 'about',
    name: 'About',
    path: '/about',
    target: '_self',
  },
  {
    id: 'github',
    name: 'GitHub',
    path: 'https://github.com/txfs19260817/falinks-teambuilder',
    target: '_blank',
  },
];

const toolboxIDs: Record<string, string> = {
  shareLink: 'share-link-btn',
  notesModal: 'notes-modal',
  importModal: 'import-ps-modal',
  postModal: 'post-pokepaste-modal',
  historyModal: 'history-modal',
};

const dialogProps = [
  {
    id: toolboxIDs.importModal,
    emoji: '📥',
    text: 'Import',
    title: 'Import a team from Showdown paste or PokePaste link',
  },
  {
    id: toolboxIDs.postModal,
    emoji: '✈️',
    text: 'Export / Post',
    title: 'Post your team to PokePaste or this site',
  },
  {
    id: toolboxIDs.notesModal,
    emoji: '📝',
    text: 'Notes',
    title: 'Add notes to your team with a rich-text editor',
  },
  {
    id: toolboxIDs.historyModal,
    emoji: '📜',
    text: 'Edit History',
    title: 'View previous changes on this team',
  },
];

const usefulLinks = [
  {
    name: '🕹️ Showdown',
    url: 'https://play.pokemonshowdown.com/',
  },
  {
    name: '📟 DamageCalc',
    url: 'https://www.pikalytics.com/calc',
  },
  {
    name: '📈 Pikalytics',
    url: 'https://www.pikalytics.com/',
  },
];

const popularItems = [
  'Aguav Berry',
  'Assault Vest',
  'Choice Band',
  'Choice Scarf',
  'Choice Specs',
  'Eviolite',
  'Expert Belt',
  'Figy Berry',
  'Focus Sash',
  'Iapapa Berry',
  'Leftovers',
  'Life Orb',
  'Mago Berry',
  'Mental Herb',
  'Power Herb',
  'Rocky Helmet',
  'Shuca Berry',
  'Sitrus Berry',
  'Weakness Policy',
  'Wiki Berry',
];

const usageFormats = ['gen8vgc2022', 'gen8ou', 'gen8bdspou'];

export const AppConfig = {
  site_name: 'Falinks Teambuilder',
  title: 'Falinks Teambuilder',
  description: 'Falinks Teambuilder is a collaborative Pokémon team building application.',
  canonical: 'https://www.falinks-teambuilder.com',
  defaultLocale: 'en',
  locales: ['en', 'zh-Hans'],
  themeColor: '#f9da55',
  maxPokemonPerTeam: 6,
  defaultGen: 8,
  defaultFormat: 'gen8vgc2022',
  usageAPI: `https://www.pikalytics.com/api/l/2022-${`${new Date().getMonth()}`.padStart(2, '0')}/ss-1500`,
  themes: tailwindConfig.daisyui.themes as string[],
  dbName: 'falinks',
  collectionName: {
    vgcPastes: 'vgc_pastes',
    publicPastes: 'public_pastes',
    privatePastes: 'private_pastes',
  },
  toolboxIDs,
  usageFormats,
  popularItems,
  dialogProps,
  usefulLinks,
  routes,
};

export const trainerNames = [
  'Acerola',
  'Alder',
  'Allister',
  'Archie',
  'Ash',
  'Barry',
  'Bea',
  'Bede',
  'Bianca',
  'Blaine',
  'Blue',
  'Brendan',
  'Brock',
  'Bruno',
  'Caitlin',
  'Candice',
  'Cheren',
  'Cheryl',
  'Courtney',
  'Cynthia',
  'Cyrus',
  'Dawn',
  'Diantha',
  'Elesa',
  'Elio',
  'Emmet',
  'Erika',
  'Ethan',
  'Flannery',
  'Gardenia',
  'Ghetsis',
  'Giovanni',
  'Gladion',
  'Gloria',
  'Grimsley',
  'Guzma',
  'Hala',
  'Hau',
  'Hilbert',
  'Hilda',
  'Hop',
  'Ingo',
  'Iris',
  'James',
  'Jasmine',
  'Jessie',
  'Korrina',
  'Lana',
  'Lance',
  'Leaf',
  'Leon',
  'Lillie',
  'Lisia',
  'Looker',
  'Lorelei',
  'Lt. Surge',
  'Lucas',
  'Lusamine',
  'Lyra',
  'Lysandre',
  'Marley',
  'Marnie',
  'Maxie',
  'May',
  'Maylene',
  'Mina',
  'Misty',
  'Molayne',
  'Morty',
  'N',
  'Naomi',
  'Nate',
  'Nessa',
  'Norman',
  'Olivia',
  'Phoebe',
  'Piers',
  'Plumeria',
  'Professor Oak',
  'Professor Sycamore',
  'Raihan',
  'Red',
  'Roark',
  'Rosa',
  'Roxanne',
  'Roxie',
  'Sabrina',
  'Selene',
  'Serena',
  'Silver',
  'Skyla',
  'Sonia',
  'Steven',
  'Thorton',
  'Viola',
  'Volkner',
  'Wallace',
  'Wally',
  'Whitney',
  'Zinnia',
];

export const roomSteps = [
  {
    selector: '[role="tablist"]',
    content: 'Hi! Welcome to Falinks Teambuilder. If you start a new team, try to click the "+" button to add a Pokémon.',
  },
  {
    selector: `#${toolboxIDs.shareLink}`,
    content: 'You can share this room with your friends by clicking this button to work on the same team together.',
  },
  {
    selector: `#${toolboxIDs.importModal}-btn`,
    content: 'You can import a team from PokePaste or a Showdown importable here.',
  },
  {
    selector: `#${toolboxIDs.postModal}-btn`,
    content: 'You can also export or publish your team to PokePaste or our Pastes section here.',
  },
  {
    selector: `#${toolboxIDs.notesModal}-btn`,
    content: 'This is a collaborative note-taking tool, just like a mini Google Docs. You can use it to take notes on your team.',
  },
  {
    selector: `#${toolboxIDs.historyModal}-btn`,
    content: 'Click this button to view the history of your team, in case you want to undo some changes.',
  },
];
