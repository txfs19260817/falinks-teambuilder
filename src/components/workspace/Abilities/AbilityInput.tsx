import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { compareFocusedFieldToIdx, FocusedFieldToIdx } from '@/components/workspace/types';

function AbilityInput() {
  const thisFocusedFieldState: FocusedFieldToIdx = { Ability: 0 };
  const { setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch } = useContext(StoreContext);
  const [ability, setAbility] = useState<string>('');

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setAbility(teamState.team[tabIdx]?.ability || '');
  }, [teamState.team[tabIdx]?.ability]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newAbility = e.target.value;
    setGlobalFilter(newAbility);
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].ability = newAbility;
  };

  const handleFocus = () => {
    setGlobalFilter('');
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
