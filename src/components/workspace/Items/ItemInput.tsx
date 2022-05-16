import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { StoreContext } from '@/components/workspace/StoreContext';

function ItemInput() {
  const { setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, setFocusedField } = useContext(StoreContext);
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

  return (
    <label className="input-group-xs input-group input-group-vertical md:input-group-md">
      <span>Item</span>
      <input
        type="search"
        placeholder="Item"
        className="input-secondary input input-xs md:input-md"
        value={item}
        onFocus={() => {
          setGlobalFilter('');
          setFocusedField({ Item: 0 });
        }}
        onChange={handleChange}
      />
    </label>
  );
}

export default ItemInput;
