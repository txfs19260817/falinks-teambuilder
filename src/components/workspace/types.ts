import { StatsTable } from '@pkmn/types';
import { ObjectId } from 'mongodb';

import { Pokemon } from '@/models/Pokemon';
import { PokePaste } from '@/models/PokePaste';

export type Metadata = {
  title: string;
  author: string;
  notes: string;
  roomName: string;
};

export enum FocusedField {
  Species = 'Species',
  Item = 'Item',
  Ability = 'Ability',
  Moves = 'Moves',
  Stats = 'Stats',
}

// FocusedFieldToIdx maps a selected panel to the index of the specific field
// (if the selected panel is not Moves, then the index is 0, which is meaningless atm)
export type FocusedFieldToIdx = { [key in FocusedField]?: number };

export type FocusedFieldAction = { type: 'set'; payload: FocusedFieldToIdx } | { type: 'next'; payload: FocusedFieldToIdx };

export function compareFocusedFieldToIdx(a: FocusedFieldToIdx, b: FocusedFieldToIdx) {
  return Object.entries(a).toString() === Object.entries(b).toString();
}

// Pikalytics usage
export interface Usage {
  name: string;
  rank: string;
  search?: string;
  raw: string;
  percent: string;
  types?: string[];
  name_trans?: string;
  l: string;
  stats?: StatsTable;
  abilities?: {
    ability: string;
    percent: string;
  }[];
  raw_count?: string;
  ranking?: string;
  viability?: string;
  items?: {
    item: string;
    item_us: string;
    percent: string;
  }[];
  spreads?: {
    nature: string;
    ev: string;
    percent: string;
  }[];
  moves?: {
    move: string;
    percent: string;
    type?: string;
  }[];
  team?: {
    pokemon: string;
    percent: string;
    types: string[];
    l: string;
    pokemon_trans?: string;
  }[];
  ss?: boolean;
  id?: number;
}

export interface Paste extends PokePaste {
  _id: ObjectId;
  team: Pokemon[];
}
