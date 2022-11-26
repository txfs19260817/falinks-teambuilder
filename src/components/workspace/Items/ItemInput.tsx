import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { compareFocusedFieldToIdx, FocusedFieldToIdx } from '@/components/workspace/FocusedField/consts';

function ItemInput() {
  const thisFocusedFieldState: FocusedFieldToIdx = { Item: 0 };
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch, setGlobalFilter } = useContext(StoreContext);
  const [item, setItem] = useState<string>('');

  // receive changes from other users
  useEffect(() => {
    if (!teamState.getPokemonInTeam(tabIdx)) return;
    setItem(teamState.getPokemonInTeam(tabIdx)?.item || '');
  }, [teamState.getPokemonInTeam(tabIdx)?.item]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newItem = e.target.value;
    setGlobalFilter(newItem); // set search words to filter table
    teamState.updatePokemonInTeam(tabIdx, 'item', newItem);
  };

  const handleFocus = () => {
    focusedFieldDispatch({ type: 'set', payload: thisFocusedFieldState });
  };

  return (
    <label className="input-group-xs input-group input-group-vertical md:input-group-md">
      <span>Item</span>
      <input
        type="search"
        placeholder="Item"
        className={`input-primary input input-sm md:input-md ${
          compareFocusedFieldToIdx(focusedFieldState, thisFocusedFieldState) ? 'outline outline-2 outline-offset-2 outline-primary' : ''
        }`}
        value={item}
        onFocus={handleFocus}
        onChange={handleChange}
      />
    </label>
  );
}

export default ItemInput;
