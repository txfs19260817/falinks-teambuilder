import { StatsTable } from '@pkmn/types';
import { MovesetStatistics } from 'smogon';

export type Modify<T, R> = Omit<T, keyof R> & R;

export type Option = {
  label: string;
  value: string;
};

export type SelectProps<T extends Option | Option[]> = {
  options: Option[];
  className?: string;
  value?: T;
  onChange?: (selected: T) => void;
  placeholder?: string;
  iconGetter?: (key: string) => JSX.Element;
};

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

export type ValueWithEmojiOption = {
  value: string;
  emoji: string;
};
