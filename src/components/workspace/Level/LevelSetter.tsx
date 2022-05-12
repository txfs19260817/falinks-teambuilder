import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/components/workspace/StoreContext';

function LevelSetter() {
  const { teamState, tabIdx } = useContext(StoreContext);
  const [level, setLevel] = useState(50);

  // receive changes from other users
  useEffect(() => {
    if (!teamState.team[tabIdx]) return;
    setLevel(teamState.team[tabIdx]?.level || 50);
  }, [teamState.team[tabIdx]?.level]);

  // emit changes to other users
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLv = +e.target.value;
    setLevel(newLv);
    if (!teamState.team[tabIdx]) return;
    // @ts-ignore
    teamState.team[tabIdx].level = newLv;
  };

  return (
    <div className="flex space-x-0.5 text-sm lg:text-lg">
      <span>Level: </span>
      <input type="number" value={level} min={0} max={100} className="input input-xs w-full md:input-sm" onChange={handleChange} />
    </div>
  );
}

export default LevelSetter;
