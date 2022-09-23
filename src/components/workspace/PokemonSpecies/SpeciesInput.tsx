import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/Contexts/DexContext';
import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { compareFocusedFieldToIdx, FocusedFieldToIdx } from '@/components/workspace/FocusedField/consts';

function SpeciesInput() {
  const thisFocusedFieldState: FocusedFieldToIdx = { Species: 0 };
  const { setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch } = useContext(StoreContext);

  const [species, setSpecies] = useState('');

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setSpecies(teamState.team[tabIdx]?.species || '');
  }, [teamState.team[tabIdx]?.species]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSp = e.target.value;
    setGlobalFilter(newSp);
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].species = newSp;
  };

  const handleFocus = () => {
    setGlobalFilter('');
    focusedFieldDispatch({ type: 'set', payload: thisFocusedFieldState });
  };

  return (
    <label className="input-group-xs input-group input-group-vertical">
      <span>Species</span>
      <input
        type="search"
        placeholder="Species"
        className={`input-primary input input-sm md:input-md ${
          compareFocusedFieldToIdx(focusedFieldState, thisFocusedFieldState) ? 'outline outline-2 outline-offset-2 outline-primary' : ''
        }`}
        value={species}
        onFocus={handleFocus}
        onChange={handleChange}
      />
    </label>
  );
}

export default SpeciesInput;
