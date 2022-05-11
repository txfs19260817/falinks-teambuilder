import AbilitiesTable from '@/components/workspace/Abilities/AbilitiesTable';
import ItemsTable from '@/components/workspace/Items/ItemsTable';
import MovesTable from '@/components/workspace/Moves/MovesTable';
import SpeciesTable from '@/components/workspace/PokemonSpecies/SpeciesTable';
import StatsSetters from '@/components/workspace/Stats/StatsSetters';
import { FocusedField, FocusedFieldToIdx, PanelProps } from '@/components/workspace/types';

export const AttributeSetterSwitch = ({ focusedField, tabIdx, teamState }: { focusedField: FocusedFieldToIdx } & PanelProps) => {
  const firstEntry = Object.entries(focusedField)[0];
  const [field, idx] = firstEntry ?? ['', 0];
  switch (field) {
    case FocusedField.Species:
      return <SpeciesTable {...{ tabIdx, teamState }} />;
    case FocusedField.Item:
      return <ItemsTable {...{ tabIdx, teamState }} />;
    case FocusedField.Ability:
      return <AbilitiesTable {...{ tabIdx, teamState }} />;
    case FocusedField.Moves:
      return <MovesTable {...{ tabIdx, teamState }} moveIdx={idx} />;
    case FocusedField.Stats:
      return <StatsSetters {...{ tabIdx, teamState }} />;
    default:
      return null;
  }
};
