import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { compareFocusedFieldToIdx, FocusedFieldToIdx } from '@/components/workspace/FocusedField/consts';

function AbilityInput() {
  const thisFocusedFieldState: FocusedFieldToIdx = { Ability: 0 };
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch, setGlobalFilter } = useContext(StoreContext);
  const [ability, setAbility] = useState<string>('');

  // receive changes from other users
  useEffect(() => {
    if (!teamState.getPokemonInTeam(tabIdx)) return;
    setAbility(teamState.getPokemonInTeam(tabIdx)?.ability || '');
  }, [teamState.getPokemonInTeam(tabIdx)?.ability]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newAbility = e.target.value;
    setGlobalFilter(newAbility); // set search words to filter table
    teamState.updatePokemonInTeam(tabIdx, 'ability', newAbility);
  };

  const handleFocus = () => {
    setGlobalFilter(''); // clear search words on table
    focusedFieldDispatch({ type: 'set', payload: thisFocusedFieldState });
  };

  return (
    <label className="input-group-xs input-group input-group-vertical md:input-group-md">
      <span>Ability</span>
      <input
        type="search"
        placeholder="Ability"
        className={`input-primary input input-sm md:input-md ${
          compareFocusedFieldToIdx(focusedFieldState, thisFocusedFieldState) ? 'outline outline-2 outline-offset-2 outline-primary' : ''
        }`}
        value={ability}
        onFocus={handleFocus}
        onChange={handleChange}
      />
    </label>
  );
}

export default AbilityInput;
