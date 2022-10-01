import { Generation, Move } from '@pkmn/data';
import { Nature } from '@pkmn/dex-types';
import { Icons } from '@pkmn/img';
import { DisplayUsageStatistics, LegacyDisplayUsageStatistics } from '@pkmn/smogon';
import { StatsTable } from '@pkmn/types';
import { MovesetStatistics, Statistics, UsageStatistics } from 'smogon';

import { AppConfig } from '@/utils/AppConfig';
import { convertObjectNumberValuesToFraction, filterSortLimitObjectByValues, getRandomElement } from '@/utils/Helpers';
import type { Usage } from '@/utils/Types';
import { Spreads } from '@/utils/Types';

const maxTotalEvs = 508;

const maxSingleEvs = 252;

export const defaultStats: StatsTable = {
  hp: 0,
  atk: 0,
  def: 0,
  spa: 0,
  spd: 0,
  spe: 0,
};

export const defaultIvs: StatsTable = {
  hp: 31,
  atk: 31,
  def: 31,
  spa: 31,
  spd: 31,
  spe: 31,
};

export const typesWithEmoji = [
  { type: 'Bug', emoji: '🐞' },
  { type: '???', emoji: '❓' },
  { type: 'Dark', emoji: '🌙' },
  { type: 'Dragon', emoji: '🐲' },
  { type: 'Electric', emoji: '⚡' },
  { type: 'Fairy', emoji: '✨' },
  { type: 'Fighting', emoji: '🥊' },
  { type: 'Fire', emoji: '🔥' },
  { type: 'Flying', emoji: '🌪️' },
  { type: 'Ghost', emoji: '👻' },
  { type: 'Grass', emoji: '🌿' },
  { type: 'Ground', emoji: '🗿' },
  { type: 'Ice', emoji: '❄️' },
  { type: 'Normal', emoji: '⚪' },
  { type: 'Poison', emoji: '☠️' },
  { type: 'Psychic', emoji: '🧠' },
  { type: 'Rock', emoji: '⛰️' },
  { type: 'Steel', emoji: '🛡️' },
  { type: 'Water', emoji: '💧' },
];

const hyphenNameToWikiName = new Map<string, string>([
  ['mr-rime', 'Mr. Rime'],
  ['mime-jr', 'Mime Jr.'],
  ['tapu-koko', 'Tapu Koko'],
  ['tapu-lele', 'Tapu Lele'],
  ['tapu-bulu', 'Tapu Bulu'],
  ['tapu-fini', 'Tapu Fini'],
  ['type-null', 'Type: Null'],
  ['ho-oh', 'Ho-Oh'],
  ['porygon-z', 'Porygon-Z'],
  ['jangmo-o', 'Jangmo-o'],
  ['hakamo-o', 'Hakamo-o'],
  ['kommo-o', 'Kommo-o'],
  ['will-o-wisp', 'Will-O-Wisp'],
]);

export const defaultSuggestedSpreads: Spreads[] = [
  {
    label: 'Fast Physical Sweeper: 4 HP / 252 Atk / 252 Spe / (+Spe, -SpA)',
    nature: 'Jolly',
    evs: {
      hp: 4,
      atk: 252,
      def: 0,
      spa: 0,
      spd: 0,
      spe: 252,
    },
  },
  {
    nature: 'Timid',
    evs: {
      hp: 4,
      atk: 0,
      def: 0,
      spa: 252,
      spd: 0,
      spe: 252,
    },
    label: 'Fast Special Sweeper: 4 HP / 252 SpA / 252 Spe / (+SpA, -Atk)',
  },
  {
    nature: 'Modest',
    evs: {
      hp: 252,
      atk: 252,
      def: 0,
      spa: 0,
      spd: 4,
      spe: 0,
    },
    label: 'Bulky Physical Sweeper: 252 HP / 252 Atk / 4 SpD / (+Atk, -SpA)',
  },
  {
    nature: 'Modest',
    evs: {
      hp: 252,
      atk: 0,
      def: 0,
      spa: 252,
      spd: 4,
      spe: 0,
    },
    label: 'Bulky Special Sweeper: 252 HP / 252 SpA / 4 SpD / (+SpA, -Atk)',
  },
  {
    nature: 'Calm',
    evs: {
      hp: 252,
      atk: 0,
      def: 4,
      spa: 0,
      spd: 252,
      spe: 0,
    },
    label: 'Specially Defensive: 252 HP / 4 Def / 252 SpD / (+SpD, -Atk)',
  },
];

