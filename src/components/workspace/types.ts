import { StatsTable } from '@pkmn/types';

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
