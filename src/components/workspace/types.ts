import { MappedTypeDescription } from '@syncedstore/core/types/doc';

import { Pokemon } from '@/models/Pokemon';

export type PanelProps = {
  tabIdx: number;
  teamState: MappedTypeDescription<{ team: Pokemon[] }>;
};

export enum FocusedField {
  Species = 'species',
  Item = 'item',
  Ability = 'ability',
  Moves = 'moves',
  Stats = 'stats',
}
