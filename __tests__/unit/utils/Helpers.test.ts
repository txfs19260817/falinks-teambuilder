import { expect, test } from 'vitest';

import {
  checkArraysEqual,
  convertObjectNumberValuesToFraction,
  ensureInteger,
  filterSortLimitObjectByValues,
  findIntersections,
  fractionToPercentage,
  getISOWeekNumber,
  getRandomColor,
  invertColor,
  S4,
} from '@/utils/Helpers';

test('S4', () => {
  const s4 = S4();
  expect(s4).toHaveLength(4);
  expect(s4).toMatch(/^[0-9a-f]{4}$/);
});

test('getRandomColor', () => {
  const color = getRandomColor();
  expect(color).toHaveLength(7);
  expect(color).toMatch(/^#[0-9a-f]{6}$/);
});

test('invertColor', () => {
  expect(invertColor('#000000')).toBe('#FFFFFF');
  expect(invertColor('#FFFFFF')).toBe('#000000');
  expect(invertColor('#000')).toBe('#FFFFFF');
  expect(invertColor('#FFF')).toBe('#000000');
});

test('ensureInteger', () => {
  expect(ensureInteger(1)).toBe(1);
  expect(ensureInteger('1')).toBe(1);
  expect(ensureInteger({})).toBe(0);
});

test('filterSortLimitObjectByValues', () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
  };
  const filtered = filterSortLimitObjectByValues(
    obj,
    (v) => v > 2,
    (a, b) => a - b,
    2
  );
  expect(filtered).toEqual({ c: 3, d: 4 });
});

test('convertObjectNumberValuesToFraction', () => {
  const obj = {
    a: 1,
    b: 3,
  };
  const converted = convertObjectNumberValuesToFraction(obj);
  expect(converted).toEqual({
    a: 0.25,
    b: 0.75,
  });
});

test('fractionToPercentage', () => {
  expect(fractionToPercentage(0)).toBe('0.0%');
  expect(fractionToPercentage(0.5)).toBe('50.0%');
  expect(fractionToPercentage(1)).toBe('100.0%');
});

test('checkArraysEqual', () => {
  expect(checkArraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  expect(checkArraysEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  expect(checkArraysEqual([1, 2, 3], [1, 2])).toBe(false);
});

test('getISOWeekNumber', () => {
  const date = new Date('2021-01-01');
  const { year, week } = getISOWeekNumber(date);
  expect(year).toBe(2020);
  expect(week).toBe(53);
});

test('findIntersections', () => {
  const teamArrs = [
    ['Amoonguss', 'Arcanine', 'Flutter Mane', 'Gothitelle', 'Palafin', 'Scream Tail'],
    ['Amoonguss', 'Arcanine', 'Espathra', 'Flutter Mane', 'Iron Hands', 'Sandy Shocks'],
    ['Amoonguss', 'Arcanine', 'Ditto', 'Indeedee-F', 'Iron Hands', 'Torkoal'],
  ];
  const intersections = findIntersections(teamArrs);
  expect(intersections).toEqual(['Amoonguss', 'Arcanine']);
});
