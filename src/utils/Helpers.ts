import { Nature } from '@pkmn/dex-types';
import { Icons } from '@pkmn/img';
import { StatsTable } from '@pkmn/types';
import { CSSProperties } from 'react';

const maxTotalEvs = 508;

const maxSingleEvs = 252;

export const S4 = (): string => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line no-bitwise

// https://gist.github.com/goldhand/70de06a3bdbdb51565878ad1ee37e92b?permalink_comment_id=3621492#gistcomment-3621492
export const convertStylesStringToObject = (stringStyles: string) =>
  stringStyles.split(';').reduce((acc, style) => {
    const colonPosition = style.indexOf(':');

    if (colonPosition === -1) {
      return acc;
    }

    const camelCaseProperty = style
      .substr(0, colonPosition)
      .trim()
      .replace(/^-ms-/, 'ms-')
      .replace(/-./g, (c) => c.substr(1).toUpperCase());
    const value = style.substr(colonPosition + 1).trim();

    return value ? { ...acc, [camelCaseProperty]: value } : acc;
  }, {});

/**
 * Returns the icon for the given Pokémon.
 * @param {number} pokeNum - The No. of the Pokémon. Only required if fetching from local (fromPS = false).
 * @param {string} pokeName - The name of the Pokémon. Only required if fetching from Pokémon Showdown site (fromPS = true).
 * @param {boolean} fromPS - Fetch icons from the Pokémon Showdown site if true, otherwise from this site.
 */
export const getPokemonIcon = (pokeNum?: number, pokeName?: string, fromPS?: boolean): CSSProperties => {
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

export const getSingleEvUpperLimit = (evs: StatsTable, oldEv: number): number => {
  return Math.min(maxTotalEvs - Object.values(evs).reduce((x, y) => x + y) + oldEv, maxSingleEvs);
};
