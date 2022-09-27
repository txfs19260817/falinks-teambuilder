import { StatsTable } from '@pkmn/types';
import { MovesetStatistics } from 'smogon';

export type Modify<T, R> = Omit<T, keyof R> & R;

export type Usage = Modify<
  MovesetStatistics,
  {
    Abilities: Partial<MovesetStatistics['Abilities']>;
    Items: Partial<MovesetStatistics['Items']>;
    Moves: Partial<MovesetStatistics['Moves']>;
    Spreads: Partial<MovesetStatistics['Spreads']>;
    Teammates: Partial<MovesetStatistics['Teammates']>;
  }
> & { name: string; rank: number };

export type Spreads = {
  label: string;
  nature: string;
  evs: StatsTable;
};
