import { Pokemon } from '@/models/Pokemon';

describe('Pokemon', () => {
  it('should be able to exported', () => {
    const pikachu = new Pokemon(
      'Pikachu',
      'pika',
      'Light Ball',
      'Lightning Rod',
      ['Fake Out', 'Volt Tackle', 'Brick Break', 'Protect'],
      'Timid',
      {
        hp: 31,
        atk: 31,
        def: 30,
        spa: 0,
        spd: 30,
        spe: 31,
      },
      'M',
      { hp: 6, atk: 252, def: 0, spa: 0, spd: 0, spe: 252 },
      50
    );
    expect(pikachu).toBeDefined();
  });
});
