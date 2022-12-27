import { Reducer, useContext, useReducer } from 'react';

import AbilitiesTable from '@/components/workspace/Abilities/AbilitiesTable';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { FocusedField, FocusedFieldAction, FocusedFieldToIdx } from '@/components/workspace/FocusedField/consts';
import ItemsTable from '@/components/workspace/Items/ItemsTable';
import MovesTable from '@/components/workspace/Moves/MovesTable';
import SpeciesTable from '@/components/workspace/PokemonSpecies/SpeciesTable';
import StatsSetters from '@/components/workspace/Stats/StatsSetters';

// A reducer hook to automatically move to the next field based on the current one
// e.g. if the user pick a Pokémon Species, it will move to the Item field
// At the same time, reset the global filter on the tables
export function useFieldAutoChange(initialState: FocusedFieldToIdx, setGlobalFilter: (filter: string) => void) {
  return useReducer<Reducer<FocusedFieldToIdx, FocusedFieldAction>>((curState: FocusedFieldToIdx, action: FocusedFieldAction) => {
    const { type, payload } = action;
    switch (type) {
      case 'set':
        setGlobalFilter(payload.globalFilterKey ?? '');
        return payload;
      case 'next': {
        const [field, idx] = (Object.entries(curState)[0] ?? ['', 0]) as [FocusedField, number]; // idx is only used for switching between moves
        if (field === FocusedField.Species) {
          setGlobalFilter('');
          return { Item: 0 };
        }
        if (field === FocusedField.Item) {
          setGlobalFilter('');
          return { Ability: 0 };
        }
        if (field === FocusedField.Ability) {
          setGlobalFilter('');
          return { Moves: 0 };
        }
        if (field === FocusedField.Moves) {
          setGlobalFilter('');
          if (idx <= 2) {
            return { Moves: idx + 1 };
          }
          return { Stats: 0 };
        }
        return payload;
      }
      default:
        throw new Error(`Unknown action type: '${type}'`);
    }
  }, initialState);
}

const FocusedFieldSwitch = () => {
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

export default FocusedFieldSwitch;
