import { useSyncedStore } from '@syncedstore/react';
import { ChangeEvent, useEffect, useState } from 'react';

import { teamStore } from '@/store';

function AbilityInput({ onFocus, tabIdx }: { onFocus: () => void; tabIdx: number }) {
  const teamState = useSyncedStore(teamStore);
  const [ability, setAbility] = useState<string>('');

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setAbility(teamState.team[tabIdx]?.ability || '');
  }, [teamState.team[tabIdx]?.ability]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newAbility = e.target.value;
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].ability = newAbility;
  };

  return (
    <div className="tooltip" data-tip="Please pick an ability below">
      <label className="input-group-xs input-group input-group-vertical md:input-group-md">
        <span>Ability</span>
        <input
          type="text"
          placeholder="Ability"
          className="input-secondary input input-xs md:input-md"
          value={ability}
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

export default AbilityInput;
