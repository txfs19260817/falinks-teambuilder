import { Generation, Move } from '@pkmn/data';
import { Nature } from '@pkmn/dex-types';
import { Icons } from '@pkmn/img';
import { StatsTable } from '@pkmn/types';
import { MovesetStatistics, Statistics, UsageStatistics } from 'smogon';

import { AppConfig, trainerNames } from '@/utils/AppConfig';
import { convertObjectNumberValuesToFraction, filterSortLimitObjectByValues, getRandomElement } from '@/utils/Helpers';
import type { Usage } from '@/utils/Types';

const maxTotalEvs = 508;
const maxSingleEvs = 252;

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

export const getStats = (stat: string, base: number, ev: number, iv: number, nature: Nature, level: number = 50): number => {
  return stat === 'hp'
    ? Math.floor((Math.floor(2 * base + iv + Math.floor(ev / 4) + 100) * level) / 100 + 10)
    : Math.floor(((Math.floor(2 * base + iv + Math.floor(ev / 4)) * level) / 100 + 5) * (nature.plus === stat ? 1.1 : nature.minus === stat ? 0.9 : 1));
};

// 252 or left over EVs
export const getSingleEvUpperLimit = (evs: StatsTable, oldEv: number): number => {
  return Math.min(maxTotalEvs - Object.values(evs).reduce((x, y) => x + y, 0) + oldEv, maxSingleEvs);
};

export const getRandomTrainerName = () => getRandomElement(trainerNames) || 'Trainer';

// get the raw usage statistics from the Smogon API for the given format
export const getLatestUsageByFormat: (format?: string) => Promise<UsageStatistics> = async (format: string = AppConfig.defaultFormat) => {
  const { url, latestDate, process } = Statistics;
  const latest = await latestDate(format, true);
  const year = new Date().getFullYear();
  const month = new Date().getMonth(); // 0-11
  const date = latest?.date ?? month === 0 ? `${year}-${`${month}`.padStart(2, '0')}` : `${year - 1}-12`;
  return process(await fetch(url(date, format)).then((r) => r.text()));
};

// filter, sort, and limit the Abilities, Items, Spreads, Teammates and Moves of each Pokémon's usage statistics
export const trimUsage = (
  oldUsage: MovesetStatistics & { name: string },
  rank: number,
  threshold: number = 0.01,
  comparator: (a: number, b: number) => number = (a, b) => b - a,
  limit: number = 15
): Usage => {
  const { Abilities, Items, Spreads, Teammates, Moves } = oldUsage;
  const newAbilities = filterSortLimitObjectByValues(convertObjectNumberValuesToFraction(Abilities), (_) => true, comparator, limit);
  const newItems = filterSortLimitObjectByValues(convertObjectNumberValuesToFraction(Items), (_) => true, comparator, limit);
  const newSpreads = filterSortLimitObjectByValues(convertObjectNumberValuesToFraction(Spreads), (v) => v >= threshold, comparator, limit);
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

// convert the raw usage statistics to a more usable format
export const postProcessUsage = (format: string = AppConfig.defaultFormat): Promise<Usage[]> => {
  return getLatestUsageByFormat(format).then((r) =>
    Object.entries(r.data)
      .map(([name, obj]) => ({ name, ...obj }))
      .sort((a, b) => b.usage - a.usage)
      .map((u, i) => trimUsage(u, i))
  );
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
