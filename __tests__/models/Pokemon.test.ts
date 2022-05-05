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
    const exportSet = pikachu.exportSet();
    expect(exportSet).toBeDefined();
    expect(exportSet).toContain('Pikachu');
    expect(exportSet).toContain('pika');
    expect(exportSet).toContain('Light Ball');
    expect(exportSet).toContain('Lightning Rod');
    expect(exportSet).toContain('Fake Out');
    expect(exportSet).toContain('Volt Tackle');
    expect(exportSet).toContain('Brick Break');
    expect(exportSet).toContain('Protect');
    expect(exportSet).toContain('Timid');
    expect(exportSet).toContain('31 HP');
    expect(exportSet).toContain('252 Atk');
  });
  it('should be able to import from a set', () => {
    const zacianText = `Zacian-Crowned @ Rusted Sword  
Ability: Intrepid Sword  
Level: 50  
Shiny: Yes  
EVs: 252 Atk / 4 SpD / 252 Spe  
Jolly Nature  
- Behemoth Blade  
- Sacred Sword  
- Play Rough  
- Protect`;
    const zacian = new Pokemon('Zacian');
    zacian.importSet(zacianText);
    expect(zacian).toBeDefined();
    expect(zacian.species).toBe('Zacian-Crowned');
    expect(zacian.nature).toBe('Jolly');
    expect(zacian.ability).toBe('Intrepid Sword');
    expect(zacian.level).toBe(50);
    expect(zacian.shiny).toBe(true);
    expect(zacian.evs.hp).toEqual(0);
    expect(zacian.evs.atk).toEqual(252);
    expect(zacian.ivs.def).toEqual(31);
    expect(zacian.moves).toEqual(['Behemoth Blade', 'Sacred Sword', 'Play Rough', 'Protect']);
  });
});
