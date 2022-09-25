import { Nature } from '@pkmn/dex-types';
import { Icons } from '@pkmn/img';
import { StatsTable } from '@pkmn/types';
import { CSSProperties } from 'react';

import { trainerNames } from '@/utils/AppConfig';

const maxTotalEvs = 508;

const maxSingleEvs = 252;

export const S4 = (): string => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line no-bitwise

export const removeItem = <T>(arr: Array<T>, value: T): Array<T> => {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
};

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

// 252 or left over EVs
export const getSingleEvUpperLimit = (evs: StatsTable, oldEv: number): number => {
  return Math.min(maxTotalEvs - Object.values(evs).reduce((x, y) => x + y, 0) + oldEv, maxSingleEvs);
};

export const getRandomColor = () =>
  `#${Math.floor(Math.random() * 0x1000000)
    .toString(16)
    .padStart(6, '0')}`;

// https://stackoverflow.com/a/35970186
export function invertColor(hex: string): string {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    // @ts-ignore
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    return '#000000';
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // https://stackoverflow.com/a/3943023/112731
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
}

// https://stackoverflow.com/a/5717133
export const urlPattern = new RegExp(
  '^(https?:\\/\\/)?' +
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    '((\\d{1,3}\\.){3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    '(\\?[;&a-z\\d%_.~+=-]*)?' +
    '(\\#[-a-z\\d_]*)?$',
  'i'
);

export const getRandomElement = (list: string[]) => list[Math.floor(Math.random() * list.length)];

export const getRandomTrainerName = () => getRandomElement(trainerNames) || 'Trainer';

export const firstDiffIndexOfTwoArrays = <T>(oldArr: T[], newArr: T[]): number => {
  return oldArr.findIndex((item) => !newArr.includes(item));
};

export const ensureInteger = (v: unknown, defaultNum: number = 0): number => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const num = Number(v);
    return Number.isInteger(num) ? num : defaultNum;
  }
  return defaultNum;
};

export const filterObjectByValue = <T extends object>(obj: T, predicate: (value: T[keyof T]) => boolean): Partial<T> => {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => predicate(value))) as Partial<T>;
};

export const sortObjectByValue = <T extends object>(obj: T, predicate: (a: T[keyof T], b: T[keyof T]) => number): T => {
  return Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => predicate(a, b))) as T;
};

export const limitObjectEntries = <T extends object>(obj: T, limit: number): T => {
  return Object.fromEntries(Object.entries(obj).slice(0, limit)) as T;
};
