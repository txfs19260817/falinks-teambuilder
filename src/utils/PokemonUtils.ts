import type { Move, MoveCategory, Nature, Specie, TypeEffectiveness, TypeName } from '@pkmn/data';
import { Team } from '@pkmn/sets';
import { DisplayUsageStatistics, LegacyDisplayUsageStatistics } from '@pkmn/smogon';
import type { StatID, StatsTable, StatusName } from '@pkmn/types';
import { MovesetStatistics, Statistics, UsageStatistics } from 'smogon';

import DexSingleton from '@/models/DexSingleton';
import FormatManager from '@/models/FormatManager';
import { AppConfig } from '@/utils/AppConfig';
import { convertObjectNumberValuesToFraction, filterSortLimitObjectByValues, getRandomElement, urlPattern } from '@/utils/Helpers';
import type { PairUsage, Spreads, Usage, ValueWithEmojiOption } from '@/utils/Types';

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
  { value: 'Stellar', emoji: '🔯' },
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
 * Returns the remaining EVs that can be distributed to the given EVs.
 * @param evs: The EVs of the Pokémon.
 * @returns The remaining EV points.
 */
export const getLeftEVs = (evs: StatsTable): number => {
  return maxTotalEvs - Object.values(evs).reduce((total, ev) => total + ev, 0);
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
 * @param format - The format to get usage statistics for. Defaults to `FormatManager.defaultFormatId`.
 */
export const getLatestUsageByFormat: (format?: string) => Promise<UsageStatistics | null> = async (format: string = FormatManager.defaultFormatId) => {
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
 * @param rank - The rank of the Pokémon in the usage statistics needs to be passed in.
 * @param threshold - The minimum usage percentage of Abilities, Items, Spreads, Teammates of the Pokémon to be included in the filtered usage statistics.
 * @param comparator - The comparator function to sort the filtered usage statistics.
 * @param limit - The maximum number of Abilities, Items, Spreads, Teammates of the Pokémon to be included in the filtered usage statistics.
 */
export const trimUsage = (
  oldUsage: (MovesetStatistics & { name: string }) | Usage,
  rank: number,
  threshold: number = 0.01,
  comparator: (a: number, b: number) => number = (a, b) => b - a,
  limit: number = 15,
): Usage => {
  const { Abilities, Items, Spreads: freqSpreads, Teammates, Moves } = oldUsage;
  const newAbilities = filterSortLimitObjectByValues(convertObjectNumberValuesToFraction(Abilities), () => true, comparator, limit);
  const newItems = filterSortLimitObjectByValues(convertObjectNumberValuesToFraction(Items), () => true, comparator, limit);
  const newSpreads = filterSortLimitObjectByValues(convertObjectNumberValuesToFraction(freqSpreads), (v) => v >= threshold, comparator, limit);
  const newTeammates = filterSortLimitObjectByValues(convertObjectNumberValuesToFraction(Teammates), (v) => v >= threshold, comparator, limit);
  const newMoves = filterSortLimitObjectByValues(
    convertObjectNumberValuesToFraction(Moves),
    (v) => v > threshold * 0.1,
    (a, b) => b - a,
    limit,
  );
  delete newItems.nothing;
  delete newMoves['']; // remove the empty move
  // Drop all tera types that equal 0
  const isUsage = (u: typeof oldUsage): u is Usage => 'TeraTypes' in u;
  const newTeraTypes = isUsage(oldUsage) && oldUsage.TeraTypes ? Object.fromEntries(Object.entries(oldUsage.TeraTypes).filter(([, v]) => v > 0)) : undefined;
  return {
    ...oldUsage,
    rank,
    Abilities: newAbilities,
    Items: newItems,
    Moves: newMoves,
    Spreads: newSpreads,
    Teammates: newTeammates,
    TeraTypes: newTeraTypes,
  };
};

/**
 * 4x the move usage percentage
 * @param usage - An usage object statistics to convert.
 */
export const movesUsage4x = (usage: Usage): Usage => {
  const { Moves } = usage;
  return {
    ...usage,
    Moves: Object.fromEntries(Object.entries(Moves).map(([k, v]) => [k, (v ?? 0) * 4])),
  };
};

/**
 * Convert the raw usage statistics to a more usable format
 * @param format - The format to get usage statistics for. Defaults to `FormatManager.defaultFormatId`.
 */
export const postProcessUsage = async (format: string = FormatManager.defaultFormatId): Promise<Usage[]> => {
  const usageStats = await getLatestUsageByFormat(format);
  return !usageStats
    ? []
    : Object.entries(usageStats.data)
        .map(([name, obj]) => ({ name, ...obj }))
        .sort((a, b) => b.usage - a.usage)
        .map((u, i) => trimUsage(u, i))
        .map(movesUsage4x);
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
 * Retrieves learnable moves for the given Pokémon.
 * @param speciesName
 * @param isBaseSpecies
 * @param format
 */
export const getMovesBySpecie = (speciesName?: string, isBaseSpecies: boolean = false, format: string = FormatManager.defaultFormatId): Promise<Move[]> => {
  const gen = DexSingleton.getGenByFormat(format);
  const species = gen.species.get(speciesName ?? '');
  // return all moves as the default behavior
  if (!species) {
    return Promise.resolve(isBaseSpecies ? [] : Array.from(gen.moves));
  }

  // read learnset by species
  return gen.learnsets.get(speciesName || '').then(async (l) => {
    const res = Object.entries(l?.learnset ?? [])
      .filter((e) => e[1].some((s) => s.startsWith(`${gen.num}`)))
      .flatMap((e) => gen.moves.get(e[0]) ?? []);

    // if the species is a forme, add the base species' moves
    const baseSpecies = gen.species.get(speciesName || '')?.baseSpecies ?? '';
    if (baseSpecies !== speciesName && baseSpecies !== '') {
      const baseSpeciesMoves = await getMovesBySpecie(baseSpecies, true, format);
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
                .filter((e) => e[1].some((s) => s.startsWith(`${gen.num}E`)))
                .flatMap((e) => gen.moves.get(e[0]) ?? []),
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
      5, // only show the top 5 spreads
    ),
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
              i === 0 ? ['hp', +e] : i === 1 ? ['atk', +e] : i === 2 ? ['def', +e] : i === 3 ? ['spa', +e] : i === 4 ? ['spd', +e] : ['spe', +e],
            ),
        ),
      }) as Spreads,
  );

export const isValidPokePasteURL = (url?: string): boolean => typeof url === 'string' && urlPattern.test(url) && url.includes('pokepast.es');

export const abilityToEffectiveness = (
  abilityName: string | undefined,
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
  move: Move,
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
      const { id, name } = gen.species.get(word) ?? {};
      if (id) return `species.${id}`;
      if (name) return name;
      break;
    }
    case 'moves': {
      const { id, name } = gen.moves.get(word) ?? {};
      if (id) return `moves.${id}`;
      if (name) return name;
      break;
    }
    case 'abilities': {
      const { id, name } = gen.abilities.get(word) ?? {};
      if (id) return `abilities.${id}`;
      if (name) return name;
      break;
    }
    case 'items': {
      const { id, name } = gen.items.get(word) ?? {};
      if (id) return `items.${id}`;
      if (name) return name;
      break;
    }
    case 'natures': {
      const { id, name } = gen.natures.get(word) ?? {};
      if (id) return `natures.${id}`;
      if (name) return name;
      break;
    }
    case 'types': {
      const { id, name } = gen.types.get(word) ?? {};
      if (id) return `types.${id}`;
      if (name) return name;
      break;
    }
    default:
      return word;
  }
  return word;
};

