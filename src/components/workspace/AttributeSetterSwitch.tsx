import { useContext } from 'react';

import AbilitiesTable from '@/components/workspace/Abilities/AbilitiesTable';
import ItemsTable from '@/components/workspace/Items/ItemsTable';
import MovesTable from '@/components/workspace/Moves/MovesTable';
import SpeciesTable from '@/components/workspace/PokemonSpecies/SpeciesTable';
import StatsSetters from '@/components/workspace/Stats/StatsSetters';
import { StoreContext } from '@/components/workspace/StoreContext';
import { FocusedField } from '@/components/workspace/types';

const AttributeSetterSwitch = () => {
  const { focusedFieldState } = useContext(StoreContext);
  const firstEntry = Object.entries(focusedFieldState)[0];
  const [field, idx] = firstEntry ?? ['', 0]; // idx is only used for switching between moves
  switch (field) {
    case FocusedField.Species:
      return <SpeciesTable />;
    case FocusedField.Item:
      return <ItemsTable />;
    case FocusedField.Ability:
      return <AbilitiesTable />;
    case FocusedField.Moves:
      return <MovesTable moveIdx={idx} />;
    case FocusedField.Stats:
      return <StatsSetters />;
    default:
      return null;
  }
};

export default AttributeSetterSwitch;