/**
 * Returns the icon for the given Pokémon.
 * @param {number} pokeNum - The No. of the Pokémon. Only required if fetching from local (fromPS = false).
 * @param {string} pokeName - The name of the Pokémon. Only required if fetching from Pokémon Showdown site (fromPS = true).
 * @param {boolean} fromPS - Fetch icons from the Pokémon Showdown site if true, otherwise from this site.
 */
export const getPokemonIcon = (pokeNum?: number, pokeName?: string, fromPS?: boolean): Record<string, string> => {
  if (fromPS && pokeName) {
    return Icons.getPokemon(pokeName).css;
  }
  let num = pokeNum ?? 0;
  if (num < 0 || num > 898) num = 0;

  const top = -Math.floor(num / 12) * 30;
  const left = -(num % 12) * 40;

  const url = `/assets/sprites/pokemonicons-sheet.png`;
  return {
    display: 'inline-block',
    width: '40px',
    height: '30px',
    imageRendering: 'pixelated',
    background: `transparent url(${url}) no-repeat scroll ${left}px ${top}px`,
  };
};

/**
 * Returns the stats for the given base stats, evs, ivs, nature, and level.
 * @param stat - The stat to calculate. Must be one of 'hp', 'atk', 'def', 'spa', 'spd', or 'spe'.
 * @param base - The base stat of the Pokémon.
 * @param ev - The EVs of the Pokémon. Must be between 0 and 252.
 * @param iv - The IVs of the Pokémon. Must be between 0 and 31.
 * @param nature - The nature of the Pokémon. E.g. 'Adamant', 'Brave'.
 * @param level - The level of the Pokémon. Must be between 1 and 100. Defaults to 50.
 */
export const getStats = (stat: string, base: number, ev: number, iv: number, nature: Nature, level: number = 50): number => {
  return stat === 'hp'
    ? Math.floor((Math.floor(2 * base + iv + Math.floor(ev / 4) + 100) * level) / 100 + 10)
    : Math.floor(((Math.floor(2 * base + iv + Math.floor(ev / 4)) * level) / 100 + 5) * (nature.plus === stat ? 1.1 : nature.minus === stat ? 0.9 : 1));
};

/**
 * Calculates the upper bound of EVs that can be put into a stat.
 * @param evs - The current EVs of the Pokémon.
 * @param oldEv - The old EV of the stat which is being changed.
 */
