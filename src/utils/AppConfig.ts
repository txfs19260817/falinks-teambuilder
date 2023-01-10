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
        id: 'public_pastes',
        name: 'User Shared',
        path: '/pastes/public',
        target: '_self',
      },
      {
        id: 'vgc_pastes',
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
    id: 'replay',
    name: 'Replays',
    path: '/replays',
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
  loadInShowdown: 'load-in-showdown-btn',
  notesModal: 'notes-modal',
  importModal: 'import-ps-modal',
  postModal: 'post-pokepaste-modal',
  historyModal: 'history-modal',
  undoButton: 'undo-btn',
  redoButton: 'redo-btn',
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

// the first element serves as the default format
// NOTE: change the rewrite rule in `next.config.js` if the default format is changed
const formats = ['gen9vgc2023series1', 'gen9vgc2023series2', 'gen9battlestadiumsinglesseries1', 'gen9doublesou', 'gen9ou', 'gen8spikemuthcup', 'gen8vgc2022'];

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
  routes,
};
