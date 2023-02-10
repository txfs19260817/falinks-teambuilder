export const S4 = (): string => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line no-bitwise

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

export const ensureInteger = (v: unknown, defaultNum: number = 0): number => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const num = Number(v);
    return Number.isInteger(num) ? num : defaultNum;
  }
  return defaultNum;
};

export const filterSortLimitObjectByValues = <T extends object>(
  obj: T,
  filter: (value: T[keyof T]) => boolean,
  sort: (a: T[keyof T], b: T[keyof T]) => number,
  limit: number
): Partial<T> => {
  const filtered = Object.entries(obj).filter(([, value]) => filter(value));
  const sorted = filtered.sort((a, b) => sort(a[1], b[1]));
  const limited = sorted.slice(0, limit);
  return <Partial<T>>Object.fromEntries(limited);
};

export const convertObjectNumberValuesToFraction = <T extends Partial<Record<string, number>>>(obj: T): Record<string, number> => {
  const entries = Object.entries(obj);
  if (!entries.length) return {};
  const sum = Object.values(obj).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 1;
  const result: Record<string, number> = {};
  entries.forEach(([key, value]) => {
    result[key] = (value ?? 0) / sum;
  });
  return result;
};

export const fractionToPercentage = (fraction: number = 0) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
  }).format(fraction ?? 0);
};

export const checkArraysEqual = (a: unknown[], b: unknown[], ignoreOrder: boolean = true) => {
  if (a === b) return true;
  if (a == null || b == null || a.length !== b.length) return false;

  // compare two arrays regardless of order
  if (ignoreOrder) {
    a.sort();
    b.sort();
  }
  return a.every((v, i) => v === b[i]);
};

export const isSubset = (a: unknown[], b: unknown[]) => (a == null || b == null || a.length > b.length ? false : a.every((v) => b.includes(v)));

export const getISOWeekNumber = (
  date: Date
): {
  year: number;
  week: number;
} => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return {
    year: d.getUTCFullYear(),
    week,
  };
};

export const convertYearWeekToNumber = ({ year, week }: { year: number; week: number }) => {
  return year * 100 + week;
};

/**
 * Calculates "Cartesian Product" sets.
 * @example
 *   cartesianProduct([[1,2], [4,8], [16,32]])
 *   Returns:
 *   [
 *     [1, 4, 16],
 *     [1, 4, 32],
 *     [1, 8, 16],
 *     [1, 8, 32],
 *     [2, 4, 16],
 *     [2, 4, 32],
 *     [2, 8, 16],
 *     [2, 8, 32]
 *   ]
 * @see https://stackoverflow.com/a/36234242/1955709
 * @see https://en.wikipedia.org/wiki/Cartesian_product
 * @param arr {T[][]}
 * @returns {T[][]}
 */
function cartesianProduct<T>(arr: T[][]): T[][] {
  return arr.reduce(
    (a, b) => {
      return a
        .map((x) => {
          return b.map((y) => {
            return x.concat(y);
          });
        })
        .reduce((c, d) => c.concat(d), []);
    },
    [[]] as T[][]
  );
}

/**
 * Permute to get all possible substitutions for each element in another 2D candidate array
 * e.g., duplicateArrayWith2DArray([1, 2, 3], [[1, 10], [], [3, 30]]) => [[1, 2, 3], [10, 2, 3], [1, 2, 30], [10, 2, 30]]
 * @param arr
 * @param candidates
 * @returns {unknown[][]}
 */
export const duplicateArrayWith2DArray = (arr: unknown[], candidates: unknown[][]): unknown[][] => {
  // first to replace empty candicates with corresponding element in arr
  const candidatesWithDefault = candidates.map((c, i) => (c.length === 0 ? [arr[i]] : c));
  // then to get all possible permutations
  return cartesianProduct(candidatesWithDefault);
};

export const findIntersections = <T>(arrs = [] as T[][]) => {
  if (arrs.length === 0) return [];
  if (arrs.length === 1) return arrs[0];
  const [first, ...rest] = arrs;
  return first!.filter((value) => rest.every((arr) => arr.includes(value)));
};
