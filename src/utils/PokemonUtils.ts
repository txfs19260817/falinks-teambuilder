import type { Ability, Move, MoveCategory, Nature, Specie, TypeEffectiveness, TypeName } from '@pkmn/data';
import { DisplayUsageStatistics, LegacyDisplayUsageStatistics } from '@pkmn/smogon';
import type { StatID, StatsTable, StatusName } from '@pkmn/types';
import { MovesetStatistics, Statistics, UsageStatistics } from 'smogon';

import DexSingleton from '@/models/DexSingleton';
import { AppConfig } from '@/utils/AppConfig';
import { convertObjectNumberValuesToFraction, filterSortLimitObjectByValues, getRandomElement, urlPattern } from '@/utils/Helpers';
import type { Spreads, Usage, ValueWithEmojiOption } from '@/utils/Types';

export const stats: StatID[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

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

export const maxEVStats: StatsTable = {
  hp: maxSingleEvs,
  atk: maxSingleEvs,
  def: maxSingleEvs,
  spa: maxSingleEvs,
  spd: maxSingleEvs,
  spe: maxSingleEvs,
};

export const defaultIvs: StatsTable = {
  hp: 31,
  atk: 31,
  def: 31,
  spa: 31,
  spd: 31,
  spe: 31,
};

export const typesWithEmoji: ValueWithEmojiOption<TypeName>[] = [
  { value: 'Bug', emoji: '🐞' },
  { value: 'Dark', emoji: '🌙' },
  { value: 'Dragon', emoji: '🐲' },
  { value: 'Electric', emoji: '⚡' },
  { value: 'Fairy', emoji: '✨' },
  { value: 'Fighting', emoji: '🥊' },
  { value: 'Fire', emoji: '🔥' },
  { value: 'Flying', emoji: '🌪️' },
  { value: 'Ghost', emoji: '👻' },
  { value: 'Grass', emoji: '🌿' },
  { value: 'Ground', emoji: '🗿' },
  { value: 'Ice', emoji: '❄️' },
  { value: 'Normal', emoji: '⚪' },
  { value: 'Poison', emoji: '☠️' },
  { value: 'Psychic', emoji: '🧠' },
  { value: 'Rock', emoji: '⛰️' },
  { value: 'Steel', emoji: '🛡️' },
  { value: 'Water', emoji: '💧' },
  { value: '???', emoji: '❓' },
];

export const moveCategoriesWithEmoji: ValueWithEmojiOption<MoveCategory>[] = [
  { value: 'Physical', emoji: '💥' },
  { value: 'Special', emoji: '🔮' },
  { value: 'Status', emoji: '⚪' },
];

export type BoostLevel = 6 | 5 | 4 | 3 | 2 | 1 | 0 | -1 | -2 | -3 | -4 | -5 | -6;

export type BoostTable = {
  [key in Exclude<StatID, 'hp'>]: BoostLevel;
};

export const boostLevels: BoostLevel[] = [6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6];

export const defaultBoosts: BoostTable = {
  atk: 0,
  def: 0,
  spa: 0,
  spd: 0,
  spe: 0,
};

export const StatusMap = new Map<string, StatusName | ''>([
  ['Healthy', ''],
  ['Burn', 'brn'],
  ['Freeze', 'frz'],
  ['Paralysis', 'par'],
  ['Poison', 'psn'],
  ['Badly Poisoned', 'tox'],
  ['Sleep', 'slp'],
]);

export const statusMapValueToName = (value: StatusName | '') => {
  return Array.from(StatusMap.entries()).find(([, v]) => value === v)![0];
};

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
    label: 'fps',
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
    label: 'fss',
    nature: 'Timid',
    evs: {
      hp: 4,
      atk: 0,
      def: 0,
      spa: 252,
      spd: 0,
      spe: 252,
    },
  },
  {
    label: 'bps',
    nature: 'Adamant',
    evs: {
      hp: 252,
      atk: 252,
      def: 0,
      spa: 0,
      spd: 4,
      spe: 0,
    },
  },
  {
    label: 'bss',
    nature: 'Modest',
    evs: {
      hp: 252,
      atk: 0,
      def: 0,
      spa: 252,
      spd: 4,
      spe: 0,
    },
  },
  {
    label: 'sd',
    nature: 'Calm',
    evs: {
      hp: 252,
      atk: 0,
      def: 4,
      spa: 0,
      spd: 252,
      spe: 0,
    },
  },
];