/**
 * Calculate the Smogon style usage of each Pokémon and their attributes from a list of pastes.
 * @param pastes A list of PokePastes to calculate the usage from.
 * @param teamBased When calculating the usage of a Pokémon, the dominator is the total number of Pokémon when false, and the total number of teams when true.
 */
export const calcUsageFromPastes = (pastes: string[], teamBased: boolean = true): Usage[] => {
  // Build the usage map, counting the occurrences of each Pokémon and their attributes
  const species2usage = new Map<string, Usage>();
  let totalCount = 0;
  pastes.forEach((paste) => {
    Team.import(paste)?.team.forEach((set, _, team) => {
      totalCount += 1;
      const { species, ability, item, moves, nature, evs, teraType } = set;
      if (species && ability && item && moves) {
        const usage: Usage = species2usage.get(species) ?? {
          Abilities: {},
          Items: {},
          Moves: {},
          Spreads: {},
          Teammates: {},
          TeraTypes: {},
          name: species,
          rank: 0,
          'Raw count': 0,
          'Viability Ceiling': [0, 0, 0, 0], // not used
          'Checks and Counters': {}, // not used
          usage: 0,
        };

        // Count
        usage['Raw count'] += 1;
        // Abilities
        usage.Abilities[ability] = (usage.Abilities[ability] ?? 0) + 1;
        // Items
        usage.Items[item] = (usage.Items[item] ?? 0) + 1;
        // Moves
        if (moves[0]) usage.Moves[moves[0]] = (usage.Moves[moves[0]] ?? 0) + 1;
        if (moves[1]) usage.Moves[moves[1]] = (usage.Moves[moves[1]] ?? 0) + 1;
        if (moves[2]) usage.Moves[moves[2]] = (usage.Moves[moves[2]] ?? 0) + 1;
        if (moves[3]) usage.Moves[moves[3]] = (usage.Moves[moves[3]] ?? 0) + 1;
        // Spreads
        if (nature && evs) {
          const spread = `${nature}:${evs.hp}/${evs.atk}/${evs.def}/${evs.spa}/${evs.spd}/${evs.spe}`;
          usage.Spreads[spread] = (usage.Spreads[spread] ?? 0) + 1;
        }
        // Teammates
        team.forEach((s) => {
          if (s.species && s.species !== species) {
            usage.Teammates[s.species] = (usage.Teammates[s.species] ?? 0) + 1;
          }
        });
        // Tera Types
        if (!usage.TeraTypes) {
          usage.TeraTypes = {};
        }
        if (teraType) {
          usage.TeraTypes[teraType] = (usage.TeraTypes[teraType] ?? 0) + 1;
        }

        // Save back to the map
        species2usage.set(species, usage);
      }
    });
  });

  // Convert all the counts to percentages
  species2usage.forEach((usage) => {
    usage.usage = usage['Raw count'] / (teamBased ? pastes.length : totalCount);
    const abilityCount = Object.values(usage.Abilities).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
    Object.keys(usage.Abilities).forEach((key) => {
      usage.Abilities[key]! /= abilityCount;
    });

    const itemCount = Object.values(usage.Items).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
    Object.keys(usage.Items).forEach((key) => {
      usage.Items[key]! /= itemCount;
    });

    const moveCount = Object.values(usage.Moves).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
    Object.keys(usage.Moves).forEach((key) => {
      usage.Moves[key]! /= moveCount;
    });

    const spreadCount = Object.values(usage.Spreads).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
    Object.keys(usage.Spreads).forEach((key) => {
      usage.Spreads[key]! /= spreadCount;
    });

    const teammateCount = Object.values(usage.Teammates).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
    Object.keys(usage.Teammates).forEach((key) => {
      usage.Teammates[key]! /= teammateCount;
    });

    const teraTypeCount = Object.values(usage.TeraTypes!).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
    Object.keys(usage.TeraTypes!).forEach((key) => {
      usage.TeraTypes![key]! /= teraTypeCount;
    });
  });

  // Sort the attributes of each usage object
  species2usage.forEach((usage) => {
    usage.Abilities = Object.fromEntries(Object.entries(usage.Abilities).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)));
    usage.Items = Object.fromEntries(Object.entries(usage.Items).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)));
    usage.Moves = Object.fromEntries(Object.entries(usage.Moves).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)));
    usage.Spreads = Object.fromEntries(Object.entries(usage.Spreads).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)));
    usage.Teammates = Object.fromEntries(Object.entries(usage.Teammates).sort(([, a], [, b]) => (b ?? 0) - (a ?? 0)));
    usage.TeraTypes = Object.fromEntries(Object.entries(usage.TeraTypes!).sort(([, a], [, b]) => b - a));
  });

  // Sort the usage map by the number of occurrences, then trim it
  const trimmedUsages = Array.from(species2usage.values())
    .sort((a, b) => b['Raw count'] - a['Raw count'])
    .map((usage, rank) => trimUsage(usage, rank)) // rank is 0-indexed
    .map(movesUsage4x); // 4x the percentage of each move usage

  // Delete unused properties
  trimmedUsages.forEach((usage) => {
    // @ts-ignore
    delete usage['Viability Ceiling'];
    // @ts-ignore
    delete usage['Checks and Counters'];
  });

  return trimmedUsages;
};

