const routes = [
  {
    name: 'Home',
    path: '/',
    target: '_self',
  },
  {
    name: 'About',
    path: '/about',
    target: '_self',
  },
  {
    name: 'Pastes',
    path: '/pastes',
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
  usageAPI: 'https://www.pikalytics.com/api/l/2022-06/ss-1500',
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
