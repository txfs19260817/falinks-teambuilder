import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { StoreContext } from '@/components/workspace/StoreContext';
import { compareFocusedFieldToIdx, FocusedFieldToIdx } from '@/components/workspace/types';

function ItemInput() {
  const thisFocusedFieldState: FocusedFieldToIdx = { Item: 0 };
  const { setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, focusedFieldState, focusedFieldDispatch } = useContext(StoreContext);
  const [item, setItem] = useState<string>('');

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setItem(teamState.team[tabIdx]?.item || '');
  }, [teamState.team[tabIdx]?.item]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newItem = e.target.value;
    setGlobalFilter(newItem);
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].item = newItem;
  };

  const handleFocus = () => {
    setGlobalFilter('');
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
