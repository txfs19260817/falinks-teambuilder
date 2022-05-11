import { useSyncedStore } from '@syncedstore/react';
import { ChangeEvent, useEffect, useState } from 'react';

import { teamStore } from '@/store';

function ItemInput({ onFocus, tabIdx }: { onFocus: () => void; tabIdx: number }) {
  const teamState = useSyncedStore(teamStore);
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
          onFocus={onFocus}
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
