/* eslint max-classes-per-file: "off" */
import { Generation } from '@pkmn/data';
import { getYjsDoc } from '@syncedstore/core';
import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import { UndoManager } from 'yjs';

import DexSingleton from '@/models/DexSingleton';
import { Pokemon } from '@/models/Pokemon';
import { AppConfig } from '@/utils/AppConfig';
import { S4 } from '@/utils/Helpers';

type Metadata = {
  title: string;
  notes: string; // it's a readonly field
  authors: string[];
  roomName: string;
  format: string;
};

type StoreContextType = {
  team: Pokemon[];
  metadata: Metadata;
  notes: any; // for Tiptap to work collaboratively only. The notes field is in metadata.
  history: string[];
};

class TeamState {
  private teamState: MappedTypeDescription<StoreContextType>;

  private readonly teamStore: MappedTypeDescription<StoreContextType>;

  private readonly username: string;

  private readonly teamUndoManager: UndoManager;

  constructor(teamState: MappedTypeDescription<StoreContextType>, teamStore: MappedTypeDescription<StoreContextType>, username?: string) {
    this.teamState = teamState;
    this.teamStore = teamStore;
    this.username = username || localStorage.getItem('username') || 'Trainer';
    // undo manager
    const doc = getYjsDoc(teamStore);
    const team = doc.getArray<Pokemon[]>('team');
    this.teamUndoManager = new UndoManager(team);
  }

  get store() {
    return this.teamStore;
  }

  /* History */
  get history() {
    return this.teamState.history;
  }

  private addHistory = (s: string) => {
    const log = `${new Date().toLocaleTimeString()} - ${this.username}: ${s}`;
    // push to history array
    this.teamState.history.push(log);
  };

  clearHistory = () => {
    this.teamState.history.splice(0, this.teamState.history.length);
  };

  /* Metadata */
  get title() {
    return this.teamState.metadata.title ?? this.roomName ?? 'Untitled';
  }

  set title(title: string) {
    this.teamState.metadata.title = title;
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

  get format() {
    return this.teamState.metadata.format ?? AppConfig.defaultFormat;
  }

  set format(format: string) {
    this.teamState.metadata.format = format;
  }

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

  getTeamMemberCategories() {
    return Pokemon.getTeamMemberCategories(this.teamState.team);
  }

  getTeamTypeChart() {
    return Pokemon.getTeamTypeChart(this.teamState.team);
  }

  // urlEncode takes effect only when packed is true
  getTeamPaste(packed = false, urlEncode = false, format = AppConfig.defaultFormat, name = `falinks_${S4()}`) {
    if (!packed) {
      return Pokemon.convertTeamToPaste(this.teamState.team);
    }
    const packedTeam = Pokemon.convertTeamToPacked(this.teamState.team, format, name);
    return urlEncode ? encodeURIComponent(packedTeam) : packedTeam;
  }

  // https://typeofnan.dev/how-to-make-one-function-argument-dependent-on-another-in-typescript/
  updatePokemonInTeam = <K extends keyof typeof Pokemon.prototype>(tabIdx: number, key: K, newValue: Pokemon[K]): void => {
    // validate
    if (tabIdx < 0 || tabIdx > this.teamState.team.length) {
      return;
    }
    // update
    const oldValue = this.teamState.team[tabIdx]![key];
    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      (this.teamState.team[tabIdx]![key]! as typeof newValue).splice(0, 4, ...newValue);
    } else {
      this.teamState.team[tabIdx]![key] = newValue;
    }
    // update history
    // check if the new value is valid before adding to history
    if (!newValue) return;
    let newValueStr = JSON.stringify(newValue);
    if (key === 'species' || key === 'item' || key === 'ability') {
      const propKey: keyof Generation = key === 'item' ? 'items' : key === 'ability' ? 'abilities' : 'species';
      const newValueObj = DexSingleton.getGen()[propKey].get(newValueStr);
      if (newValueObj) {
        newValueStr = newValueObj.name;
      } else {
        return;
      }
    }
    this.addHistory(`Changed ${key} of ${this.teamState.team[tabIdx]!.species} from ${JSON.stringify(oldValue)} to ${newValueStr}`);
  };

  addPokemonToTeam = (pokemon: Pokemon): number => {
    // update history
    this.addHistory(`Added ${pokemon.species}`);
    return this.teamState.team.push(pokemon);
  };

  splicePokemonTeam = (start: number, deleteCount: number, ...items: Pokemon[]): Pokemon[] => {
    const oldTeamNames = this.teamState.team
      .slice(start, start + deleteCount)
      .map((p) => p.species)
      .join(', ');
    const newTeam = this.teamState.team.splice(start, deleteCount, ...items);
    // update history depending on whether we're replacing or deleting
    this.addHistory(items.length === 0 ? `Deleted ${oldTeamNames}` : `Replaced ${oldTeamNames} with ${items.map((p) => p.species).join(', ')}`);
    return newTeam;
  };

  updatePokemonOneMoveInTeam = (tabIdx: number, moveIdx: number, newMoveName: string): void => {
    // validate
    if (tabIdx < 0 || tabIdx > this.teamState.team.length) {
      return;
    }
    const oldMoveName = this.teamState.team[tabIdx]?.moves[moveIdx] ?? '';
    this.teamState.team[tabIdx]!.moves.splice(moveIdx, 1, newMoveName);
    // check if the new move is valid
    const newMove = DexSingleton.getGen().moves.get(newMoveName);
    if (newMove == null) {
      return;
    }
    // update history
    this.addHistory(`Changed move ${moveIdx + 1} of ${this.teamState.team[tabIdx]!.species} from ${oldMoveName} to ${newMove.name}`);
  };

  getPokemonInTeam = (tabIdx: number) => {
    if (tabIdx < 0 || tabIdx > this.teamState.team.length) {
      return undefined;
    }
    return this.teamState.team[tabIdx];
  };

  public teamUndo() {
    const r = this.teamUndoManager.undo();
    const isDelete = r != null && r.deletions.clients.size > 0;
    const isAdd = r != null && r.insertions.clients.size > 0;
    this.addHistory(`Undo ${isDelete && isAdd ? 'edit' : isDelete ? 'delete' : isAdd ? 'add' : ''}`);
  }

  public teamRedo() {
    const r = this.teamUndoManager.redo();
    const isDelete = r != null && r.deletions.clients.size > 0;
    const isAdd = r != null && r.insertions.clients.size > 0;
    this.addHistory(`Redo ${isDelete && isAdd ? 'edit' : isDelete ? 'delete' : isAdd ? 'add' : ''}`);
  }
}

export { TeamState };
export type { StoreContextType };
