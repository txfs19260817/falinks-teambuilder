import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { DexContext } from '@/components/workspace/DexContext';
import { StoreContext } from '@/components/workspace/StoreContext';

function AbilityInput() {
  const { setGlobalFilter } = useContext(DexContext);
  const { teamState, tabIdx, setFocusedField } = useContext(StoreContext);
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

  return (
    <label className="input-group-xs input-group input-group-vertical md:input-group-md">
      <span>Ability</span>
      <input
        type="search"
        placeholder="Ability"
        className="input-secondary input input-xs md:input-md"
        value={ability}
        onFocus={() => {
          setGlobalFilter('');
          setFocusedField({ Ability: 0 });
        }}
        onChange={handleChange}
      />
    </label>
  );
}

export default AbilityInput;
