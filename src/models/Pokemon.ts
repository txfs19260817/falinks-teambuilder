import { Sets, Team } from '@pkmn/sets';
import { PokemonSet, StatsTable } from '@pkmn/types';

import { S4 } from '@/utils/Helpers';

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

  static exportSetToPaste(p: Pokemon | PokemonSet): string {
    return Sets.exportSet(p);
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
}
