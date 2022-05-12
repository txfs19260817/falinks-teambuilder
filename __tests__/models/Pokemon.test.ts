import { Pokemon } from '@/models/Pokemon';

function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

describe('Pokemon', () => {
  it('should be able to exported as Showdown paste', () => {
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
    const s = Pokemon.exportSetToPaste(pikachu);
    expect(s).toBeDefined();
    expect(s).toContain('Pikachu');
  });

  it('should be able to imported', () => {
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
    const zacian = Pokemon.importSet(zacianText);
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

  it('should convert a paste to JSON', () => {
    const sampleText = `Cotton (Whimsicott) @ Focus Sash  
                        Ability: Prankster  
                        Level: 50  
                        EVs: 4 HP / 252 SpA / 252 Spe  
                        Timid Nature  
                        IVs: 0 Atk  
                        - Tailwind  
                        - Helping Hand  
                        - Dazzling Gleam  
                        - Taunt  
                        
                        Kyogre @ Life Orb  
                        Ability: Drizzle  
                        Level: 50  
                        EVs: 28 HP / 20 Def / 252 SpA / 4 SpD / 204 Spe  
                        Timid Nature  
                        IVs: 0 Atk  
                        - Water Spout  
                        - Origin Pulse  
                        - Protect  
                        - Blizzard  
                        
                        Horse (Calyrex-Shadow) @ Choice Specs  
                        Ability: As One (Spectrier)  
                        Level: 50  
                        EVs: 252 SpA / 4 SpD / 252 Spe  
                        Timid Nature  
                        IVs: 0 Atk  
                        - Astral Barrage  
                        - Expanding Force  
                        - Hyper Beam  
                        - Mud Shot  
                        
                        Regieleki @ Assault Vest  
                        Ability: Transistor  
                        Level: 50  
                        EVs: 28 HP / 252 Atk / 52 Def / 108 SpD / 68 Spe  
                        Jolly Nature  
                        - Bounce  
                        - Wild Charge  
                        - Assurance  
                        - Electroweb  
                        
                        Indeedee-F (F) @ Psychic Seed  
                        Ability: Psychic Surge  
                        Level: 50  
                        EVs: 252 HP / 252 Def / 4 SpD  
                        Bold Nature  
                        IVs: 0 Atk  
                        - Follow Me  
                        - Helping Hand  
                        - Mystical Fire  
                        - Protect  
                        
                        Paper Sword (Kartana) @ Chople Berry  
                        Ability: Beast Boost  
                        Level: 50  
                        EVs: 252 HP / 252 Atk / 4 Spe  
                        Adamant Nature  
                        - Smart Strike  
                        - Swords Dance  
                        - Sacred Sword  
                        - Leaf Blade  
                        
                        `;

    const j = Pokemon.convertPasteToJSON(sampleText);
    expect(j).toBeDefined();
    expect(isJsonString(j)).toBeTruthy();
  });

  it('should not convert a piece of invalid text to JSON', () => {
    const j = Pokemon.convertPasteToJSON('sampleText');
    expect(j).toHaveLength(0);
    expect(isJsonString(j)).toBeFalsy();
  });
});
