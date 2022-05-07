import { MappedTypeDescription } from '@syncedstore/core/types/doc';

import { Pokemon } from '@/models/Pokemon';

export interface PanelProps {
  tabIdx: number;
  teamState: MappedTypeDescription<{ team: Pokemon[] }>;
}

export enum FocusedField {
  Species = 'Species',
  Item = 'Item',
  Ability = 'Ability',
  Moves = 'Moves',
  Stats = 'Stats',
}

// FocusedFieldToIdx maps a selected panel to the index of the specific field
// (if the selected panel is not Moves, then the index is meaningless atm)
export type FocusedFieldToIdx = { [key in FocusedField]?: number };
