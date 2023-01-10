import type { ItemName, Move, MoveCategory, Specie, Type, TypeEffectiveness } from '@pkmn/data';
import { Sets, Team } from '@pkmn/sets';
import type { PokemonSet, StatsTable } from '@pkmn/types';

import DexSingleton from '@/models/DexSingleton';
import { AppConfig } from '@/utils/AppConfig';
import { checkArraysEqual, S4 } from '@/utils/Helpers';
import { abilityToEffectiveness, changeMoveType, getStats, moveToEffectiveness } from '@/utils/PokemonUtils';
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

  teraType?: string;

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
    teraType?: string,
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
    this.teraType = teraType;
    this.happiness = happiness;
    this.shiny = shiny;
  }

  static getTeamMemberCategories(team: Pokemon[]): {
    [key in MoveCategory]: Specie[];
  } {
    const data = DexSingleton.getGen();
    const res: {
      [key in MoveCategory]: Specie[];
    } = { Physical: [], Special: [], Status: [] };
    team.forEach((p) => {
      const species = data.species.get(p.species);
      if (!species) return;
      const nature = data.natures.get(p.nature);
      const atkStat = getStats('atk', species.baseStats.atk ?? 0, p.evs.atk, p.ivs.atk, nature, p.level);
      const spaStat = getStats('spa', species.baseStats.spa ?? 0, p.evs.spa, p.ivs.spa, nature, p.level);
      if (atkStat >= spaStat) {
        res.Physical.push(species);
      }
      if (atkStat <= spaStat) {
        res.Special.push(species);
      }
      // Rules for Status Pokémon: the Pokemon's ability is Prankster or at least 3 moves are status moves
      if (p.ability === 'Prankster' || p.moves.filter((m) => data.moves.get(m)?.category === 'Status').length >= 3) {
        res.Status.push(species);
      }
    });
    return res;
  }

  static getTeamTypeChart = (
    team: Pokemon[]
  ): {
    offenseMap: Type2EffectivenessMap<TypeEffectiveness>;
    defenseMap: Type2EffectivenessMap;
    defenseTeraMap: Type2EffectivenessMap;
  } => {
    // Dex data
    const data = DexSingleton.getGen();

    // Get all 18 types
    const allTypes = Array.from(data.types);

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

    // key: TypeName, value: extended damage multiplier to species ID
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

    // key: TypeName, value: extended damage multiplier to species ID
    const defenseTeraMap: Type2EffectivenessMap = new Map(
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

    // key: TypeName, value: damage multiplier to move ID
    const offenseMap: Type2EffectivenessMap<TypeEffectiveness> = new Map(
      allTypes.map((t) => [
        t.name,
        {
          0: [],
          0.5: [],
          1: [],
          2: [],
        },
      ])
    );

    // Build the defense map & defense tera map
    // for each species, get its type damage taken from all 18 types
    teamSpecies.forEach((teamMemberSpecies, i) => {
      if (!teamMemberSpecies) return;
      allTypes.forEach((curType) => {
        // get the current team member's types
        const speciesTypes = teamMemberSpecies.types.map((st) => data.types.get(st)!) as [Type] | [Type, Type];

        // Types check: compute the damage ratio of the current type to the current species
        let typeEffectiveness = speciesTypes.reduce((acc, t) => acc * curType.effectiveness[t.name], 1);

        // Ability check: if the current team member's ability has an immunity/reduction to the current type
        const immunity = abilityToEffectiveness(team[i]?.ability).find(({ typeName }) => typeName === curType.name);
        if (immunity) {
          typeEffectiveness *= immunity.rate;
        }
        defenseMap.get(curType.name)![typeEffectiveness as ExtendedTypeEffectiveness].push(teamMemberSpecies.id);

        // repeat for the Tera type defense map
        const spTeraType = data.types.get(team[i]?.teraType || '') ?? speciesTypes[0];
        typeEffectiveness = curType.effectiveness[spTeraType.name];
        if (immunity) {
          typeEffectiveness *= immunity.rate;
        }
        defenseTeraMap.get(curType.name)![typeEffectiveness as ExtendedTypeEffectiveness].push(teamMemberSpecies.id);
      });
    });

    // Build the offense map
    // for each species, get its moves' type damage dealt to all 18 types
    teamSpecies.forEach((teamMemberSpecies, i) => {
      if (!teamMemberSpecies) return;
      allTypes.forEach((curType) => {
        // get the current team member's moves
        const speciesMoves = <Move[]>team[i]!.moves.filter((m) => m.length > 0)
          .map((m) => data.moves.get(m))
          .filter((m) => m !== undefined && m.category !== 'Status');

        const oldValue = offenseMap.get(curType.name)!;

        speciesMoves.forEach((move) => {
          const specialTypeEffectiveness = moveToEffectiveness(move).find(({ typeName }) => typeName === curType.name)?.rate;
          const typeEffectiveness =
            specialTypeEffectiveness ??
            data.types.get(changeMoveType(move, team[i]?.ability, team[i]?.item, data.types.get(team[i]?.teraType || '')?.name).type)!.effectiveness[
              curType.name
            ];
          // ensure no duplicates
          if (!oldValue[typeEffectiveness].includes(move.id)) {
            oldValue[typeEffectiveness].push(move.id);
          }
        });
        offenseMap.set(curType.name, oldValue);
      });
    });
    return { defenseMap, offenseMap, defenseTeraMap };
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

  static exportSetToTranslatedPaste(s: Pokemon | PokemonSet, t: (key: string, options?: { ns: string; defaultValue: string }) => string): string {
    const data = DexSingleton.getDex();
    const statsList = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const;
    let buf = '';

    // Species
    const { num, name } = data.species.get(s.species || s.name || '');
    const species = t(`${num}`, {
      ns: 'species',
      defaultValue: name,
    });
    buf += `${species}`;

    // Gender
    if (s.gender === 'M') buf += ' (♂)';
    if (s.gender === 'F') buf += ' (♀)';

    // Item
    if (s.item) {
      const item = data?.items.get(s.item)?.id ?? s.item;
      buf += ` @ ${t(item, { ns: 'items', defaultValue: s.item })}`;
    }
    buf += '  \n';
    if (s.ability) {
      const ability = data?.abilities.get(s.ability)?.id ?? s.ability;
      buf += `${t('common.ability')}: ${t(ability, {
        ns: 'abilities',
        defaultValue: s.ability,
      })}  \n`;
    }
    if (s.level && s.level !== 100) {
      buf += `${t('common.level')}: ${s.level}  \n`;
    }
    if (s.gigantamax) {
      buf += `${t('common.gigantamax')}: √  \n`;
    }
    if (s.teraType) {
      buf += `${t('common.teraType')}: ${t(s.teraType.toLowerCase(), {
        ns: 'types',
        defaultValue: s.teraType,
      })}  \n`;
    }
    let first = true;
    if (s.evs) {
      statsList.forEach((stat) => {
        if (s.evs[stat]) {
          if (first) {
            buf += `${t('common.evs')}: `;
            first = false;
          } else {
            buf += ' / ';
          }
          buf += `${s.evs[stat]} ${t(`common.stats.${stat}`)}`;
        }
      });
    }
    if (!first) {
      buf += '  \n';
    }
    if (s.nature && (!data || data.gen >= 3)) {
      buf += `${t(s.nature.toLowerCase(), {
        ns: 'natures',
        defaultValue: s.nature,
      })} ${t('common.nature')} \n`;
    }
    first = true;
    if (s.ivs) {
      const notDefaultIVs = statsList.some((stat) => s.ivs[stat] !== 31 && s.ivs[stat] !== undefined);
      if (notDefaultIVs) {
        statsList.forEach((stat) => {
          if (s.ivs[stat] !== 31) {
            if (first) {
              buf += `${t('common.ivs')}: `;
              first = false;
            } else {
              buf += ' / ';
            }
            buf += `${s.ivs[stat]} ${t(`common.stats.${stat}`)}`;
          }
        });
      }
    }
    if (!first) {
      buf += '  \n';
    }
    s.moves.forEach((m) => {
      buf += `- ${t(data?.moves.get(m)?.id, {
        ns: 'moves',
        defaultValue: m,
      })}  \n`;
    });
    buf += '\n';

    return buf;
  }

  static importSet(s: string): Pokemon {
    const { species, name, item, ability, moves, nature, evs, gender, ivs, level, gigantamax, teraType, happiness, shiny } = Sets.importSet(s);
    return new Pokemon(species as string, name, item, ability, moves, nature, evs, gender, ivs, level, gigantamax, teraType, happiness, shiny);
  }

  static convertPasteToJSON(s: string): string {
    return Team.import(s)?.toJSON() ?? '';
  }

  static convertPasteToTeam(s: string): Pokemon[] | undefined {
    return Team.import(s)?.team.map(
      (p) =>
        new Pokemon(p.species!, p.name, p.item, p.ability, p.moves, p.nature, p.evs, p.gender, p.ivs, p.level, p.gigantamax, p.teraType, p.happiness, p.shiny)
    );
  }

  static convertTeamToPaste(t: Pokemon[]): string {
    return new Team(t).export();
  }

  static convertTeamToTranslatedPaste(team: Pokemon[], t: (key: string, options?: { ns: string }) => string): string {
    return team.map((p) => this.exportSetToTranslatedPaste(p, t)).join('');
  }

  static convertPasteToPackedTeam(s: string, option?: { format: string; name: string }): string {
    const packed = (this.convertPasteToTeam(s) || []).map((p) => Sets.packSet(p)).join(']');
    return option ? `${option.format}]${option.name}|${packed}` : packed;
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

  static extractSpeciesFromPaste(s: string): string[] {
    const speciesData = DexSingleton.getDex().species;
    return (
      this.convertPasteToTeam(s)
        ?.map((p) => speciesData.get(p.species)?.id ?? '')
        .filter((id) => id.length) ?? []
    );
  }
}
