import type { ItemName } from '@pkmn/data';
import { Sets, Team } from '@pkmn/sets';
import type { PokemonSet, StatsTable } from '@pkmn/types';

import DexSingleton from '@/models/DexSingleton';
import { AppConfig } from '@/utils/AppConfig';
import { checkArraysEqual, S4 } from '@/utils/Helpers';
import { abilityToImmunity } from '@/utils/PokemonUtils';
import type { BasePokePaste } from '@/utils/Types';
import { ExtendedTypeEffectiveness, Type2EffectivenessMap } from '@/utils/Types';

export class Pokemon implements PokemonSet {
  /**
   * The Pokémon's unique ID for .map() methods.
   */
  id: string;

  /**
   * Nickname of the Pokémon.
   */
  name: string;

  species: string;

  item: string;

  ability: string;

  moves: string[];

  nature: string;

  evs: StatsTable;

  gender: string;

  ivs: StatsTable;

  level: number;

  gigantamax?: boolean;

  happiness?: number;

  shiny?: boolean;

  constructor(
    species: string,
    name?: string,
    item?: string,
    ability?: string,
    moves?: string[],
    nature?: string,
    evs?: StatsTable,
    gender?: string,
    ivs?: StatsTable,
    level?: number,
    gigantamax?: boolean,
    happiness?: number,
    shiny?: boolean
  ) {
    this.id = `${S4()}${S4()}`;
    this.species = species;
    this.name = name || '';
    this.item = item || '';
    this.ability = ability || '';
    this.moves = moves || ['', '', '', ''];
    this.nature = nature || 'Hardy';
    this.evs = evs || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
    this.gender = gender || '';
    this.ivs = ivs || { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
    this.level = level || 50;
    this.gigantamax = gigantamax;
    this.happiness = happiness;
    this.shiny = shiny;
  }

  static getTeamTypeChart = (team: Pokemon[]) => {
    // Dex data
    const data = DexSingleton.getGen();

    // Get all 18 types
    const allTypes = Array.from(data.types);

    // Get all moves of the team
    // const teamMoves = team
    //   .flatMap((p) => p.moves)
    //   .filter((m) => m.length > 0)
    //   .map((m) => data.moves.get(m));
    // const teamMovesTypes = teamMoves.flatMap((m) => m?.type).filter((t) => t.length > 0);

    // Transform any eligible Pokemon's formes who hold the required item
    // map team members to their species in Dex
    const teamSpecies = team.map((p) => data.species.get(p.species));
    // update a species' types if the current team member has equipped a type/forme-changing item
    teamSpecies.forEach((species, i) => {
      if (!species || !species.otherFormes) return;
      species.otherFormes.forEach((f) => {
        // get the forme's species
        const theOtherForme = data.species.get(f);
        // if the other forme shares the same types with the current species, do nothing
        if (!theOtherForme || checkArraysEqual(theOtherForme.types, species.types)) return;

        // if it can transform, update the species
        if (theOtherForme.requiredItems?.includes(<ItemName>team[i]!.item)) {
          teamSpecies.splice(teamSpecies.indexOf(species), 1, theOtherForme);
        }
      });
    });

    // Get all types that the team is weak to
    // key: TypeName, value: damage multiplier to species ID
    const defenseMap: Type2EffectivenessMap = new Map(
      allTypes.map((t) => [
        t.name,
        {
          0: [],
          0.25: [],
          0.5: [],
          1: [],
          2: [],
          4: [],
        },
      ])
    );

    // for each species, get its type damage taken from all 18 types
    teamSpecies.forEach((species, i) => {
      if (!species) return;
      allTypes.forEach((curType) => {
        // get the current team member's types
        const speciesTypes = species.types.map((st) => data.types.get(st)!);

        // Types Check: compute the damage ratio of the current type to the current species
        let typeEffectiveness = speciesTypes.reduce((acc, t) => acc * curType.effectiveness[t.name], 1);

        // Ability check: if the current team member's ability has an immunity/reduction to the current type
        const immunity = abilityToImmunity(team[i]?.ability ?? '').find(({ typeName }) => typeName === curType.name);
        if (immunity) {
          typeEffectiveness *= immunity.rate;
        }
        defenseMap.get(curType.name)![typeEffectiveness as ExtendedTypeEffectiveness].push(species.id);
      });
    });
    return defenseMap;
  };

  static pokePasteURLFetcher = (url: string): Promise<BasePokePaste> =>
    fetch(`${url}/json`)
      .then(
        (res) =>
          res.json() as Promise<{
            title: string;
            author: string;
            paste: string;
            notes: string;
          }>
      )
      .then((res) => ({
        ...res,
        format: AppConfig.defaultFormat,
      }));

  /* Text <-> Object */
  static exportSetToPaste(p: Pokemon | PokemonSet): string {
    return Sets.exportSet(p).replace(/\n$/, '');
  }

  static importSet(s: string): Pokemon {
    const { species, name, item, ability, moves, nature, evs, gender, ivs, level, gigantamax, happiness, shiny } = Sets.importSet(s);
    return new Pokemon(species as string, name, item, ability, moves, nature, evs, gender, ivs, level, gigantamax, happiness, shiny);
  }

  static convertPasteToJSON(s: string): string {
    return Team.import(s)?.toJSON() ?? '';
  }

  static convertPasteToTeam(s: string): Pokemon[] | undefined {
    return Team.import(s)?.team.map(
      (p) => new Pokemon(p.species!, p.name, p.item, p.ability, p.moves, p.nature, p.evs, p.gender, p.ivs, p.level, p.gigantamax, p.happiness, p.shiny)
    );
  }

  static convertTeamToPaste(t: Pokemon[]): string {
    return new Team(t).export();
  }

  static convertPasteToPackedTeam(s: string): string {
    const team = this.convertPasteToTeam(s) || [];
    return team.map((p) => Sets.packSet(p)).join(']');
  }

  static convertPackedTeamToTeam(packedTeam: string): BasePokePaste | undefined {
    const unpacked = Team.unpack(packedTeam, DexSingleton.getDex());
    return unpacked
      ? {
          paste: unpacked.export(),
          format: unpacked.format || AppConfig.defaultFormat,
          title: unpacked.name || '',
        }
      : undefined;
  }

  static convertTeamToPacked(t: Pokemon[], format?: string, name?: string): string {
    const packed = new Team(t, undefined, format).pack();
    // seems `Team.pack()` does not add format and team name to the packed team, we do it manually
    return format && name ? `${format}]${name}|${packed}` : packed;
  }
}
