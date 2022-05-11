import AbilitiesTable from '@/components/workspace/Abilities/AbilitiesTable';
import ItemsTable from '@/components/workspace/Items/ItemsTable';
import MovesTable from '@/components/workspace/Moves/MovesTable';
import SpeciesTable from '@/components/workspace/PokemonSpecies/SpeciesTable';
import StatsSetters from '@/components/workspace/Stats/StatsSetters';
import { FocusedField, FocusedFieldToIdx } from '@/components/workspace/types';

const AttributeSetterSwitch = ({ focusedField, tabIdx }: { focusedField: FocusedFieldToIdx; tabIdx: number }) => {
  const firstEntry = Object.entries(focusedField)[0];
  const [field, idx] = firstEntry ?? ['', 0];
  switch (field) {
    case FocusedField.Species:
      return <SpeciesTable tabIdx={tabIdx} />;
    case FocusedField.Item:
      return <ItemsTable tabIdx={tabIdx} />;
    case FocusedField.Ability:
      return <AbilitiesTable tabIdx={tabIdx} />;
    case FocusedField.Moves:
      return <MovesTable tabIdx={tabIdx} moveIdx={idx} />;
    case FocusedField.Stats:
      return <StatsSetters tabIdx={tabIdx} />;
    default:
      return null;
  }
};

export default AttributeSetterSwitch;