export const pastesToSpeciesArrays = (pastes: string[]) => pastes.map((p) => Team.import(p)?.team ?? []).map((team) => team.map((p) => p.species) as string[]);

/**
 * For each team (unique species string array), calculate the usage of each pair of Pokémon.
 * @param {string[][]} speciesArrays: The array of unique species string arrays
 * @returns An array of pair usages. The `pair` of species names separated by a comma.
 */
export const calcPairUsage: (speciesArrays: string[][]) => PairUsage[] = (speciesArrays: string[][]) => {
  const pair2usage = new Map<string, number>();
  const splitter = ',';
  speciesArrays.forEach((speciesArray) => {
    speciesArray.forEach((species, index) => {
      speciesArray.slice(index + 1).forEach((otherSpecies) => {
        const pair = species < otherSpecies ? `${species}${splitter}${otherSpecies}` : `${otherSpecies}${splitter}${species}`;
        pair2usage.set(pair, (pair2usage.get(pair) ?? 0) + 1);
      });
    });
  });
  // convert map to json
  return Array.from(pair2usage.entries())
    .map(([pair, count]) => ({
      pair,
      count,
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Return the all species names of the given Pokemon who has other formes but shares the same functionality.
 * e.g., Gastrodon-East -> Gastrodon
 *
 * @param {string} speciesName: The species name (not ID) of the Pokemon
 * @returns {string[]} The species names of the Pokemon who has other formes but shares the same functionality. Empty array if the Pokemon has no other formes.
 */
export const getAllFormesForSameFuncSpecies = (speciesName: string): string[] => {
  const otherFormesPrefixes = ['Gastrodon', 'Toxtricity', 'Palafin', 'Dudunsparce', 'Squawkabilly', 'Gourgeist', 'Pumpkaboo'];
  if (otherFormesPrefixes.some((prefix) => speciesName.startsWith(prefix))) {
    const baseSpeciesName = speciesName.split('-')[0] ?? '';
    return DexSingleton.getGen().species.get(baseSpeciesName)?.formes ?? [];
  }
  return [];
};

/**
 * Get the generation from a format string. If the format string does not contain a generation, undefined is returned.
 * Example: gen8ou -> 8, gen5doublesou -> 5
 * @param format
 * @returns The generation number or undefined if the format string does not contain a generation
 */
export const getGenNumberFromFormat = (format: string): number | undefined => {
  if (format === 'vgc2014' || format === 'vgc2015') return 6;
  const genNum = parseInt(format.replace(/gen(\d+).*/, '$1'), 10);
  return Number.isInteger(genNum) ? genNum : undefined;
};