/**
 * Returns the stats for the given base stats, evs, ivs, nature, and level.
 * @param stat - The stat to calculate. Must be one of 'hp', 'atk', 'def', 'spa', 'spd', or 'spe'.
 * @param base - The base stat of the Pokémon.
 * @param ev - The EVs of the Pokémon. Must be between 0 and 252.
 * @param iv - The IVs of the Pokémon. Must be between 0 and 31.
 * @param nature - The nature of the Pokémon. E.g. 'Adamant', 'Brave'.
 * @param level - The level of the Pokémon. Must be between 1 and 100. Defaults to 50.
 */
export const getStats = (stat: string, base: number, ev: number, iv: number, nature: Nature | undefined, level: number = 50): number => {
  return stat === 'hp'
    ? Math.floor((Math.floor(2 * base + iv + Math.floor(ev / 4) + 100) * level) / 100 + 10)
    : Math.floor(((Math.floor(2 * base + iv + Math.floor(ev / 4)) * level) / 100 + 5) * (nature?.plus === stat ? 1.1 : nature?.minus === stat ? 0.9 : 1));
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
export const getLatestUsageByFormat: (format?: string) => Promise<UsageStatistics | null> = async (format: string = AppConfig.defaultFormat) => {
  const { url, latestDate, process } = Statistics;
  const latest = await latestDate(format, true);
  const year = new Date().getFullYear();
  const month = new Date().getMonth(); // 0-11
  const date = latest?.date ?? (month !== 0 ? `${year}-${`${month}`.padStart(2, '0')}` : `${year - 1}-12`);
  try {
    return process(await fetch(url(date, format)).then((r) => r.text()));
  } catch (e) {
    return null;
  }
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
export const postProcessUsage = async (format: string = AppConfig.defaultFormat): Promise<Usage[]> => {
  const usage = await getLatestUsageByFormat(format);
  return !usage
    ? []
    : Object.entries(usage.data)
        .map(([name, obj]) => ({ name, ...obj }))
        .sort((a, b) => b.usage - a.usage)
        .map((u, i) => trimUsage(u, i));
};

const getWikiHost = (locale: string) => {
  switch (locale.toLowerCase()) {
    case 'de':
      return 'https://www.pokewiki.de/';
    case 'fr':
      return 'https://www.pokepedia.fr/';
    case 'es':
      return 'https://www.wikidex.net/wiki/';
    case 'ja':
      return 'https://wiki.xn--rckteqa2e.com/wiki/';
    case 'zh-hans':
      return 'https://wiki.52poke.com/zh-hans/';
    case 'zh-hant':
      return 'https://wiki.52poke.com/zh-hant/';
    default:
      return 'https://bulbapedia.bulbagarden.net/wiki/';
  }
};

/**
 * Generates a Wiki link for the given name of Pokémon, item, ability, move, or nature.
 * @param keyword: The name of the Pokémon, item, ability, move, or nature.
 * @param locale: The locale of the Wiki link. Defaults to `AppConfig.locale`.
 */
export const wikiLink = (keyword: string, locale?: string) => {
  const host = getWikiHost(locale ?? AppConfig.defaultLocale);
  const lowerCaseKeyword = keyword.toLowerCase();
  if (hyphenNameToWikiName.has(lowerCaseKeyword)) {
    return `${host}${hyphenNameToWikiName.get(lowerCaseKeyword)}`;
  }
  return `${host}${keyword
    .split(/[-:]/)
    .at(0)!
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join('_')}`;
};

/**
 * Retrieves ability for the given Pokémon.
 * @param speciesName
 */
export const getAbilitiesBySpecie = (speciesName?: string): Ability[] => {
  const gen = DexSingleton.getGen();
  const abilitiesMap = gen.species.get(speciesName ?? '')?.abilities;
  // return all abilities as the default behavior
  return abilitiesMap
    ? (Object.values(abilitiesMap)
        .map((a: string) => gen.abilities.get(a))
        .filter((a) => a != null) as Ability[])
    : Array.from(gen.abilities);
};

/**
 * Retrieves learnable moves for the given Pokémon.
 * @param speciesName
 * @param isBaseSpecies
 */
export const getMovesBySpecie = (speciesName?: string, isBaseSpecies: boolean = false): Promise<Move[]> => {
  const gen = DexSingleton.getGen();
  const species = gen.species.get(speciesName ?? '');
  // return all moves as the default behavior
  if (!species) {
    return Promise.resolve(isBaseSpecies ? [] : Array.from(gen.moves));
  }

  // read learnset by species
  return gen.learnsets.get(speciesName || '').then(async (l) => {
    const res = Object.entries(l?.learnset ?? [])
      .filter((e) => e[1].some((s) => s.startsWith(`${AppConfig.defaultGen}`)))
      .flatMap((e) => gen.moves.get(e[0]) ?? []);

    // if the species is a forme, add the base species' moves
    const baseSpecies = gen.species.get(speciesName || '')?.baseSpecies ?? '';
    if (baseSpecies !== speciesName && baseSpecies !== '') {
      const baseSpeciesMoves = await getMovesBySpecie(baseSpecies, true);
      res.push(...baseSpeciesMoves);
    }

    // get egg moves from its basic species
    if (species.prevo) {
      let basicSpecies: Specie | undefined = species;
      while (basicSpecies && basicSpecies.prevo) {
        basicSpecies = gen.species.get(basicSpecies.prevo);
      }
      const eggMoves =
        basicSpecies != null
          ? await gen.learnsets.get(basicSpecies.name).then((le) =>
              Object.entries(le?.learnset ?? [])
                .filter((e) => e[1].some((s) => s.startsWith(`${AppConfig.defaultGen}E`)))
                .flatMap((e) => gen.moves.get(e[0]) ?? [])
            )
          : [];
      res.push(...eggMoves);
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

export const isValidPokePasteURL = (url?: string): boolean => typeof url === 'string' && urlPattern.test(url) && url.includes('pokepast.es');

export const abilityToEffectiveness = (
  abilityName: string | undefined
): {
  typeName: TypeName;
  rate: TypeEffectiveness;
}[] => {
  switch (abilityName) {
    case 'Sap Sipper':
      return [{ typeName: 'Grass', rate: 0 }];
    case 'Levitate':
      return [{ typeName: 'Ground', rate: 0 }];
    case 'Water Bubble':
      return [{ typeName: 'Fire', rate: 0.5 }];
    case 'Fluffy':
      return [{ typeName: 'Fire', rate: 2 }]; // it should be contact moves, but we don't have that information
    case 'Volt Absorb':
    case 'Motor Drive':
    case 'Lightning Rod':
      return [{ typeName: 'Electric', rate: 0 }];
    case 'Storm Drain':
    case 'Water Absorb':
      return [{ typeName: 'Water', rate: 0 }];
    case 'Dry Skin':
      return [
        { typeName: 'Water', rate: 0 },
        { typeName: 'Fire', rate: 2 }, // it should be 1.25, but we don't have a way to represent that
      ];
    case 'Flash Fire':
      return [{ typeName: 'Fire', rate: 0 }];
    case 'Heatproof':
      return [{ typeName: 'Fire', rate: 0.5 }];
    case 'Thick Fat':
      return [
        { typeName: 'Fire', rate: 0.5 },
        { typeName: 'Ice', rate: 0.5 },
      ];
    default:
      return [];
  }
};

export const moveToEffectiveness = (
  move: Move
): {
  typeName: TypeName;
  rate: TypeEffectiveness;
}[] => {
  if (move.name === 'Freeze-Dry') {
    return [{ typeName: 'Water', rate: 2 }];
  }
  if (move.name === 'Flying Press') {
    return [
      { typeName: 'Normal', rate: 2 },
      { typeName: 'Fighting', rate: 2 },
      { typeName: 'Flying', rate: 0.5 },
      { typeName: 'Poison', rate: 0.5 },
      { typeName: 'Ground', rate: 1 },
      { typeName: 'Rock', rate: 1 },
      { typeName: 'Bug', rate: 1 },
      { typeName: 'Ghost', rate: 0 },
      { typeName: 'Steel', rate: 1 },
      { typeName: 'Fire', rate: 1 },
      { typeName: 'Water', rate: 1 },
      { typeName: 'Grass', rate: 2 },
      { typeName: 'Electric', rate: 0.5 },
      { typeName: 'Psychic', rate: 0.5 },
      { typeName: 'Ice', rate: 2 },
      { typeName: 'Dragon', rate: 1 },
      { typeName: 'Dark', rate: 2 },
      { typeName: 'Fairy', rate: 0.5 },
    ];
  }
  return [];
};

/**
 * Change the type of a move only if certain conditions are met.
 * @param move
 * @param abilityName
 * @param itemName
 * @param teraTypeName
 */
export const changeMoveType = (move: Move, abilityName: string | undefined, itemName: string | undefined, teraTypeName: TypeName | undefined): Move => {
  if (move.name === 'Tera Blast' && teraTypeName) return { ...move, type: teraTypeName };
  if (abilityName === 'Normalize') return { ...move, type: 'Normal' };
  if (abilityName === 'Pixilate' && move.type === 'Normal') return { ...move, type: 'Fairy' };
  if (abilityName === 'Refrigerate' && move.type === 'Normal') return { ...move, type: 'Ice' };
  if (abilityName === 'Aerilate' && move.type === 'Normal') return { ...move, type: 'Flying' };
  if (abilityName === 'Galvanize' && move.type === 'Normal') return { ...move, type: 'Electric' };
  if (abilityName === 'Liquid Voice' && move.flags.sound === 1) return { ...move, type: 'Water' };
  if (move.name === 'Multi-Attack' || move.name === 'Judgment') {
    switch (itemName) {
      case 'Grassium Z':
      case 'Meadow Plate':
        return { ...move, type: 'Grass' };
      case 'Firium Z':
      case 'Flame Plate':
        return { ...move, type: 'Fire' };
      case 'Waterium Z':
      case 'Splash Plate':
        return { ...move, type: 'Water' };
      case 'Buginium Z':
      case 'Insect Plate':
        return { ...move, type: 'Bug' };
      case 'Rockium Z':
      case 'Stone Plate':
        return { ...move, type: 'Rock' };
      case 'Ghostium Z':
      case 'Spooky Plate':
        return { ...move, type: 'Ghost' };
      case 'Darkinium Z':
      case 'Dread Plate':
        return { ...move, type: 'Dark' };
      case 'Steelium Z':
      case 'Iron Plate':
        return { ...move, type: 'Steel' };
      case 'Electrium Z':
      case 'Zap Plate':
        return { ...move, type: 'Electric' };
      case 'Psychium Z':
      case 'Mind Plate':
        return { ...move, type: 'Psychic' };
      case 'Groundium Z':
      case 'Earth Plate':
        return { ...move, type: 'Ground' };
      case 'Dragonium Z':
      case 'Sky Plate':
        return { ...move, type: 'Dragon' };
      case 'Fairium Z':
      case 'Pixie Plate':
        return { ...move, type: 'Fairy' };
      case 'Icium Z':
      case 'Icicle Plate':
        return { ...move, type: 'Ice' };
      case 'Poisonium Z':
      case 'Toxic Plate':
        return { ...move, type: 'Poison' };
      case 'Fightingium Z':
      case 'Fist Plate':
        return { ...move, type: 'Fighting' };
      default:
        return move;
    }
  }
  return move;
};

export const getPokemonTranslationKey = (word: string, category: 'species' | 'moves' | 'abilities' | 'items' | 'natures' | 'types' | string): string => {
  const gen = DexSingleton.getGen();
  switch (category) {
    case 'species': {
      const dexNum = gen.species.get(word)?.num;
      if (dexNum) return `species.${dexNum}`;
      break;
    }
    case 'moves': {
      const moveId = gen.moves.get(word)?.id;
      if (moveId) return `moves.${moveId}`;
      break;
    }
    case 'abilities': {
      const abilityId = gen.abilities.get(word)?.id;
      if (abilityId) return `abilities.${abilityId}`;
      break;
    }
    case 'items': {
      const itemId = gen.items.get(word)?.id;
      if (itemId) return `items.${itemId}`;
      break;
    }
    case 'natures': {
      const natureId = gen.natures.get(word)?.id;
      if (natureId) return `natures.${natureId}`;
      break;
    }
    case 'types': {
      const typeId = gen.types.get(word)?.id;
      if (typeId) return `types.${typeId}`;
      break;
    }
    default:
      return word;
  }
  return word;
};
