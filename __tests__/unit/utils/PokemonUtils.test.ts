import { expect, test } from 'vitest';

import { getRandomTrainerName, getSingleEvUpperLimit, isValidPokePasteURL, trainerNames } from '@/utils/PokemonUtils';

test('isValidPokePasteURL', () => {
  expect(isValidPokePasteURL('https://pokepast.es/a00ca5bc26cda7e9')).toBe(true);
  expect(isValidPokePasteURL('https://google.com')).toBe(false);
});

test('getRandomTrainerName', () => {
  expect(trainerNames).toContain(getRandomTrainerName());
});

test('getSingleEvUpperLimit', () => {
  expect(getSingleEvUpperLimit({ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }, 252)).toBe(252);
  expect(getSingleEvUpperLimit({ hp: 252, atk: 252, def: 0, spa: 0, spd: 0, spe: 0 }, 0)).toBe(4);
});