export const getSingleEvUpperLimit = (evs: StatsTable, oldEv: number): number => {
  // 252 or left over EVs
  return Math.min(maxTotalEvs - Object.values(evs).reduce((x, y) => x + y, 0) + oldEv, maxSingleEvs);
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

/**
 * Randomly generates a Pokémon trainer name.
 */
export const getRandomTrainerName = () => getRandomElement(trainerNames) || 'Trainer';

/**
 * Get the raw usage statistics from the Smogon API for the given format
 * @param format - The format to get usage statistics for. Defaults to `AppConfig.defaultFormat`.
 */
export const getLatestUsageByFormat: (format?: string) => Promise<UsageStatistics> = async (format: string = AppConfig.defaultFormat) => {
  const { url, latestDate, process } = Statistics;
  const latest = await latestDate(format, true);
  const year = new Date().getFullYear();
  const month = new Date().getMonth(); // 0-11
  const date = latest?.date ?? (month === 0 ? `${year}-${`${month}`.padStart(2, '0')}` : `${year - 1}-12`);
  return process(await fetch(url(date, format)).then((r) => r.text()));
};

/**
 * Filters, sorts, and limits the Abilities, Items, Spreads, Teammates and Moves of each Pokémon's usage statistics.
 * @param oldUsage - The usage statistics to filter, sort, and limit of each Pokémon.
 * @param rank - The rank of the Pokémon in the usage statistics.
 * @param threshold - The minimum usage percentage of Abilities, Items, Spreads, Teammates of the Pokémon to be included in the filtered usage statistics.
 * @param comparator - The comparator function to sort the filtered usage statistics.
 * @param limit - The maximum number of Abilities, Items, Spreads, Teammates of the Pokémon to be included in the filtered usage statistics.
 */
export const trimUsage = (
  oldUsage: MovesetStatistics & { name: string },
  rank: number,
  threshold: number = 0.01,
  comparator: (a: number, b: number) => number = (a, b) => b - a,
  limit: number = 15
): Usage => {
  const { Abilities, Items, Spreads: freqSpreads, Teammates, Moves } = oldUsage;
  const newAbilities = filterSortLimitObjectByValues(convertObjectNumberValuesToFraction(Abilities), (_) => true, comparator, limit);
  const newItems = filterSortLimitObjectByValues(convertObjectNumberValuesToFraction(Items), (_) => true, comparator, limit);
  const newSpreads = filterSortLimitObjectByValues(convertObjectNumberValuesToFraction(freqSpreads), (v) => v >= threshold, comparator, limit);
  const newTeammates = filterSortLimitObjectByValues(convertObjectNumberValuesToFraction(Teammates), (v) => v >= threshold, comparator, limit);
  const newMoves = filterSortLimitObjectByValues(
    convertObjectNumberValuesToFraction(Moves),
    (v) => v > threshold * 0.1,
    (a, b) => b - a,
    limit
  );
  delete newItems.nothing;
  delete newMoves['']; // remove the empty move
  return {
    ...oldUsage,
    rank,
    Abilities: newAbilities,
    Items: newItems,
    Moves: newMoves,
    Spreads: newSpreads,
    Teammates: newTeammates,
  };
};

/**
 * Convert the raw usage statistics to a more usable format
 * @param format - The format to get usage statistics for. Defaults to `AppConfig.defaultFormat`.
 */
export const postProcessUsage = (format: string = AppConfig.defaultFormat): Promise<Usage[]> => {
  return getLatestUsageByFormat(format).then((r) =>
    Object.entries(r.data)
      .map(([name, obj]) => ({ name, ...obj }))
      .sort((a, b) => b.usage - a.usage)
      .map((u, i) => trimUsage(u, i))
  );
};

/**
 * Generates a Wiki link for the given name of Pokémon, item, ability, move, or nature.
 * @param keyword
 */
export const wikiLink = (keyword: string) => {
  const lowerCaseKeyword = keyword.toLowerCase();
  if (hyphenNameToWikiName.has(lowerCaseKeyword)) {
    return `https://bulbapedia.bulbagarden.net/wiki/${hyphenNameToWikiName.get(lowerCaseKeyword)}`;
  }
  return `https://bulbapedia.bulbagarden.net/wiki/${keyword
    .split(/[-:]/)
    .at(0)!
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join('_')}`;
};

/**
 * Retrieves learnable moves for the given Pokémon in the latest generation.
 * @param gen
 * @param speciesName
 */
export const getMovesBySpecie = (gen: Generation, speciesName?: string): Promise<Move[]> => {
  return gen.learnsets.get(speciesName || '').then(async (l) => {
    const res = Object.entries(l?.learnset ?? []).flatMap((e) => gen.moves.get(e[0]) ?? []);
    const baseSpecies = gen.species.get(speciesName || '')?.baseSpecies ?? '';
    if (baseSpecies !== speciesName && baseSpecies !== '') {
      const baseSpeciesMoves = await getMovesBySpecie(gen, baseSpecies);
      res.push(...baseSpeciesMoves);
    }
    return res;
  });
};

/**
 * Processes the fetched usage statistics into a some options for the user to choose from.
 * @param d - The fetched usage statistics.
 */
export const getSuggestedSpreadsBySpecie = (d: DisplayUsageStatistics & LegacyDisplayUsageStatistics): Spreads[] =>
  Object.keys(
    filterSortLimitObjectByValues(
      d.stats ?? d.spreads ?? {}, // its either in the stats (DisplayUsageStatistics) or spreads (LegacyDisplayUsageStatistics) field
      (v) => v > 0.001, // only show spreads with a usage of 0.1% or higher
      (a, b) => b - a, // sort by usage descending
      5 // only show the top 5 spreads
    )
  ).map(
    (s) =>
      ({
        label: s, // the label is the spread itself
        nature: s.split(':')[0], // the nature is the first part of the spread
        evs: Object.fromEntries(
          // parse the string like "Adamant:252/0/0/0/4/252" into an StatsTable like {hp: 0, atk: 252, def: 0, spa: 0, spd: 4, spe: 252}
          s
            .split(':')[1]!
            .split('/')
            .map((e: string, i: number) =>
              i === 0 ? ['hp', +e] : i === 1 ? ['atk', +e] : i === 2 ? ['def', +e] : i === 3 ? ['spa', +e] : i === 4 ? ['spd', +e] : ['spe', +e]
            )
        ),
      } as Spreads)
  );
