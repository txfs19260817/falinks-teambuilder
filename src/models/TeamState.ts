import { MappedTypeDescription } from '@syncedstore/core/types/doc';

import { Pokemon } from '@/models/Pokemon';

export type TeamChangelog = {
  username: string;
  tabIdx: number;
  category: string;
  oldValue: string;
  newValue: string;
};

export type Metadata = {
  title: string;
  notes: string;
  authors: string[];
  roomName: string;
};

export type StoreContextType = {
  team: Pokemon[];
  metadata: Metadata;
  notes: any; // for Tiptap
  history: TeamChangelog[];
};

export class TeamState {
  private teamState: MappedTypeDescription<StoreContextType>;

  private username: string;

  constructor(teamState: MappedTypeDescription<StoreContextType>, username?: string) {
    this.teamState = teamState;
    this.username = username || localStorage.getItem('username') || 'Trainer';
  }

  /* History */
  get history() {
    return this.teamState.history;
  }

  get historyLiteral() {
    return this.teamState.history.map(
      (h) =>
        `${h.username} ${h.category}${h.oldValue.length > 0 ? ` <${h.oldValue}>` : ''}${h.newValue.length > 0 ? ` to <${h.newValue}>` : ''} on tab ${
          h.tabIdx + 1
        }`
    );
  }

  private pushHistory(history: TeamChangelog) {
    this.teamState.history.push(history);
  }

  clearHistory = () => {
    this.teamState.history.splice(0, this.teamState.history.length);
  };

  /* Metadata */
  get title() {
    return this.teamState.metadata.title;
  }

  get notes() {
    return this.teamState.metadata.notes;
  }

  get authors() {
    return this.teamState.metadata.authors;
  }

  get roomName() {
    return this.teamState.metadata.roomName;
  }

  updateMetadata = <K extends keyof Metadata>(key: K, value: Metadata[K]) => {
    this.teamState.metadata[key] = value;
  };

  updateNotes = (notes: string) => {
    this.teamState.metadata.notes = notes;
  };

  /* Team */
  get team() {
    return this.teamState.team;
  }

  get teamLength() {
    return this.teamState.team.length;
  }

  get teamPokePaste() {
    return Pokemon.convertTeamToPaste(this.teamState.team);
  }

  // https://typeofnan.dev/how-to-make-one-function-argument-dependent-on-another-in-typescript/
  updatePokemonInTeam = <K extends keyof typeof Pokemon.prototype>(tabIdx: number, key: K, newValue: Pokemon[K], recordHistory = true): boolean => {
    // validate
    if (tabIdx < 0 || tabIdx > this.teamState.team.length) {
      return false;
    }
    // update
    const oldValue = this.teamState.team[tabIdx]![key];
    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      (this.teamState.team[tabIdx]![key]! as typeof newValue).splice(0, 4, ...newValue);
    } else {
      this.teamState.team[tabIdx]![key] = newValue;
    }

    // update history optionally
    if (recordHistory) {
      this.pushHistory({
        username: this.username,
        tabIdx,
        category: `set ${key}`,
        oldValue: typeof oldValue === 'string' ? oldValue : JSON.stringify(oldValue),
        newValue: typeof newValue === 'string' ? newValue : JSON.stringify(newValue),
      });
    }
    return true;
  };

  addPokemonToTeam = (pokemon: Pokemon): number => {
    const newLength = this.teamState.team.push(pokemon);
    // update history
    this.pushHistory({
      username: this.username,
      tabIdx: newLength - 1,
      category: 'added Pokémon',
      oldValue: '',
      newValue: pokemon.species,
    });
    return newLength;
  };

  splicePokemonTeam = (start: number, deleteCount: number, ...items: Pokemon[]): Pokemon[] => {
    const oldTeamNames = this.teamState.team
      .slice(start, start + deleteCount)
      .map((p) => p.species)
      .join(', ');
    const newTeam = this.teamState.team.splice(start, deleteCount, ...items);
    // update history depending on whether we're replacing or deleting
    if (items.length === 0) {
      this.pushHistory({
        username: this.username,
        tabIdx: start,
        category: 'deleted Pokémon',
        oldValue: oldTeamNames,
        newValue: '',
      });
    } else {
      this.pushHistory({
        username: this.username,
        tabIdx: start,
        category: 'replaced Pokémon',
        oldValue: oldTeamNames,
        newValue: items.map((p) => p.species).join(', '),
      });
    }
    return newTeam;
  };

  updatePokemonOneMoveInTeam = (tabIdx: number, moveIdx: number, newMove: string): boolean => {
    // validate
    if (tabIdx < 0 || tabIdx > this.teamState.team.length) {
      return false;
    }
    const oldMove = this.teamState.team[tabIdx]?.moves[moveIdx] ?? '';
    this.teamState.team[tabIdx]!.moves.splice(moveIdx, 1, newMove);
    // update history
    this.pushHistory({
      username: this.username,
      tabIdx,
      category: 'set a move',
      oldValue: oldMove,
      newValue: newMove,
    });

    return true;
  };

  getPokemonInTeam = (tabIdx: number) => {
    if (tabIdx < 0 || tabIdx > this.teamState.team.length) {
      return undefined;
    }
    return this.teamState.team[tabIdx];
  };
}
