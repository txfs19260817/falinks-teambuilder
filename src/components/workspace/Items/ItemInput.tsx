import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/StoreContext';

function ItemInput() {
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
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].item = newItem;
  };

  return (
    <div className="tooltip" data-tip="Please pick an item below">
      <label className="input-group-xs input-group input-group-vertical md:input-group-md">
        <span>Item</span>
        <input
          type="text"
          placeholder="Item"
          className="input-secondary input input-xs md:input-md"
          value={item}
          onFocus={() => setFocusedField({ Item: 0 })}
          onChange={handleChange}
          onKeyDown={(event) => {
            event.preventDefault();
          }}
        />
      </label>
    </div>
  );
}

export default ItemInput;
