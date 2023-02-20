import { TypeEffectiveness, TypeName } from '@pkmn/data';
import { StatsTable } from '@pkmn/types';
import { MovesetStatistics } from 'smogon';

export type GetElementType<T extends any[]> = T extends (infer U)[] ? U : never;
export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type Modify<T, R> = Omit<T, keyof R> & R;

export type Option = {
  label: string;
  value: string;
};

export type Format = {
  id: string;
  name: string;
  gen: number;
  gameType: 'singles' | 'doubles';
  defaultLevel: 50 | 100;
  defaultSpeciesName: string;
  isIndexedAsUsage: boolean;
  isVGC: boolean;
};

export type SelectProps<T extends Option | Option[]> = {
  options: Option[];
  inputSize?: 'xs' | 'sm' | 'md' | 'lg';
  itemClassName?: string;
  defaultValue?: T;
  value?: T;
  onChange?: (selected: T) => void;
  placeholder?: string;
  iconGetter?: (key: string) => JSX.Element;
  ariaLabel?: string;
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
> & { name: string; rank: number } & {
  TeraTypes?: {
    [type: string]: number;
  };
};

export type SearchPastePokemonCriteria = {
  species: string;
  ability?: string;
  item?: string;
  teraType?: TypeName;
  moves: string[];
  minEVs: StatsTable;
  maxEVs: StatsTable;
};

export type SearchPasteForm = {
  speciesCriterion: SearchPastePokemonCriteria[];
  format: string;
  hasRentalCode: boolean;
  officialOnly: boolean;
};

export type Spreads = {
  label: string;
  nature: string;
  evs: StatsTable;
};

export type ValueWithEmojiOption<T extends string | boolean = string> = {
  value: T;
  emoji: string;
};

export type BasePokePaste = {
  paste: string;
  format: string;
  title?: string;
  author?: string;
  notes?: string;
};

export type ExtendedTypeEffectiveness = TypeEffectiveness | 0.25 | 4;

// key: TypeName, value: damage multiplier to species ID
export type Type2EffectivenessMap<T extends ExtendedTypeEffectiveness | TypeEffectiveness = ExtendedTypeEffectiveness> = Map<TypeName, Record<T, string[]>>;

export type IndexedDBTeam = {
  species: string[];
  format: string;
};

export type ReplayResponse = {
  id: string;
  p1: string;
  p2: string;
  format: string;
  log: string;
  uploadtime: number;
  views: number;
  p1id: string;
  p2id: string;
  formatid: string;
  rating: number;
  private: 0 | 1;
  password: string | null;
};

export type PairUsage = {
  pair: string;
  count: number;
};
