// @ts-ignore
// eslint-disable-next-line import/extensions
import tailwindConfig from '../../tailwind.config.js';

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

export const AppConfig = {
  site_name: 'Falinks Teambuilder',
  title: 'Falinks Teambuilder',
  description: 'Falinks Teambuilder is a collaborative Pokémon team building application.',
  canonical: 'https://www.falinks-teambuilder.com',
  locales: ['de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'zh-Hans', 'zh-Hant'],
  defaultLocale: 'en',
  themeColor: '#f9da55',
  maxPokemonPerTeam: 6,
  defaultGen: 9,
  themes: tailwindConfig.daisyui.themes as string[],
  toolboxIDs,
  dialogProps,
};
