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
      {
        id: 'search_paste',
        name: 'Search',
        path: '/pastes/search',
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
    id: 'gen9dex',
    name: 'Gen 9 Dex',
    path: '/gen9dex',
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
  loadInShowdown: 'load-in-showdown-btn',
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
    name: '📟 DamageCalc',
    url: 'https://www.pikalytics.com/calc',
  },
];

// the first element serves as the default format
// NOTE: change the rewrite rule in `next.config.js` if the default format is changed
const formats = ['gen9doublesou', 'gen9ou', 'gen8spikemuthcup', 'gen8battlestadiumdoublesseries13', 'gen8vgc2022', 'gen8ou', 'gen8bdspou'];

export const AppConfig = {
  site_name: 'Falinks Teambuilder',
  title: 'Falinks Teambuilder',
  description: 'Falinks Teambuilder is a collaborative Pokémon team building application.',
  canonical: 'https://www.falinks-teambuilder.com',
  defaultLocale: 'en',
  locales: ['en', 'zh-Hans'],
  themeColor: '#f9da55',
  maxPokemonPerTeam: 6,
  defaultGen: 9,
  defaultFormat: formats[0]!,
  themes: tailwindConfig.daisyui.themes as string[],
  dbName: 'falinks',
  collectionName: {
    vgcPastes: 'vgc_pastes',
    publicPastes: 'public_pastes',
    privatePastes: 'private_pastes',
  },
  toolboxIDs,
  formats,
  dialogProps,
  usefulLinks,
  routes,
};

export const roomTourSteps = [
  {
    selector: '[role="tablist"]',
    content: 'Hi! Welcome to Falinks Teambuilder. If you start a new team from scratch, please try to click the "+" button to add a Pokémon.',
  },
  {
    selector: `#${toolboxIDs.shareLink}`,
    content: 'Sharing this room with friends allows you to collaborate on the same team at the same time.',
  },
  {
    selector: `#${toolboxIDs.importModal}-btn`,
    content: 'PokePaste and Showdown teams are both importable here.',
  },
  {
    selector: `#${toolboxIDs.loadInShowdown}`,
    content: 'Once you are done, you can load the team into Showdown, but it needs the helper userscript to work. See About page for more details.',
  },
  {
    selector: `#${toolboxIDs.postModal}-btn`,
    content: "If you'd like to share your team with the world, you may do so by exporting it to PokePaste or publishing it on our Pastes page.",
  },
  {
    selector: `#${toolboxIDs.notesModal}-btn`,
    content: 'Comparable to a scaled-down version of Google Docs, this is a collaborative note-taking tool. Using it, you may take notes on your team.',
  },
  {
    selector: `#${toolboxIDs.historyModal}-btn`,
    content: "If you want to look into your team's past, go here.",
  },
];
