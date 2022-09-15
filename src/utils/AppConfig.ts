const routes = [
  {
    name: 'Home',
    path: '/',
    target: '_self',
  },
  {
    name: 'Pastes',
    path: '/pastes',
    target: '_self',
  },
  {
    name: 'About',
    path: '/about',
    target: '_self',
  },
  {
    name: 'GitHub',
    path: 'https://github.com/txfs19260817/falinks-teambuilder',
    target: '_blank',
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

export const AppConfig = {
  site_name: 'Falinks Teambuilder',
  title: 'Falinks Teambuilder',
  description: 'Falinks Teambuilder is a collaborative Pokémon team building platform.',
  locale: 'en',
  maxPokemonPerTeam: 6,
  defaultGen: 8,
  usageAPI: `https://www.pikalytics.com/api/l/2022-${`${new Date().getMonth()}`.padStart(2, '0')}/ss-1500`,
  dbName: 'falinks',
  collectionName: {
    vgcPastes: 'vgc_pastes',
    userPastes: 'user_pastes',
  },
  popularItems: [
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
  ],
  usefulLinks,
  routes,
};

export const animalNames = [
  'alligator',
  'anteater',
  'armadillo',
  'auroch',
  'axolotl',
  'badger',
  'bat',
  'bear',
  'beaver',
  'blobfish',
  'buffalo',
  'camel',
  'chameleon',
  'cheetah',
  'chipmunk',
  'chinchilla',
  'chupacabra',
  'cormorant',
  'coyote',
  'crow',
  'dingo',
  'dinosaur',
  'dog',
  'dolphin',
  'dragon',
  'duck',
  'dumbo octopus',
  'elephant',
  'ferret',
  'fox',
  'frog',
  'giraffe',
  'goose',
  'gopher',
  'grizzly',
  'hamster',
  'hedgehog',
  'hippo',
  'hyena',
  'jackal',
  'jackalope',
  'ibex',
  'ifrit',
  'iguana',
  'kangaroo',
  'kiwi',
  'koala',
  'kraken',
  'lemur',
  'leopard',
  'liger',
  'lion',
  'llama',
  'manatee',
  'mink',
  'monkey',
  'moose',
  'narwhal',
  'nyan cat',
  'orangutan',
  'otter',
  'panda',
  'penguin',
  'platypus',
  'python',
  'pumpkin',
  'quagga',
  'quokka',
  'rabbit',
  'raccoon',
  'rhino',
  'sheep',
  'shrew',
  'skunk',
  'slow loris',
  'squirrel',
  'tiger',
  'turtle',
  'unicorn',
  'walrus',
  'wolf',
  'wolverine',
  'wombat',
];

export const trainerNames = [
  'Acerola',
  'Agatha',
  'Alder',
  'Allister',
  'Archie',
  'Ash',
  'Barry',
  'Bea',
  'Bede',
  'Bertha',
  'Bianca',
  'Blaine',
  'Blue',
  'Brawly',
  'Brendan',
  'Brock',
  'Bruno',
  'Brycen',
  'Bugsy',
  'Burgh',
  'Caitlin',
  'Calem',
  'Candice',
  'Cheren',
  'Cheryl',
  'Clair',
  'Clay',
  'Clemont',
  'Courtney',
  'Crasher Wake',
  'Cynthia',
  'Cyrus',
  'Darach',
  'Dawn',
  'Diantha',
  'Drake',
  'Elesa',
  'Elio',
  'Emmet',
  'Erika',
  'Ethan',
  'Evelyn',
  'Falkner',
  'Fantina',
  'Flannery',
  'Flint',
  'Gardenia',
  'Ghetsis',
  'Giovanni',
  'Glacia',
  'Gladion',
  'Gloria',
  'Grant',
  'Grimsley',
  'Guzma',
  'Hala',
  'Hapu',
  'Hau',
  'Hilbert',
  'Hilda',
  'Hop',
  'Ingo',
  'Iris',
  'James',
  'Janine',
  'Jasmine',
  'Jessie',
  'Kahili',
  'Karen',
  'Kiawe',
  'Koga',
  'Korrina',
  'Kris',
  'Lana',
  'Lance',
  'Leaf',
  'Lear',
  'Leon',
  'Lillie',
  'Lisia',
  'Liza',
  'Looker',
  'Lorelei',
  'Lt. Surge',
  'Lucas',
  'Lucian',
  'Lucy',
  'Lusamine',
  'Lyra',
  'Lysandre',
  'Mallow',
  'Marley',
  'Marlon',
  'Marnie',
  'Marshal',
  'Maxie',
  'May',
  'Maylene',
  'Mina',
  'Misty',
  'Molayne',
  'Morty',
  'N',
  'Nanu',
  'Naomi',
  'Nate',
  'Nessa',
  'Nita',
  'Noland',
  'Norman',
  'Olivia',
  'Phoebe',
  'Piers',
  'Plumeria',
  'Professor Kukui',
  'Professor Oak',
  'Professor Sycamore',
  'Pryce',
  'Rachel',
  'Raihan',
  'Ramos',
  'Red',
  'Roark',
  'Rosa',
  'Roxanne',
  'Roxie',
  'Sabrina',
  'Sawyer',
  'Selene',
  'Serena',
  'Shauntal',
  'Sidney',
  'Siebold',
  'Silver',
  'Skyla',
  'Sonia',
  'Sophocles',
  'Steven',
  'Tate',
  'The Masked Royal',
  'Thorton',
  'Valerie',
  'Viola',
  'Volkner',
  'Wallace',
  'Wally',
  'Whitney',
  'Wikstrom',
  'Will',
  'Winona',
  'Wulfric',
  'Zinnia',
];
