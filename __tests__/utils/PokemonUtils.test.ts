import { trainerNames } from '@/utils/AppConfig';
import { getRandomTrainerName, getSingleEvUpperLimit } from '@/utils/PokemonUtils';

describe('getSingleEvUpperLimit', () => {
  it('should return 252 for a pokemon with 0 base stats', () => {
    expect(
      getSingleEvUpperLimit(
        {
          hp: 0,
          atk: 0,
          def: 0,
          spa: 0,
          spd: 0,
          spe: 0,
        },
        0
      )
    ).toBe(252);
  });

  it('should return 4 for a pokemon with two base stats with 252', () => {
    expect(
      getSingleEvUpperLimit(
        {
          hp: 252,
          atk: 252,
          def: 0,
          spa: 0,
          spd: 0,
          spe: 0,
        },
        0
      )
    ).toBe(4);
  });

  it('should return 0 for a pokemon with two base stats with 252 and one with 4', () => {
    expect(
      getSingleEvUpperLimit(
        {
          hp: 252,
          atk: 252,
          def: 0,
          spa: 0,
          spd: 0,
          spe: 4,
        },
        0
      )
    ).toBe(0);
  });
});

describe('getRandomTrainerName', () => {
  it('should return a random trainer name', () => {
    expect(getRandomTrainerName()).not.toBe('');
  });
  it('should be in the list of trainer names', () => {
    expect(trainerNames.includes(getRandomTrainerName())).toBe(true);
  });
});
